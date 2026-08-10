import type { AchievementDef } from '../lib/types';

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-quest',
    title: 'First Quest',
    icon: '🏆',
    description: 'Complete your first quest.',
    check: (p) => p.completedQuests.length >= 1,
  },
  {
    id: 'seven-day-adventurer',
    title: '7-Day Adventurer',
    icon: '🔥',
    description: 'Check in for seven days.',
    check: (p) => p.checkInDates.length >= 7,
  },
  {
    id: 'quest-master',
    title: 'Quest Master',
    icon: '⚔️',
    description: 'Complete 25 quests.',
    check: (p) => p.completedQuests.length >= 25,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    icon: '🌎',
    description: 'Try five different activities.',
    check: (p) => new Set(p.completedQuests.map((q) => q.chosenExerciseId)).size >= 5,
  },
  {
    id: 'skill-collector',
    title: 'Skill Collector',
    icon: '🎯',
    description: 'Complete 10 skill quests.',
    check: (p) => p.completedQuests.filter((q) => q.questId.startsWith('skill')).length >= 10,
  },
];
