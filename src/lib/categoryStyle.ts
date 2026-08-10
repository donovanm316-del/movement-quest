import type { Quest } from './types';

interface CategoryStyle {
  icon: string;
  color: string;
  bg: string;
  border: string;
  label: string;
}

const STYLES: Record<Quest['type'], CategoryStyle> = {
  starter: { icon: '⚔️', color: 'text-strength', bg: 'bg-strength/10', border: 'border-strength/40', label: 'Strength' },
  movement: { icon: '🏃', color: 'text-cardio', bg: 'bg-cardio/10', border: 'border-cardio/40', label: 'Cardio' },
  recovery: { icon: '🧘', color: 'text-mobility', bg: 'bg-mobility/10', border: 'border-mobility/40', label: 'Mobility' },
  skill: { icon: '🎯', color: 'text-skills', bg: 'bg-skills/10', border: 'border-skills/40', label: 'Skill' },
  target: { icon: '🏆', color: 'text-target', bg: 'bg-target/10', border: 'border-target/40', label: 'Target Routine' },
};

export function questStyle(type: Quest['type']): CategoryStyle {
  return STYLES[type];
}
