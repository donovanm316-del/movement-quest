import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { CompletedQuest, OnboardingAnswers, Quest, UserProfile } from './types';
import { createProfile, loadProfile, saveProfile, clearProfile } from './storage';
import { generateDailyQuests, isNewDay, skillsForQuest } from './quests';
import { ACHIEVEMENTS } from '../data/achievements';
import { computeStartingExp, getLevel, getRankForExp } from '../data/ranks';
import { supabase, isCloudSyncConfigured } from './supabase';

interface LevelUpInfo {
  fromLevel: number;
  toLevel: number;
  fromRank: string;
  toRank: string;
  rankChanged: boolean;
}

type SyncStatus = 'idle' | 'syncing' | 'saved' | 'error';

interface CloudAuth {
  enabled: boolean;
  user: User | null;
  status: SyncStatus;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

interface ProfileContextValue {
  profile: UserProfile | null;
  startProfile: (name: string) => void;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  completeQuest: (quest: Quest, exerciseId: string) => { expEarned: number; newAchievements: string[]; levelUp: LevelUpInfo | null };
  resetProfile: () => void;
  isQuestCompletedToday: (questId: string) => boolean;
  cloud: CloudAuth;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

function todayKey() {
  return new Date().toDateString();
}

async function fetchCloudProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('profiles').select('data').eq('id', userId).maybeSingle();
  return (data?.data as UserProfile | undefined) ?? null;
}

async function pushCloudProfile(userId: string, profile: UserProfile): Promise<void> {
  if (!supabase) return;
  await supabase.from('profiles').upsert({ id: userId, data: profile, updated_at: new Date().toISOString() });
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => loadProfile());
  const [session, setSession] = useState<Session | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextPush = useRef(false);
  const profileRef = useRef(profile);

  useEffect(() => {
    profileRef.current = profile;
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

  // Track auth session and pull/push the cloud profile whenever sign-in state changes.
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_IN' && newSession) {
        void handleSignedIn(newSession.user.id);
      }
    });

    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSignedIn(userId: string) {
    setSyncStatus('syncing');
    const cloudProfile = await fetchCloudProfile(userId);
    const currentProfile = profileRef.current;

    if (cloudProfile) {
      const hasLocalProgress =
        currentProfile && (currentProfile.onboarding !== null || currentProfile.completedQuests.length > 0);
      const proceed = !hasLocalProgress || window.confirm(
        "Signing in loads your saved account progress and replaces what's on this device. Continue?",
      );
      if (proceed) {
        skipNextPush.current = true;
        setProfile(cloudProfile);
      }
    } else {
      // First time this account has signed in — adopt whatever is on this device as the starting cloud save.
      const toSave = currentProfile ?? createProfile('Adventurer');
      await pushCloudProfile(userId, toSave);
      if (!currentProfile) setProfile(toSave);
    }
    setSyncStatus('saved');
  }

  // Debounced push of local changes up to the cloud while signed in.
  useEffect(() => {
    if (!supabase || !session || !profile) return;
    if (skipNextPush.current) {
      skipNextPush.current = false;
      return;
    }
    setSyncStatus('syncing');
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      pushCloudProfile(session.user.id, profile)
        .then(() => setSyncStatus('saved'))
        .catch(() => setSyncStatus('error'));
    }, 800);
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, session]);

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

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Cloud sync is not configured yet.' };
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Cloud sync is not configured yet.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const cloud: CloudAuth = useMemo(
    () => ({ enabled: isCloudSyncConfigured, user: session?.user ?? null, status: syncStatus, signUp, signIn, signOut }),
    [session, syncStatus, signUp, signIn, signOut],
  );

  const value = useMemo(
    () => ({ profile, startProfile, completeOnboarding, completeQuest, resetProfile, isQuestCompletedToday, cloud }),
    [profile, startProfile, completeOnboarding, completeQuest, resetProfile, isQuestCompletedToday, cloud],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
