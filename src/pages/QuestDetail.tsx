import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../lib/ProfileContext';
import { getExercise } from '../data/exercises';
import { LevelUpModal } from '../components/LevelUpModal';

interface LevelUpInfo {
  fromLevel: number;
  toLevel: number;
  fromRank: string;
  toRank: string;
  rankChanged: boolean;
}

export function QuestDetail() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { profile, completeQuest, isQuestCompletedToday } = useProfile();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'active' | 'done'>('select');
  const [result, setResult] = useState<{ expEarned: number; levelUp: LevelUpInfo | null } | null>(null);

  if (!profile) return null;
  const quest = profile.activeQuests.find((q) => q.id === questId);
  if (!quest) {
    return (
      <div className="mx-auto max-w-md px-6 py-10 text-center text-text-dim">
        Quest not found.
        <div className="mt-4">
          <button onClick={() => navigate('/dashboard')} className="text-primary underline">
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const activeQuest = quest;
  const alreadyDone = isQuestCompletedToday(activeQuest.id);
  const options = activeQuest.options.map((o) => getExercise(o.exerciseId)).filter(Boolean);

  function handleComplete() {
    if (!selectedExercise) return;
    const res = completeQuest(activeQuest, selectedExercise);
    setResult(res);
    setPhase('done');
  }

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 text-text-dim">
        ← Back
      </button>

      <h1 className="mb-1 text-2xl font-bold text-text">{quest.title}</h1>
      <p className="mb-1 text-text-dim">{quest.description}</p>
      {quest.recommendedMinutes && (
        <p className="mb-6 text-sm text-text-dim">Recommended: {quest.recommendedMinutes}</p>
      )}

      {alreadyDone && phase !== 'done' ? (
        <div className="rounded-xl border border-success/40 bg-success/10 p-4 text-center text-success">
          ✓ Already completed today
        </div>
      ) : phase === 'select' ? (
        <>
          <h2 className="mb-3 font-semibold text-text">Choose an activity:</h2>
          <div className="mb-6 space-y-2">
            {options.map((ex) => (
              <button
                key={ex!.id}
                onClick={() => setSelectedExercise(ex!.id)}
                className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                  selectedExercise === ex!.id
                    ? 'border-primary bg-primary/10 text-text'
                    : 'border-border bg-surface text-text-dim hover:border-primary/50'
                }`}
              >
                <div className="font-medium text-text">{ex!.name}</div>
                <div className="text-xs text-text-dim">{ex!.description}</div>
              </button>
            ))}
          </div>
          <button
            disabled={!selectedExercise}
            onClick={() => setPhase('active')}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-white disabled:opacity-40"
          >
            Start
          </button>
        </>
      ) : phase === 'active' ? (
        <ActiveQuest exerciseId={selectedExercise!} onComplete={handleComplete} />
      ) : (
        <div className="rounded-xl border border-primary bg-surface p-6 text-center">
          <div className="mb-2 text-2xl">🏆 Quest Completed</div>
          <div className="text-gold font-mono text-lg">+{result?.expEarned} EXP</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full rounded-lg bg-primary py-3 font-semibold text-white"
          >
            Continue
          </button>
        </div>
      )}

      {phase === 'done' && result?.levelUp && (
        <LevelUpModal info={result.levelUp} onClose={() => navigate('/dashboard')} />
      )}
    </div>
  );
}

function ActiveQuest({ exerciseId, onComplete }: { exerciseId: string; onComplete: () => void }) {
  const exercise = getExercise(exerciseId);
  if (!exercise) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="mb-2 text-xl font-bold text-text">{exercise.name}</h2>
      <p className="mb-4 text-sm text-text-dim">{exercise.description}</p>

      <h3 className="mb-1 text-sm font-semibold text-text">How to do it</h3>
      <ol className="mb-4 list-inside list-decimal space-y-1 text-sm text-text-dim">
        {exercise.howTo.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <h3 className="mb-1 text-sm font-semibold text-text">Form tips</h3>
      <ul className="mb-6 list-inside list-disc space-y-1 text-sm text-text-dim">
        {exercise.formTips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>

      <button
        onClick={onComplete}
        className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary-dim"
      >
        Mark Complete
      </button>
    </div>
  );
}
