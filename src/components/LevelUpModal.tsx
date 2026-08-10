import { Confetti } from './Confetti';

interface LevelUpInfo {
  fromLevel: number;
  toLevel: number;
  fromRank: string;
  toRank: string;
  rankChanged: boolean;
}

export function LevelUpModal({ info, onClose }: { info: LevelUpInfo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm animate-pop overflow-hidden rounded-2xl border border-primary/60 bg-surface p-6 text-center shadow-2xl shadow-primary/20">
        <Confetti />
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dim text-3xl shadow-lg shadow-primary/40">
          ⚔️
        </div>
        <div className="text-sm font-semibold tracking-widest text-gold">LEVEL UP!</div>
        <div className="my-2 text-3xl font-bold text-text">LEVEL {info.toLevel}</div>
        {info.rankChanged && (
          <div className="mb-4 inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary font-semibold">
            New Rank: {info.toRank}!
          </div>
        )}
        <div className="mb-6 text-text-dim text-sm">You've unlocked new quests and progress.</div>
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary-dim"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
