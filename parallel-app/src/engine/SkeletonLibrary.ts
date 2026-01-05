// PARALLEL - Skeleton Library
// Manages the selection and retrieval of abstract life dilemmas

import { Skeleton, ShadowProfile, TraitName } from '../types';
import { skeletons } from '../data/skeletons';

export class SkeletonLibrary {
  private skeletons: Skeleton[];

  constructor() {
    this.skeletons = skeletons;
  }

  // Get a skeleton appropriate for the current profile
  getSkeletonForProfile(
    profile: ShadowProfile,
    recentSkeletonIds: string[]
  ): Skeleton {
    // Get skeletons not used in the last 5 lives
    const availableSkeletons = this.skeletons.filter(
      (skeleton) => !recentSkeletonIds.slice(-5).includes(skeleton.id)
    );

    // If all skeletons have been used recently, allow all
    const candidates = availableSkeletons.length > 0 ? availableSkeletons : this.skeletons;

    // Find undertested traits (traits with values closest to 50)
    const traitDistances = this.getTraitDistances(profile);

    // Weight skeletons based on how much their primary trait needs testing
    const weightedSkeletons = candidates.map((skeleton) => {
      const traitDistance = traitDistances.get(skeleton.primaryTrait) || 0;
      // Higher weight for traits closer to 50 (less determined)
      const weight = Math.max(1, 50 - traitDistance);
      return { skeleton, weight };
    });

    // Select skeleton with weighted random selection
    return this.weightedRandomSelect(weightedSkeletons);
  }

  // Get a skeleton by ID
  getSkeletonById(id: string): Skeleton | undefined {
    return this.skeletons.find((skeleton) => skeleton.id === id);
  }

  // Get all skeletons
  getAllSkeletons(): Skeleton[] {
    return [...this.skeletons];
  }

  // Get skeletons that test a specific trait
  getSkeletonsForTrait(trait: TraitName): Skeleton[] {
    return this.skeletons.filter((skeleton) => skeleton.primaryTrait === trait);
  }

  // Calculate how far each trait is from the neutral value (50)
  private getTraitDistances(profile: ShadowProfile): Map<TraitName, number> {
    const distances = new Map<TraitName, number>();

    const traits: TraitName[] = [
      'riskTolerance',
      'loyaltyVsFreedom',
      'truthVsPeace',
      'ambitionVsContentment',
      'forgivenessVsJustice',
      'spontaneityVsPlanning',
      'selfVsOthers',
    ];

    traits.forEach((trait) => {
      const value = profile.traits[trait];
      distances.set(trait, Math.abs(value - 50));
    });

    return distances;
  }

  // Weighted random selection
  private weightedRandomSelect(
    weightedItems: { skeleton: Skeleton; weight: number }[]
  ): Skeleton {
    const totalWeight = weightedItems.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of weightedItems) {
      random -= item.weight;
      if (random <= 0) {
        return item.skeleton;
      }
    }

    // Fallback to last item
    return weightedItems[weightedItems.length - 1].skeleton;
  }

  // Get the count of available skeletons
  getSkeletonCount(): number {
    return this.skeletons.length;
  }

  // Check if a skeleton exists
  hasSkeletion(id: string): boolean {
    return this.skeletons.some((skeleton) => skeleton.id === id);
  }
}

export default SkeletonLibrary;
