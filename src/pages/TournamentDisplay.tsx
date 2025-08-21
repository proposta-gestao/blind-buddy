import { useState } from "react";
import { TournamentDisplay as TournamentDisplayComponent } from "@/components/tournament/TournamentDisplay";
import { useTournamentTimer } from "@/hooks/useTournamentTimer";
import { TournamentState, Player } from "@/types/tournament";
import { TOURNAMENT_STRUCTURES } from "@/data/tournament-structures";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TournamentDisplay() {
  const navigate = useNavigate();
  
  // Initialize with first structure - in a real app this would come from shared state/URL params
  const initialStructure = TOURNAMENT_STRUCTURES[0];
  const [players] = useState<Player[]>([]);
  
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
        {/* Header Controls */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/tournament')}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Ir para Gerenciamento
          </Button>
        </div>

        {/* Main Tournament Display - Full Screen */}
        <div className="bg-gradient-felt border border-primary/20 rounded-lg p-8 shadow-poker">
          <TournamentDisplayComponent
            currentLevel={tournament.currentLevel}
            nextLevel={tournament.nextLevel}
            timeRemaining={tournament.state.timeRemaining}
            timeStatus={tournament.getTimeStatus()}
            formatTime={tournament.formatTime}
            tournamentState={currentState}
          />
        </div>
      </div>
    </div>
  );
}