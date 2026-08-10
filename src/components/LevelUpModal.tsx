interface LevelUpInfo {
  fromLevel: number;
  toLevel: number;
  fromRank: string;
  toRank: string;
  rankChanged: boolean;
}

export function LevelUpModal({ info, onClose }: { info: LevelUpInfo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm animate-pop rounded-2xl border border-primary bg-surface p-6 text-center shadow-2xl">
        <div className="text-sm tracking-widest text-gold">LEVEL UP!</div>
        <div className="my-2 text-3xl font-bold text-text">LEVEL {info.toLevel}</div>
        {info.rankChanged && (
          <div className="mb-4 text-primary font-semibold">New Rank: {info.toRank}!</div>
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
