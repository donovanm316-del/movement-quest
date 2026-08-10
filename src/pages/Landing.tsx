import { useNavigate } from 'react-router-dom';
import { useProfile } from '../lib/ProfileContext';
import { useState } from 'react';

const FEATURES = [
  {
    icon: '⚔️',
    color: 'text-strength',
    bg: 'bg-strength/10',
    title: 'Daily Quests',
    body: 'Bite-sized movement challenges across strength, cardio, mobility, and skills.',
  },
  {
    icon: '🏆',
    color: 'text-target',
    bg: 'bg-target/10',
    title: 'Targeted Routines',
    body: 'Pick a focus area — Chest, Back, Legs, and more — for structured workout quests.',
  },
  {
    icon: '📈',
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Level Up',
    body: 'Earn EXP, climb ranks, and grow six different skills as you stay consistent.',
  },
  {
    icon: '🎮',
    color: 'text-games',
    bg: 'bg-games/10',
    title: 'Achievements',
    body: 'Unlock badges, keep your adventure streak alive, and track your journey.',
  },
];

export function Landing() {
  const navigate = useNavigate();
  const { startProfile } = useProfile();
  const [name, setName] = useState('');

  function handleStart() {
    startProfile(name.trim() || 'Adventurer');
    navigate('/onboarding');
  }

  return (
    <div className="relative overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-0 h-56 w-56 rounded-full bg-target/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
        <div className="animate-float mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dim text-4xl shadow-lg shadow-primary/30">
          ⚔️
        </div>
        <h1 className="mb-3 text-4xl font-bold text-text">Turn Movement Into an Adventure</h1>
        <p className="mb-8 text-text-dim">
          Level up in real life. Complete quests, earn EXP, and build consistency — no
          matter where you're starting from. You don't have to be fit to play; you play to
          learn, move, and explore.
        </p>

        <div className="mb-10 w-full max-w-xs space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What's your name?"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-center text-text placeholder:text-text-dim focus:border-primary focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
          <button
            onClick={handleStart}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary-dim"
          >
            Start Your Adventure
          </button>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 text-left">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              <span className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full text-lg ${f.bg}`}>
                {f.icon}
              </span>
              <div className="text-sm font-semibold text-text">{f.title}</div>
              <div className="text-xs text-text-dim">{f.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-xs text-text-dim">40 exercises · 7 targeted routines · 7 ranks · 100% free</div>
      </div>
    </div>
  );
}
