import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../lib/ProfileContext';
import { getExercise } from '../data/exercises';
import { getRoutine } from '../data/routines';
import { LevelUpModal } from '../components/LevelUpModal';
import { Confetti } from '../components/Confetti';
import { questStyle } from '../lib/categoryStyle';
import type { Quest } from '../lib/types';

interface LevelUpInfo {
  fromLevel: number;
  toLevel: number;
  fromRank: string;
  toRank: string;
  rankChanged: boolean;
}

interface CompletionResult {
  expEarned: number;
  levelUp: LevelUpInfo | null;
}

export function QuestDetail() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { profile, completeQuest, isQuestCompletedToday } = useProfile();

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

  if (activeQuest.type === 'target' && activeQuest.routineId) {
    return (
      <RoutineQuestScreen
        quest={activeQuest}
        alreadyDone={alreadyDone}
        onComplete={(exerciseId) => completeQuest(activeQuest, exerciseId)}
        onBack={() => navigate(-1)}
        onFinish={() => navigate('/dashboard')}
      />
    );
  }

  return (
    <StandardQuestScreen
      quest={activeQuest}
      alreadyDone={alreadyDone}
      onComplete={(exerciseId) => completeQuest(activeQuest, exerciseId)}
      onBack={() => navigate(-1)}
      onFinish={() => navigate('/dashboard')}
    />
  );
}

function QuestHeader({ quest }: { quest: Quest }) {
  const style = questStyle(quest.type);
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-3">
        <span className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${style.bg}`}>
          {style.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-text">{quest.title}</h1>
          <span className={`text-xs font-semibold uppercase tracking-wide ${style.color}`}>{style.label}</span>
        </div>
      </div>
      <p className="text-text-dim">{quest.description}</p>
      {quest.recommendedMinutes && <p className="mt-1 text-sm text-text-dim">Recommended: {quest.recommendedMinutes}</p>}
    </div>
  );
}

function CompletionScreen({
  result,
  quest,
  onFinish,
}: {
  result: CompletionResult;
  quest: Quest;
  onFinish: () => void;
}) {
  const style = questStyle(quest.type);
  return (
    <div className={`relative overflow-hidden rounded-xl border p-6 text-center ${style.border} bg-surface`}>
      <Confetti />
      <div className="mb-2 text-3xl">🏆</div>
      <div className="mb-1 text-lg font-bold text-text">Quest Completed</div>
      <div className={`font-mono text-2xl ${style.color}`}>+{result.expEarned} EXP</div>
      <button
        onClick={onFinish}
        className="mt-6 w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary-dim"
      >
        Continue
      </button>
    </div>
  );
}

function StandardQuestScreen({
  quest,
  alreadyDone,
  onComplete,
  onBack,
  onFinish,
}: {
  quest: Quest;
  alreadyDone: boolean;
  onComplete: (exerciseId: string) => CompletionResult;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'active' | 'done'>('select');
  const [result, setResult] = useState<CompletionResult | null>(null);

  const options = quest.options.map((o) => getExercise(o.exerciseId)).filter(Boolean);

  function handleComplete() {
    if (!selectedExercise) return;
    setResult(onComplete(selectedExercise));
    setPhase('done');
  }

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <button onClick={onBack} className="mb-6 text-text-dim">
        ← Back
      </button>

      <QuestHeader quest={quest} />

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
        <ActiveExercise exerciseId={selectedExercise!} onComplete={handleComplete} />
      ) : (
        result && <CompletionScreen result={result} quest={quest} onFinish={onFinish} />
      )}

      {phase === 'done' && result?.levelUp && <LevelUpModal info={result.levelUp} onClose={onFinish} />}
    </div>
  );
}

function ActiveExercise({ exerciseId, onComplete }: { exerciseId: string; onComplete: () => void }) {
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

function RoutineQuestScreen({
  quest,
  alreadyDone,
  onComplete,
  onBack,
  onFinish,
}: {
  quest: Quest;
  alreadyDone: boolean;
  onComplete: (exerciseId: string) => CompletionResult;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [phase, setPhase] = useState<'overview' | 'active' | 'done'>('overview');
  const [checkedOff, setCheckedOff] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<CompletionResult | null>(null);

  const maybeRoutine = quest.routineId ? getRoutine(quest.routineId) : undefined;
  if (!maybeRoutine) return null;
  const routine = maybeRoutine;

  const specs = routine.exercises.map((spec) => ({ spec, exercise: getExercise(spec.exerciseId) }));
  const allChecked = checkedOff.size === specs.length;

  function toggleChecked(exerciseId: string) {
    setCheckedOff((prev) => {
      const next = new Set(prev);
      if (next.has(exerciseId)) next.delete(exerciseId);
      else next.add(exerciseId);
      return next;
    });
  }

  function handleComplete() {
    setResult(onComplete(`routine:${routine.id}`));
    setPhase('done');
  }

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <button onClick={onBack} className="mb-6 text-text-dim">
        ← Back
      </button>

      <QuestHeader quest={quest} />

      {alreadyDone && phase !== 'done' ? (
        <div className="rounded-xl border border-success/40 bg-success/10 p-4 text-center text-success">
          ✓ Already completed today
        </div>
      ) : phase === 'overview' ? (
        <>
          <h2 className="mb-3 font-semibold text-text">Today's routine:</h2>
          <div className="mb-6 space-y-2">
            {specs.map(({ spec, exercise }) => (
              <div key={spec.exerciseId} className="rounded-lg border border-border bg-surface px-4 py-3">
                <div className="font-medium text-text">{exercise?.name}</div>
                <div className="text-xs text-text-dim">
                  {spec.sets} sets · {spec.reps ?? `${spec.durationSeconds}s hold`}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPhase('active')}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary-dim"
          >
            Start Routine
          </button>
        </>
      ) : phase === 'active' ? (
        <>
          <h2 className="mb-1 font-semibold text-text">Check off each exercise as you finish it:</h2>
          <p className="mb-4 text-xs text-text-dim">
            {checkedOff.size}/{specs.length} complete
          </p>
          <div className="mb-6 space-y-3">
            {specs.map(({ spec, exercise }) => {
              const checked = checkedOff.has(spec.exerciseId);
              return (
                <button
                  key={spec.exerciseId}
                  onClick={() => toggleChecked(spec.exerciseId)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    checked ? 'border-success/50 bg-success/10' : 'border-border bg-surface hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                        checked ? 'border-success bg-success text-black' : 'border-border text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <div className="flex-1">
                      <div className={`font-medium ${checked ? 'text-text-dim line-through' : 'text-text'}`}>
                        {exercise?.name}
                      </div>
                      <div className="text-xs text-text-dim">
                        {spec.sets} sets · {spec.reps ?? `${spec.durationSeconds}s hold`}
                      </div>
                      {!checked && exercise && (
                        <div className="mt-2 space-y-0.5 text-xs text-text-dim">
                          {exercise.howTo.slice(0, 2).map((step, i) => (
                            <div key={i}>• {step}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <button
            disabled={!allChecked}
            onClick={handleComplete}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-40"
          >
            {allChecked ? 'Complete Routine' : `Complete all ${specs.length} exercises to finish`}
          </button>
        </>
      ) : (
        result && <CompletionScreen result={result} quest={quest} onFinish={onFinish} />
      )}

      {phase === 'done' && result?.levelUp && <LevelUpModal info={result.levelUp} onClose={onFinish} />}
    </div>
  );
}
