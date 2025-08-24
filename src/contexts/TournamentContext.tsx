import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TournamentState, Player, TournamentStructure } from '@/types/tournament';
import { TOURNAMENT_STRUCTURES } from '@/data/tournament-structures';

interface TournamentContextState {
  tournament: TournamentState;
  players: Player[];
  timerState: {
    isRunning: boolean;
    isPaused: boolean;
    currentLevel: number;
    timeRemaining: number;
  };
  timerInterval: NodeJS.Timeout | null;
}

type TournamentAction = 
  | { type: 'UPDATE_TOURNAMENT'; payload: Partial<TournamentState> }
  | { type: 'SET_PLAYERS'; payload: Player[] }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'ELIMINATE_PLAYER'; payload: { playerId: string; position: number; level: number } }
  | { type: 'UPDATE_TIMER'; payload: { isRunning: boolean; isPaused: boolean; currentLevel: number; timeRemaining: number } }
  | { type: 'UPDATE_TIMER_FUNCTION'; payload: (prev: { isRunning: boolean; isPaused: boolean; currentLevel: number; timeRemaining: number }) => { isRunning: boolean; isPaused: boolean; currentLevel: number; timeRemaining: number } }
  | { type: 'SET_TIMER_INTERVAL'; payload: NodeJS.Timeout | null }
  | { type: 'UPDATE_STRUCTURE'; payload: TournamentStructure }
  | { type: 'RESET_TOURNAMENT' };

const initialStructure = TOURNAMENT_STRUCTURES[0];

const initialState: TournamentContextState = {
  tournament: {
    isRunning: false,
    isPaused: false,
    currentLevel: 0,
    timeRemaining: initialStructure.blindLevels[0]?.duration * 60 || 0,
    totalPlayers: 0,
    playersRemaining: 0,
    prizePool: 0,
    totalChips: 0,
    structure: initialStructure
  },
  players: [],
  timerState: {
    isRunning: false,
    isPaused: false,
    currentLevel: 0,
    timeRemaining: initialStructure.blindLevels[0]?.duration * 60 || 0
  },
  timerInterval: null
};

function tournamentReducer(state: TournamentContextState, action: TournamentAction): TournamentContextState {
  switch (action.type) {
    case 'UPDATE_TOURNAMENT':
      return {
        ...state,
        tournament: { ...state.tournament, ...action.payload }
      };
    
    case 'SET_PLAYERS':
      const totalPlayers = action.payload.length;
      const playersRemaining = action.payload.filter(p => !p.isEliminated).length;
      
      // Calculate total chips including admin fee chips
      const totalChips = action.payload.reduce((total, player) => {
        let playerChips = player.buyInType === 'double' 
          ? state.tournament.structure.doubleBuyInChips 
          : state.tournament.structure.startingChips;
        
        // Add addon chips
        playerChips += player.addons * state.tournament.structure.addonChips;
        
        // Add admin fee chips if player paid admin fee
        if (player.paidAdminFee) {
          playerChips += state.tournament.structure.adminFeeChips;
        }
        
        return total + playerChips;
      }, 0);
      
      const prizePool = Math.max(
        action.payload.reduce((total, player) => {
          const buyInAmount = player.buyInType === 'double' 
            ? state.tournament.structure.doubleBuyIn 
            : state.tournament.structure.buyIn;
          return total + buyInAmount;
        }, 0),
        state.tournament.structure.guaranteedPrize
      );
      
      return {
        ...state,
        players: action.payload,
        tournament: {
          ...state.tournament,
          totalPlayers,
          playersRemaining,
          prizePool,
          totalChips
        }
      };
    
    case 'ADD_PLAYER':
      const newPlayers = [...state.players, action.payload];
      return tournamentReducer(state, { type: 'SET_PLAYERS', payload: newPlayers });
    
    case 'REMOVE_PLAYER':
      const filteredPlayers = state.players.filter(p => p.id !== action.payload);
      return tournamentReducer(state, { type: 'SET_PLAYERS', payload: filteredPlayers });
    
    case 'ELIMINATE_PLAYER':
      const updatedPlayers = state.players.map(p => 
        p.id === action.payload.playerId 
          ? { ...p, isEliminated: true, position: action.payload.position, eliminationLevel: action.payload.level }
          : p
      );
      return tournamentReducer(state, { type: 'SET_PLAYERS', payload: updatedPlayers });
    
    case 'UPDATE_TIMER':
      // Only clear existing interval if timer is being stopped or paused
      if (state.timerInterval && (!action.payload.isRunning || action.payload.isPaused)) {
        clearInterval(state.timerInterval);
      }
      
      return {
        ...state,
        timerState: action.payload,
        timerInterval: (!action.payload.isRunning || action.payload.isPaused) ? null : state.timerInterval,
        tournament: {
          ...state.tournament,
          isRunning: action.payload.isRunning,
          isPaused: action.payload.isPaused,
          currentLevel: action.payload.currentLevel,
          timeRemaining: action.payload.timeRemaining
        }
      };
    
    case 'UPDATE_TIMER_FUNCTION':
      const newTimerState = action.payload(state.timerState);
      
      return {
        ...state,
        timerState: newTimerState,
        tournament: {
          ...state.tournament,
          isRunning: newTimerState.isRunning,
          isPaused: newTimerState.isPaused,
          currentLevel: newTimerState.currentLevel,
          timeRemaining: newTimerState.timeRemaining
        }
      };
    
    case 'SET_TIMER_INTERVAL':
      // Clear existing interval before setting new one
      if (state.timerInterval && action.payload !== state.timerInterval) {
        clearInterval(state.timerInterval);
      }
      
      return {
        ...state,
        timerInterval: action.payload
      };
    
    case 'UPDATE_STRUCTURE':
      return {
        ...state,
        tournament: {
          ...state.tournament,
          structure: action.payload,
          timeRemaining: action.payload.blindLevels[0]?.duration * 60 || 0
        }
      };
    
    case 'RESET_TOURNAMENT':
      // Clear any existing timer interval
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
      }
      
      return {
        ...initialState,
        players: [],
        timerInterval: null,
        tournament: {
          ...initialState.tournament,
          structure: state.tournament.structure,
          totalPlayers: 0,
          playersRemaining: 0,
          prizePool: 0,
          totalChips: 0
        }
      };
    
    default:
      return state;
  }
}

