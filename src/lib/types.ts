export type ExperienceLevel = 'new' | 'casual' | 'active' | 'regular';

export type Category = 'strength' | 'cardio' | 'mobility' | 'skills' | 'games';

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'full_body';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Environment = 'home' | 'gym' | 'outdoors' | 'sports_facility' | 'limited_space';

export type Equipment = 'none' | 'bands' | 'dumbbells' | 'pull_up_bar' | 'full_gym' | 'other';

export type Goal =
  | 'consistency'
  | 'strength'
  | 'endurance'
  | 'learn_exercises'
  | 'athletic_ability'
  | 'fun';

export interface Exercise {
  id: string;
  name: string;
  category: Category;
  muscleGroup?: MuscleGroup;
  difficulty: Difficulty;
  equipment: Equipment[];
  description: string;
  howTo: string[];
  formTips: string[];
  alternative?: string;
}

export interface RoutineExerciseSpec {
  exerciseId: string;
  sets: number;
  reps?: string;
  durationSeconds?: number;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  description: string;
  exercises: RoutineExerciseSpec[];
  exp: number;
}

export type QuestType = 'starter' | 'movement' | 'recovery' | 'skill' | 'target';

export interface QuestOption {
  exerciseId: string;
}

export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  category: Category;
  exp: number;
  options: QuestOption[];
  routineId?: string;
  muscleGroup?: MuscleGroup;
  recommendedMinutes?: string;
}

export interface CompletedQuest {
  questId: string;
  completedAt: string;
  chosenExerciseId: string;
  expEarned: number;
}

export type SkillName = 'strength' | 'endurance' | 'mobility' | 'balance' | 'movement' | 'consistency';

export type SkillLevels = Record<SkillName, number>;

export interface AchievementDef {
  id: string;
  title: string;
  icon: string;
  description: string;
  check: (profile: UserProfile) => boolean;
}

export interface OnboardingAnswers {
  activityLevel: ExperienceLevel;
  pastWorkouts: 'never' | 'few' | 'sometimes' | 'regularly';
  interests: string[];
  environment: Environment[];
  equipment: Equipment[];
  goals: Goal[];
  targetMuscleGroups: MuscleGroup[];
}

export interface UserProfile {
  name: string;
  createdAt: string;
  onboarding: OnboardingAnswers | null;
  exp: number;
  skills: SkillLevels;
  activeQuests: Quest[];
  activeQuestDate: string;
  completedQuests: CompletedQuest[];
  unlockedAchievements: string[];
  checkInDates: string[];
}

export interface Rank {
  id: string;
  name: string;
  icon: string;
  theme: string;
  minExp: number;
}
