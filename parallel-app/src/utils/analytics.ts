// PARALLEL - Analytics Utilities
// Functions for analyzing profile data and detecting patterns

import { v4 as uuidv4 } from 'uuid';
import {
  ShadowProfile,
  Pattern,
  FixedPoint,
  TraitName,
  ChoiceHistoryEntry,
  Archetype,
} from '../types';

// Calculate tendency for a specific trait based on choice history
export const calculateTraitTendency = (
  choices: ChoiceHistoryEntry[],
  trait: TraitName
): number => {
  if (choices.length === 0) return 50;

  // Weight recent choices higher
  const weightedSum = choices.reduce((sum, choice, index) => {
    const weight = (index + 1) / choices.length; // More recent = higher weight
    const impact = choice.traitImpacts[trait] || 0;
    return sum + impact * weight;
  }, 0);

  const totalWeight = choices.reduce((sum, _, index) => sum + (index + 1) / choices.length, 0);

  // Return weighted average, centered at 50
  return Math.max(0, Math.min(100, 50 + (weightedSum / totalWeight) * 2));
};

// Detect behavioral patterns in the profile
export const detectPatterns = (profile: ShadowProfile): Pattern[] => {
  const patterns: Pattern[] = [];
  const history = profile.choiceHistory;

  if (history.length < 10) return patterns;

  // Pattern: Consistently takes risky choices after safe ones
  const riskAfterSafe = analyzeSequentialPattern(history, 'safe', 'risky');
  if (riskAfterSafe > 0.6) {
    patterns.push({
      id: 'risk-after-safe',
      name: 'The Compensator',
      description: 'You tend to take risks after playing it safe, as if making up for lost time.',
      frequency: riskAfterSafe,
      triggerCondition: 'After making a safe choice, you are more likely to take risks next.',
    });
  }

  // Pattern: Consistently takes safe choices after risky ones
  const safeAfterRisk = analyzeSequentialPattern(history, 'risky', 'safe');
  if (safeAfterRisk > 0.6) {
    patterns.push({
      id: 'safe-after-risk',
      name: 'The Recoiler',
      description: 'After taking a risk, you pull back to safety, as if recovering from the thrill.',
      frequency: safeAfterRisk,
      triggerCondition: 'After making a risky choice, you tend to choose safety next.',
    });
  }

  // Pattern: Risk tolerance increases over the life
  const riskOverTime = analyzeRiskProgression(history);
  if (riskOverTime > 0.7) {
    patterns.push({
      id: 'escalating-risk',
      name: 'The Accelerator',
      description: 'Your appetite for risk grows as life progresses. Caution fades with experience.',
      frequency: riskOverTime,
      triggerCondition: 'Risk-taking increases as you age within each life.',
    });
  }

  // Pattern: Always chooses the same on specific skeleton types
  const skeletonPatterns = analyzeSkeletonConsistency(history);
  skeletonPatterns.forEach((pattern) => {
    if (pattern.frequency > 0.8) {
      patterns.push(pattern);
    }
  });

  // Pattern: Truth vs Peace tendency
  const truthBias = analyzeTruthBias(profile);
  if (truthBias !== null) {
    patterns.push(truthBias);
  }

  return patterns;
};

// Analyze sequential patterns (what follows what)
const analyzeSequentialPattern = (
  history: ChoiceHistoryEntry[],
  firstType: 'safe' | 'moderate' | 'risky',
  secondType: 'safe' | 'moderate' | 'risky'
): number => {
  let matches = 0;
  let opportunities = 0;

  for (let i = 1; i < history.length; i++) {
    if (history[i - 1].riskLevel === firstType) {
      opportunities++;
      if (history[i].riskLevel === secondType) {
        matches++;
      }
    }
  }

  return opportunities > 5 ? matches / opportunities : 0;
};

