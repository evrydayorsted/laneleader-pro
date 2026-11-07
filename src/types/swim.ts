export type UserRole = 'coach' | 'swimmer';

export type StrokeType = 'Freestyle' | 'Backstroke' | 'Breaststroke' | 'Butterfly' | 'IM' | 'Choice' | 'Kick' | 'Pull' | 'Drill';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  coachId?: string | null;
  createdAt: string;
  avatarColor?: string;
  clubName?: string;
  specialty?: string;
}

export interface InviteCode {
  id: string;
  code: string;
  coachId: string;
  coachName: string;
  createdAt: string;
  expiresAt?: string;
  usedBy?: string[];
}

export interface SwimSet {
  id: string;
  reps: number;
  distance: number; // e.g. 25, 50, 75, 100, 200, 400
  stroke: StrokeType;
  interval?: string; // e.g. "1:30", ":45", "on coach"
  notes?: string; // e.g. "Descend 1-4", "Fast turns", "High elbow catch"
  category?: 'Warm Up' | 'Main Set' | 'Kick' | 'Pull' | 'Sprint' | 'Cool Down' | 'Technique';
  // Swimmer execution tracking
  completedTime?: string; // e.g. "1:05, 1:04, 1:03, 1:01"
  swimmerNotes?: string; // e.g. "Felt strong, stroke rate 38"
}

export interface Workout {
  id: string;
  swimmerId: string;
  coachId: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  dayType?: 'workout' | 'meet' | 'rest' | 'recovery';
  sets: SwimSet[];
  completed: boolean;
  rpe?: number | null; // Rate of Perceived Exertion (1 - 10)
  feedback?: string; // Swimmer's notes
  coachReview?: string; // Coach's reply
  completedAt?: string;
  poolCourse?: 'SCY' | 'SCM' | 'LCM'; // Short Course Yards, Short Course Meters, Long Course Meters
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  sets: Omit<SwimSet, 'id'>[];
}
