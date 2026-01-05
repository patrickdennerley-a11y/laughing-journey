// PARALLEL - Proteus Engine
// Core game engine that orchestrates all game mechanics

import { SkeletonLibrary } from './SkeletonLibrary';
import { SkinGenerator } from './SkinGenerator';
import { LifeGenerator } from './LifeGenerator';
import { useProfileStore } from '../stores/profileStore';
import { useGameStore } from '../stores/gameStore';
import {
  Life,
  Scenario,
  Choice,
  ShadowProfile,
  GhostBranch,
} from '../types';

interface DeathData {
  summary: string;
  ghostBranch: GhostBranch;
  life: Life;
}

interface ProcessChoiceResult {
  updatedLife: Life;
  isDead: boolean;
  deathData?: DeathData;
}

export class ProteusEngine {
  private skeletonLibrary: SkeletonLibrary;
  private skinGenerator: SkinGenerator;
  private lifeGenerator: LifeGenerator;
  private recentSkeletonIds: string[] = [];

  constructor() {
    this.skeletonLibrary = new SkeletonLibrary();
    this.skinGenerator = new SkinGenerator();
    this.lifeGenerator = new LifeGenerator();
  }

  // Start a new life
  startNewLife(): Life {
    const profile = useProfileStore.getState().profile;
    const life = this.lifeGenerator.generateNewLife(profile);

    // Store in game state
    const gameStore = useGameStore.getState();
    gameStore.setCurrentLife(life);
    gameStore.startNewLife();

    // Increment lives played
    useProfileStore.getState().incrementLivesPlayed();

    return life;
  }

  // Get the next scenario for the current life
  getNextScenario(life: Life): Scenario {
    const profile = useProfileStore.getState().profile;

    // Get appropriate skeleton
    const skeleton = this.skeletonLibrary.getSkeletonForProfile(
      profile,
      this.recentSkeletonIds
    );

    // Track recent skeletons to avoid repetition
    this.recentSkeletonIds.push(skeleton.id);
    if (this.recentSkeletonIds.length > 10) {
      this.recentSkeletonIds.shift();
    }

    // Generate skinned scenario
    const scenario = this.skinGenerator.generateScenario(skeleton, life, profile);

    // Add to life's scenario history
    const updatedLife = {
      ...life,
      scenarios: [...life.scenarios, scenario],
    };
    useGameStore.getState().setCurrentLife(updatedLife);
    useGameStore.getState().loadScenario(scenario);

    return scenario;
  }

  // Process a choice made by the player
  processChoice(life: Life, choice: Choice): ProcessChoiceResult {
    const currentScenario = useGameStore.getState().currentScenario;

    // Record the choice in the profile
    if (currentScenario) {
      this.updateProfile(choice, currentScenario);
    }

    // Check for immediate death from risky choice
    const riskyDeathCheck = this.lifeGenerator.checkRiskyDeath(life, choice);
    if (riskyDeathCheck.isDead) {
      const updatedLife = {
        ...life,
        endTime: Date.now(),
        deathCause: riskyDeathCheck.cause,
      };

      const deathData = this.generateDeathData(updatedLife);
      useGameStore.getState().setCurrentLife(updatedLife);

      return {
        updatedLife,
        isDead: true,
        deathData,
      };
    }

    // Advance the life
    let updatedLife = this.lifeGenerator.advanceLife(life, choice);

    // Check for natural death
    const naturalDeathCheck = this.lifeGenerator.checkDeath(updatedLife);
    if (naturalDeathCheck.isDead) {
      updatedLife = {
        ...updatedLife,
        endTime: Date.now(),
        deathCause: naturalDeathCheck.cause,
      };

      const deathData = this.generateDeathData(updatedLife);
      useGameStore.getState().setCurrentLife(updatedLife);

      return {
        updatedLife,
        isDead: true,
        deathData,
      };
    }

    // Update game store with advanced life
    useGameStore.getState().setCurrentLife(updatedLife);

    return {
      updatedLife,
      isDead: false,
    };
  }

  // Update the player's profile based on the choice
  private updateProfile(choice: Choice, scenario: Scenario): void {
    const profileStore = useProfileStore.getState();
    const gameStore = useGameStore.getState();
    const life = gameStore.currentLife;

    if (!life) return;

    // Record the choice
    profileStore.recordChoice(
      scenario.id,
      scenario.skeletonId,
      choice.id,
      choice.traitImpacts,
      choice.riskLevel,
      life.id
    );

    // Update traits based on choice impacts
    profileStore.updateTraits(choice.traitImpacts);
  }

  // Generate death data for the death screen
  private generateDeathData(life: Life): DeathData {
    const summary = this.lifeGenerator.generateDeathSummary(life);
    const ghostBranch = this.lifeGenerator.generateGhostBranch(life);

    return {
      summary,
      ghostBranch,
      life,
    };
  }

  // Start a life from a ghost branch pivot point
  startFromGhostBranch(pivotScenarioId: string, originalLife: Life): Life {
    const profile = useProfileStore.getState().profile;

    // Create a new life with the same era
    const newLife = this.lifeGenerator.generateNewLife(profile);
    newLife.era = originalLife.era;

    // Find the pivot point in the original life
    const pivotIndex = originalLife.scenarios.findIndex(
      (s) => s.id === pivotScenarioId
    );

    if (pivotIndex > 0) {
      // Copy scenarios and choices up to the pivot
      newLife.scenarios = originalLife.scenarios.slice(0, pivotIndex);
      newLife.choicesMade = originalLife.choicesMade.slice(0, pivotIndex);

      // Set age to the age at pivot
      const pivotChoice = originalLife.choicesMade[pivotIndex - 1];
      if (pivotChoice) {
        newLife.currentAge = pivotChoice.age;
      }
    }

    // Store in game state
    const gameStore = useGameStore.getState();
    gameStore.setCurrentLife(newLife);
    gameStore.dismissDeathScreen();
    gameStore.startNewLife();

    return newLife;
  }

  // Get skeleton library for external use
  getSkeletonLibrary(): SkeletonLibrary {
    return this.skeletonLibrary;
  }

  // Get life generator for external use
  getLifeGenerator(): LifeGenerator {
    return this.lifeGenerator;
  }

  // Reset the engine state
  reset(): void {
    this.recentSkeletonIds = [];
    useGameStore.getState().resetGame();
  }
}

// Singleton instance
let engineInstance: ProteusEngine | null = null;

export const getProteusEngine = (): ProteusEngine => {
  if (!engineInstance) {
    engineInstance = new ProteusEngine();
  }
  return engineInstance;
};

export default ProteusEngine;
