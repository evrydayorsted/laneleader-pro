import { User, InviteCode, Workout } from '../types/swim';

const STORAGE_PREFIX = 'laneleader_pro_';

export const loadLocal = <T>(key: string, fallback: T): T => {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val ? (JSON.parse(val) as T) : fallback;
  } catch (e) {
    console.warn(`Storage read error for ${key}:`, e);
    return fallback;
  }
};

export const saveLocal = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Storage write error for ${key}:`, e);
  }
};

// Realistic seed data
export const DEFAULT_COACH: User = {
  id: 'coach_collin',
  name: 'Collin F',
  email: 'collin@coach.com',
  role: 'coach',
  password: 'password123',
  createdAt: '2026-10-01T08:00:00.000Z',
  clubName: 'Apex Aquatics Club',
  specialty: 'Distance & Senior Performance'
};

export const DEFAULT_SWIMMER_1: User = {
  id: 'swimmer_thor',
  name: 'Thor S',
  email: 'thor@swimmer.com',
  role: 'swimmer',
  password: 'password123',
  coachId: 'coach_collin',
  createdAt: '2026-10-05T09:30:00.000Z',
  clubName: 'Apex Aquatics Club',
  specialty: '200 Free / 400 IM'
};

export const DEFAULT_SWIMMER_2: User = {
  id: 'swimmer_maya',
  name: 'Maya L',
  email: 'maya@swimmer.com',
  role: 'swimmer',
  password: 'password123',
  coachId: 'coach_collin',
  createdAt: '2026-10-12T14:15:00.000Z',
  clubName: 'Apex Aquatics Club',
  specialty: '100 & 200 Breaststroke'
};

export const DEFAULT_INVITES: InviteCode[] = [
  {
    id: 'inv_seed_1',
    code: 'SWIM99',
    coachId: 'coach_collin',
    coachName: 'Collin F',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inv_seed_2',
    code: 'FAST24',
    coachId: 'coach_collin',
    coachName: 'Collin F',
    createdAt: new Date().toISOString()
  }
];

const today = new Date();
const formatDateOffset = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: 'w_seed_today',
    swimmerId: 'swimmer_thor',
    coachId: 'coach_collin',
    date: formatDateOffset(0),
    title: 'Aerobic Threshold & Stroke Rate',
    description: 'Target holding steady stroke count across the 100s. Fast turns.',
    poolCourse: 'SCY',
    dayType: 'workout',
    sets: [
      { id: 's_1', reps: 1, distance: 400, stroke: 'Freestyle', interval: '6:00', notes: 'Warmup swim, relaxed breathing 3/5 pattern', completedTime: '5:18', swimmerNotes: 'Felt smooth' },
      { id: 's_2', reps: 4, distance: 100, stroke: 'Freestyle', interval: '1:30', notes: 'Hold descending pace 1-4', completedTime: '1:06, 1:05, 1:03, 1:01', swimmerNotes: 'Strong final 100!' },
      { id: 's_3', reps: 8, distance: 50, stroke: 'Choice', interval: ':55', notes: 'Stroke technique drill / swim', completedTime: '35s avg', swimmerNotes: 'High elbow catch focus' },
      { id: 's_4', reps: 1, distance: 200, stroke: 'Freestyle', interval: '3:30', notes: 'Loosen down', completedTime: '2:50', swimmerNotes: 'Warm down' }
    ],
    completed: true,
    rpe: 8,
    feedback: 'High quality set! Arms felt heavy on the final 50s but kept stroke rate up.',
    coachReview: 'Excellent pace discipline on the 100s Thor. 1:01 on the 4th rep shows your taper is working.',
    completedAt: new Date().toISOString()
  },
  {
    id: 'w_seed_yesterday',
    swimmerId: 'swimmer_thor',
    coachId: 'coach_collin',
    date: formatDateOffset(-1),
    title: 'Speed Breakouts & Lactate Tolerance',
    description: 'Fast explosive push-offs, dolphin kicks past flags, maximum turnover.',
    poolCourse: 'SCY',
    dayType: 'workout',
    sets: [
      { id: 's_201', reps: 1, distance: 300, stroke: 'Choice', interval: '5:00', notes: 'Easy warmup', completedTime: '4:15', swimmerNotes: 'Good warmup' },
      { id: 's_202', reps: 8, distance: 25, stroke: 'Freestyle', interval: ':45', notes: 'All-out sprint from dive / push', completedTime: '12.8, 12.6, 12.7, 12.5, 12.6, 12.7, 12.4, 12.2', swimmerNotes: 'Power was there' },
      { id: 's_203', reps: 1, distance: 200, stroke: 'Choice', interval: '4:00', notes: 'Flush swim', completedTime: '3:05', swimmerNotes: 'Felt relaxed' }
    ],
    completed: true,
    rpe: 9,
    feedback: 'Felt explosive on the underwater kicks. Breaths were minimal on 25s.',
    coachReview: 'Under 12.5 on reps 7-8 is great sprint stamina.',
    completedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'w_seed_tomorrow',
    swimmerId: 'swimmer_thor',
    coachId: 'coach_collin',
    date: formatDateOffset(1),
    title: 'IM Transition & Race Pace 200s',
    description: 'Focus on clean back-to-breast crossover turns and tempo transitions.',
    poolCourse: 'SCY',
    dayType: 'workout',
    sets: [
      { id: 's_301', reps: 1, distance: 400, stroke: 'IM', interval: '6:30', notes: '100 of each stroke smooth', completedTime: '', swimmerNotes: '' },
      { id: 's_302', reps: 4, distance: 200, stroke: 'IM', interval: '3:15', notes: 'Descend 1-4 to race pace effort', completedTime: '', swimmerNotes: '' },
      { id: 's_303', reps: 4, distance: 50, stroke: 'Choice', interval: '1:00', notes: 'Easy recovery', completedTime: '', swimmerNotes: '' }
    ],
    completed: false,
    rpe: null,
    feedback: '',
    coachReview: ''
  },
  {
    id: 'w_seed_maya_today',
    swimmerId: 'swimmer_maya',
    coachId: 'coach_collin',
    date: formatDateOffset(0),
    title: 'Breaststroke Power & Tempo Set',
    description: '2 kicks 1 pull drills into full race tempo.',
    poolCourse: 'SCY',
    dayType: 'workout',
    sets: [
      { id: 'sm_1', reps: 1, distance: 300, stroke: 'Choice', interval: '5:00', notes: 'Choice warmup' },
      { id: 'sm_2', reps: 6, distance: 100, stroke: 'Breaststroke', interval: '1:45', notes: 'Descend 1-3, 4-6' },
      { id: 'sm_3', reps: 8, distance: 50, stroke: 'Breaststroke', interval: '1:00', notes: 'Fast glide' }
    ],
    completed: false,
    rpe: null,
    feedback: ''
  }
];
