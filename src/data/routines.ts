import type { MuscleGroup, WorkoutRoutine } from '../lib/types';

export const ROUTINES: WorkoutRoutine[] = [
  {
    id: 'chest-foundations',
    title: 'Chest Foundations',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    description: 'Build pressing strength with beginner-friendly push-up variations.',
    exp: 120,
    exercises: [
      { exerciseId: 'wall-pushup', sets: 2, reps: '10-12' },
      { exerciseId: 'incline-pushup', sets: 3, reps: '8-10' },
      { exerciseId: 'plank', sets: 2, durationSeconds: 30 },
    ],
  },
  {
    id: 'back-foundations',
    title: 'Back Foundations',
    muscleGroup: 'back',
    difficulty: 'beginner',
    description: 'Strengthen your back and improve posture.',
    exp: 120,
    exercises: [
      { exerciseId: 'superman', sets: 3, reps: '10' },
      { exerciseId: 'reverse-snow-angel', sets: 2, reps: '10' },
      { exerciseId: 'resistance-band-row', sets: 3, reps: '10-12' },
    ],
  },
  {
    id: 'leg-day-foundations',
    title: 'Leg Day Foundations',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    description: 'Build lower-body strength from the ground up.',
    exp: 130,
    exercises: [
      { exerciseId: 'bodyweight-squat', sets: 3, reps: '12-15' },
      { exerciseId: 'glute-bridge', sets: 3, reps: '12-15' },
      { exerciseId: 'calf-raise', sets: 2, reps: '15' },
    ],
  },
  {
    id: 'shoulder-foundations',
    title: 'Shoulder Foundations',
    muscleGroup: 'shoulders',
    difficulty: 'beginner',
    description: 'Build stable, strong shoulders safely.',
    exp: 120,
    exercises: [
      { exerciseId: 'shoulder-taps', sets: 3, reps: '10 per side' },
      { exerciseId: 'band-lateral-raise', sets: 3, reps: '12' },
      { exerciseId: 'pike-pushup', sets: 2, reps: '6-8' },
    ],
  },
  {
    id: 'arm-day-foundations',
    title: 'Arm Day Foundations',
    muscleGroup: 'arms',
    difficulty: 'beginner',
    description: 'Target biceps and triceps with simple, effective moves.',
    exp: 110,
    exercises: [
      { exerciseId: 'dumbbell-curl', sets: 3, reps: '10-12' },
      { exerciseId: 'triceps-dip', sets: 3, reps: '8-10' },
      { exerciseId: 'assisted-pullup-hang', sets: 2, durationSeconds: 20 },
    ],
  },
  {
    id: 'core-foundations',
    title: 'Core Foundations',
    muscleGroup: 'core',
    difficulty: 'beginner',
    description: 'Build a strong, stable core.',
    exp: 110,
    exercises: [
      { exerciseId: 'plank', sets: 3, durationSeconds: 30 },
      { exerciseId: 'bicycle-crunch', sets: 3, reps: '15 per side' },
      { exerciseId: 'glute-bridge', sets: 2, reps: '12' },
    ],
  },
  {
    id: 'full-body-foundations',
    title: 'Full-Body Foundations',
    muscleGroup: 'full_body',
    difficulty: 'beginner',
    description: 'A balanced routine that trains your whole body in one go.',
    exp: 150,
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 2, reps: '20' },
      { exerciseId: 'bodyweight-squat', sets: 2, reps: '12' },
      { exerciseId: 'incline-pushup', sets: 2, reps: '10' },
      { exerciseId: 'plank', sets: 2, durationSeconds: 30 },
    ],
  },
];

export function getRoutine(id: string): WorkoutRoutine | undefined {
  return ROUTINES.find((r) => r.id === id);
}

export function routinesForMuscleGroup(muscleGroup: MuscleGroup): WorkoutRoutine[] {
  return ROUTINES.filter((r) => r.muscleGroup === muscleGroup);
}

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, { label: string; icon: string }> = {
  chest: { label: 'Chest', icon: '🛡️' },
  back: { label: 'Back', icon: '🔙' },
  legs: { label: 'Legs', icon: '🦵' },
  shoulders: { label: 'Shoulders', icon: '🏔️' },
  arms: { label: 'Arms', icon: '💪' },
  core: { label: 'Core', icon: '🎯' },
  full_body: { label: 'Full Body', icon: '⚡' },
};
