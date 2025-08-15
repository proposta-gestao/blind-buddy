import { useState, useEffect, useCallback, useRef } from 'react';
import { TournamentState, BlindLevel } from '@/types/tournament';

export const useTournamentTimer = (initialState: TournamentState) => {
  const [state, setState] = useState<TournamentState>(initialState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio notifications
  const playNotification = useCallback((type: 'warning' | 'critical' | 'levelUp' | 'break') => {
    if (audioRef.current) {
      // Simple beep sounds - in a real app you'd load proper audio files
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      switch (type) {
        case 'warning':
          oscillator.frequency.setValueAtTime(800, context.currentTime);
          gainNode.gain.setValueAtTime(0.1, context.currentTime);
          oscillator.start();
          oscillator.stop(context.currentTime + 0.2);
          break;
        case 'critical':
          oscillator.frequency.setValueAtTime(1000, context.currentTime);
          gainNode.gain.setValueAtTime(0.2, context.currentTime);
          oscillator.start();
          oscillator.stop(context.currentTime + 0.5);
          break;
        case 'levelUp':
          oscillator.frequency.setValueAtTime(600, context.currentTime);
          gainNode.gain.setValueAtTime(0.15, context.currentTime);
          oscillator.start();
          oscillator.stop(context.currentTime + 1);
          break;
        case 'break':
          oscillator.frequency.setValueAtTime(400, context.currentTime);
          gainNode.gain.setValueAtTime(0.1, context.currentTime);
          oscillator.start();
          oscillator.stop(context.currentTime + 0.8);
          break;
      }
    }
  }, []);

  const getCurrentLevel = useCallback((): BlindLevel | null => {
    if (state.currentLevel >= state.structure.blindLevels.length) {
      return null;
    }
    return state.structure.blindLevels[state.currentLevel] || null;
  }, [state.currentLevel, state.structure.blindLevels]);

  const getNextLevel = useCallback((): BlindLevel | null => {
    const nextIndex = state.currentLevel + 1;
    if (nextIndex >= state.structure.blindLevels.length) {
      return null;
    }
    return state.structure.blindLevels[nextIndex] || null;
  }, [state.currentLevel, state.structure.blindLevels]);

  const startTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true, isPaused: false }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resetTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentLevel: 0,
      timeRemaining: prev.structure.blindLevels[0]?.duration * 60 || 0
    }));
  }, []);

  const skipLevel = useCallback(() => {
    const nextLevel = state.currentLevel + 1;
    if (nextLevel < state.structure.blindLevels.length) {
      const nextBlindLevel = state.structure.blindLevels[nextLevel];
      setState(prev => ({
        ...prev,
        currentLevel: nextLevel,
        timeRemaining: nextBlindLevel.duration * 60
      }));
      playNotification('levelUp');
    }
  }, [state.currentLevel, state.structure.blindLevels, playNotification]);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getTimeStatus = useCallback((): 'normal' | 'warning' | 'critical' => {
    if (state.timeRemaining <= 60) return 'critical';
    if (state.timeRemaining <= 300) return 'warning';
    return 'normal';
  }, [state.timeRemaining]);

  // Timer effect
  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            // Level completed, move to next
            const nextLevel = prev.currentLevel + 1;
            if (nextLevel < prev.structure.blindLevels.length) {
              const nextBlindLevel = prev.structure.blindLevels[nextLevel];
              playNotification(nextBlindLevel.isBreak ? 'break' : 'levelUp');
              return {
                ...prev,
                currentLevel: nextLevel,
                timeRemaining: nextBlindLevel.duration * 60
              };
            } else {
              // Tournament completed
              playNotification('levelUp');
              return {
                ...prev,
                isRunning: false,
                timeRemaining: 0
              };
            }
          } else {
            const newTime = prev.timeRemaining - 1;
            
            // Play warnings
            if (newTime === 300) playNotification('warning');
            if (newTime === 60) playNotification('critical');
            
            return {
              ...prev,
              timeRemaining: newTime
            };
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.isPaused, playNotification]);

  return {
    state,
    getCurrentLevel,
    getNextLevel,
    startTimer,
    pauseTimer,
    resetTimer,
    skipLevel,
    formatTime,
    getTimeStatus,
    isRunning: state.isRunning && !state.isPaused,
    isPaused: state.isPaused,
    currentLevel: getCurrentLevel(),
    nextLevel: getNextLevel(),
  };
};