import { EXERCISES } from '../data/exercises';
import { routinesForMuscleGroup, MUSCLE_GROUP_LABELS } from '../data/routines';
import type { Difficulty, Equipment, Exercise, MuscleGroup, OnboardingAnswers, Quest, QuestType, UserProfile } from './types';

interface QuestTemplate {
  type: QuestType;
  title: string;
  description: string;
  category: Exercise['category'];
  exp: number;
  recommendedMinutes?: string;
  optionCount: number;
}

const TEMPLATES: QuestTemplate[] = [
  {
    type: 'starter',
    title: 'Morning Starter',
    description: 'Complete a short movement routine to kick off your day.',
    category: 'strength',
    exp: 50,
    recommendedMinutes: '5-10 minutes',
    optionCount: 2,
  },
  {
    type: 'movement',
    title: 'Movement Quest',
    description: 'Choose an activity and get your body moving.',
    category: 'cardio',
    exp: 75,
    recommendedMinutes: '10-20 minutes',
    optionCount: 4,
  },
  {
    type: 'recovery',
    title: 'Recovery Quest',
    description: 'Complete a short mobility or stretching session.',
    category: 'mobility',
    exp: 40,
    recommendedMinutes: '5-10 minutes',
    optionCount: 2,
  },
  {
    type: 'skill',
    title: 'Skill Quest',
    description: 'Practice one movement skill.',
    category: 'skills',
    exp: 60,
    recommendedMinutes: '10 minutes',
    optionCount: 2,
  },
];

function difficultyForExperience(onboarding: OnboardingAnswers | null): Difficulty {
  if (!onboarding) return 'beginner';
  if (onboarding.activityLevel === 'regular' || onboarding.pastWorkouts === 'regularly') return 'intermediate';
  return 'beginner';
}

function equipmentAllowed(exercise: Exercise, ownedEquipment: Equipment[]): boolean {
  if (exercise.equipment.includes('none')) return true;
  if (!ownedEquipment || ownedEquipment.length === 0) return true;
  return exercise.equipment.some((eq) => ownedEquipment.includes(eq));
}

function pickOptions(category: Exercise['category'], count: number, onboarding: OnboardingAnswers | null): Exercise[] {
  const maxDifficulty = difficultyForExperience(onboarding);
  const equipment = onboarding?.equipment ?? ['none'];

  const pool = EXERCISES.filter((e) => {
    if (e.category !== category) return false;
    if (maxDifficulty === 'beginner' && e.difficulty !== 'beginner') return false;
    return equipmentAllowed(e, equipment);
  });

  const source = pool.length >= count ? pool : EXERCISES.filter((e) => e.category === category);
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function dayIndex(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}

function pickTargetQuest(onboarding: OnboardingAnswers, seed: string, i: number): Quest | null {
  const groups = onboarding.targetMuscleGroups;
  if (!groups || groups.length === 0) return null;

  const group: MuscleGroup = groups[dayIndex(seed) % groups.length];
  const candidates = routinesForMuscleGroup(group);
  if (candidates.length === 0) return null;

  const routine = candidates[dayIndex(seed + group) % candidates.length];
  const groupInfo = MUSCLE_GROUP_LABELS[group];

  return {
    id: `${seed}-target-${i}`,
    type: 'target',
    title: `${groupInfo.icon} ${groupInfo.label} Day`,
    description: routine.description,
    category: 'strength',
    exp: routine.exp,
    options: [],
    routineId: routine.id,
    muscleGroup: group,
    recommendedMinutes: '15-25 minutes',
  };
}

export function generateDailyQuests(onboarding: OnboardingAnswers | null, seed = new Date().toDateString()): Quest[] {
  const quests: Quest[] = TEMPLATES.map((template, i) => {
    const options = pickOptions(template.category, template.optionCount, onboarding);
    return {
      id: `${seed}-${template.type}-${i}`,
      type: template.type,
      title: template.title,
      description: template.description,
      category: template.category,
      exp: template.exp,
      recommendedMinutes: template.recommendedMinutes,
      options: options.map((o) => ({ exerciseId: o.id })),
    };
  });

  if (onboarding) {
    const targetQuest = pickTargetQuest(onboarding, seed, quests.length);
    if (targetQuest) quests.push(targetQuest);
  }

  return quests;
}

export function isNewDay(lastDate: string): boolean {
  return lastDate !== new Date().toDateString();
}

export function skillsForQuest(quest: Quest): Partial<UserProfile['skills']> {
  const gain: Partial<UserProfile['skills']> = { consistency: 1 };
  if (quest.type === 'target') {
    gain.strength = 4;
    return gain;
  }
  switch (quest.category) {
    case 'strength':
      gain.strength = 2;
      break;
    case 'cardio':
      gain.endurance = 2;
      break;
    case 'mobility':
      gain.mobility = 2;
      break;
    case 'skills':
      gain.balance = 1;
      gain.movement = 2;
      break;
    case 'games':
      gain.movement = 1;
      gain.balance = 1;
      break;
  }
  return gain;
}
