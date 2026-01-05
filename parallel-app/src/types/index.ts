// PARALLEL - Type Definitions

// Risk levels for choices
export type RiskLevel = 'safe' | 'moderate' | 'risky';

// Archetype rarity levels
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

// Trait names as a union type for type safety
export type TraitName =
  | 'riskTolerance'
  | 'loyaltyVsFreedom'
  | 'truthVsPeace'
  | 'ambitionVsContentment'
  | 'forgivenessVsJustice'
  | 'spontaneityVsPlanning'
  | 'selfVsOthers';

// Trait impacts mapping
export type TraitImpacts = Partial<Record<TraitName, number>>;

// Era types for scenario skinning
export type Era = 'modern' | 'medieval' | 'future' | 'ancient' | 'victorian' | 'renaissance';

// Choice interface - represents a decision the player can make
export interface Choice {
  id: string;
  text: string; // max 80 characters
  riskLevel: RiskLevel;
  traitImpacts: TraitImpacts;
  nextScenarioId: string | null;
  isLifeDefining: boolean; // triggers hesitation pause if true
}

// Scenario interface - a specific situation with choices
export interface Scenario {
  id: string;
  skeletonId: string; // references the abstract dilemma type
  narrativeText: string; // the situation description
  ageRange: [number, number]; // when this can occur in a life
  choices: Choice[]; // 2-4 choices
  era: Era;
}

// Record of a choice made during a life
export interface ChoiceRecord {
  scenarioId: string;
  choiceId: string;
  age: number;
  timestamp: number;
}

// Life interface - represents a single playthrough
export interface Life {
  id: string;
  currentAge: number; // starts at 18, ends at death
  era: Era;
  scenarios: Scenario[]; // scenarios encountered
  choicesMade: ChoiceRecord[];
  startTime: number; // timestamp
  endTime: number | null;
  deathCause: string | null;
  satisfactionScore: number; // 0-100
  regretScore: number; // 0-100
}

// Traits mapping for shadow profile
export interface Traits {
  riskTolerance: number; // 0-100
  loyaltyVsFreedom: number; // 0-100
  truthVsPeace: number; // 0-100
  ambitionVsContentment: number; // 0-100
  forgivenessVsJustice: number; // 0-100
  spontaneityVsPlanning: number; // 0-100
  selfVsOthers: number; // 0-100
}

// Pattern - detected behavioral patterns
export interface Pattern {
  id: string;
  name: string;
  description: string;
  frequency: number; // 0-1, how often this occurs
  triggerCondition: string; // human-readable description
}

// Fixed Point - consistent behaviors across many scenarios
export interface FixedPoint {
  id: string;
  traitName: TraitName;
  direction: 'always' | 'never';
  behavior: string;
  confidence: number; // 0-1, based on sample size
  discoveredAt: number; // timestamp
}

// Shadow Profile - the player's psychological profile
export interface ShadowProfile {
  id: string;
  totalLivesPlayed: number;
  traits: Traits;
  patterns: Pattern[];
  fixedPoints: FixedPoint[];
  unlockedArchetypes: string[]; // array of archetype IDs
  choiceHistory: ChoiceHistoryEntry[];
}

// Entry in choice history for analysis
export interface ChoiceHistoryEntry {
  skeletonId: string;
  choiceId: string;
  traitImpacts: TraitImpacts;
  riskLevel: RiskLevel;
  timestamp: number;
  lifeId: string;
}

// Archetype - psychological profile type
export interface Archetype {
  id: string;
  name: string; // e.g., "The Comfortable Liar"
  description: string;
  icon: string; // emoji
  unlockCondition: (profile: ShadowProfile) => boolean;
  rarity: Rarity;
}

// Choice template for skeleton
export interface ChoiceTemplate {
  abstractOutcome: string;
  traitImpacts: TraitImpacts;
  satisfactionModifier: number;
  regretModifier: number;
}

// Skeleton - abstract dilemma type
export interface Skeleton {
  id: string;
  name: string; // e.g., "The Golden Handcuffs"
  abstractDilemma: string;
  primaryTrait: TraitName; // which trait this tests
  choiceTemplate: {
    safe: ChoiceTemplate;
    risky: ChoiceTemplate;
  };
}

// Death screen data
export interface DeathScreenData {
  visible: boolean;
  summary: string;
  ghostBranch: GhostBranch | null;
}

// Ghost branch - the path not taken
export interface GhostBranch {
  text: string;
  pivotScenarioId: string;
}

// Skin template for era-specific scenario generation
export interface SkinTemplate {
  skeletonId: string;
  era: Era;
  settingDescription: string;
  characterTypes: string[];
  safeChoicePhrasing: string;
  riskyChoicePhrasing: string;
  contextTemplate: string;
}

// Death summary categories
export type DeathCategory = 'peaceful' | 'tragic' | 'heroic' | 'lonely' | 'fulfilled' | 'regretful';

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
  Insights: undefined;
  ArchetypeGallery: undefined;
};

// Game state for zustand store
export interface GameState {
  currentLife: Life | null;
  currentScenario: Scenario | null;
  isPlaying: boolean;
  isPaused: boolean;
  hesitationActive: boolean;
  deathScreen: DeathScreenData | null;
}

// Game actions for zustand store
export interface GameActions {
  startNewLife: () => void;
  loadScenario: (scenario: Scenario) => void;
  makeChoice: (choice: Choice) => void;
  setHesitation: (active: boolean) => void;
  showDeathScreen: (data: DeathScreenData) => void;
  dismissDeathScreen: () => void;
  resetGame: () => void;
  setCurrentLife: (life: Life) => void;
  updateCurrentLife: (updates: Partial<Life>) => void;
}

// Profile state for zustand store
export interface ProfileState {
  profile: ShadowProfile;
  isLoaded: boolean;
}

// Profile actions for zustand store
export interface ProfileActions {
  loadProfile: () => Promise<void>;
  updateTraits: (impacts: TraitImpacts) => void;
  recordChoice: (
    scenarioId: string,
    skeletonId: string,
    choiceId: string,
    traits: TraitImpacts,
    riskLevel: RiskLevel,
    lifeId: string
  ) => void;
  addPattern: (pattern: Pattern) => void;
  addFixedPoint: (fixedPoint: FixedPoint) => void;
  unlockArchetype: (archetypeId: string) => void;
  incrementLivesPlayed: () => void;
  getInsights: () => ProfileInsights;
}

// Profile insights returned by getInsights
export interface ProfileInsights {
  dominantTraits: { trait: TraitName; value: number }[];
  weakestTraits: { trait: TraitName; value: number }[];
  totalLives: number;
  averageLifespan: number;
  mostCommonDeathType: string;
  patternCount: number;
  fixedPointCount: number;
  archetypeProgress: { archetype: Archetype; progress: number }[];
}

// Default trait values
export const DEFAULT_TRAITS: Traits = {
  riskTolerance: 50,
  loyaltyVsFreedom: 50,
  truthVsPeace: 50,
  ambitionVsContentment: 50,
  forgivenessVsJustice: 50,
  spontaneityVsPlanning: 50,
  selfVsOthers: 50,
};

// Create a default shadow profile
export const createDefaultProfile = (id: string): ShadowProfile => ({
  id,
  totalLivesPlayed: 0,
  traits: { ...DEFAULT_TRAITS },
  patterns: [],
  fixedPoints: [],
  unlockedArchetypes: [],
  choiceHistory: [],
});
