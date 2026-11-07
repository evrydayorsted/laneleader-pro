import { SwimSet, Workout } from '../types/swim';

export const formatDateKey = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateStr: string): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const calculateSetYardage = (set: Pick<SwimSet, 'reps' | 'distance'>): number => {
  return (Number(set.reps) || 0) * (Number(set.distance) || 0);
};

export const calculateWorkoutYardage = (workout?: Workout | null): number => {
  if (!workout || !workout.sets) return 0;
  return workout.sets.reduce((sum, s) => sum + calculateSetYardage(s), 0);
};

export const formatYardage = (yards: number, course: 'SCY' | 'SCM' | 'LCM' = 'SCY'): string => {
  const unit = course === 'SCY' ? 'yd' : 'm';
  return `${yards.toLocaleString()} ${unit}`;
};

/**
 * Parses time strings like "1:05.4", ":32.1", "58.2", "5:20" into total seconds.
 */
export const parseTimeToSeconds = (str: string): number | null => {
  if (!str) return null;
  const clean = str.trim().replace(/^:/, '0:');
  const parts = clean.split(':');
  if (parts.length === 1) {
    const s = parseFloat(parts[0]);
    return isNaN(s) ? null : s;
  }
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const s = parseFloat(parts[1]);
    if (isNaN(m) || isNaN(s)) return null;
    return m * 60 + s;
  }
  return null;
};

/**
 * Formats seconds back to swim time (e.g., 68.5 -> "1:08.5")
 */
export const formatSecondsToTime = (totalSeconds: number): string => {
  if (totalSeconds < 0 || isNaN(totalSeconds)) return '0:00';
  const mins = Math.floor(totalSeconds / 60);
  const secs = (totalSeconds % 60).toFixed(1);
  const paddedSecs = parseFloat(secs) < 10 ? `0${secs}` : secs;
  return mins > 0 ? `${mins}:${paddedSecs}` : `${paddedSecs}s`;
};

/**
 * Calculates pace per 100y/m from distance and total time string
 */
export const calculatePacePer100 = (distance: number, timeStr: string): string | null => {
  if (!distance || distance <= 0) return null;
  const secs = parseTimeToSeconds(timeStr);
  if (!secs) return null;
  const paceSecs = (secs / distance) * 100;
  return formatSecondsToTime(paceSecs);
};

/**
 * Estimate workout duration from intervals and sets
 */
export const estimateWorkoutDurationMinutes = (sets: SwimSet[]): number => {
  let totalSecs = 0;
  for (const s of sets) {
    const reps = Number(s.reps) || 1;
    const intervalSecs = parseTimeToSeconds(s.interval || '') || (s.distance * 0.9); // fallback ~1:30/100
    totalSecs += reps * intervalSecs;
  }
  // Add rest buffer between sets (approx 30s)
  totalSecs += Math.max(0, sets.length - 1) * 30;
  return Math.max(1, Math.round(totalSecs / 60));
};
