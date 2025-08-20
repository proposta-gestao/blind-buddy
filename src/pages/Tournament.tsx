import { useState, useCallback } from "react";
import { TournamentDisplay } from "@/components/tournament/TournamentDisplay";
import { TournamentControls } from "@/components/tournament/TournamentControls";
import { PlayerManager } from "@/components/tournament/PlayerManager";
import { SettingsDialog } from "@/components/tournament/SettingsDialog";
import { useTournamentTimer } from "@/hooks/useTournamentTimer";
import { TournamentState, Player } from "@/types/tournament";
import { TOURNAMENT_STRUCTURES } from "@/data/tournament-structures";
import { useToast } from "@/hooks/use-toast";

export default function Tournament() {
  const { toast } = useToast();
  
  // Initialize with first structure
  const initialStructure = TOURNAMENT_STRUCTURES[0];
  const [players, setPlayers] = useState<Player[]>([]);
  const [isPlayerManagerOpen, setIsPlayerManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const initialState: TournamentState = {
    isRunning: false,
    isPaused: false,
    currentLevel: 0,
    timeRemaining: initialStructure.blindLevels[0]?.duration * 60 || 0,
    totalPlayers: 0,
    playersRemaining: 0,
    prizePool: 0,
    structure: initialStructure
  };

  const tournament = useTournamentTimer(initialState);

  const handleStructureChange = useCallback((structureId: string) => {
    const newStructure = TOURNAMENT_STRUCTURES.find(s => s.id === structureId);
    if (newStructure && !tournament.isRunning) {
      // Update the tournament structure
      tournament.updateStructure(newStructure);
      
      toast({
        title: "Estrutura Alterada",
        description: `Torneio configurado para: ${newStructure.name}`,
      });
    }
  }, [tournament, toast]);

  const handleAddPlayer = useCallback((newPlayer: Omit<Player, 'id'>) => {
    const player: Player = {
      ...newPlayer,
      id: Date.now().toString(),
      chips: tournament.state.structure.startingChips
    };
    
    setPlayers(prev => [...prev, player]);
    
    toast({
      title: "Jogador Adicionado",
      description: `${player.name} foi registrado no torneio.`,
    });
  }, [tournament.state.structure.startingChips, toast]);

  const handleRemovePlayer = useCallback((playerId: string) => {
    const player = players.find(p => p.id === playerId);
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    
    if (player) {
      toast({
        title: "Jogador Removido",
        description: `${player.name} foi removido do torneio.`,
        variant: "destructive"
      });
    }
  }, [players, toast]);

  const handleEliminatePlayer = useCallback((playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      const remainingPlayers = players.filter(p => !p.isEliminated && p.id !== playerId);
      const position = remainingPlayers.length + 1;
      
      setPlayers(prev => prev.map(p => 
        p.id === playerId 
          ? { ...p, isEliminated: true, position, eliminationLevel: tournament.state.currentLevel }
          : p
      ));
      
      toast({
        title: "Jogador Eliminado",
        description: `${player.name} terminou em ${position}º lugar.`,
      });
    }
  }, [players, tournament.state.currentLevel, toast]);

  const currentState: TournamentState = {
    ...tournament.state,
    totalPlayers: players.length,
    playersRemaining: players.filter(p => !p.isEliminated).length,
    prizePool: Math.max(
      players.length * tournament.state.structure.buyIn,
      tournament.state.structure.guaranteedPrize
    )
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Tournament Display */}
        <TournamentDisplay
          currentLevel={tournament.currentLevel}
          nextLevel={tournament.nextLevel}
          timeRemaining={tournament.state.timeRemaining}
          timeStatus={tournament.getTimeStatus()}
          formatTime={tournament.formatTime}
          tournamentState={currentState}
        />

        {/* Controls */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <TournamentControls
              isRunning={tournament.isRunning}
              isPaused={tournament.isPaused}
              currentStructure={tournament.state.structure}
              onStart={tournament.startTimer}
              onPause={tournament.pauseTimer}
              onReset={tournament.resetTimer}
              onSkip={tournament.skipLevel}
              onStructureChange={handleStructureChange}
              onPlayersToggle={() => setIsPlayerManagerOpen(true)}
              onSettingsToggle={() => setIsSettingsOpen(true)}
            />
          </div>
          
          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gradient-felt border-primary/20 rounded-lg p-4 shadow-poker text-center">
                <div className="text-sm text-muted-foreground">Nível Atual</div>
                <div className="text-2xl font-bold text-primary">
                  {tournament.currentLevel?.isBreak ? 'BREAK' : tournament.currentLevel?.level || 1}
                </div>
              </div>
              
              <div className="bg-gradient-felt border-primary/20 rounded-lg p-4 shadow-poker text-center">
                <div className="text-sm text-muted-foreground">Average Stack</div>
                <div className="text-lg font-bold text-poker-chip">
                  {currentState.playersRemaining > 0 
                    ? Math.round((currentState.totalPlayers * currentState.structure.startingChips) / currentState.playersRemaining).toLocaleString()
                    : '0'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player Manager Modal */}
        <PlayerManager
          isOpen={isPlayerManagerOpen}
          onClose={() => setIsPlayerManagerOpen(false)}
          players={players}
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
          onEliminatePlayer={handleEliminatePlayer}
        />

        {/* Settings Modal */}
        <SettingsDialog
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  );
}