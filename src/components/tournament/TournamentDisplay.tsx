import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TournamentState, BlindLevel, Player } from "@/types/tournament";
import { formatCurrency } from "@/lib/format";
import pokerChipsBg from "@/assets/poker-chips-bg.jpg";

interface TournamentDisplayProps {
  currentLevel: BlindLevel | null;
  nextLevel: BlindLevel | null;
  timeRemaining: number;
  timeStatus: 'normal' | 'warning' | 'critical';
  formatTime: (seconds: number) => string;
  tournamentState: TournamentState;
  players?: Player[];
}

export function TournamentDisplay({
  currentLevel,
  nextLevel,
  timeRemaining,
  timeStatus,
  formatTime,
  tournamentState,
  players = []
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

  const getTotalChips = () => {
    // Calculate total chips based on actual buy-in types and addons
    return players?.reduce((total, player) => {
      let playerChips = 0;
      
      // Base chips according to buy-in type
      if (player.buyInType === 'double') {
        playerChips = tournamentState.structure.doubleBuyInChips || (tournamentState.structure.startingChips * 2);
      } else {
        playerChips = tournamentState.structure.startingChips;
      }
      
      // Add addon chips if player has addons
      playerChips += player.addons * (tournamentState.structure.addonChips || tournamentState.structure.startingChips);
      
      // Add rebuy chips if player has rebuys
      playerChips += player.rebuys * tournamentState.structure.startingChips;
      
      return total + playerChips;
    }, 0) || tournamentState.structure.startingChips * tournamentState.totalPlayers;
  };

  const formatGuaranteedValue = (value: number) => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`;
    }
    return `R$ ${value}`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-poker-felt via-background to-background/95 relative overflow-hidden flex flex-col">
      {/* Background decorative elements */}
      <div 
        className="absolute inset-0 bg-gradient-felt opacity-10"
        style={{
          backgroundImage: `url(${pokerChipsBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-felt opacity-20"></div>
      
      <div className="relative z-10 flex-1 p-2 sm:p-4 pt-20 flex flex-col">
        {/* Tournament Header - Compact */}
        <div className="text-center mb-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1">
            {tournamentState.structure.name} - {formatGuaranteedValue(tournamentState.structure.guaranteedPrize)}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base truncate">
            {tournamentState.structure.description}
          </p>
        </div>

        {/* Main Content - Reorganized Layout */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          {/* 1. Level Display - First */}
          <div className="text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">
              {currentLevel?.isBreak ? 'INTERVALO' : `NÍVEL ${currentLevel?.level || 1}`}
            </div>
          </div>

          {/* 2. Timer - Modern, wider, and nearly transparent design */}
          <div className="flex justify-center">
            <div className="relative group w-full max-w-2xl">
              {/* Outer glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-700"></div>
              
              {/* Main timer container - wider and more transparent */}
              <div className="relative bg-background/5 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-lg border border-primary/10 overflow-hidden">
                {/* Animated border gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl animate-pulse"></div>
                <div className="absolute inset-[1px] bg-background/5 rounded-2xl"></div>
                
                {/* Timer display */}
                <div className="relative z-10 text-center space-y-4">
                  <div className={cn(
                    "text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight",
                    "bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent",
                    "drop-shadow-2xl transition-all duration-300",
                    timeStatus === 'critical' && "from-destructive via-destructive to-destructive/80 animate-pulse",
                    timeStatus === 'warning' && "from-orange-500 via-orange-400 to-orange-600"
                  )}>
                    {formatTime(timeRemaining)}
                  </div>
                  
                  {/* Progress Bar - Integrated within timer */}
                  <div className="w-full bg-secondary/20 rounded-full h-3">
                    <div 
                      className={cn(
                        "h-3 rounded-full transition-all duration-1000",
                        timeStatus === 'critical' ? 'bg-destructive' :
                        timeStatus === 'warning' ? 'bg-orange-500' :
                        'bg-primary'
                      )}
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blinds Display - Single Background, Inverted Positions */}
          {currentLevel?.isBreak ? (
            <div className="text-center bg-poker-highlight/10 rounded-lg p-6">
              <div className="text-3xl sm:text-4xl font-bold text-poker-highlight">
                BREAK TIME
              </div>
              <div className="text-xl text-muted-foreground mt-2">
                Duração: {currentLevel.breakDuration} minutos
              </div>
            </div>
          ) : (
           <div className="bg-gradient-felt/40 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-primary/10 shadow-lg">
             <div className="grid grid-cols-3 gap-6 text-center">
               {/* Small Blind - Now on the left */}
               <div>
                 <div className="text-sm font-semibold text-muted-foreground/90 mb-2">SMALL BLIND</div>
                 <div className="text-3xl sm:text-4xl font-black text-primary drop-shadow-sm">
                   {currentLevel?.smallBlind?.toLocaleString() || '0'}
                 </div>
               </div>
               {/* Big Blind - Now in the center */}
               <div>
                 <div className="text-sm font-semibold text-muted-foreground/90 mb-2">BIG BLIND</div>
                 <div className="text-3xl sm:text-4xl font-black text-poker-chip drop-shadow-sm">
                   {currentLevel?.bigBlind?.toLocaleString() || '0'}
                 </div>
               </div>
               <div>
                 <div className="text-sm font-semibold text-muted-foreground/90 mb-2">ANTE</div>
                 <div className="text-3xl sm:text-4xl font-black text-accent drop-shadow-sm">
                   {currentLevel?.ante?.toLocaleString() || '0'}
                 </div>
               </div>
             </div>
           </div>
           )}

          {/* Next Level Info - Below Blinds */}
          {nextLevel && (
            <div className="text-center text-muted-foreground text-sm sm:text-base mb-4">
              {nextLevel.isBreak ? (
                <span>Próximo: Intervalo ({nextLevel.breakDuration} min)</span>
              ) : (
                <span>Próximo: Nível {nextLevel.level} - {nextLevel.smallBlind.toLocaleString()}/{nextLevel.bigBlind.toLocaleString()}{nextLevel.ante > 0 ? ` (A${nextLevel.ante.toLocaleString()})` : ''}</span>
              )}
            </div>
          )}

           {/* Tournament Info - Enhanced with larger fonts */}
           <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
             <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-chip border border-primary/20">
               <div className="text-sm font-semibold text-muted-foreground/90 mb-2">Jogadores</div>
               <div className="text-lg font-black text-primary">
                 {tournamentState.playersRemaining}/{tournamentState.totalPlayers}
               </div>
             </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-chip border border-primary/20">
                <div className="text-sm font-semibold text-muted-foreground/90 mb-2">Total de Fichas</div>
                <div className="text-lg font-black text-poker-highlight">
                  {tournamentState.totalChips?.toLocaleString() || getTotalChips().toLocaleString()}
                </div>
              </div>
             <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-chip border border-primary/20">
               <div className="text-sm font-semibold text-muted-foreground/90 mb-2">Buy-in Simples</div>
               <div className="text-base font-bold text-poker-chip">
                 {formatCurrency(tournamentState.structure.buyIn)}
               </div>
               <div className="text-xs text-muted-foreground">
                 {tournamentState.structure.startingChips.toLocaleString()} fichas
               </div>
             </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-chip border border-primary/20">
                <div className="text-sm font-semibold text-muted-foreground/90 mb-2">Buy-in Duplo</div>
                <div className="text-base font-bold text-accent">
                  {formatCurrency(tournamentState.structure.doubleBuyIn)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {(tournamentState.structure.doubleBuyInChips || tournamentState.structure.startingChips * 2).toLocaleString()} fichas
                </div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-chip border border-primary/20">
                <div className="text-sm font-semibold text-muted-foreground/90 mb-2">Addon</div>
                <div className="text-base font-bold text-primary">
                  {formatCurrency(tournamentState.structure.buyIn)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {(tournamentState.structure.addonChips || tournamentState.structure.startingChips).toLocaleString()} fichas
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}