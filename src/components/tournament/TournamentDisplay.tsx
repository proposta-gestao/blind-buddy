import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TournamentState, BlindLevel } from "@/types/tournament";
import { formatCurrency } from "@/lib/format";

interface TournamentDisplayProps {
  currentLevel: BlindLevel | null;
  nextLevel: BlindLevel | null;
  timeRemaining: number;
  timeStatus: 'normal' | 'warning' | 'critical';
  formatTime: (seconds: number) => string;
  tournamentState: TournamentState;
}

export function TournamentDisplay({
  currentLevel,
  nextLevel,
  timeRemaining,
  timeStatus,
  formatTime,
  tournamentState
}: TournamentDisplayProps) {
  const getTimerVariant = () => {
    switch (timeStatus) {
      case 'critical': return 'critical';
      case 'warning': return 'warning';
      case 'normal': return 'timer';
      default: return 'timer';
    }
  };

  const getProgressPercentage = () => {
    if (!currentLevel) return 0;
    const totalTime = currentLevel.duration * 60;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <Card className="bg-gradient-felt border-primary/20 shadow-poker">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {tournamentState.structure.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {tournamentState.structure.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-center">
              <div className="bg-card/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Buy-in</div>
                <div className="text-lg font-bold text-poker-chip">
                  {formatCurrency(tournamentState.structure.buyIn)}
                </div>
              </div>
              <div className="bg-card/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Buy-in Duplo</div>
                <div className="text-lg font-bold text-accent">
                  {formatCurrency(tournamentState.structure.doubleBuyIn)}
                </div>
              </div>
              <div className="bg-card/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Taxa Admin</div>
                <div className="text-lg font-bold text-muted-foreground">
                  {formatCurrency(tournamentState.structure.adminFee)}
                </div>
              </div>
              <div className="bg-card/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Garantido</div>
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(tournamentState.structure.guaranteedPrize)}
                </div>
              </div>
              <div className="bg-card/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Jogadores</div>
                <div className="text-lg font-bold text-primary">
                  {tournamentState.playersRemaining}/{tournamentState.totalPlayers}
                </div>
              </div>
              <div className="bg-card/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Prize Pool</div>
                <div className="text-lg font-bold text-poker-chip">
                  {formatCurrency(tournamentState.prizePool)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Display */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timer Display */}
        <Card className="lg:col-span-2 bg-gradient-felt border-primary/20 shadow-poker">
          <div className="p-8 text-center">
            <div className="text-sm text-muted-foreground mb-4">TEMPO RESTANTE</div>
            <Button
              variant={getTimerVariant()}
              size="massive"
              className="w-full text-display pointer-events-none mb-6"
            >
              {formatTime(timeRemaining)}
            </Button>
            
            {/* Progress Bar */}
            <div className="bg-muted rounded-full h-3 mb-6">
              <div 
                className={cn(
                  "h-3 rounded-full transition-all duration-1000",
                  timeStatus === 'critical' ? 'bg-timer-critical' :
                  timeStatus === 'warning' ? 'bg-timer-warning' : 'bg-primary'
                )}
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>

            {/* Current Blinds */}
            {currentLevel?.isBreak ? (
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">INTERVALO</div>
                <div className="text-title font-bold text-poker-highlight">
                  BREAK TIME
                </div>
                <div className="text-subtitle text-muted-foreground mt-2">
                  Duração: {currentLevel.breakDuration} minutos
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">SMALL BLIND</div>
                  <div className="text-title font-bold text-primary">
                    {currentLevel?.smallBlind?.toLocaleString() || '0'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">BIG BLIND</div>
                  <div className="text-title font-bold text-poker-chip">
                    {currentLevel?.bigBlind?.toLocaleString() || '0'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">ANTE</div>
                  <div className="text-title font-bold text-accent">
                    {currentLevel?.ante?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Level Info and Next Level */}
        <div className="space-y-6">
          {/* Current Level */}
          <Card className="bg-gradient-felt border-primary/20 shadow-poker">
            <div className="p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">NÍVEL ATUAL</div>
              <div className="text-massive font-bold text-foreground">
                {currentLevel?.isBreak ? 'INTERVALO' : `Nível ${currentLevel?.level || 1}`}
              </div>
            </div>
          </Card>

          {/* Next Level */}
          {nextLevel && (
            <Card className="bg-card/50 border-border/50">
              <div className="p-4">
                <div className="text-sm text-muted-foreground mb-3 text-center">
                  PRÓXIMO NÍVEL
                </div>
                {nextLevel.isBreak ? (
                  <div className="text-center">
                    <div className="text-lg font-bold text-poker-highlight">
                      INTERVALO
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {nextLevel.breakDuration} minutos
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        Nível {nextLevel.level}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <div className="text-muted-foreground">SB</div>
                        <div className="font-bold text-primary">
                          {nextLevel.smallBlind.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">BB</div>
                        <div className="font-bold text-poker-chip">
                          {nextLevel.bigBlind.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Ante</div>
                        <div className="font-bold text-accent">
                          {nextLevel.ante.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}