// Analyze if risk-taking increases over time within lives
const analyzeRiskProgression = (history: ChoiceHistoryEntry[]): number => {
  // Group by life
  const lives = new Map<string, ChoiceHistoryEntry[]>();
  history.forEach((entry) => {
    const existing = lives.get(entry.lifeId) || [];
    existing.push(entry);
    lives.set(entry.lifeId, existing);
  });

  let increasingLives = 0;
  let totalLives = 0;

  lives.forEach((lifeChoices) => {
    if (lifeChoices.length < 4) return;

    totalLives++;
    const firstHalf = lifeChoices.slice(0, Math.floor(lifeChoices.length / 2));
    const secondHalf = lifeChoices.slice(Math.floor(lifeChoices.length / 2));

    const firstRiskScore = firstHalf.filter((c) => c.riskLevel === 'risky').length / firstHalf.length;
    const secondRiskScore = secondHalf.filter((c) => c.riskLevel === 'risky').length / secondHalf.length;

    if (secondRiskScore > firstRiskScore + 0.1) {
      increasingLives++;
    }
  });

  return totalLives > 3 ? increasingLives / totalLives : 0;
};

// Analyze consistency on specific skeleton types
const analyzeSkeletonConsistency = (history: ChoiceHistoryEntry[]): Pattern[] => {
  const patterns: Pattern[] = [];
  const bySkeletonId = new Map<string, ChoiceHistoryEntry[]>();

  history.forEach((entry) => {
    const existing = bySkeletonId.get(entry.skeletonId) || [];
    existing.push(entry);
    bySkeletonId.set(entry.skeletonId, existing);
  });

  bySkeletonId.forEach((choices, skeletonId) => {
    if (choices.length < 5) return;

    const riskyCount = choices.filter((c) => c.riskLevel === 'risky').length;
    const safeCount = choices.filter((c) => c.riskLevel === 'safe').length;
    const riskyRatio = riskyCount / choices.length;
    const safeRatio = safeCount / choices.length;

    if (riskyRatio > 0.85) {
      patterns.push({
        id: `always-risky-${skeletonId}`,
        name: `Bold on ${formatSkeletonName(skeletonId)}`,
        description: `When facing ${formatSkeletonName(skeletonId)}, you consistently choose the bold path.`,
        frequency: riskyRatio,
        triggerCondition: `${formatSkeletonName(skeletonId)} scenarios trigger risk-taking.`,
      });
    }

    if (safeRatio > 0.85) {
      patterns.push({
        id: `always-safe-${skeletonId}`,
        name: `Cautious on ${formatSkeletonName(skeletonId)}`,
        description: `When facing ${formatSkeletonName(skeletonId)}, you consistently play it safe.`,
        frequency: safeRatio,
        triggerCondition: `${formatSkeletonName(skeletonId)} scenarios trigger caution.`,
      });
    }
  });

  return patterns;
};

// Analyze truth vs peace bias
const analyzeTruthBias = (profile: ShadowProfile): Pattern | null => {
  const trait = profile.traits.truthVsPeace;

  if (trait > 75) {
    return {
      id: 'truth-seeker-pattern',
      name: 'Compulsive Honesty',
      description: 'You choose truth even when lies would serve you better. Honesty is not a choice for you - it is a compulsion.',
      frequency: (trait - 50) / 50,
      triggerCondition: 'When faced with a truth vs peace dilemma, you choose truth.',
    };
  }

  if (trait < 25) {
    return {
      id: 'peace-keeper-pattern',
      name: 'Diplomatic Deception',
      description: 'Harmony matters more than honesty. You bend the truth to keep the peace, and have gotten very good at it.',
      frequency: (50 - trait) / 50,
      triggerCondition: 'When faced with a truth vs peace dilemma, you choose peace.',
    };
  }

  return null;
};

