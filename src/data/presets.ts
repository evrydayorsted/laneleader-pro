import { WorkoutPreset } from '../types/swim';

export const WORKOUT_PRESETS: WorkoutPreset[] = [
  {
    id: 'preset_warmup_classic',
    name: 'Classic 1000 Warm-Up',
    category: 'Warm Up',
    description: 'Gradual ramp up engaging aerobic lungs, feel for the water, and all 4 competitive strokes.',
    sets: [
      { reps: 1, distance: 400, stroke: 'Freestyle', interval: '6:00', notes: 'Smooth long stroke, breathe bilateral every 3', category: 'Warm Up' },
      { reps: 4, distance: 100, stroke: 'IM', interval: '1:45', notes: '25 drill / 25 swim by stroke', category: 'Technique' },
      { reps: 4, distance: 50, stroke: 'Choice', interval: ':55', notes: 'Build each 50 to 85% fast breakout', category: 'Warm Up' }
    ]
  },
  {
    id: 'preset_threshold_100s',
    name: 'Aerobic Threshold 10 x 100',
    category: 'Threshold',
    description: 'Heart-rate 160-170 zone. Hold consistent target pace within 1-2 seconds per 100.',
    sets: [
      { reps: 10, distance: 100, stroke: 'Freestyle', interval: '1:25', notes: 'Hold best aerobic pace. Descend 1-5, 6-10', category: 'Main Set' },
      { reps: 1, distance: 100, stroke: 'Choice', interval: '2:30', notes: 'Easy recovery swim', category: 'Cool Down' }
    ]
  },
  {
    id: 'preset_im_transition',
    name: 'IM Transition & Engine',
    category: 'IM',
    description: 'Focus on turns and tempo transitions across Fly-to-Back, Back-to-Breast, and Breast-to-Free.',
    sets: [
      { reps: 1, distance: 300, stroke: 'Choice', interval: '5:00', notes: 'Choice warmup', category: 'Warm Up' },
      { reps: 4, distance: 200, stroke: 'IM', interval: '3:15', notes: '50 Fly, 50 Back, 50 Breast, 50 Free. Fast crossover turns', category: 'Main Set' },
      { reps: 4, distance: 50, stroke: 'Breaststroke', interval: '1:05', notes: '2 kicks 1 pull drill / power glide', category: 'Technique' }
    ]
  },
  {
    id: 'preset_kick_lactate',
    name: 'Leg Power & Kick Circuit',
    category: 'Kick',
    description: 'High intensity leg conditioning to sustain fast stroke rate at race finish.',
    sets: [
      { reps: 8, distance: 50, stroke: 'Kick', interval: '1:05', notes: 'Streamline underwater kicks off wall, board in surface', category: 'Kick' },
      { reps: 4, distance: 100, stroke: 'Kick', interval: '2:00', notes: 'Descend 1-4. Rep 4 maximum sustained kick', category: 'Kick' }
    ]
  },
  {
    id: 'preset_sprint_power',
    name: 'Anaerobic Sprint & Breakouts',
    category: 'Sprint',
    description: 'Neuromuscular speed, dive breakouts, and underwater speed.',
    sets: [
      { reps: 8, distance: 25, stroke: 'Freestyle', interval: ':45', notes: 'MAX sprint with fast 15m breakout & finish', category: 'Sprint' },
      { reps: 4, distance: 50, stroke: 'Choice', interval: '1:15', notes: '25 MAX blast / 25 easy float', category: 'Sprint' },
      { reps: 1, distance: 200, stroke: 'Freestyle', interval: '4:00', notes: 'Super easy flush out', category: 'Cool Down' }
    ]
  },
  {
    id: 'preset_recovery_flush',
    name: 'Recovery & Technique Flush',
    category: 'Recovery',
    description: 'Low heart rate recovery day to stretch shoulders and reset stroke biomechanics.',
    sets: [
      { reps: 4, distance: 100, stroke: 'Backstroke', interval: '2:00', notes: 'Focus on rotation and clean catch', category: 'Technique' },
      { reps: 6, distance: 50, stroke: 'Choice', interval: '1:10', notes: 'Catch-up drill with fins or pull buoy', category: 'Technique' },
      { reps: 1, distance: 200, stroke: 'Freestyle', interval: '4:30', notes: 'Silent swimming, zero splash entry', category: 'Cool Down' }
    ]
  }
];

export const COMMON_SETS = [
  { reps: 4, distance: 100, stroke: 'Freestyle' as const, interval: '1:30', notes: 'Hold steady pace', category: 'Main Set' as const },
  { reps: 8, distance: 50, stroke: 'Choice' as const, interval: ':55', notes: 'Stroke drill / swim', category: 'Technique' as const },
  { reps: 1, distance: 400, stroke: 'Freestyle' as const, interval: '6:00', notes: 'Warmup aerobic swim', category: 'Warm Up' as const },
  { reps: 6, distance: 75, stroke: 'IM' as const, interval: '1:20', notes: '25 Fly / 25 Back / 25 Breast', category: 'Main Set' as const },
  { reps: 4, distance: 25, stroke: 'Freestyle' as const, interval: ':40', notes: 'Max sprint speed', category: 'Sprint' as const },
  { reps: 1, distance: 200, stroke: 'Freestyle' as const, interval: '3:30', notes: 'Loosen down easy', category: 'Cool Down' as const }
];
