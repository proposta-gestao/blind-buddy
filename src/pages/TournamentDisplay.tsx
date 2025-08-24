import { TournamentDisplay as TournamentDisplayComponent } from "@/components/tournament/TournamentDisplay";
import { useTournamentContext } from "@/contexts/TournamentContext";
import { useSharedTournamentTimer } from "@/hooks/useSharedTournamentTimer";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TournamentDisplay() {
  const navigate = useNavigate();
  const { state } = useTournamentContext();
  const tournament = useSharedTournamentTimer();

  return (
    <div className="relative">
      {/* Floating Header Controls */}
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="gap-2 bg-background/90 backdrop-blur-sm border-primary/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/tournament')}
          className="gap-2 bg-background/90 backdrop-blur-sm border-primary/30"
        >
          <Settings className="w-4 h-4" />
          Gerenciamento
        </Button>
      </div>

      {/* Tournament Display Component */}
      <TournamentDisplayComponent
        currentLevel={tournament.currentLevel}
        nextLevel={tournament.nextLevel}
        timeRemaining={state.tournament.timeRemaining}
        timeStatus={tournament.getTimeStatus()}
        formatTime={tournament.formatTime}
        tournamentState={state.tournament}
        players={state.players}
      />
    </div>
  );
}