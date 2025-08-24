import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, SkipForward, Settings, Users } from "lucide-react";
import { TournamentStructure } from "@/types/tournament";
import { TOURNAMENT_STRUCTURES } from "@/data/tournament-structures";

interface TournamentControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  currentStructure: TournamentStructure;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onStructureChange: (structureId: string) => void;
}

export function TournamentControls({
  isRunning,
  isPaused,
  currentStructure,
  onStart,
  onPause,
  onReset,
  onSkip,
  onStructureChange
}: TournamentControlsProps) {
  return (
    <Card className="bg-gradient-felt border-primary/20 shadow-poker">
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Primary Controls */}
          <div className="flex flex-wrap gap-3">
            {!isRunning || isPaused ? (
              <Button 
                onClick={onStart} 
                variant="chip" 
                size="lg"
                className="flex-1 min-w-[120px]"
              >
                <Play className="w-5 h-5" />
                {isPaused ? 'Continuar' : 'Iniciar'}
              </Button>
            ) : (
              <Button 
                onClick={onPause} 
                variant="warning" 
                size="lg"
                className="flex-1 min-w-[120px]"
              >
                <Pause className="w-5 h-5" />
                Pausar
              </Button>
            )}
            
            <Button 
              onClick={onReset} 
              variant="destructive" 
              size="lg"
              className="flex-1 min-w-[120px]"
            >
              <RotateCcw className="w-5 h-5" />
              Resetar Campeonato
            </Button>
            
            <Button 
              onClick={onSkip} 
              variant="poker" 
              size="lg"
              className="flex-1 min-w-[120px]"
              disabled={!isRunning}
            >
              <SkipForward className="w-5 h-5" />
              Próximo Nível
            </Button>
          </div>

          {/* Structure Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Estrutura do Torneio
            </label>
            <Select 
              value={currentStructure.id} 
              onValueChange={onStructureChange}
              disabled={isRunning}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {TOURNAMENT_STRUCTURES.map((structure) => (
                  <SelectItem key={structure.id} value={structure.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{structure.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {structure.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Starting Chips</div>
              <div className="font-bold text-poker-chip">
                {currentStructure.startingChips.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Blind Levels</div>
              <div className="font-bold text-primary">
                {currentStructure.blindLevels.filter(level => !level.isBreak).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}