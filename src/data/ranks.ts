import type { Rank } from '../lib/types';

export const RANKS: Rank[] = [
  { id: 'beginner', name: 'Beginner', icon: '🌱', theme: 'Starting your journey', minExp: 0 },
  { id: 'bronze', name: 'Bronze', icon: '🥉', theme: 'Building the habit', minExp: 500 },
  { id: 'silver', name: 'Silver', icon: '🥈', theme: 'Getting consistent', minExp: 1500 },
  { id: 'gold', name: 'Gold', icon: '🥇', theme: 'Growing your skills', minExp: 3500 },
  { id: 'platinum', name: 'Platinum', icon: '💎', theme: 'Strong foundation', minExp: 7000 },
  { id: 'diamond', name: 'Diamond', icon: '🔥', theme: 'Advanced consistency', minExp: 12500 },
  { id: 'master', name: 'Master', icon: '👑', theme: 'Movement veteran', minExp: 20000 },
];

// Each rank is split into sub-levels for finer-grained progress, similar to games.
const LEVELS_PER_RANK = 10;

export function getRankForExp(exp: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (exp >= rank.minExp) current = rank;
  }
  return current;
}

export function getNextRank(exp: number): Rank | null {
  const current = getRankForExp(exp);
  const idx = RANKS.findIndex((r) => r.id === current.id);
  return RANKS[idx + 1] ?? null;
}

export function getRankProgress(exp: number) {
  const current = getRankForExp(exp);
  const next = getNextRank(exp);
  const floor = current.minExp;
  const ceiling = next ? next.minExp : current.minExp + 1;
  const span = ceiling - floor;
  const progressExp = exp - floor;
  const pct = next ? Math.min(100, Math.round((progressExp / span) * 100)) : 100;
  return { current, next, floor, ceiling, progressExp, span, pct };
}

// A simple overall "level" derived from total EXP, independent of rank, for a
// familiar RPG-style "LEVEL 12" readout. 100 EXP per level.
const EXP_PER_LEVEL = 100;

export function getLevel(exp: number): number {
  return Math.floor(exp / EXP_PER_LEVEL) + 1;
}

export function getLevelProgress(exp: number) {
  const level = getLevel(exp);
  const floor = (level - 1) * EXP_PER_LEVEL;
  const ceiling = level * EXP_PER_LEVEL;
  const pct = Math.round(((exp - floor) / EXP_PER_LEVEL) * 100);
  return { level, floor, ceiling, pct };
}

export function getSubLevelLabel(exp: number): string {
  const { pct } = getRankProgress(exp);
  const sub = Math.min(LEVELS_PER_RANK, Math.floor((pct / 100) * LEVELS_PER_RANK) + 1);
  const numeral = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][sub - 1];
  return numeral;
}
