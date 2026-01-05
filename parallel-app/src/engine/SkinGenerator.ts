// PARALLEL - Skin Generator
// Generates era-specific scenarios from abstract skeletons

import { v4 as uuidv4 } from 'uuid';
import {
  Skeleton,
  Scenario,
  Life,
  ShadowProfile,
  Era,
  Choice,
  SkinTemplate,
} from '../types';

// Skin templates for each skeleton and era combination
const skinTemplates: Record<string, Record<Era, SkinTemplate>> = {
  'golden-handcuffs': {
    modern: {
      skeletonId: 'golden-handcuffs',
      era: 'modern',
      settingDescription: 'TechCorp offers you $2M to sell your startup',
      characterTypes: ['CEO', 'investor', 'co-founder'],
      safeChoicePhrasing: 'Accept the buyout and golden handcuffs',
      riskyChoicePhrasing: 'Reject the offer and bet on yourself',
      contextTemplate: 'Your small company has caught the attention of a tech giant.',
    },
    medieval: {
      skeletonId: 'golden-handcuffs',
      era: 'medieval',
      settingDescription: 'The King offers you a peaceful duchy',
      characterTypes: ['lord', 'knight', 'noble'],
      safeChoicePhrasing: 'Accept the duchy and swear fealty forever',
      riskyChoicePhrasing: 'Refuse the King and remain your own master',
      contextTemplate: 'Your valor has earned royal attention.',
    },
    future: {
      skeletonId: 'golden-handcuffs',
      era: 'future',
      settingDescription: 'The Colony Council offers citizenship',
      characterTypes: ['scientist', 'colonist', 'pioneer'],
      safeChoicePhrasing: 'Accept citizenship - your research becomes theirs',
      riskyChoicePhrasing: 'Decline and continue your independent research',
      contextTemplate: 'Your breakthrough could reshape the colony.',
    },
    ancient: {
      skeletonId: 'golden-handcuffs',
      era: 'ancient',
      settingDescription: 'The Emperor offers you a position in the palace',
      characterTypes: ['scholar', 'general', 'merchant'],
      safeChoicePhrasing: 'Accept the gilded cage of imperial service',
      riskyChoicePhrasing: 'Refuse and maintain your independence',
      contextTemplate: 'Your reputation has reached the imperial court.',
    },
    victorian: {
      skeletonId: 'golden-handcuffs',
      era: 'victorian',
      settingDescription: 'A wealthy patron offers to fund your work',
      characterTypes: ['inventor', 'artist', 'writer'],
      safeChoicePhrasing: 'Accept patronage and their creative control',
      riskyChoicePhrasing: 'Decline and struggle for artistic freedom',
      contextTemplate: 'Your talent has attracted powerful attention.',
    },
    renaissance: {
      skeletonId: 'golden-handcuffs',
      era: 'renaissance',
      settingDescription: 'The Medici offer to sponsor your workshop',
      characterTypes: ['artist', 'craftsman', 'inventor'],
      safeChoicePhrasing: 'Accept their gold and their direction',
      riskyChoicePhrasing: 'Refuse and create on your own terms',
      contextTemplate: 'Your work has caught the eye of great patrons.',
    },
  },
  'betrayal-response': {
    modern: {
      skeletonId: 'betrayal-response',
      era: 'modern',
      settingDescription: 'Your business partner embezzled company funds',
      characterTypes: ['partner', 'colleague', 'friend'],
      safeChoicePhrasing: 'Forgive them and try to rebuild the partnership',
      riskyChoicePhrasing: 'Press charges and end the relationship forever',
      contextTemplate: 'Trust has been shattered by someone you believed in.',
    },
    medieval: {
      skeletonId: 'betrayal-response',
      era: 'medieval',
      settingDescription: 'Your sworn brother revealed your plans to enemies',
      characterTypes: ['knight', 'vassal', 'brother-in-arms'],
      safeChoicePhrasing: 'Accept their contrition and rebuild trust',
      riskyChoicePhrasing: 'Challenge them to single combat for their treachery',
      contextTemplate: 'A sacred oath has been broken.',
    },
    future: {
      skeletonId: 'betrayal-response',
      era: 'future',
      settingDescription: 'Your AI partner sold your research to a rival corp',
      characterTypes: ['AI companion', 'research partner', 'colleague'],
      safeChoicePhrasing: 'Reset their ethics module and continue working together',
      riskyChoicePhrasing: 'Decommission them and work alone',
      contextTemplate: 'Even artificial intelligence can betray.',
    },
    ancient: {
      skeletonId: 'betrayal-response',
      era: 'ancient',
      settingDescription: 'Your trusted advisor poisoned your reputation at court',
      characterTypes: ['advisor', 'scribe', 'servant'],
      safeChoicePhrasing: 'Offer mercy and a chance at redemption',
      riskyChoicePhrasing: 'Exile them and purge their influence',
      contextTemplate: 'Whispers in dark corners have done their damage.',
    },
    victorian: {
      skeletonId: 'betrayal-response',
      era: 'victorian',
      settingDescription: 'Your confidant shared your secrets with society',
      characterTypes: ['friend', 'servant', 'relation'],
      safeChoicePhrasing: 'Accept their apology and maintain appearances',
      riskyChoicePhrasing: 'Cut them completely and weather the scandal',
      contextTemplate: 'Private matters have become public entertainment.',
    },
    renaissance: {
      skeletonId: 'betrayal-response',
      era: 'renaissance',
      settingDescription: 'Your apprentice claimed your invention as their own',
      characterTypes: ['apprentice', 'student', 'assistant'],
      safeChoicePhrasing: 'Forgive their ambition and reclaim your credit quietly',
      riskyChoicePhrasing: 'Denounce them publicly and demand justice',
      contextTemplate: 'Your life\'s work bears another\'s name.',
    },
  },
  'comfortable-lie': {
    modern: {
      skeletonId: 'comfortable-lie',
      era: 'modern',
      settingDescription: 'Your spouse asks if you still love them',
      characterTypes: ['spouse', 'partner', 'lover'],
      safeChoicePhrasing: 'Tell them what they need to hear',
      riskyChoicePhrasing: 'Tell them the complicated truth',
      contextTemplate: 'Some questions have no comfortable answers.',
    },
    medieval: {
      skeletonId: 'comfortable-lie',
      era: 'medieval',
      settingDescription: 'The dying lord asks if their heir is ready to rule',
      characterTypes: ['lord', 'king', 'master'],
      safeChoicePhrasing: 'Assure them their legacy is secure',
      riskyChoicePhrasing: 'Speak truthfully of the heir\'s shortcomings',
      contextTemplate: 'The deathbed demands answers you may not want to give.',
    },
    future: {
      skeletonId: 'comfortable-lie',
      era: 'future',
      settingDescription: 'The colony asks if Earth survived the war',
      characterTypes: ['colonist', 'leader', 'citizens'],
      safeChoicePhrasing: 'Tell them hope still lives',
      riskyChoicePhrasing: 'Share the devastating truth',
      contextTemplate: 'Millions depend on your next words.',
    },
    ancient: {
      skeletonId: 'comfortable-lie',
      era: 'ancient',
      settingDescription: 'The oracle asks if their prophecy was true',
      characterTypes: ['oracle', 'priest', 'seer'],
      safeChoicePhrasing: 'Confirm their vision, preserving their faith',
      riskyChoicePhrasing: 'Reveal the prophecy was misinterpreted',
      contextTemplate: 'Faith and truth may not align.',
    },
    victorian: {
      skeletonId: 'comfortable-lie',
      era: 'victorian',
      settingDescription: 'Your family asks about your finances',
      characterTypes: ['family', 'relations', 'dependents'],
      safeChoicePhrasing: 'Maintain the facade of prosperity',
      riskyChoicePhrasing: 'Confess your mounting debts',
      contextTemplate: 'Reputation rests on comfortable illusions.',
    },
    renaissance: {
      skeletonId: 'comfortable-lie',
      era: 'renaissance',
      settingDescription: 'The patron asks if your masterpiece is original',
      characterTypes: ['patron', 'buyer', 'collector'],
      safeChoicePhrasing: 'Let them believe what they wish',
      riskyChoicePhrasing: 'Admit your inspiration came from another',
      contextTemplate: 'Art and authenticity are complicated bedfellows.',
    },
  },
  'leap-of-faith': {
    modern: {
      skeletonId: 'leap-of-faith',
      era: 'modern',
      settingDescription: 'A dream job offer requires moving across the world',
      characterTypes: ['recruiter', 'opportunity', 'calling'],
      safeChoicePhrasing: 'Stay where life is comfortable and known',
      riskyChoicePhrasing: 'Take the leap into the unknown',
      contextTemplate: 'Everything you\'ve built stands between you and your dream.',
    },
    medieval: {
      skeletonId: 'leap-of-faith',
      era: 'medieval',
      settingDescription: 'A crusade offers glory but certain danger',
      characterTypes: ['knight', 'warrior', 'believer'],
      safeChoicePhrasing: 'Remain home with family and land',
      riskyChoicePhrasing: 'Take up the cross and march into legend',
      contextTemplate: 'Faith calls, but so does hearth and home.',
    },
    future: {
      skeletonId: 'leap-of-faith',
      era: 'future',
      settingDescription: 'A one-way mission to a new world needs volunteers',
      characterTypes: ['explorer', 'pioneer', 'scientist'],
      safeChoicePhrasing: 'Stay on Earth, in the life you know',
      riskyChoicePhrasing: 'Board the ship and never look back',
      contextTemplate: 'The stars call, but you can never return.',
    },
    ancient: {
      skeletonId: 'leap-of-faith',
      era: 'ancient',
      settingDescription: 'A trading expedition to unknown lands promises fortune',
      characterTypes: ['merchant', 'explorer', 'sailor'],
      safeChoicePhrasing: 'Continue the profitable routes you know',
      riskyChoicePhrasing: 'Sail beyond the mapped world',
      contextTemplate: 'The edge of the map beckons.',
    },
    victorian: {
      skeletonId: 'leap-of-faith',
      era: 'victorian',
      settingDescription: 'An expedition to uncharted Africa seeks members',
      characterTypes: ['explorer', 'scientist', 'adventurer'],
      safeChoicePhrasing: 'Remain in civilized comfort',
      riskyChoicePhrasing: 'Join the expedition into the unknown',
      contextTemplate: 'The map has blank spaces that call your name.',
    },
    renaissance: {
      skeletonId: 'leap-of-faith',
      era: 'renaissance',
      settingDescription: 'A ship to the New World needs skilled hands',
      characterTypes: ['craftsman', 'sailor', 'dreamer'],
      safeChoicePhrasing: 'Stay in the old world you understand',
      riskyChoicePhrasing: 'Board the ship to a new beginning',
      contextTemplate: 'A new world exists, if you dare to seek it.',
    },
  },
  'loyalty-test': {
    modern: {
      skeletonId: 'loyalty-test',
      era: 'modern',
      settingDescription: 'Your struggling startup gets a job offer from a competitor',
      characterTypes: ['founder', 'employee', 'leader'],
      safeChoicePhrasing: 'Stay with your team through the hard times',
      riskyChoicePhrasing: 'Accept the offer and secure your future',
      contextTemplate: 'The ship is sinking, but these are your people.',
    },
    medieval: {
      skeletonId: 'loyalty-test',
      era: 'medieval',
      settingDescription: 'Your lord\'s war is lost, but a rival offers sanctuary',
      characterTypes: ['vassal', 'knight', 'retainer'],
      safeChoicePhrasing: 'Stand with your lord until the bitter end',
      riskyChoicePhrasing: 'Accept the rival\'s offer and live',
      contextTemplate: 'Loyalty unto death, or wisdom to survive.',
    },
    future: {
      skeletonId: 'loyalty-test',
      era: 'future',
      settingDescription: 'Your colony is failing, but another offers citizenship',
      characterTypes: ['colonist', 'citizen', 'settler'],
      safeChoicePhrasing: 'Stay and fight for your home',
      riskyChoicePhrasing: 'Emigrate to the thriving colony',
      contextTemplate: 'Home is where you make it, or where you leave it.',
    },
    ancient: {
      skeletonId: 'loyalty-test',
      era: 'ancient',
      settingDescription: 'Your tribe faces famine, but enemies offer food for service',
      characterTypes: ['warrior', 'hunter', 'elder'],
      safeChoicePhrasing: 'Share your tribe\'s fate, whatever comes',
      riskyChoicePhrasing: 'Accept enemy aid and obligation',
      contextTemplate: 'Survival and honor pull in opposite directions.',
    },
    victorian: {
      skeletonId: 'loyalty-test',
      era: 'victorian',
      settingDescription: 'Your failing business could be saved by betraying a partner',
      characterTypes: ['businessman', 'partner', 'associate'],
      safeChoicePhrasing: 'Go down with integrity intact',
      riskyChoicePhrasing: 'Save yourself at your partner\'s expense',
      contextTemplate: 'Ruin approaches, but so does temptation.',
    },
    renaissance: {
      skeletonId: 'loyalty-test',
      era: 'renaissance',
      settingDescription: 'Your guild faces decline, but a rival guild offers membership',
      characterTypes: ['craftsman', 'artisan', 'master'],
      safeChoicePhrasing: 'Remain loyal to your guild until the end',
      riskyChoicePhrasing: 'Join the rising guild and prosper',
      contextTemplate: 'Old bonds compete with new opportunities.',
    },
  },
};

