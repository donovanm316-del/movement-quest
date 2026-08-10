import { useProfile } from '../lib/ProfileContext';
import { NavBar } from '../components/NavBar';
import { QuestCard } from '../components/QuestCard';
import { ExpBar } from '../components/ExpBar';
import { getLevelProgress, getRankProgress, getSubLevelLabel } from '../data/ranks';

export function Dashboard() {
  const { profile, isQuestCompletedToday } = useProfile();
  if (!profile) return null;

  const level = getLevelProgress(profile.exp);
  const rank = getRankProgress(profile.exp);
  const sub = getSubLevelLabel(profile.exp);

  const completedToday = profile.activeQuests.filter((q) => isQuestCompletedToday(q.id)).length;

  return (
    <div className="mx-auto max-w-md px-6 pb-28 pt-10">
      <div className="mb-6">
        <div className="text-sm text-text-dim">Welcome back,</div>
        <div className="text-2xl font-bold text-text">{profile.name}</div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-text">⚔️ LEVEL {level.level}</div>
            <div className="text-sm text-primary font-semibold">
              {rank.current.icon} {rank.current.name.toUpperCase()} {sub}
            </div>
          </div>
          <div className="text-right text-xs text-text-dim">{profile.exp} total EXP</div>
        </div>
        <ExpBar pct={level.pct} label={`${profile.exp - level.floor} / ${level.ceiling - level.floor} EXP to next level`} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">Daily Quests</h2>
        <span className="text-sm text-text-dim">
          {completedToday}/{profile.activeQuests.length} complete
        </span>
      </div>

      <div className="space-y-3">
        {profile.activeQuests.map((q) => (
          <QuestCard key={q.id} quest={q} completed={isQuestCompletedToday(q.id)} />
        ))}
      </div>

      {completedToday === profile.activeQuests.length && profile.activeQuests.length > 0 && (
        <div className="mt-6 rounded-xl border border-success/40 bg-success/10 p-4 text-center text-success">
          🎉 All quests complete for today! Come back tomorrow for more.
        </div>
      )}

      <NavBar />
    </div>
  );
}
