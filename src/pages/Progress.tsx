import { useProfile } from '../lib/ProfileContext';
import { NavBar } from '../components/NavBar';
import { ExpBar } from '../components/ExpBar';
import { ACHIEVEMENTS } from '../data/achievements';
import type { SkillName } from '../lib/types';

const SKILL_LABELS: Record<SkillName, string> = {
  strength: 'Strength',
  endurance: 'Endurance',
  mobility: 'Mobility',
  balance: 'Balance',
  movement: 'Movement',
  consistency: 'Consistency',
};

const MAX_SKILL_DISPLAY = 50;

export function Progress() {
  const { profile } = useProfile();
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-md px-6 pb-28 pt-10">
      <h1 className="mb-6 text-2xl font-bold text-text">Progress</h1>

      <h2 className="mb-3 font-semibold text-text">Skills</h2>
      <div className="mb-8 space-y-4">
        {(Object.keys(profile.skills) as SkillName[]).map((skill) => (
          <div key={skill}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-text">{SKILL_LABELS[skill]}</span>
              <span className="text-text-dim">Lv. {profile.skills[skill]}</span>
            </div>
            <ExpBar pct={(profile.skills[skill] / MAX_SKILL_DISPLAY) * 100} colorClass="bg-gold" />
          </div>
        ))}
      </div>

      <h2 className="mb-3 font-semibold text-text">Achievements</h2>
      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = profile.unlockedAchievements.includes(a.id);
          return (
            <div
              key={a.id}
              className={`rounded-xl border p-4 text-center ${
                unlocked ? 'border-gold bg-gold/10' : 'border-border bg-surface/50 opacity-50'
              }`}
            >
              <div className="text-2xl">{a.icon}</div>
              <div className="mt-1 text-sm font-semibold text-text">{a.title}</div>
              <div className="text-xs text-text-dim">{a.description}</div>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 mt-8 font-semibold text-text">Adventure Streak</h2>
      <div className="rounded-xl border border-border bg-surface p-4 text-center">
        <div className="text-2xl font-bold text-primary">{profile.checkInDates.length}</div>
        <div className="text-sm text-text-dim">days checked in</div>
      </div>

      <NavBar />
    </div>
  );
}
