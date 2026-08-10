import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../lib/ProfileContext';
import { MUSCLE_GROUP_LABELS } from '../data/routines';
import type { Environment, Equipment, ExperienceLevel, Goal, MuscleGroup, OnboardingAnswers } from '../lib/types';

const STEPS = ['activity', 'past', 'interests', 'environment', 'equipment', 'goals', 'focus'] as const;
type Step = (typeof STEPS)[number];

const MUSCLE_GROUP_OPTIONS = (Object.entries(MUSCLE_GROUP_LABELS) as [MuscleGroup, { label: string; icon: string }][]).map(
  ([value, info]) => ({ value, label: info.label, icon: info.icon }),
);

const ACTIVITY_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: 'new', label: "I'm just getting started" },
  { value: 'casual', label: 'I move around sometimes' },
  { value: 'active', label: "I'm pretty active" },
  { value: 'regular', label: 'I already work out regularly' },
];

const PAST_OPTIONS: { value: OnboardingAnswers['pastWorkouts']; label: string }[] = [
  { value: 'never', label: 'Never' },
  { value: 'few', label: 'A few times' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'regularly', label: 'Regularly' },
];

const INTEREST_OPTIONS = [
  { value: 'Running', icon: '🏃' },
  { value: 'Strength', icon: '🏋️' },
  { value: 'Sports', icon: '⚽' },
  { value: 'Cycling', icon: '🚴' },
  { value: 'Stretching', icon: '🧘' },
  { value: 'Dancing', icon: '💃' },
  { value: 'Challenges', icon: '🎮' },
  { value: 'Walking', icon: '🚶' },
];

