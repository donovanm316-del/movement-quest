import { EXERCISES } from '../data/exercises';
import type { Difficulty, Equipment, Exercise, OnboardingAnswers, Quest, QuestType, UserProfile } from './types';

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

export function generateDailyQuests(onboarding: OnboardingAnswers | null, seed = new Date().toDateString()): Quest[] {
  return TEMPLATES.map((template, i) => {
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
}

export function isNewDay(lastDate: string): boolean {
  return lastDate !== new Date().toDateString();
}

export function skillsForQuest(quest: Quest): Partial<UserProfile['skills']> {
  const gain: Partial<UserProfile['skills']> = { consistency: 1 };
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
