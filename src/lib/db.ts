import { supabase } from './supabaseClient';
import type { User, InviteCode, Workout, SwimSet } from '../types/swim';

export interface ProfileRow {
  id: string;
  name: string;
  email: string;
  role: 'coach' | 'swimmer';
  coach_id: string | null;
  club_name: string | null;
  specialty: string | null;
  avatar_color: string | null;
  created_at: string;
}

export interface InviteRow {
  id: string;
  code: string;
  coach_id: string;
  coach_name: string;
  created_at: string;
}

export interface WorkoutRow {
  id: string;
  swimmer_id: string;
  coach_id: string;
  date: string;
  title: string;
  description: string | null;
  day_type: Workout['dayType'] | null;
  pool_course: Workout['poolCourse'] | null;
  sets: SwimSet[];
  completed: boolean;
  rpe: number | null;
  feedback: string | null;
  coach_review: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const rowToUser = (row: ProfileRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  coachId: row.coach_id ?? undefined,
  createdAt: row.created_at,
  avatarColor: row.avatar_color ?? undefined,
  clubName: row.club_name ?? undefined,
  specialty: row.specialty ?? undefined,
});

export const rowToInvite = (row: InviteRow): InviteCode => ({
  id: row.id,
  code: row.code,
  coachId: row.coach_id,
  coachName: row.coach_name,
  createdAt: row.created_at,
});

export const rowToWorkout = (row: WorkoutRow): Workout => ({
  id: row.id,
  swimmerId: row.swimmer_id,
  coachId: row.coach_id,
  date: row.date,
  title: row.title,
  description: row.description ?? undefined,
  dayType: row.day_type ?? undefined,
  sets: row.sets,
  completed: row.completed,
  rpe: row.rpe,
  feedback: row.feedback ?? undefined,
  coachReview: row.coach_review ?? undefined,
  completedAt: row.completed_at ?? undefined,
  poolCourse: row.pool_course ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const workoutToRow = (workout: Workout): Omit<WorkoutRow, 'created_at' | 'updated_at'> => ({
  id: workout.id,
  swimmer_id: workout.swimmerId,
  coach_id: workout.coachId,
  date: workout.date,
  title: workout.title,
  description: workout.description ?? null,
  day_type: workout.dayType ?? null,
  pool_course: workout.poolCourse ?? null,
  sets: workout.sets,
  completed: workout.completed,
  rpe: workout.rpe ?? null,
  feedback: workout.feedback ?? null,
  coach_review: workout.coachReview ?? null,
  completed_at: workout.completedAt ?? null,
});

export const fetchVisibleProfiles = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return (data as ProfileRow[]).map(rowToUser);
};

export const fetchInvitesForCoach = async (coachId: string): Promise<InviteCode[]> => {
  const { data, error } = await supabase.from('invites').select('*').eq('coach_id', coachId);
  if (error) throw error;
  return (data as InviteRow[]).map(rowToInvite);
};

export const fetchVisibleWorkouts = async (): Promise<Workout[]> => {
  const { data, error } = await supabase.from('workouts').select('*');
  if (error) throw error;
  return (data as WorkoutRow[]).map(rowToWorkout);
};
