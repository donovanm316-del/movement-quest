import { Link } from 'react-router-dom';
import { useProfile } from '../lib/ProfileContext';
import { NavBar } from '../components/NavBar';
import { QuestCard } from '../components/QuestCard';
import { ProgressRing } from '../components/ProgressRing';
import { RankGem } from '../components/RankGem';
import { getLevelProgress, getRankPosition, getRankProgress } from '../data/ranks';
import { getOverallRating } from '../lib/stats';

export function Dashboard() {
  const { profile, isQuestCompletedToday } = useProfile();
  if (!profile) return null;

  const level = getLevelProgress(profile.exp);
  const position = getRankPosition(profile.exp);
  const rankProgress = getRankProgress(profile.exp);
  const ovr = getOverallRating(profile.skills);

  const completedToday = profile.activeQuests.filter((q) => isQuestCompletedToday(q.id)).length;
  const totalToday = profile.activeQuests.length;
  const targetQuest = profile.activeQuests.find((q) => q.type === 'target');
  const otherQuests = profile.activeQuests.filter((q) => q.type !== 'target');
  const allDone = totalToday > 0 && completedToday === totalToday;
  const expToNextRank = rankProgress.next ? rankProgress.ceiling - profile.exp : null;

  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-target/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-strength/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-md px-6 pb-28 pt-10 lg:max-w-4xl lg:px-10">
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

        <div className="lg:grid lg:grid-cols-[380px_1fr] lg:items-start lg:gap-8">
          <div className="lg:sticky lg:top-8 lg:space-y-6">
            <div className="relative mb-6 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-surface to-surface-hi p-5 lg:mb-0">
              <div className="starfield pointer-events-none absolute inset-0 opacity-70" />
              <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-surface-hi/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-dim">
                LV {level.level}
              </div>
              <div className="relative flex items-center gap-4">
                <ProgressRing pct={rankProgress.pct} size={88} strokeWidth={6} colorClass="text-primary">
                  <RankGem rankId={position.rank.id} size={56} />
                </ProgressRing>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-text leading-none">OVR {ovr}</div>
                  <div className="mt-1 text-sm font-semibold text-primary">
                    {position.rank.name.toUpperCase()} {position.level} · Div {position.division}
                  </div>
                  <div className="text-xs text-gold">{position.levelName}</div>
                </div>
              </div>
              <div className="relative mt-3 text-xs text-text-dim">
                {profile.exp - level.floor}/{level.ceiling - level.floor} EXP to level {level.level + 1}
              </div>
              <Link
                to="/ranks"
                className="relative mt-4 flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs transition hover:border-primary/40"
              >
                <span className="text-text-dim">
                  {expToNextRank !== null ? (
                    <>
                      <span className="text-gold font-semibold">{expToNextRank}</span> EXP to {rankProgress.next?.name}
                    </>
                  ) : (
                    'Max rank reached — keep climbing Legend'
                  )}
                </span>
                <span className="text-primary">View ranks →</span>
              </Link>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2 lg:mb-0">
              <StatChip label="Today" value={`${completedToday}/${totalToday}`} icon="⚔️" accent="strength" />
              <StatChip label="Total EXP" value={String(profile.exp)} icon="✨" accent="gold" />
              <StatChip label="Quests Done" value={String(profile.completedQuests.length)} icon="🏆" accent="primary" />
            </div>

            {targetQuest && (
              <div className="mb-6 lg:mb-0">
                <h2 className="mb-3 text-lg font-bold text-text">Today's Focus</h2>
                <QuestCard quest={targetQuest} completed={isQuestCompletedToday(targetQuest.id)} />
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-lg font-bold text-text">Daily Quests</h2>

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
          </div>
        </div>

        <NavBar />
      </div>
    </div>
  );
}

const ACCENT_CLASSES = {
  strength: 'bg-strength/10 text-strength',
  gold: 'bg-gold/10 text-gold',
  primary: 'bg-primary/10 text-primary',
} as const;

function StatChip({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: string;
  accent: keyof typeof ACCENT_CLASSES;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-3 text-center transition hover:border-primary/30">
      <div className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full text-base ${ACCENT_CLASSES[accent]}`}>
        {icon}
      </div>
      <div className="font-bold text-text">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-text-dim">{label}</div>
    </div>
  );
}
