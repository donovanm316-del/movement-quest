import { useNavigate } from 'react-router-dom';
import { useProfile } from '../lib/ProfileContext';
import { NavBar } from '../components/NavBar';
import { AccountPanel } from '../components/AccountPanel';
import { getRankPosition, getLevelProgress } from '../data/ranks';

export function Profile() {
  const { profile, resetProfile } = useProfile();
  const navigate = useNavigate();
  if (!profile) return null;

  const position = getRankPosition(profile.exp);
  const level = getLevelProgress(profile.exp);

  function handleReset() {
    if (confirm('This will erase all local progress. Are you sure?')) {
      resetProfile();
      navigate('/');
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 pb-28 pt-10">
      <div className="mb-8 text-center">
        <div className="mb-2 text-5xl">{position.rank.icon}</div>
        <div className="text-2xl font-bold text-text">{profile.name}</div>
        <div className="text-primary font-semibold">
          {position.rank.name} {position.level} · Div {position.division} · Level {level.level}
        </div>
        <div className="text-xs text-gold mt-1">{position.levelName}</div>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-surface p-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-text-dim">Total EXP</span>
          <span className="text-text font-mono">{profile.exp}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-text-dim">Quests completed</span>
          <span className="text-text font-mono">{profile.completedQuests.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-dim">Member since</span>
          <span className="text-text font-mono">{new Date(profile.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <AccountPanel />

      <h2 className="mb-3 font-semibold text-text">Preferences</h2>
      <div className="mb-8 rounded-xl border border-border bg-surface p-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-text-dim">Interests</span>
          <span className="text-text text-right">{profile.onboarding?.interests.join(', ') || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-dim">Equipment</span>
          <span className="text-text text-right">{profile.onboarding?.equipment.join(', ') || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-dim">Goals</span>
          <span className="text-text text-right">{profile.onboarding?.goals.join(', ') || '—'}</span>
        </div>
      </div>

      <button
        onClick={handleReset}
        className="w-full rounded-lg border border-red-500/40 py-3 text-red-400 transition hover:bg-red-500/10"
      >
        Reset Progress
      </button>

      <NavBar />
    </div>
  );
}
