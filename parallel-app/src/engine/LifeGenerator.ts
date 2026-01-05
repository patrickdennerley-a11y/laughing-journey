// PARALLEL - Life Generator
// Manages life creation, progression, death, and ghost branches

import { v4 as uuidv4 } from 'uuid';
import {
  Life,
  ShadowProfile,
  Choice,
  Era,
  GhostBranch,
  DeathCategory,
} from '../types';
import { getDeathSummary, determineDeathCategory } from '../data/deathSummaries';

export class LifeGenerator {
  // Generate a new life for the player
  generateNewLife(profile: ShadowProfile): Life {
    const era = this.selectEra(profile);

    return {
      id: uuidv4(),
      currentAge: 18,
      era,
      scenarios: [],
      choicesMade: [],
      startTime: Date.now(),
      endTime: null,
      deathCause: null,
      satisfactionScore: 50,
      regretScore: 50,
    };
  }

  // Advance life after a choice is made
  advanceLife(life: Life, choiceMade: Choice): Life {
    // Calculate age advancement (3-10 years based on scenario significance)
    const ageAdvancement = this.calculateAgeAdvancement(choiceMade);
    const newAge = Math.min(life.currentAge + ageAdvancement, 100);

    // Update satisfaction and regret scores
    const satisfactionDelta = this.calculateSatisfactionDelta(choiceMade);
    const regretDelta = this.calculateRegretDelta(choiceMade);

    return {
      ...life,
      currentAge: newAge,
      satisfactionScore: Math.max(0, Math.min(100, life.satisfactionScore + satisfactionDelta)),
      regretScore: Math.max(0, Math.min(100, life.regretScore + regretDelta)),
    };
  }

  // Check if death should occur
  checkDeath(life: Life): { isDead: boolean; cause: string | null } {
    // Certain death at 85+
    if (life.currentAge >= 85) {
      return { isDead: true, cause: 'old age' };
    }

    // Increasing random chance with age
    const deathChance = this.calculateDeathChance(life);
    if (Math.random() < deathChance) {
      const cause = this.determineDeathCause(life);
      return { isDead: true, cause };
    }

    return { isDead: false, cause: null };
  }

  // Check if a specific risky choice causes immediate death
  checkRiskyDeath(life: Life, choice: Choice): { isDead: boolean; cause: string | null } {
    if (choice.riskLevel !== 'risky') {
      return { isDead: false, cause: null };
    }

    // Very risky choices have a small chance of immediate death
    // Higher chance at older ages
    const baseChance = 0.02;
    const ageModifier = Math.max(0, (life.currentAge - 40) / 100);
    const deathChance = baseChance + ageModifier;

    if (Math.random() < deathChance) {
      return {
        isDead: true,
        cause: 'the consequences of a bold choice',
      };
    }

    return { isDead: false, cause: null };
  }

  // Generate death summary
  generateDeathSummary(life: Life): string {
    const lastChoice = life.choicesMade[life.choicesMade.length - 1];
    const wasRisky = lastChoice?.choiceId.includes('risky') || Math.random() > 0.5;

    // Estimate social isolation from loyalty trait choices
    const socialIsolation = this.estimateSocialIsolation(life);

    // Determine if death was a sacrifice
    const wasSacrifice = this.checkIfSacrifice(life);

    const category = determineDeathCategory(
      life.satisfactionScore,
      life.regretScore,
      wasRisky,
      wasSacrifice,
      socialIsolation,
      life.currentAge
    );

    return getDeathSummary(
      category,
      this.formatEra(life.era),
      life.currentAge,
      'your final choice'
    );
  }

  // Generate ghost branch - the path not taken
  generateGhostBranch(life: Life): GhostBranch {
    // Find the most impactful choice in the life
    const pivotChoice = this.findPivotChoice(life);

    const ghostText = this.generateGhostText(life, pivotChoice);

    return {
      text: ghostText,
      pivotScenarioId: pivotChoice.scenarioId,
    };
  }

  // Select era based on what user has played least
  private selectEra(profile: ShadowProfile): Era {
    const eras: Era[] = ['modern', 'medieval', 'future', 'ancient', 'victorian', 'renaissance'];

    // Count era occurrences in choice history
    const eraCounts = new Map<Era, number>();
    eras.forEach((era) => eraCounts.set(era, 0));

    // For now, just randomly select with slight bias toward less-played
    // In full implementation, would track era history
    return eras[Math.floor(Math.random() * eras.length)];
  }

  // Calculate age advancement based on choice
  private calculateAgeAdvancement(choice: Choice): number {
    if (choice.isLifeDefining) {
      return Math.floor(Math.random() * 5) + 5; // 5-10 years
    }
    return Math.floor(Math.random() * 5) + 3; // 3-7 years
  }