// Format skeleton ID to human-readable name
const formatSkeletonName = (skeletonId: string): string => {
  return skeletonId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Check if a trait has become a fixed point
export const checkFixedPoint = (
  profile: ShadowProfile,
  trait: TraitName
): FixedPoint | null => {
  const history = profile.choiceHistory;

  if (history.length < 20) return null;

  // Get choices that affected this trait
  const relevantChoices = history.filter(
    (choice) => choice.traitImpacts[trait] !== undefined
  );

  if (relevantChoices.length < 20) return null;

  // Count positive vs negative impacts
  const positiveCount = relevantChoices.filter(
    (choice) => (choice.traitImpacts[trait] || 0) > 0
  ).length;

  const negativeCount = relevantChoices.filter(
    (choice) => (choice.traitImpacts[trait] || 0) < 0
  ).length;

  const totalRelevant = positiveCount + negativeCount;
  if (totalRelevant < 20) return null;

  const positiveRatio = positiveCount / totalRelevant;
  const negativeRatio = negativeCount / totalRelevant;

  // Need 85%+ consistency for a fixed point
  if (positiveRatio >= 0.85) {
    return {
      id: uuidv4(),
      traitName: trait,
      direction: 'always',
      behavior: getFixedPointBehavior(trait, 'always'),
      confidence: positiveRatio,
      discoveredAt: Date.now(),
    };
  }

  if (negativeRatio >= 0.85) {
    return {
      id: uuidv4(),
      traitName: trait,
      direction: 'never',
      behavior: getFixedPointBehavior(trait, 'never'),
      confidence: negativeRatio,
      discoveredAt: Date.now(),
    };
  }

  return null;
};

// Get human-readable behavior for fixed points
const getFixedPointBehavior = (trait: TraitName, direction: 'always' | 'never'): string => {
  const behaviors: Record<TraitName, { always: string; never: string }> = {
    riskTolerance: {
      always: 'You almost always choose the risky option.',
      never: 'You almost never take unnecessary risks.',
    },
    loyaltyVsFreedom: {
      always: 'You consistently prioritize loyalty over freedom.',
      never: 'You consistently choose freedom over loyalty.',
    },
    truthVsPeace: {
      always: 'You almost always choose truth over peace.',
      never: 'You almost never disrupt peace with hard truths.',
    },
    ambitionVsContentment: {
      always: 'You consistently pursue ambition over contentment.',
      never: 'You consistently choose contentment over ambition.',
    },
    forgivenessVsJustice: {
      always: 'You almost always choose forgiveness.',
      never: 'You almost never forgive - justice must be served.',
    },
    spontaneityVsPlanning: {
      always: 'You consistently act spontaneously.',
      never: 'You almost never act without careful planning.',
    },
    selfVsOthers: {
      always: 'You consistently prioritize yourself over others.',
      never: 'You almost never put yourself first.',
    },
  };

  return behaviors[trait][direction];
};

// Calculate progress toward unlocking an archetype
export const calculateArchetypeProgress = (
  profile: ShadowProfile,
  archetype: Archetype
): number => {
  // This is a simplified calculation - in practice, would need to
  // analyze the unlock condition more thoroughly

  // Check if already unlocked
  if (profile.unlockedArchetypes.includes(archetype.id)) {
    return 100;
  }

  // Base progress on trait values and lives played
  let progress = 0;

  // Lives played contribution (max 30%)
  const livesProgress = Math.min(30, (profile.totalLivesPlayed / 15) * 30);
  progress += livesProgress;

  // Trait-based progress estimation (max 70%)
  // This is a rough estimate - actual unlock depends on specific conditions
  switch (archetype.id) {
    case 'comfortable-liar':
      progress += (100 - profile.traits.truthVsPeace) * 0.7;
      break;
    case 'loyal-fool':
      progress += profile.traits.loyaltyVsFreedom * 0.7;
      break;
    case 'cold-calculator':
      progress += profile.traits.selfVsOthers * 0.7;
      break;
    case 'bridge-burner':
      progress += (100 - profile.traits.forgivenessVsJustice) * 0.7;
      break;
    case 'wanderer':
      progress += (100 - profile.traits.loyaltyVsFreedom) * 0.7;
      break;
    case 'gamblers-heart':
      progress += profile.traits.riskTolerance * 0.7;
      break;
    case 'safe-harbor':
      progress += (100 - profile.traits.riskTolerance) * 0.7;
      break;
    case 'truth-seeker':
      progress += profile.traits.truthVsPeace * 0.7;
      break;
    case 'martyr':
      progress += (100 - profile.traits.selfVsOthers) * 0.7;
      break;
    default:
      // Generic progress for unknown archetypes
      progress += 35;
  }

  return Math.min(99, Math.round(progress)); // Never show 100 for locked archetypes
};
