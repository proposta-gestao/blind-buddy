import { useCallback } from 'react';
import { useTournamentContext } from '@/contexts/TournamentContext';
import { BlindLevel, TournamentStructure } from '@/types/tournament';

export function useSharedTournamentTimer() {
  const { state, actions } = useTournamentContext();
  const { tournament, timerState, timerInterval } = state;

  const currentLevel = tournament.structure.blindLevels[tournament.currentLevel];
  const nextLevel = tournament.structure.blindLevels[tournament.currentLevel + 1];

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getTimeStatus = useCallback((): 'normal' | 'warning' | 'critical' => {
    if (tournament.timeRemaining <= 60) return 'critical';
    if (tournament.timeRemaining <= 300) return 'warning';
    return 'normal';
  }, [tournament.timeRemaining]);

  const startTimer = useCallback(() => {
    console.log('🚀 startTimer called', { 
      isRunning: tournament.isRunning, 
      currentLevel: tournament.currentLevel, 
      timeRemaining: tournament.timeRemaining 
    });
    
    // Only start if not already running
    if (tournament.isRunning && !tournament.isPaused) {
      console.log('⚠️ Timer already running, skipping');
      return;
    }

    // Update state to running
    actions.updateTimer({
      isRunning: true,
      isPaused: false,
      currentLevel: tournament.currentLevel, 
      timeRemaining: tournament.timeRemaining
    });

    // Create and store interval
    const interval = setInterval(() => {
      actions.updateTimer(prevState => {
        // Stop if not running anymore (prevents multiple timers)
        if (!prevState.isRunning || prevState.isPaused) {
          return prevState;
        }
        
        const newTimeRemaining = prevState.timeRemaining - 1;
        console.log('⏰ Timer tick', { newTimeRemaining, currentLevel: prevState.currentLevel });
        
        if (newTimeRemaining <= 0) {
          // Move to next level - use the current structure from the closure
          const nextLevelIndex = prevState.currentLevel + 1;
          const nextLevel = tournament.structure.blindLevels[nextLevelIndex];
          
          if (nextLevel) {
            console.log('📈 Moving to next level', nextLevelIndex, 'Duration:', nextLevel.duration);
            return {
              isRunning: true,
              isPaused: false,
              currentLevel: nextLevelIndex,
              timeRemaining: nextLevel.duration * 60
            };
          } else {
            console.log('🏁 Tournament finished - no more levels');
            // Clear the interval when tournament ends
            clearInterval(interval);
            return {
              isRunning: false,
              isPaused: false,
              currentLevel: prevState.currentLevel,
              timeRemaining: 0
            };
          }
        }
        
        return {
          ...prevState,
          timeRemaining: newTimeRemaining
        };
      });
    }, 1000);

    // Store interval in context
    actions.setTimerInterval(interval);
  }, [actions, tournament.currentLevel, tournament.timeRemaining, tournament.structure, tournament.isRunning, tournament.isPaused]);

  const pauseTimer = useCallback(() => {
    // Clear interval through context
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    actions.updateTimer({
      isRunning: false,
      isPaused: true,
      currentLevel: tournament.currentLevel,
      timeRemaining: tournament.timeRemaining
    });
    
    actions.setTimerInterval(null);
  }, [actions, tournament.currentLevel, tournament.timeRemaining, timerInterval]);

  const resetTimer = useCallback(() => {
    // Clear interval through context
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const firstLevel = tournament.structure.blindLevels[0];
    actions.updateTimer({
      isRunning: false,
      isPaused: false,
      currentLevel: 0,
      timeRemaining: firstLevel?.duration * 60 || 0
    });
    
    actions.setTimerInterval(null);
  }, [actions, tournament.structure.blindLevels, timerInterval]);

  const skipLevel = useCallback(() => {
    const nextLevelIndex = tournament.currentLevel + 1;
    const nextLevel = tournament.structure.blindLevels[nextLevelIndex];
    
    if (nextLevel) {
      actions.updateTimer({
        isRunning: tournament.isRunning,
        isPaused: tournament.isPaused,
        currentLevel: nextLevelIndex,
        timeRemaining: nextLevel.duration * 60
      });
    }
  }, [actions, tournament.currentLevel, tournament.isRunning, tournament.isPaused, tournament.structure.blindLevels]);

  const updateStructure = useCallback((newStructure: TournamentStructure) => {
    // Clear any running timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    actions.updateStructure(newStructure);
    actions.updateTimer({
      isRunning: false,
      isPaused: false,
      currentLevel: 0,
      timeRemaining: newStructure.blindLevels[0]?.duration * 60 || 0
    });
    
    actions.setTimerInterval(null);
  }, [actions, timerInterval]);

  return {
    state: tournament,
    isRunning: tournament.isRunning,
    isPaused: tournament.isPaused,
    currentLevel,
    nextLevel,
    formatTime,
    getTimeStatus,
    startTimer,
    pauseTimer,
    resetTimer,
    skipLevel,
    updateStructure
  };
}