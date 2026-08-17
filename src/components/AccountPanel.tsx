import { useState } from 'react';
import { useProfile } from '../lib/ProfileContext';

const SYNC_LABEL: Record<string, string> = {
  idle: '',
  syncing: 'Syncing…',
  saved: 'All changes saved to your account',
  error: "Couldn't sync — check your connection",
};

export function AccountPanel() {
  const { cloud } = useProfile();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!cloud.enabled) {
    return (
      <div className="mb-8 rounded-xl border border-border bg-surface/50 p-4 text-center text-xs text-text-dim">
        Cloud sync isn't set up for this app yet — progress is only saved on this device.
      </div>
    );
  }

  if (cloud.user) {
    return (
      <div className="mb-8 rounded-xl border border-border bg-surface p-4">
        <div className="mb-1 text-sm font-semibold text-text">Signed in</div>
        <div className="mb-2 text-sm text-text-dim">{cloud.user.email}</div>
        <div className="mb-3 text-xs text-text-dim">{SYNC_LABEL[cloud.status]}</div>
        <button
          onClick={() => cloud.signOut()}
          className="w-full rounded-lg border border-border py-2 text-sm text-text-dim transition hover:bg-surface-hi"
        >
          Sign Out
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    const action = mode === 'signup' ? cloud.signUp : cloud.signIn;
    const { error } = await action(email, password);
    setBusy(false);
    if (error) {
      setError(error);
    } else if (mode === 'signup') {
      setNotice('Check your email to confirm your account, then sign in below.');
      setMode('signin');
    }
  }

  return (
    <div className="mb-8 rounded-xl border border-border bg-surface p-4">
      <div className="mb-1 text-sm font-semibold text-text">Save your progress</div>
      <p className="mb-3 text-xs text-text-dim">
        Create an account to keep your progress and pick it up on any device.
      </p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-border bg-surface-hi px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-primary focus:outline-none"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-border bg-surface-hi px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-primary focus:outline-none"
        />

        {error && <p className="text-xs text-red-400">{error}</p>}
        {notice && <p className="text-xs text-success">{notice}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dim disabled:opacity-50"
        >
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup');
            setError(null);
            setNotice(null);
          }}
          className="w-full text-center text-xs text-text-dim underline"
        >
          {mode === 'signup' ? 'Already have an account? Sign in' : "New here? Create an account"}
        </button>
      </form>
    </div>
  );
}
