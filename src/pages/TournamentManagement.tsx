import { useState, useCallback } from "react";
import { TournamentDisplay } from "@/components/tournament/TournamentDisplay";
import { TournamentControls } from "@/components/tournament/TournamentControls";
import { PlayerSidebar } from "@/components/tournament/PlayerSidebar";
import { SettingsSidebar } from "@/components/tournament/SettingsSidebar";
import { useTournamentTimer } from "@/hooks/useTournamentTimer";
import { TournamentState, Player } from "@/types/tournament";
import { TOURNAMENT_STRUCTURES } from "@/data/tournament-structures";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, ArrowLeft, Users, Settings, Trophy, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TournamentManagement() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
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

  const handleUpdateStructure = useCallback((updates: Partial<TournamentState['structure']>) => {
    if (!tournament.isRunning) {
      const updatedStructure = { ...tournament.state.structure, ...updates };
      tournament.updateStructure(updatedStructure);
      
      toast({
        title: "Configurações Salvas",
        description: "Os valores do torneio foram atualizados.",
      });
    }
  }, [tournament, toast]);

  const handleAddPlayer = useCallback((newPlayer: Omit<Player, 'id'>) => {
    const player: Player = {
      ...newPlayer,
      id: Date.now().toString(),
      chips: tournament.state.structure.startingChips,
      buyInType: newPlayer.buyInType || 'normal',
      paidAdminFee: newPlayer.paidAdminFee || false
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
      players.reduce((total, player) => {
        const buyInAmount = player.buyInType === 'double' 
          ? tournament.state.structure.doubleBuyIn 
          : tournament.state.structure.buyIn;
        return total + buyInAmount;
      }, 0),
      tournament.state.structure.guaranteedPrize
    )
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gerenciamento de Torneio</h1>
              <p className="text-muted-foreground">{currentState.structure.name}</p>
            </div>
          </div>
          <Button 
            variant="timer" 
            onClick={() => navigate('/tournament/display')}
            className="gap-2 animate-fade-in"
          >
            <Monitor className="w-4 h-4" />
            Tela de Exibição
          </Button>
        </div>

        {/* Management Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls Section */}
          <div className="lg:col-span-2 space-y-6">
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
            
            {/* Quick Actions */}
            <Card className="bg-gradient-felt border-primary/20 shadow-poker">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsPlayerManagerOpen(true)}
                  className="gap-2 hover-scale"
                >
                  <Users className="w-4 h-4" />
                  Jogadores ({currentState.totalPlayers})
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSettingsOpen(true)}
                  className="gap-2 hover-scale"
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/tournament/display')}
                  className="gap-2 hover-scale col-span-2"
                >
                  <Monitor className="w-4 h-4" />
                  Visualização Completa
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Stats & Mini Display */}
          <div className="space-y-6">
            {/* Mini Timer Display */}
            <Card className="bg-gradient-felt border-primary/20 shadow-poker">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Status Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {tournament.formatTime(tournament.state.timeRemaining)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Nível {tournament.currentLevel?.isBreak ? 'BREAK' : tournament.currentLevel?.level || 1}
                  </div>
                </div>
                
                {tournament.currentLevel && (
                  <div className="space-y-2 text-sm">
                    {tournament.currentLevel.isBreak ? (
                      <div className="text-center text-accent font-medium">INTERVALO</div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Small Blind:</span>
                          <span className="font-medium">{tournament.currentLevel.smallBlind.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Big Blind:</span>
                          <span className="font-medium">{tournament.currentLevel.bigBlind.toLocaleString()}</span>
                        </div>
                        {tournament.currentLevel.ante > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ante:</span>
                            <span className="font-medium">{tournament.currentLevel.ante.toLocaleString()}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tournament Stats */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-gradient-felt border-primary/20 shadow-poker p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <div className="text-sm text-muted-foreground">Jogadores</div>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {currentState.playersRemaining} / {currentState.totalPlayers}
                </div>
              </Card>
              
              <Card className="bg-gradient-felt border-primary/20 shadow-poker p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-poker-chip" />
                  <div className="text-sm text-muted-foreground">Prize Pool</div>
                </div>
                <div className="text-xl font-bold text-poker-chip">
                  R$ {currentState.prizePool.toLocaleString()}
                </div>
              </Card>
              
              <Card className="bg-gradient-felt border-primary/20 shadow-poker p-4 text-center">
                <div className="text-sm text-muted-foreground">Average Stack</div>
                <div className="text-lg font-bold text-accent">
                  {currentState.playersRemaining > 0 
                    ? Math.round((currentState.totalPlayers * currentState.structure.startingChips) / currentState.playersRemaining).toLocaleString()
                    : '0'
                  }
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Player Sidebar */}
        <PlayerSidebar
          isOpen={isPlayerManagerOpen}
          onClose={() => setIsPlayerManagerOpen(false)}
          players={players}
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
          onEliminatePlayer={handleEliminatePlayer}
        />

        {/* Settings Sidebar */}
        <SettingsSidebar
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentStructure={tournament.state.structure}
          onUpdateStructure={handleUpdateStructure}
        />
      </div>
    </div>
  );
}