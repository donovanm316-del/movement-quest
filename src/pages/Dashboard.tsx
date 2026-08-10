import { useProfile } from '../lib/ProfileContext';
import { NavBar } from '../components/NavBar';
import { QuestCard } from '../components/QuestCard';
import { ProgressRing } from '../components/ProgressRing';
import { getLevelProgress, getRankPosition } from '../data/ranks';

export function Dashboard() {
  const { profile, isQuestCompletedToday } = useProfile();
  if (!profile) return null;

  const level = getLevelProgress(profile.exp);
  const position = getRankPosition(profile.exp);

  const completedToday = profile.activeQuests.filter((q) => isQuestCompletedToday(q.id)).length;
  const totalToday = profile.activeQuests.length;
  const targetQuest = profile.activeQuests.find((q) => q.type === 'target');
  const otherQuests = profile.activeQuests.filter((q) => q.type !== 'target');
  const allDone = totalToday > 0 && completedToday === totalToday;

  return (
    <div className="mx-auto max-w-md px-6 pb-28 pt-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-text-dim">Welcome back,</div>
          <div className="text-2xl font-bold text-text">{profile.name}</div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm">
          <span>🔥</span>
          <span className="font-semibold text-text">{profile.checkInDates.length}</span>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-surface to-surface-hi p-5">
        <div className="flex items-center gap-4">
          <ProgressRing pct={level.pct} size={84} strokeWidth={7}>
            <div className="text-center">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-text-dim">LV</div>
              <div className="text-xl font-bold text-text">{level.level}</div>
            </div>
          </ProgressRing>
          <div className="flex-1">
            <div className="text-sm font-semibold text-primary">
              {position.rank.icon} {position.rank.name.toUpperCase()} {position.level} · Div {position.division}
            </div>
            <div className="text-xs text-gold mb-1">{position.levelName}</div>
            <div className="text-xs text-text-dim">
              {profile.exp - level.floor}/{level.ceiling - level.floor} EXP to level {level.level + 1}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2">
        <StatChip label="Today" value={`${completedToday}/${totalToday}`} icon="⚔️" />
        <StatChip label="Total EXP" value={String(profile.exp)} icon="✨" />
        <StatChip label="Quests Done" value={String(profile.completedQuests.length)} icon="🏆" />
      </div>

      {targetQuest && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-text">Today's Focus</h2>
          <QuestCard quest={targetQuest} completed={isQuestCompletedToday(targetQuest.id)} />
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">Daily Quests</h2>
      </div>

      <div className="space-y-3">
        {otherQuests.map((q) => (
          <QuestCard key={q.id} quest={q} completed={isQuestCompletedToday(q.id)} />
        ))}
      </div>

      {allDone && (
        <div className="relative mt-6 overflow-hidden rounded-xl border border-success/40 bg-success/10 p-5 text-center text-success">
          <div className="text-2xl mb-1">🎉</div>
          <div className="font-semibold">All quests complete for today!</div>
          <div className="text-sm text-success/80">Come back tomorrow for more.</div>
        </div>
      )}

      <NavBar />
    </div>
  );
}

function StatChip({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-3 text-center">
      <div className="text-lg">{icon}</div>
      <div className="font-bold text-text">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-text-dim">{label}</div>
    </div>
  );
}
