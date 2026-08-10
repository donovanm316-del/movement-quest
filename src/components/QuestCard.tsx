import { Link } from 'react-router-dom';
import type { Quest } from '../lib/types';

const TYPE_ICON: Record<Quest['type'], string> = {
  starter: '⚔️',
  movement: '🏃',
  recovery: '🧘',
  skill: '🎯',
};

export function QuestCard({ quest, completed }: { quest: Quest; completed: boolean }) {
  return (
    <Link
      to={completed ? '#' : `/quest/${quest.id}`}
      className={`block rounded-xl border p-4 transition ${
        completed
          ? 'border-border bg-surface/50 opacity-60 pointer-events-none'
          : 'border-border bg-surface hover:border-primary hover:bg-surface-hi cursor-pointer'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{TYPE_ICON[quest.type]}</span>
          <div>
            <div className="font-semibold text-text">{quest.title}</div>
            <div className="text-sm text-text-dim">{quest.description}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-gold font-mono text-sm">+{quest.exp} EXP</span>
          <span className={`text-xs ${completed ? 'text-success' : 'text-text-dim'}`}>
            {completed ? '✓ Complete' : 'Not started'}
          </span>
        </div>
      </div>
    </Link>
  );
}