  // Calculate satisfaction delta from choice
  private calculateSatisfactionDelta(choice: Choice): number {
    // Base delta from risk level
    let delta = 0;
    switch (choice.riskLevel) {
      case 'safe':
        delta = Math.random() * 5 - 2; // -2 to +3
        break;
      case 'moderate':
        delta = Math.random() * 8 - 3; // -3 to +5
        break;
      case 'risky':
        delta = Math.random() * 15 - 5; // -5 to +10
        break;
    }

    // Life-defining choices have bigger swings
    if (choice.isLifeDefining) {
      delta *= 1.5;
    }

    return Math.round(delta);
  }

  // Calculate regret delta from choice
  private calculateRegretDelta(choice: Choice): number {
    let delta = 0;
    switch (choice.riskLevel) {
      case 'safe':
        delta = Math.random() * 8 - 2; // -2 to +6 (safe choices can lead to regret)
        break;
      case 'moderate':
        delta = Math.random() * 6 - 3; // -3 to +3
        break;
      case 'risky':
        delta = Math.random() * 10 - 7; // -7 to +3 (risky choices reduce regret)
        break;
    }

    if (choice.isLifeDefining) {
      delta *= 1.5;
    }

    return Math.round(delta);
  }

  // Calculate death chance based on age
  private calculateDeathChance(life: Life): number {
    const age = life.currentAge;

    if (age < 40) return 0.01;
    if (age < 50) return 0.02;
    if (age < 60) return 0.05;
    if (age < 70) return 0.10;
    if (age < 75) return 0.15;
    if (age < 80) return 0.20;
    if (age < 85) return 0.30;

    return 0.5;
  }

  // Determine death cause based on life circumstances
  private determineDeathCause(life: Life): string {
    const causes = [
      'a sudden illness',
      'an accident',
      'the weight of years',
      'a broken heart',
      'peacefully in sleep',
      'surrounded by those you loved',
      'alone but content',
      'with unfinished business',
    ];

    // Weight based on satisfaction/regret
    if (life.satisfactionScore > 70) {
      return 'peacefully, with no regrets';
    }

    if (life.regretScore > 70) {
      return 'with words left unsaid';
    }

    return causes[Math.floor(Math.random() * causes.length)];
  }

  // Estimate social isolation from choices
  private estimateSocialIsolation(life: Life): number {
    // This would analyze choices for patterns indicating isolation
    // Simplified: base on number of choices and randomness
    const baseIsolation = 30;
    const choiceCount = life.choicesMade.length;
    const variation = Math.random() * 40 - 20;

    return Math.max(0, Math.min(100, baseIsolation + variation));
  }

  // Check if death was a sacrifice for others
  private checkIfSacrifice(life: Life): boolean {
    // Would check if final choice was selfless
    // Simplified: random with low probability
    return Math.random() < 0.1;
  }

  // Find the most impactful choice for ghost branch
  private findPivotChoice(life: Life): { scenarioId: string; choiceId: string; age: number } {
    if (life.choicesMade.length === 0) {
      return { scenarioId: 'none', choiceId: 'none', age: 18 };
    }

    // Find life-defining choices first
    const lifeDefiningChoices = life.choicesMade.filter(
      (choice, index) => index > 0 && index < life.choicesMade.length - 1
    );

    if (lifeDefiningChoices.length > 0) {
      return lifeDefiningChoices[Math.floor(Math.random() * lifeDefiningChoices.length)];
    }

    // Otherwise, pick a choice from the middle of life
    const middleIndex = Math.floor(life.choicesMade.length / 2);
    return life.choicesMade[middleIndex];
  }

  // Generate ghost branch text
  private generateGhostText(
    life: Life,
    pivotChoice: { scenarioId: string; choiceId: string; age: number }
  ): string {
    const ghostTexts = [
      `In another life, at ${pivotChoice.age}, you chose differently...`,
      `What if, at ${pivotChoice.age}, you had taken the other path?`,
      `There's a version of you who, at ${pivotChoice.age}, made a different choice.`,
      `In a parallel life, the you of ${pivotChoice.age} chose another way.`,
      `Somewhere, another you took the road not traveled at ${pivotChoice.age}.`,
    ];

    return ghostTexts[Math.floor(Math.random() * ghostTexts.length)];
  }

  // Format era for display
  private formatEra(era: Era): string {
    const formatted: Record<Era, string> = {
      modern: 'modern',
      medieval: 'medieval',
      future: 'future',
      ancient: 'ancient',
      victorian: 'Victorian',
      renaissance: 'Renaissance',
    };
    return formatted[era];
  }
}

export default LifeGenerator;
