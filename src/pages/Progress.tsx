import { useProfile } from '../lib/ProfileContext';
import { NavBar } from '../components/NavBar';
import { ExpBar } from '../components/ExpBar';
import { ACHIEVEMENTS } from '../data/achievements';
import type { SkillName } from '../lib/types';

const SKILL_INFO: Record<SkillName, { label: string; icon: string }> = {
  strength: { label: 'Strength', icon: '🏋️' },
  endurance: { label: 'Endurance', icon: '🏃' },
  mobility: { label: 'Mobility', icon: '🧘' },
  balance: { label: 'Balance', icon: '🤸' },
  movement: { label: 'Movement', icon: '⚡' },
  consistency: { label: 'Consistency', icon: '🔥' },
};

const MAX_SKILL_DISPLAY = 50;

export function Progress() {
  const { profile } = useProfile();
  if (!profile) return null;

  const unlockedCount = profile.unlockedAchievements.length;

  return (
    <div className="mx-auto max-w-md px-6 pb-28 pt-10">
      <h1 className="mb-6 text-2xl font-bold text-text">Progress</h1>

      <h2 className="mb-3 font-semibold text-text">Skills</h2>
      <div className="mb-8 space-y-4 rounded-xl border border-border bg-surface p-4">
        {(Object.keys(profile.skills) as SkillName[]).map((skill) => (
          <div key={skill}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-text">
                {SKILL_INFO[skill].icon} {SKILL_INFO[skill].label}
              </span>
              <span className="text-text-dim">Lv. {profile.skills[skill]}</span>
            </div>
            <ExpBar pct={(profile.skills[skill] / MAX_SKILL_DISPLAY) * 100} colorClass="bg-gold" />
          </div>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-text">Achievements</h2>
        <span className="text-sm text-text-dim">
          {unlockedCount}/{ACHIEVEMENTS.length}
        </span>
      </div>
      <div className="mb-8 grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = profile.unlockedAchievements.includes(a.id);
          return (
            <div
              key={a.id}
              className={`rounded-xl border p-4 text-center transition ${
                unlocked
                  ? 'border-gold bg-gold/10 shadow-md shadow-gold/10'
                  : 'border-border bg-surface/50 opacity-50 grayscale'
              }`}
            >
              <div className="text-2xl">{a.icon}</div>
              <div className="mt-1 text-sm font-semibold text-text">{a.title}</div>
              <div className="text-xs text-text-dim">{a.description}</div>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 font-semibold text-text">Adventure Streak</h2>
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl">🔥</span>
          <span className="text-3xl font-bold text-primary">{profile.checkInDates.length}</span>
        </div>
        <div className="text-center text-sm text-text-dim">days checked in</div>
        <div className="mt-3 flex justify-center gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            const filled = i < Math.min(7, profile.checkInDates.length);
            return (
              <span
                key={i}
                className={`h-2 flex-1 max-w-6 rounded-full ${filled ? 'bg-primary' : 'bg-surface-hi'}`}
              />
            );
          })}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