// Generate default templates for skeletons not explicitly defined
const generateDefaultTemplate = (skeleton: Skeleton, era: Era): SkinTemplate => {
  const settings: Record<Era, string> = {
    modern: 'in the bustling city',
    medieval: 'in the castle halls',
    future: 'on the space station',
    ancient: 'in the ancient temple',
    victorian: 'in the grand manor',
    renaissance: 'in the artist\'s workshop',
  };

  return {
    skeletonId: skeleton.id,
    era,
    settingDescription: `A crucial moment arrives ${settings[era]}`,
    characterTypes: ['you', 'fate', 'circumstance'],
    safeChoicePhrasing: skeleton.choiceTemplate.safe.abstractOutcome,
    riskyChoicePhrasing: skeleton.choiceTemplate.risky.abstractOutcome,
    contextTemplate: skeleton.abstractDilemma,
  };
};

export class SkinGenerator {
  // Generate a scenario from a skeleton
  generateScenario(
    skeleton: Skeleton,
    life: Life,
    profile: ShadowProfile
  ): Scenario {
    const template = this.getTemplate(skeleton, life.era);

    const safeChoice: Choice = {
      id: uuidv4(),
      text: this.generateChoiceText(template.safeChoicePhrasing, life.era, 'safe'),
      riskLevel: 'safe',
      traitImpacts: skeleton.choiceTemplate.safe.traitImpacts,
      nextScenarioId: null,
      isLifeDefining: this.isLifeDefining(skeleton, life.currentAge),
    };

    const riskyChoice: Choice = {
      id: uuidv4(),
      text: this.generateChoiceText(template.riskyChoicePhrasing, life.era, 'risky'),
      riskLevel: 'risky',
      traitImpacts: skeleton.choiceTemplate.risky.traitImpacts,
      nextScenarioId: null,
      isLifeDefining: this.isLifeDefining(skeleton, life.currentAge),
    };

    // Sometimes add a moderate choice
    const choices: Choice[] = [safeChoice, riskyChoice];
    if (Math.random() > 0.5) {
      const moderateChoice: Choice = {
        id: uuidv4(),
        text: this.generateModerateChoiceText(template, life.era),
        riskLevel: 'moderate',
        traitImpacts: this.generateModerateImpacts(skeleton),
        nextScenarioId: null,
        isLifeDefining: false,
      };
      choices.splice(1, 0, moderateChoice);
    }

    return {
      id: uuidv4(),
      skeletonId: skeleton.id,
      narrativeText: this.generateNarrativeText(template, life),
      ageRange: this.getAgeRange(life.currentAge),
      choices,
      era: life.era,
    };
  }

