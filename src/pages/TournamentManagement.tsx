import { useState, useCallback } from "react";
import { TournamentDisplay } from "@/components/tournament/TournamentDisplay";
import { TournamentControls } from "@/components/tournament/TournamentControls";
import { PlayerDropdown } from "@/components/tournament/PlayerDropdown";
import { SettingsDropdown } from "@/components/tournament/SettingsDropdown";
import { useTournamentContext } from "@/contexts/TournamentContext";
import { useSharedTournamentTimer } from "@/hooks/useSharedTournamentTimer";
import { TournamentState, Player } from "@/types/tournament";
import { TOURNAMENT_STRUCTURES } from "@/data/tournament-structures";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, ArrowLeft, Users, Trophy, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TournamentManagement() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { state, actions } = useTournamentContext();
  const tournament = useSharedTournamentTimer();
  
  const [isPlayerManagerOpen, setIsPlayerManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleStructureChange = useCallback((structureId: string) => {
    const newStructure = TOURNAMENT_STRUCTURES.find(s => s.id === structureId);
    if (newStructure && !tournament.isRunning) {
      tournament.updateStructure(newStructure);
      
      toast({
        title: "Estrutura Alterada",
        description: `Torneio configurado para: ${newStructure.name}`,
      });
    }
  }, [tournament, toast]);

  const handleUpdateStructure = useCallback((updates: Partial<TournamentState['structure']>) => {
    if (!tournament.isRunning) {
      const updatedStructure = { ...state.tournament.structure, ...updates };
      tournament.updateStructure(updatedStructure);
      
      toast({
        title: "Configurações Salvas",
        description: "Os valores do torneio foram atualizados.",
      });
    }
  }, [tournament, state.tournament.structure, toast]);

  const handleAddPlayer = useCallback((newPlayer: Omit<Player, 'id'>) => {
    const player: Player = {
      ...newPlayer,
      id: Date.now().toString(),
      chips: state.tournament.structure.startingChips,
      buyInType: newPlayer.buyInType || 'normal',
      paidAdminFee: newPlayer.paidAdminFee || false
    };
    
    actions.addPlayer(player);
    
    toast({
      title: "Jogador Adicionado",
      description: `${player.name} foi registrado no torneio.`,
    });
  }, [state.tournament.structure.startingChips, actions, toast]);

  const handleRemovePlayer = useCallback((playerId: string) => {
    const player = state.players.find(p => p.id === playerId);
    actions.removePlayer(playerId);
    
    if (player) {
      toast({
        title: "Jogador Removido",
        description: `${player.name} foi removido do torneio.`,
        variant: "destructive"
      });
    }
  }, [state.players, actions, toast]);

  const handleEliminatePlayer = useCallback((playerId: string) => {
    const player = state.players.find(p => p.id === playerId);
    if (player) {
      const remainingPlayers = state.players.filter(p => !p.isEliminated && p.id !== playerId);
      const position = remainingPlayers.length + 1;
      
      actions.eliminatePlayer(playerId, position, state.tournament.currentLevel);
      
      toast({
        title: "Jogador Eliminado",
        description: `${player.name} terminou em ${position}º lugar.`,
      });
    }
  }, [state.players, state.tournament.currentLevel, actions, toast]);

  const currentState = state.tournament;

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
              currentStructure={state.tournament.structure}
              onStart={tournament.startTimer}
              onPause={tournament.pauseTimer}
              onReset={actions.resetTournament}
              onSkip={tournament.skipLevel}
              onStructureChange={handleStructureChange}
            />
            
            {/* Expandable Sections */}
            <div className="space-y-4">
              <PlayerDropdown
                isOpen={isPlayerManagerOpen}
                onToggle={() => setIsPlayerManagerOpen(!isPlayerManagerOpen)}
                players={state.players}
                onAddPlayer={handleAddPlayer}
                onRemovePlayer={handleRemovePlayer}
                onEliminatePlayer={handleEliminatePlayer}
              />
              
              <SettingsDropdown
                isOpen={isSettingsOpen}
                onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
                currentStructure={state.tournament.structure}
                onUpdateStructure={handleUpdateStructure}
              />
            </div>
            
            {/* Quick Actions */}
            <Card className="bg-gradient-felt border-primary/20 shadow-poker">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/tournament/display')}
                  className="gap-2 hover-scale"
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
                    {tournament.formatTime(state.tournament.timeRemaining)}
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

        {/* Remove old sidebars - they are now replaced by dropdowns */}
      </div>
    </div>
  );
}