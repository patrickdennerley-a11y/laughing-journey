// PARALLEL - Profile Store
// Zustand store for managing the player's shadow profile with AsyncStorage persistence

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import {
  ShadowProfile,
  ProfileState,
  ProfileActions,
  TraitImpacts,
  Pattern,
  FixedPoint,
  ProfileInsights,
  TraitName,
  RiskLevel,
  createDefaultProfile,
  Archetype,
} from '../types';
import { archetypes } from '../data/archetypes';
import { detectPatterns, checkFixedPoint, calculateArchetypeProgress } from '../utils/analytics';

const STORAGE_KEY = '@parallel_profile';
const SAVE_DEBOUNCE_MS = 500;

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

// Debounced save function
const debouncedSave = (profile: ShadowProfile) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save profile:', error);
      // Retry with exponential backoff
      setTimeout(() => debouncedSave(profile), 1000);
    }
  }, SAVE_DEBOUNCE_MS);
};

export const useProfileStore = create<ProfileState & ProfileActions>((set, get) => ({
  // Initial state
  profile: createDefaultProfile(uuidv4()),
  isLoaded: false,

  // Load profile from AsyncStorage
  loadProfile: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ShadowProfile;
        set({ profile: parsed, isLoaded: true });
      } else {
        // Create new profile with UUID
        const newProfile = createDefaultProfile(uuidv4());
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
        set({ profile: newProfile, isLoaded: true });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Create default profile on error
      set({ profile: createDefaultProfile(uuidv4()), isLoaded: true });
    }
  },

  // Update trait values based on choice impacts
  updateTraits: (impacts: TraitImpacts) => {
    set((state) => {
      const newTraits = { ...state.profile.traits };

      Object.entries(impacts).forEach(([trait, impact]) => {
        const traitKey = trait as TraitName;
        if (traitKey in newTraits && typeof impact === 'number') {
          // Clamp values between 0 and 100
          newTraits[traitKey] = Math.max(0, Math.min(100, newTraits[traitKey] + impact));
        }
      });

      const newProfile = {
        ...state.profile,
        traits: newTraits,
      };

      debouncedSave(newProfile);

      return { profile: newProfile };
    });
  },

  // Record a choice for pattern analysis
  recordChoice: (
    scenarioId: string,
    skeletonId: string,
    choiceId: string,
    traits: TraitImpacts,
    riskLevel: RiskLevel,
    lifeId: string
  ) => {
    set((state) => {
      const newHistory = [
        ...state.profile.choiceHistory,
        {
          skeletonId,
          choiceId,
          traitImpacts: traits,
          riskLevel,
          timestamp: Date.now(),
          lifeId,
        },
      ];

      // Keep last 1000 choices to prevent unlimited growth
      const trimmedHistory = newHistory.slice(-1000);

      const newProfile = {
        ...state.profile,
        choiceHistory: trimmedHistory,
      };

      // Update traits
      const currentTraits = { ...newProfile.traits };
      Object.entries(traits).forEach(([trait, impact]) => {
        const traitKey = trait as TraitName;
        if (traitKey in currentTraits && typeof impact === 'number') {
          currentTraits[traitKey] = Math.max(0, Math.min(100, currentTraits[traitKey] + impact));
        }
      });
      newProfile.traits = currentTraits;

      // Check for new patterns
      const newPatterns = detectPatterns(newProfile);
      newPatterns.forEach((pattern) => {
        if (!newProfile.patterns.find((p) => p.id === pattern.id)) {
          newProfile.patterns.push(pattern);
        }
      });

      // Check for fixed points
      const traitNames: TraitName[] = [
        'riskTolerance',
        'loyaltyVsFreedom',
        'truthVsPeace',
        'ambitionVsContentment',
        'forgivenessVsJustice',
        'spontaneityVsPlanning',
        'selfVsOthers',
      ];

      traitNames.forEach((traitName) => {
        const fixedPoint = checkFixedPoint(newProfile, traitName);
        if (fixedPoint && !newProfile.fixedPoints.find((fp) => fp.traitName === traitName)) {
          newProfile.fixedPoints.push(fixedPoint);
        }
      });

      // Check for archetype unlocks
      archetypes.forEach((archetype) => {
        if (
          !newProfile.unlockedArchetypes.includes(archetype.id) &&
          archetype.unlockCondition(newProfile)
        ) {
          newProfile.unlockedArchetypes.push(archetype.id);
        }
      });

      debouncedSave(newProfile);

      return { profile: newProfile };
    });
  },

  // Add a new pattern
  addPattern: (pattern: Pattern) => {
    set((state) => {
      if (state.profile.patterns.find((p) => p.id === pattern.id)) {
        return state;
      }

      const newProfile = {
        ...state.profile,
        patterns: [...state.profile.patterns, pattern],
      };

      debouncedSave(newProfile);

      return { profile: newProfile };
    });
  },

  // Add a fixed point
  addFixedPoint: (fixedPoint: FixedPoint) => {
    set((state) => {
      if (state.profile.fixedPoints.find((fp) => fp.traitName === fixedPoint.traitName)) {
        return state;
      }

      const newProfile = {
        ...state.profile,
        fixedPoints: [...state.profile.fixedPoints, fixedPoint],
      };

      debouncedSave(newProfile);

      return { profile: newProfile };
    });
  },

  // Unlock an archetype
  unlockArchetype: (archetypeId: string) => {
    set((state) => {
      if (state.profile.unlockedArchetypes.includes(archetypeId)) {
        return state;
      }

      const newProfile = {
        ...state.profile,
        unlockedArchetypes: [...state.profile.unlockedArchetypes, archetypeId],
      };

      debouncedSave(newProfile);

      return { profile: newProfile };
    });
  },

  // Increment total lives played
  incrementLivesPlayed: () => {
    set((state) => {
      const newProfile = {
        ...state.profile,
        totalLivesPlayed: state.profile.totalLivesPlayed + 1,
      };

      debouncedSave(newProfile);

      return { profile: newProfile };
    });
  },

  // Get analyzed insights from the profile
  getInsights: (): ProfileInsights => {
    const { profile } = get();

    // Sort traits by value
    const traitEntries = Object.entries(profile.traits) as [TraitName, number][];
    const sortedTraits = traitEntries.sort((a, b) => b[1] - a[1]);

    const dominantTraits = sortedTraits.slice(0, 3).map(([trait, value]) => ({ trait, value }));
    const weakestTraits = sortedTraits.slice(-3).map(([trait, value]) => ({ trait, value }));

    // Calculate average lifespan from choice history
    const lifeIds = [...new Set(profile.choiceHistory.map((c) => c.lifeId))];
    const averageLifespan = lifeIds.length > 0 ? 50 + Math.random() * 20 : 0; // Placeholder

    // Most common death type (placeholder - would need death history)
    const mostCommonDeathType = 'peaceful';

    // Calculate archetype progress
    const archetypeProgress = archetypes.map((archetype) => ({
      archetype,
      progress: profile.unlockedArchetypes.includes(archetype.id)
        ? 100
        : calculateArchetypeProgress(profile, archetype),
    }));

    return {
      dominantTraits,
      weakestTraits,
      totalLives: profile.totalLivesPlayed,
      averageLifespan,
      mostCommonDeathType,
      patternCount: profile.patterns.length,
      fixedPointCount: profile.fixedPoints.length,
      archetypeProgress,
    };
  },
}));

export default useProfileStore;
