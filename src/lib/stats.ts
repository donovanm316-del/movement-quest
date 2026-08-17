import type { SkillLevels } from './types';

// A sports-card style "overall rating" derived from the six skills, purely
// for flavor. Starts in the high-30s at baseline and climbs toward 99 as
// skills grow through consistent quest completion.
export function getOverallRating(skills: SkillLevels): number {
  const values = Object.values(skills);
  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  const ovr = Math.round(35 + average * 2.2);
  return Math.max(1, Math.min(99, ovr));
}