const ENV_OPTIONS: { value: Environment; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'gym', label: 'Gym' },
  { value: 'outdoors', label: 'Outdoors' },
  { value: 'sports_facility', label: 'Sports facility' },
  { value: 'limited_space', label: 'I have limited space' },
];

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'bands', label: 'Resistance bands' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'pull_up_bar', label: 'Pull-up bar' },
  { value: 'full_gym', label: 'Full gym' },
  { value: 'other', label: 'Other' },
];

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: 'consistency', label: 'Build consistency' },
  { value: 'strength', label: 'Get stronger' },
  { value: 'endurance', label: 'Improve endurance' },
  { value: 'learn_exercises', label: 'Learn exercises' },
  { value: 'athletic_ability', label: 'Improve athletic ability' },
  { value: 'fun', label: 'Have more fun being active' },
];

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border px-4 py-3 text-left transition ${
        selected
          ? 'border-primary bg-primary/10 text-text'
          : 'border-border bg-surface text-text-dim hover:border-primary/50'
      }`}
    >
      {children}
    </button>
  );
}

export function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useProfile();
  const [stepIdx, setStepIdx] = useState(0);
  const step: Step = STEPS[stepIdx];

  const [activityLevel, setActivityLevel] = useState<ExperienceLevel | null>(null);
  const [pastWorkouts, setPastWorkouts] = useState<OnboardingAnswers['pastWorkouts'] | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [environment, setEnvironment] = useState<Environment[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [targetMuscleGroups, setTargetMuscleGroups] = useState<MuscleGroup[]>([]);

  function toggle<T>(list: T[], value: T, setter: (v: T[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function canProceed() {
    switch (step) {
      case 'activity':
        return activityLevel !== null;
      case 'past':
        return pastWorkouts !== null;
      case 'interests':
        return interests.length > 0;
      case 'environment':
        return environment.length > 0;
      case 'equipment':
        return equipment.length > 0;
      case 'goals':
        return goals.length > 0;
      case 'focus':
        return true;
    }
  }

  function handleNext() {
    if (stepIdx < STEPS.length - 1) {
      setStepIdx(stepIdx + 1);
      return;
    }
    const answers: OnboardingAnswers = {
      activityLevel: activityLevel!,
      pastWorkouts: pastWorkouts!,
      interests,
      environment,
      equipment,
      goals,
      targetMuscleGroups,
    };
    completeOnboarding(answers);
    navigate('/dashboard');
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col px-6 py-10">
      <div className="mb-8 flex gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${i <= stepIdx ? 'bg-primary' : 'bg-surface-hi'}`}
          />
        ))}
      </div>

      <div className="flex-1">
        {step === 'activity' && (
          <>
            <h2 className="mb-1 text-2xl font-bold text-text">How active are you right now?</h2>
            <p className="mb-6 text-text-dim text-sm">This just sets your starting quests — nothing else.</p>
            <div className="space-y-2">
              {ACTIVITY_OPTIONS.map((o) => (
                <OptionButton key={o.value} selected={activityLevel === o.value} onClick={() => setActivityLevel(o.value)}>
                  {o.label}
                </OptionButton>
              ))}
            </div>
          </>
        )}

        {step === 'past' && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-text">Have you worked out before?</h2>
            <div className="space-y-2">
              {PAST_OPTIONS.map((o) => (
                <OptionButton key={o.value} selected={pastWorkouts === o.value} onClick={() => setPastWorkouts(o.value)}>
                  {o.label}
                </OptionButton>
              ))}
            </div>
          </>
        )}

        {step === 'interests' && (
          <>
            <h2 className="mb-1 text-2xl font-bold text-text">What sounds fun to you?</h2>
            <p className="mb-6 text-text-dim text-sm">Select as many as you like.</p>
            <div className="grid grid-cols-2 gap-2">
              {INTEREST_OPTIONS.map((o) => (
                <OptionButton key={o.value} selected={interests.includes(o.value)} onClick={() => toggle(interests, o.value, setInterests)}>
                  {o.icon} {o.value}
                </OptionButton>
              ))}
            </div>
          </>
        )}

        {step === 'environment' && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-text">Where can you exercise?</h2>
            <div className="space-y-2">
              {ENV_OPTIONS.map((o) => (
                <OptionButton key={o.value} selected={environment.includes(o.value)} onClick={() => toggle(environment, o.value, setEnvironment)}>
                  {o.label}
                </OptionButton>
              ))}
            </div>
          </>
        )}

        {step === 'equipment' && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-text">What equipment do you have?</h2>
            <div className="space-y-2">
              {EQUIPMENT_OPTIONS.map((o) => (
                <OptionButton key={o.value} selected={equipment.includes(o.value)} onClick={() => toggle(equipment, o.value, setEquipment)}>
                  {o.label}
                </OptionButton>
              ))}
            </div>
          </>
        )}

        {step === 'goals' && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-text">What do you want to improve?</h2>
            <div className="space-y-2">
              {GOAL_OPTIONS.map((o) => (
                <OptionButton key={o.value} selected={goals.includes(o.value)} onClick={() => toggle(goals, o.value, setGoals)}>
                  {o.label}
                </OptionButton>
              ))}
            </div>
          </>
        )}

        {step === 'focus' && (
          <>
            <h2 className="mb-1 text-2xl font-bold text-text">Any areas you want to focus on?</h2>
            <p className="mb-6 text-text-dim text-sm">
              Optional — we'll add a targeted routine quest for these areas. Skip if you'd rather keep things varied.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MUSCLE_GROUP_OPTIONS.map((o) => (
                <OptionButton
                  key={o.value}
                  selected={targetMuscleGroups.includes(o.value)}
                  onClick={() => toggle(targetMuscleGroups, o.value, setTargetMuscleGroups)}
                >
                  {o.icon} {o.label}
                </OptionButton>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        {stepIdx > 0 && (
          <button
            onClick={() => setStepIdx(stepIdx - 1)}
            className="rounded-lg border border-border px-5 py-3 text-text-dim"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-40"
        >
          {stepIdx === STEPS.length - 1 ? 'Start Adventure' : 'Next'}
        </button>
      </div>
    </div>
  );
}
