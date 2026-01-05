// PARALLEL - Archetype Definitions
// 20 psychological profile archetypes unlocked through consistent behavior

import { Archetype, ShadowProfile } from '../types';

export const archetypes: Archetype[] = [
  // 1. The Comfortable Liar
  {
    id: 'comfortable-liar',
    name: 'The Comfortable Liar',
    description:
      'You choose peace over truth with remarkable consistency. The comfortable lies roll off your tongue because you believe they serve a greater harmony - even when they trap you in webs of your own making.',
    icon: '🎭',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.truthVsPeace < 30 && profile.totalLivesPlayed >= 10,
    rarity: 'uncommon',
  },

  // 2. The Icarus
  {
    id: 'icarus',
    name: 'The Icarus',
    description:
      'Success intoxicates you. When things go well, you immediately reach for more, pushing higher until the inevitable fall. You live for the climb, even knowing how it ends.',
    icon: '☀️',
    unlockCondition: (profile: ShadowProfile) => {
      // Check for pattern of high risk after success
      const history = profile.choiceHistory;
      let successStreak = 0;
      let icariusPattern = 0;

      for (let i = 1; i < history.length; i++) {
        const prev = history[i - 1];
        const curr = history[i];
        if (prev.riskLevel === 'risky' && curr.riskLevel === 'risky') {
          successStreak++;
          if (successStreak >= 3) icariusPattern++;
        } else {
          successStreak = 0;
        }
      }
      return icariusPattern >= 5 && profile.totalLivesPlayed >= 5;
    },
    rarity: 'rare',
  },

  // 3. The Late Bloomer
  {
    id: 'late-bloomer',
    name: 'The Late Bloomer',
    description:
      "Your lives follow a pattern: quiet beginnings, cautious middles, and explosive endings. You consistently find your stride only when others would consider it too late. Perhaps you've learned that timing is an illusion.",
    icon: '🌸',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.spontaneityVsPlanning < 40 &&
      profile.traits.riskTolerance > 60 &&
      profile.totalLivesPlayed >= 8,
    rarity: 'rare',
  },

  // 4. The Loyal Fool
  {
    id: 'loyal-fool',
    name: 'The Loyal Fool',
    description:
      'Your loyalty persists even when logic screams to leave. You see abandonment as betrayal, even of those who betray you. There is nobility in your steadfastness - and perhaps a touch of blindness.',
    icon: '🐕',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.loyaltyVsFreedom > 85 && profile.totalLivesPlayed >= 10,
    rarity: 'uncommon',
  },

  // 5. The Cold Calculator
  {
    id: 'cold-calculator',
    name: 'The Cold Calculator',
    description:
      'You optimize for outcomes with surgical precision. Sentiment rarely clouds your judgment - you know the cost of every choice and consistently choose the mathematically superior option, regardless of who pays.',
    icon: '🧮',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.selfVsOthers > 80 &&
      profile.totalLivesPlayed >= 10,
    rarity: 'uncommon',
  },

  // 6. The Bridge Burner
  {
    id: 'bridge-burner',
    name: 'The Bridge Burner',
    description:
      'Forgiveness is not in your vocabulary. When wronged, you respond with finality - relationships end, not pause. You leave behind a trail of closed doors and have never once looked back.',
    icon: '🔥',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.forgivenessVsJustice < 20 && profile.totalLivesPlayed >= 12,
    rarity: 'uncommon',
  },

  // 7. The Wanderer
  {
    id: 'wanderer',
    name: 'The Wanderer',
    description:
      'Roots are for trees. You move through life like water, never staying long enough to be held. Every bond is temporary, every home a waystation. Freedom is your only constant.',
    icon: '🌊',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.loyaltyVsFreedom < 25 && profile.totalLivesPlayed >= 15,
    rarity: 'uncommon',
  },

  // 8. The Gambler's Heart
  {
    id: 'gamblers-heart',
    name: "The Gambler's Heart",
    description:
      'The safe choice bores you. Risk is not just tolerated - it is sought, craved, required. Life without danger feels like a slow death, so you ensure there is always something on the line.',
    icon: '🎲',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.riskTolerance > 90 && profile.totalLivesPlayed >= 8,
    rarity: 'rare',
  },

  // 9. The Safe Harbor
  {
    id: 'safe-harbor',
    name: 'The Safe Harbor',
    description:
      'Security is your sanctuary. You build walls against uncertainty and choose the known over the possible. Your lives are longer but narrower - and you have made peace with that trade.',
    icon: '⚓',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.riskTolerance < 15 && profile.totalLivesPlayed >= 10,
    rarity: 'uncommon',
  },

  // 10. The Truth Seeker
  {
    id: 'truth-seeker',
    name: 'The Truth Seeker',
    description:
      'Lies are intolerable, even kind ones. You chase honesty like others chase wealth, willing to pay any price for authentic understanding. The truth will set you free - even when it first destroys everything.',
    icon: '🔍',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.truthVsPeace > 85 && profile.totalLivesPlayed >= 10,
    rarity: 'uncommon',
  },

  // 11. The Eternal Optimist
  {
    id: 'eternal-optimist',
    name: 'The Eternal Optimist',
    description:
      'Despite evidence, despite history, despite reason - you believe things will work out. Your second chances have second chances. Some call it naive; you call it the only way to live.',
    icon: '🌈',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.forgivenessVsJustice > 80 &&
      profile.traits.riskTolerance > 60 &&
      profile.totalLivesPlayed >= 12,
    rarity: 'rare',
  },

  // 12. The Martyr
  {
    id: 'martyr',
    name: 'The Martyr',
    description:
      'You give until empty, then give more. Self-sacrifice is not a choice but an identity. Others benefit from your burning, and somewhere deep down, you find meaning in the ash.',
    icon: '✝️',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.selfVsOthers < 20 && profile.totalLivesPlayed >= 15,
    rarity: 'rare',
  },

  // 13. The Contrarian
  {
    id: 'contrarian',
    name: 'The Contrarian',
    description:
      'When authority says go right, you go left. Rules exist to be questioned, expectations to be defied. You may not always be right, but you are always authentically wrong on your own terms.',
    icon: '↩️',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.loyaltyVsFreedom < 30 &&
      profile.traits.riskTolerance > 70 &&
      profile.totalLivesPlayed >= 10,
    rarity: 'uncommon',
  },

  // 14. The Perfectionist's Paralysis
  {
    id: 'perfectionist-paralysis',
    name: "The Perfectionist's Paralysis",
    description:
      'You wait for conditions that never come. The perfect moment remains always just ahead, and opportunities pass while you prepare. Your caution is your cage.',
    icon: '⏳',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.spontaneityVsPlanning < 20 &&
      profile.traits.riskTolerance < 30 &&
      profile.totalLivesPlayed >= 12,
    rarity: 'rare',
  },

  // 15. The Phoenix
  {
    id: 'phoenix',
    name: 'The Phoenix',
    description:
      'Endings are beginnings. You cut ties, burn boats, and start fresh with alarming regularity. The sunk cost fallacy holds no power over you - when something fails, you walk away and rebuild.',
    icon: '🔥',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.loyaltyVsFreedom < 35 &&
      profile.traits.riskTolerance > 65 &&
      profile.traits.ambitionVsContentment > 60 &&
      profile.totalLivesPlayed >= 15,
    rarity: 'legendary',
  },

  // 16. The Dutiful Son
  {
    id: 'dutiful-son',
    name: 'The Dutiful Son',
    description:
      'Obligation shapes your choices more than desire. You honor commitments, meet expectations, fulfill duties - and quietly wonder what your life would look like if you had ever said no.',
    icon: '📜',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.loyaltyVsFreedom > 75 &&
      profile.traits.selfVsOthers < 35 &&
      profile.totalLivesPlayed >= 10,
    rarity: 'uncommon',
  },

  // 17. The Wild Card
  {
    id: 'wild-card',
    name: 'The Wild Card',
    description:
      'Predictability is death. You zigzag through life, choosing chaos over pattern, surprise over expectation. Even you do not know what you will do next - and that is exactly how you like it.',
    icon: '🃏',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.spontaneityVsPlanning > 85 &&
      profile.traits.riskTolerance > 70 &&
      profile.totalLivesPlayed >= 12,
    rarity: 'rare',
  },

  // 18. The Hollow Victor
  {
    id: 'hollow-victor',
    name: 'The Hollow Victor',
    description:
      'You win but never feel it. Achievement leads to emptiness, success to the question "is this all?" You collect victories like others collect regrets, and find them equally unsatisfying.',
    icon: '🏆',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.ambitionVsContentment > 80 &&
      profile.traits.selfVsOthers > 60 &&
      profile.totalLivesPlayed >= 15,
    rarity: 'rare',
  },

  // 19. The Keeper of Secrets
  {
    id: 'keeper-of-secrets',
    name: 'The Keeper of Secrets',
    description:
      'You carry truths that could shatter worlds, and choose silence every time. Information is sacred, discretion absolute. Some call it loyalty; others call it complicity.',
    icon: '🤫',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.truthVsPeace < 35 &&
      profile.traits.loyaltyVsFreedom > 65 &&
      profile.totalLivesPlayed >= 12,
    rarity: 'uncommon',
  },

  // 20. The Absolver
  {
    id: 'absolver',
    name: 'The Absolver',
    description:
      'Forgiveness flows from you like water. Betrayal, cruelty, negligence - all can be washed clean in your presence. You have been called a saint and a fool in equal measure, and answered both with the same serene smile.',
    icon: '🕊️',
    unlockCondition: (profile: ShadowProfile) =>
      profile.traits.forgivenessVsJustice > 90 &&
      profile.traits.selfVsOthers < 40 &&
      profile.totalLivesPlayed >= 15,
    rarity: 'legendary',
  },
];

export default archetypes;
