import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../lib/ProfileContext';
import { getRankPosition } from '../data/ranks';
import { TreasureChest, type ChestState } from '../components/TreasureChest';
import { Confetti } from '../components/Confetti';

export function RevealRank() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [state, setState] = useState<ChestState>('closed');

  if (!profile) return null;
  const position = getRankPosition(profile.exp);
  const rank = position.rank;

  function handleClick() {
    if (state !== 'closed') return;
    setState('shaking');
    setTimeout(() => setState('open'), 700);
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-2 text-2xl font-bold text-text">Your adventure begins...</h1>
      <p className="mb-6 text-sm text-text-dim">
        {state === 'open' ? 'Your starting rank has been revealed!' : 'Tap the chest to reveal your starting rank.'}
      </p>

      <div className="mb-6">
        <TreasureChest state={state} onClick={handleClick} />
      </div>

      {state !== 'open' && (
        <button onClick={handleClick} className="mb-6 text-sm font-semibold text-primary underline">
          Tap to open
        </button>
      )}

      {state === 'open' && (
        <div className="relative w-full animate-pop overflow-hidden rounded-2xl border border-gold/50 bg-surface p-6">
          <Confetti />
          <div className="mb-2 text-5xl">{rank.icon}</div>
          <div className="text-2xl font-bold text-text">
            {rank.name.toUpperCase()} {position.level} · DIV {position.division}
          </div>
          <div className="mb-1 text-sm text-gold">{position.levelName}</div>
          <div className="mb-4 text-xs text-text-dim">{rank.theme}</div>
          <div className="mb-6 inline-block rounded-full border border-border bg-surface-hi px-3 py-1 text-xs text-text-dim">
            Starting EXP: {profile.exp}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary-dim"
          >
            Enter Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
