import type { Exercise } from '../lib/types';

export function ExerciseInfoModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${exercise.name} proper form tutorial`,
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85svh] w-full max-w-sm animate-pop overflow-y-auto rounded-t-2xl border border-border bg-surface p-6 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-text">{exercise.name}</h2>
            <p className="text-sm text-text-dim">{exercise.description}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hi text-text-dim hover:text-text"
          >
            ✕
          </button>
        </div>

        <h3 className="mb-1 text-sm font-semibold text-text">How to do it</h3>
        <ol className="mb-4 list-inside list-decimal space-y-1 text-sm text-text-dim">
          {exercise.howTo.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        <h3 className="mb-1 text-sm font-semibold text-text">Form tips</h3>
        <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-dim">
          {exercise.formTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>

        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-border bg-surface-hi px-2 py-1 text-text-dim capitalize">
            {exercise.difficulty}
          </span>
          {exercise.equipment.map((eq) => (
            <span key={eq} className="rounded-full border border-border bg-surface-hi px-2 py-1 text-text-dim capitalize">
              {eq.replace('_', ' ')}
            </span>
          ))}
        </div>

        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-strength/15 py-3 font-semibold text-strength transition hover:bg-strength/25"
        >
          ▶ Watch a tutorial on YouTube
        </a>
      </div>
    </div>
  );
}
