import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CompletedQuest, OnboardingAnswers, Quest, UserProfile } from './types';
import { createProfile, loadProfile, saveProfile, clearProfile } from './storage';
import { generateDailyQuests, isNewDay, skillsForQuest } from './quests';
import { ACHIEVEMENTS } from '../data/achievements';
import { computeStartingExp, getLevel, getRankForExp } from '../data/ranks';

interface LevelUpInfo {
  fromLevel: number;
  toLevel: number;
  fromRank: string;
  toRank: string;
  rankChanged: boolean;
}

interface ProfileContextValue {
  profile: UserProfile | null;
  startProfile: (name: string) => void;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  completeQuest: (quest: Quest, exerciseId: string) => { expEarned: number; newAchievements: string[]; levelUp: LevelUpInfo | null };
  resetProfile: () => void;
  isQuestCompletedToday: (questId: string) => boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

function todayKey() {
  return new Date().toDateString();
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => loadProfile());

  useEffect(() => {
    if (profile) saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    if (!profile || !profile.onboarding) return;
    if (isNewDay(profile.activeQuestDate)) {
      setProfile((p) => {
        if (!p) return p;
        const checkIns = p.checkInDates.includes(todayKey()) ? p.checkInDates : [...p.checkInDates, todayKey()];
        return {
          ...p,
          activeQuests: generateDailyQuests(p.onboarding),
          activeQuestDate: todayKey(),
          checkInDates: checkIns,
        };
      });
    }
  }, [profile]);

  const startProfile = useCallback((name: string) => {
    setProfile(createProfile(name));
  }, []);

  const completeOnboarding = useCallback((answers: OnboardingAnswers) => {
    setProfile((p) => {
      if (!p) return p;
      return {
        ...p,
        onboarding: answers,
        exp: computeStartingExp(answers),
        activeQuests: generateDailyQuests(answers),
        activeQuestDate: todayKey(),
        checkInDates: [todayKey()],
      };
    });
  }, []);

  const isQuestCompletedToday = useCallback(
    (questId: string) => {
      if (!profile) return false;
      return profile.completedQuests.some((c) => c.questId === questId);
    },
    [profile],
  );

  const completeQuest = useCallback((quest: Quest, exerciseId: string) => {
    let expEarned = 0;
    let newAchievements: string[] = [];
    let levelUp: LevelUpInfo | null = null;

    setProfile((p) => {
      if (!p) return p;
      if (p.completedQuests.some((c) => c.questId === quest.id)) return p;

      const before = p.exp;
      expEarned = quest.exp;
      const afterExp = before + expEarned;

      const gain = skillsForQuest(quest);
      const nextSkills = { ...p.skills };
      (Object.keys(gain) as (keyof typeof gain)[]).forEach((k) => {
        nextSkills[k] = (nextSkills[k] ?? 0) + (gain[k] ?? 0);
      });

      const completed: CompletedQuest = {
        questId: quest.id,
        completedAt: new Date().toISOString(),
        chosenExerciseId: exerciseId,
        expEarned,
      };

      const candidate: UserProfile = {
        ...p,
        exp: afterExp,
        skills: nextSkills,
        completedQuests: [...p.completedQuests, completed],
      };

      const unlocked = ACHIEVEMENTS.filter(
        (a) => !p.unlockedAchievements.includes(a.id) && a.check(candidate),
      ).map((a) => a.id);
      newAchievements = unlocked;

      const fromLevel = getLevel(before);
      const toLevel = getLevel(afterExp);
      const fromRank = getRankForExp(before);
      const toRank = getRankForExp(afterExp);
      if (toLevel > fromLevel || toRank.id !== fromRank.id) {
        levelUp = {
          fromLevel,
          toLevel,
          fromRank: fromRank.name,
          toRank: toRank.name,
          rankChanged: toRank.id !== fromRank.id,
        };
      }

      return {
        ...candidate,
        unlockedAchievements: [...p.unlockedAchievements, ...unlocked],
      };
    });

    return { expEarned, newAchievements, levelUp };
  }, []);

  const resetProfile = useCallback(() => {
    clearProfile();
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({ profile, startProfile, completeOnboarding, completeQuest, resetProfile, isQuestCompletedToday }),
    [profile, startProfile, completeOnboarding, completeQuest, resetProfile, isQuestCompletedToday],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
