import { useNavigate } from 'react-router-dom';
import { useProfile } from '../lib/ProfileContext';
import { useState } from 'react';

export function Landing() {
  const navigate = useNavigate();
  const { startProfile } = useProfile();
  const [name, setName] = useState('');

  function handleStart() {
    startProfile(name.trim() || 'Adventurer');
    navigate('/onboarding');
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 text-6xl">⚔️</div>
      <h1 className="mb-3 text-4xl font-bold text-text">Turn Movement Into an Adventure</h1>
      <p className="mb-8 max-w-md text-text-dim">
        Level up in real life. Complete quests, earn EXP, and build consistency — no
        matter where you're starting from. You don't have to be fit to play; you play to
        learn, move, and explore.
      </p>

      <div className="w-full max-w-xs space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What's your name?"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-center text-text placeholder:text-text-dim focus:border-primary focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
        />
        <button
          onClick={handleStart}
          className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary-dim"
        >
          Start Your Adventure
        </button>
      </div>
    </div>
  );
}