interface TournamentContextType {
  state: TournamentContextState;
  dispatch: React.Dispatch<TournamentAction>;
  actions: {
    updateTournament: (updates: Partial<TournamentState>) => void;
    setPlayers: (players: Player[]) => void;
    addPlayer: (player: Player) => void;
    removePlayer: (playerId: string) => void;
    eliminatePlayer: (playerId: string, position: number, level: number) => void;
    updateTimer: (timerState: { isRunning: boolean; isPaused: boolean; currentLevel: number; timeRemaining: number } | ((prev: { isRunning: boolean; isPaused: boolean; currentLevel: number; timeRemaining: number }) => { isRunning: boolean; isPaused: boolean; currentLevel: number; timeRemaining: number })) => void;
    setTimerInterval: (interval: NodeJS.Timeout | null) => void;
    updateStructure: (structure: TournamentStructure) => void;
    resetTournament: () => void;
  };
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tournamentReducer, initialState);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
      }
    };
  }, [state.timerInterval]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('tournamentState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'UPDATE_TOURNAMENT', payload: parsed.tournament });
        dispatch({ type: 'SET_PLAYERS', payload: parsed.players || [] });
        if (parsed.timerState) {
          dispatch({ type: 'UPDATE_TIMER', payload: parsed.timerState });
        }
      } catch (error) {
        console.error('Error loading tournament state:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('tournamentState', JSON.stringify(state));
  }, [state]);

  const actions = {
    updateTournament: (updates: Partial<TournamentState>) => {
      dispatch({ type: 'UPDATE_TOURNAMENT', payload: updates });
    },
    setPlayers: (players: Player[]) => {
      dispatch({ type: 'SET_PLAYERS', payload: players });
    },
    addPlayer: (player: Player) => {
      dispatch({ type: 'ADD_PLAYER', payload: player });
    },
    removePlayer: (playerId: string) => {
      dispatch({ type: 'REMOVE_PLAYER', payload: playerId });
    },
    eliminatePlayer: (playerId: string, position: number, level: number) => {
      dispatch({ type: 'ELIMINATE_PLAYER', payload: { playerId, position, level } });
    },
    updateTimer: (timerState: { isRunning: boolean; isPaused: boolean; currentLevel: number; timeRemaining: number } | ((prev: { isRunning: boolean; isPaused: boolean; currentLevel: number; timeRemaining: number }) => { isRunning: boolean; isPaused: boolean; currentLevel: number; timeRemaining: number })) => {
      if (typeof timerState === 'function') {
        dispatch({ type: 'UPDATE_TIMER_FUNCTION', payload: timerState });
      } else {
        dispatch({ type: 'UPDATE_TIMER', payload: timerState });
      }
    },
    setTimerInterval: (interval: NodeJS.Timeout | null) => {
      dispatch({ type: 'SET_TIMER_INTERVAL', payload: interval });
    },
    updateStructure: (structure: TournamentStructure) => {
      dispatch({ type: 'UPDATE_STRUCTURE', payload: structure });
    },
    resetTournament: () => {
      dispatch({ type: 'RESET_TOURNAMENT' });
    }
  };

  return (
    <TournamentContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournamentContext() {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournamentContext must be used within a TournamentProvider');
  }
  return context;
}