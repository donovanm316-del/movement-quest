import { useProfile } from '../lib/ProfileContext';
import { NavBar } from '../components/NavBar';
import { QuestCard } from '../components/QuestCard';

export function Quests() {
  const { profile, isQuestCompletedToday } = useProfile();
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-md px-6 pb-28 pt-10">
      <h1 className="mb-6 text-2xl font-bold text-text">Today's Quests</h1>
      <div className="space-y-3">
        {profile.activeQuests.map((q) => (
          <QuestCard key={q.id} quest={q} completed={isQuestCompletedToday(q.id)} />
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold text-text">Recently Completed</h2>
      {profile.completedQuests.length === 0 && (
        <p className="text-text-dim text-sm">Complete a quest to see your history here.</p>
      )}
      <div className="space-y-2">
        {[...profile.completedQuests]
          .reverse()
          .slice(0, 10)
          .map((c, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-4 py-2 text-sm">
              <span className="text-text-dim">{new Date(c.completedAt).toLocaleDateString()}</span>
              <span className="text-gold font-mono">+{c.expEarned} EXP</span>
            </div>
          ))}
      </div>

      <NavBar />
    </div>
  );
}
