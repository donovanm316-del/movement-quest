import { Link } from 'react-router-dom';
import type { Quest } from '../lib/types';
import { questStyle } from '../lib/categoryStyle';
import { getRoutine } from '../data/routines';

export function QuestCard({ quest, completed }: { quest: Quest; completed: boolean }) {
  const style = questStyle(quest.type);
  const routine = quest.routineId ? getRoutine(quest.routineId) : undefined;

  return (
    <Link
      to={completed ? '#' : `/quest/${quest.id}`}
      className={`group block rounded-xl border p-4 transition ${
        completed
          ? 'border-border bg-surface/40 opacity-60 pointer-events-none'
          : `border-border bg-surface hover:-translate-y-0.5 hover:shadow-lg ${style.border} hover:bg-surface-hi`
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${style.bg} ${
              completed ? '' : 'transition group-hover:scale-110'
            }`}
          >
            {style.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text">{quest.title}</span>
              {quest.type === 'target' && (
                <span className="rounded-full bg-target/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-target">
                  Routine
                </span>
              )}
            </div>
            <div className="text-sm text-text-dim">{quest.description}</div>
            {routine && (
              <div className="mt-1 text-xs text-text-dim">
                {routine.exercises.length} exercises · {routine.exercises.reduce((s, e) => s + e.sets, 0)} sets
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`font-mono text-sm ${style.color}`}>+{quest.exp} EXP</span>
          <span className={`text-xs ${completed ? 'text-success' : 'text-text-dim'}`}>
            {completed ? '✓ Complete' : 'Not started'}
          </span>
        </div>
      </div>
    </Link>
  );
}
