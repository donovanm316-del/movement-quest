import { useProfile } from '../lib/ProfileContext';
import { NavBar } from '../components/NavBar';
import {
  RANKS,
  RANK_LEVEL_NAMES,
  DIVISIONS_PER_LEVEL,
  LEVELS_PER_RANK,
  getRankPosition,
} from '../data/ranks';

type Status = 'completed' | 'current' | 'locked';

export function Ranks() {
  const { profile } = useProfile();
  if (!profile) return null;

  const position = getRankPosition(profile.exp);
  const currentIdx = RANKS.findIndex((r) => r.id === position.rank.id);

  return (
    <div className="mx-auto max-w-md px-6 pb-28 pt-10">
      <h1 className="mb-1 text-2xl font-bold text-text">Ranks</h1>
      <p className="mb-6 text-sm text-text-dim">
        Every rank has 3 levels, and every level has 3 divisions. Clear all 3 divisions to level up; clear all 3
        levels to promote.
      </p>

      <div className="mb-6 rounded-2xl border border-primary/40 bg-gradient-to-br from-surface to-surface-hi p-5 text-center">
        <div className="text-4xl mb-1">{position.rank.icon}</div>
        <div className="text-lg font-bold text-text">
          {position.rank.name.toUpperCase()} {position.level} · DIV {position.division}
        </div>
        <div className="text-sm text-gold">{position.levelName}</div>
        <div className="mt-2 text-xs text-text-dim">{profile.exp} total EXP</div>
      </div>

      <div className="space-y-3">
        {RANKS.map((rank, idx) => {
          const status: Status = idx < currentIdx ? 'completed' : idx === currentIdx ? 'current' : 'locked';
          const names = RANK_LEVEL_NAMES[rank.id];

          return (
            <div
              key={rank.id}
              className={`rounded-xl border p-4 transition ${
                status === 'current'
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : status === 'completed'
                    ? 'border-gold/40 bg-surface'
                    : 'border-border bg-surface/40 opacity-60'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl ${status === 'locked' ? 'grayscale' : ''}`}>{rank.icon}</span>
                  <div>
                    <div className="font-bold text-text">{rank.name}</div>
                    <div className="text-xs text-text-dim">{rank.theme}</div>
                  </div>
                </div>
                <div className="text-right text-xs text-text-dim">
                  {status === 'completed' && <span className="text-gold">✓ Cleared</span>}
                  {status === 'current' && <span className="font-semibold text-primary">You are here</span>}
                  {status === 'locked' && <span>{rank.minExp.toLocaleString()}+ EXP</span>}
                </div>
              </div>

              <div className="space-y-2">
                {Array.from({ length: LEVELS_PER_RANK }, (_, i) => i + 1).map((level) => (
                  <LevelRow
                    key={level}
                    levelNumber={level}
                    levelName={names[level - 1]}
                    rankStatus={status}
                    currentLevel={position.level}
                    currentDivision={position.division}
                    currentPct={position.pct}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <div className="rounded-xl border border-border bg-surface/40 p-4 text-center text-xs text-text-dim">
          👑 Master keeps climbing forever — there's no final level.
        </div>
      </div>

      <NavBar />
    </div>
  );
}

function LevelRow({
  levelNumber,
  levelName,
  rankStatus,
  currentLevel,
  currentDivision,
  currentPct,
}: {
  levelNumber: number;
  levelName: string;
  rankStatus: Status;
  currentLevel: number;
  currentDivision: number;
  currentPct: number;
}) {
  const isCurrentLevel = rankStatus === 'current' && levelNumber === currentLevel;
  const levelFullyDone = rankStatus === 'completed' || (rankStatus === 'current' && levelNumber < currentLevel);

  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${isCurrentLevel ? 'bg-primary/10' : ''}`}>
      <div className="text-sm">
        <span className={isCurrentLevel ? 'font-semibold text-text' : 'text-text-dim'}>Level {levelNumber}</span>
        <span className="ml-2 text-xs text-text-dim">{levelName}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: DIVISIONS_PER_LEVEL }, (_, i) => i + 1).map((div) => {
          let widthPct = 0;
          if (levelFullyDone) widthPct = 100;
          else if (isCurrentLevel) {
            if (div < currentDivision) widthPct = 100;
            else if (div === currentDivision) widthPct = currentPct;
          }
          return (
            <div key={div} className="h-2 w-5 overflow-hidden rounded-full bg-surface-hi">
              <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${widthPct}%` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