  // Get template for skeleton and era
  private getTemplate(skeleton: Skeleton, era: Era): SkinTemplate {
    const skeletonTemplates = skinTemplates[skeleton.id];
    if (skeletonTemplates && skeletonTemplates[era]) {
      return skeletonTemplates[era];
    }
    return generateDefaultTemplate(skeleton, era);
  }

  // Generate choice text within 80 character limit
  generateChoiceText(
    abstractChoice: string,
    era: Era,
    riskLevel: 'safe' | 'risky'
  ): string {
    // Ensure text is under 80 characters
    if (abstractChoice.length <= 80) {
      return abstractChoice;
    }
    return abstractChoice.substring(0, 77) + '...';
  }

  // Generate narrative text for the scenario
  private generateNarrativeText(template: SkinTemplate, life: Life): string {
    const ageDescriptors: Record<number, string> = {
      18: 'young and uncertain',
      25: 'finding your way',
      35: 'in the prime of life',
      45: 'at a crossroads',
      55: 'with wisdom earned',
      65: 'in your twilight years',
      75: 'with time running short',
    };

    const ageKey = Math.floor(life.currentAge / 10) * 10;
    const ageDesc = ageDescriptors[Math.min(ageKey, 75)] || 'at this moment';

    return `${template.settingDescription}. ${template.contextTemplate} At ${life.currentAge}, ${ageDesc}, you must decide.`;
  }

