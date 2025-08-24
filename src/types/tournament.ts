export interface BlindLevel {
  level: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  duration: number; // in minutes
  isBreak?: boolean;
  breakDuration?: number;
}

export interface TournamentStructure {
  id: string;
  name: string;
  description: string;
  blindLevels: BlindLevel[];
  startingChips: number;
  doubleBuyInChips: number;
  addonChips: number;
  adminFeeChips: number;
  buyIn: number;
  doubleBuyIn: number;
  adminFee: number;
  addon: number;
  guaranteedPrize: number;
  rebuyAllowed: boolean;
  addonAllowed: boolean;
  breakDuration: number; // in minutes
}

export interface TournamentState {
  isRunning: boolean;
  isPaused: boolean;
  currentLevel: number;
  timeRemaining: number; // in seconds
  totalPlayers: number;
  playersRemaining: number;
  prizePool: number;
  totalChips: number;
  structure: TournamentStructure;
}

export interface Player {
  id: string;
  name: string;
  position?: number;
  isEliminated: boolean;
  eliminationLevel?: number;
  chips: number;
  rebuys: number;
  addons: number;
  buyInType: 'normal' | 'double';
  paidAdminFee: boolean;
}