  // Generate moderate choice text
  private generateModerateChoiceText(template: SkinTemplate, era: Era): string {
    return 'Seek a middle path between extremes';
  }

  // Generate moderate trait impacts (averaged between safe and risky)
  private generateModerateImpacts(skeleton: Skeleton): Record<string, number> {
    const safeImpacts = skeleton.choiceTemplate.safe.traitImpacts;
    const riskyImpacts = skeleton.choiceTemplate.risky.traitImpacts;
    const moderate: Record<string, number> = {};

    const allTraits = new Set([
      ...Object.keys(safeImpacts),
      ...Object.keys(riskyImpacts),
    ]);

    allTraits.forEach((trait) => {
      const safeValue = (safeImpacts as Record<string, number>)[trait] || 0;
      const riskyValue = (riskyImpacts as Record<string, number>)[trait] || 0;
      moderate[trait] = Math.round((safeValue + riskyValue) / 2);
    });

    return moderate;
  }

  // Determine if a choice is life-defining based on skeleton and age
  private isLifeDefining(skeleton: Skeleton, age: number): boolean {
    // Certain skeletons are always life-defining
    const alwaysLifeDefining = [
      'leap-of-faith',
      'final-stand',
      'betrayal-response',
      'golden-handcuffs',
    ];

    if (alwaysLifeDefining.includes(skeleton.id)) {
      return true;
    }

    // Choices become more life-defining at key ages
    const keyAges = [25, 30, 40, 50, 60];
    if (keyAges.some((keyAge) => Math.abs(age - keyAge) <= 2)) {
      return Math.random() > 0.5;
    }

    return Math.random() > 0.8;
  }

  // Get appropriate age range for current age
  private getAgeRange(currentAge: number): [number, number] {
    return [currentAge - 2, currentAge + 5];
  }
}

export default SkinGenerator;
