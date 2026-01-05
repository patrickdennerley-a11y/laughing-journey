// PARALLEL - Skeleton Library
// 25 abstract life dilemmas that can be "skinned" into any era

import { Skeleton } from '../types';

export const skeletons: Skeleton[] = [
  // 1. The Golden Handcuffs
  {
    id: 'golden-handcuffs',
    name: 'The Golden Handcuffs',
    abstractDilemma: 'High immediate reward vs long-term freedom',
    primaryTrait: 'ambitionVsContentment',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Accept security at the cost of autonomy',
        traitImpacts: { ambitionVsContentment: -5, riskTolerance: -3 },
        satisfactionModifier: 10,
        regretModifier: 15,
      },
      risky: {
        abstractOutcome: 'Reject comfort for uncertain freedom',
        traitImpacts: { ambitionVsContentment: 5, riskTolerance: 5 },
        satisfactionModifier: -5,
        regretModifier: -10,
      },
    },
  },

  // 2. The Betrayal Response
  {
    id: 'betrayal-response',
    name: 'The Betrayal Response',
    abstractDilemma: 'Forgive and rebuild vs cut ties completely',
    primaryTrait: 'forgivenessVsJustice',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Forgive the betrayer and try to rebuild trust',
        traitImpacts: { forgivenessVsJustice: 8, loyaltyVsFreedom: 5 },
        satisfactionModifier: 5,
        regretModifier: 10,
      },
      risky: {
        abstractOutcome: 'Cut all ties and seek justice or revenge',
        traitImpacts: { forgivenessVsJustice: -8, loyaltyVsFreedom: -3 },
        satisfactionModifier: 0,
        regretModifier: 5,
      },
    },
  },

  // 3. The Comfortable Lie
  {
    id: 'comfortable-lie',
    name: 'The Comfortable Lie',
    abstractDilemma: 'Maintain peace through deception vs painful truth',
    primaryTrait: 'truthVsPeace',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Keep the lie to preserve harmony',
        traitImpacts: { truthVsPeace: -8, selfVsOthers: -3 },
        satisfactionModifier: 5,
        regretModifier: 20,
      },
      risky: {
        abstractOutcome: 'Reveal the truth regardless of consequences',
        traitImpacts: { truthVsPeace: 8, selfVsOthers: 3 },
        satisfactionModifier: -10,
        regretModifier: -5,
      },
    },
  },

  // 4. The Leap of Faith
  {
    id: 'leap-of-faith',
    name: 'The Leap of Faith',
    abstractDilemma: 'Abandon security for passion vs stay safe',
    primaryTrait: 'riskTolerance',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Stay in the secure but unfulfilling situation',
        traitImpacts: { riskTolerance: -7, ambitionVsContentment: -5 },
        satisfactionModifier: 5,
        regretModifier: 25,
      },
      risky: {
        abstractOutcome: 'Take the leap into the unknown',
        traitImpacts: { riskTolerance: 7, ambitionVsContentment: 5 },
        satisfactionModifier: -5,
        regretModifier: -15,
      },
    },
  },

  // 5. The Loyalty Test
  {
    id: 'loyalty-test',
    name: 'The Loyalty Test',
    abstractDilemma: 'Stay with failing group vs pursue better opportunity',
    primaryTrait: 'loyaltyVsFreedom',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Remain loyal despite the sinking ship',
        traitImpacts: { loyaltyVsFreedom: 8, selfVsOthers: -5 },
        satisfactionModifier: -5,
        regretModifier: 15,
      },
      risky: {
        abstractOutcome: 'Leave for better prospects elsewhere',
        traitImpacts: { loyaltyVsFreedom: -8, selfVsOthers: 5 },
        satisfactionModifier: 10,
        regretModifier: 5,
      },
    },
  },

  // 6. The Sacrifice Play
  {
    id: 'sacrifice-play',
    name: 'The Sacrifice Play',
    abstractDilemma: 'Personal gain vs helping others at cost',
    primaryTrait: 'selfVsOthers',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Prioritize personal benefit',
        traitImpacts: { selfVsOthers: 8, forgivenessVsJustice: -2 },
        satisfactionModifier: 10,
        regretModifier: 15,
      },
      risky: {
        abstractOutcome: 'Sacrifice personal gain for others',
        traitImpacts: { selfVsOthers: -8, forgivenessVsJustice: 3 },
        satisfactionModifier: 5,
        regretModifier: -10,
      },
    },
  },

  // 7. The Timing Gamble
  {
    id: 'timing-gamble',
    name: 'The Timing Gamble',
    abstractDilemma: 'Act now imperfectly vs wait for perfect moment',
    primaryTrait: 'spontaneityVsPlanning',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Wait for the right moment',
        traitImpacts: { spontaneityVsPlanning: -7, riskTolerance: -3 },
        satisfactionModifier: 0,
        regretModifier: 20,
      },
      risky: {
        abstractOutcome: 'Act now despite imperfect conditions',
        traitImpacts: { spontaneityVsPlanning: 7, riskTolerance: 4 },
        satisfactionModifier: 5,
        regretModifier: -5,
      },
    },
  },

  // 8. The Sunk Cost
  {
    id: 'sunk-cost',
    name: 'The Sunk Cost',
    abstractDilemma: 'Continue failing path vs admit mistake and restart',
    primaryTrait: 'ambitionVsContentment',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Continue down the familiar path',
        traitImpacts: { ambitionVsContentment: -3, riskTolerance: -5, truthVsPeace: -4 },
        satisfactionModifier: -5,
        regretModifier: 25,
      },
      risky: {
        abstractOutcome: 'Cut losses and start fresh',
        traitImpacts: { ambitionVsContentment: 3, riskTolerance: 5, truthVsPeace: 4 },
        satisfactionModifier: 0,
        regretModifier: -10,
      },
    },
  },

  // 9. The Authority Challenge
  {
    id: 'authority-challenge',
    name: 'The Authority Challenge',
    abstractDilemma: 'Obey unjust rule vs rebel with consequences',
    primaryTrait: 'riskTolerance',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Comply with authority despite disagreement',
        traitImpacts: { riskTolerance: -6, loyaltyVsFreedom: 4, truthVsPeace: -4 },
        satisfactionModifier: 5,
        regretModifier: 20,
      },
      risky: {
        abstractOutcome: 'Stand against authority and face consequences',
        traitImpacts: { riskTolerance: 6, loyaltyVsFreedom: -4, truthVsPeace: 5 },
        satisfactionModifier: -5,
        regretModifier: -15,
      },
    },
  },

  // 10. The Love Triangle
  {
    id: 'love-triangle',
    name: 'The Love Triangle',
    abstractDilemma: 'Safe partner vs exciting but unstable connection',
    primaryTrait: 'riskTolerance',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Choose stability and predictable affection',
        traitImpacts: { riskTolerance: -6, spontaneityVsPlanning: -4 },
        satisfactionModifier: 10,
        regretModifier: 15,
      },
      risky: {
        abstractOutcome: 'Choose passion despite uncertainty',
        traitImpacts: { riskTolerance: 6, spontaneityVsPlanning: 5 },
        satisfactionModifier: 0,
        regretModifier: 5,
      },
    },
  },

  // 11. The Whistleblower
  {
    id: 'whistleblower',
    name: 'The Whistleblower',
    abstractDilemma: 'Expose wrongdoing at personal risk vs stay silent',
    primaryTrait: 'truthVsPeace',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Keep quiet and protect yourself',
        traitImpacts: { truthVsPeace: -7, selfVsOthers: 6, riskTolerance: -4 },
        satisfactionModifier: 5,
        regretModifier: 25,
      },
      risky: {
        abstractOutcome: 'Expose the truth despite personal cost',
        traitImpacts: { truthVsPeace: 7, selfVsOthers: -6, riskTolerance: 5 },
        satisfactionModifier: -10,
        regretModifier: -20,
      },
    },
  },

  // 12. The Family Obligation
  {
    id: 'family-obligation',
    name: 'The Family Obligation',
    abstractDilemma: 'Honor family expectations vs pursue personal dreams',
    primaryTrait: 'loyaltyVsFreedom',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Follow family wishes and tradition',
        traitImpacts: { loyaltyVsFreedom: 7, selfVsOthers: -5, ambitionVsContentment: -4 },
        satisfactionModifier: 5,
        regretModifier: 20,
      },
      risky: {
        abstractOutcome: 'Break from family to follow your path',
        traitImpacts: { loyaltyVsFreedom: -7, selfVsOthers: 5, ambitionVsContentment: 5 },
        satisfactionModifier: 0,
        regretModifier: 10,
      },
    },
  },

  // 13. The Second Chance
  {
    id: 'second-chance',
    name: 'The Second Chance',
    abstractDilemma: 'Give someone who failed you another opportunity',
    primaryTrait: 'forgivenessVsJustice',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Offer forgiveness and another chance',
        traitImpacts: { forgivenessVsJustice: 7, riskTolerance: 3 },
        satisfactionModifier: 5,
        regretModifier: 10,
      },
      risky: {
        abstractOutcome: 'Hold firm and demand consequences',
        traitImpacts: { forgivenessVsJustice: -7, riskTolerance: -2 },
        satisfactionModifier: 0,
        regretModifier: 5,
      },
    },
  },

  // 14. The Career Crossroads
  {
    id: 'career-crossroads',
    name: 'The Career Crossroads',
    abstractDilemma: 'Stable career vs risky passion project',
    primaryTrait: 'ambitionVsContentment',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Stay on the established career path',
        traitImpacts: { ambitionVsContentment: -6, riskTolerance: -5 },
        satisfactionModifier: 10,
        regretModifier: 20,
      },
      risky: {
        abstractOutcome: 'Pursue the uncertain passion',
        traitImpacts: { ambitionVsContentment: 6, riskTolerance: 6 },
        satisfactionModifier: -5,
        regretModifier: -10,
      },
    },
  },

  // 15. The Inheritance Dilemma
  {
    id: 'inheritance-dilemma',
    name: 'The Inheritance Dilemma',
    abstractDilemma: 'Accept tainted wealth vs maintain moral high ground',
    primaryTrait: 'selfVsOthers',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Accept the wealth despite its origins',
        traitImpacts: { selfVsOthers: 6, truthVsPeace: -4 },
        satisfactionModifier: 15,
        regretModifier: 15,
      },
      risky: {
        abstractOutcome: 'Reject the wealth on principle',
        traitImpacts: { selfVsOthers: -6, truthVsPeace: 5 },
        satisfactionModifier: -10,
        regretModifier: -5,
      },
    },
  },

  // 16. The Broken Promise
  {
    id: 'broken-promise',
    name: 'The Broken Promise',
    abstractDilemma: 'Keep an outdated promise vs break it for better outcome',
    primaryTrait: 'loyaltyVsFreedom',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Honor the promise no matter what',
        traitImpacts: { loyaltyVsFreedom: 6, spontaneityVsPlanning: -4 },
        satisfactionModifier: 5,
        regretModifier: 15,
      },
      risky: {
        abstractOutcome: 'Break the promise for a better outcome',
        traitImpacts: { loyaltyVsFreedom: -6, spontaneityVsPlanning: 4 },
        satisfactionModifier: 5,
        regretModifier: 10,
      },
    },
  },

  // 17. The Health Gamble
  {
    id: 'health-gamble',
    name: 'The Health Gamble',
    abstractDilemma: 'Safe treatment with limited effect vs risky experimental cure',
    primaryTrait: 'riskTolerance',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Choose the proven but limited treatment',
        traitImpacts: { riskTolerance: -8, spontaneityVsPlanning: -4 },
        satisfactionModifier: 5,
        regretModifier: 15,
      },
      risky: {
        abstractOutcome: 'Risk everything on the experimental option',
        traitImpacts: { riskTolerance: 8, spontaneityVsPlanning: 5 },
        satisfactionModifier: -10,
        regretModifier: -20,
      },
    },
  },

  // 18. The Mentor's Shadow
  {
    id: 'mentors-shadow',
    name: "The Mentor's Shadow",
    abstractDilemma: 'Follow trusted advisor vs forge your own path',
    primaryTrait: 'loyaltyVsFreedom',
    choiceTemplate: {
      safe: {
        abstractOutcome: "Follow the mentor's guidance",
        traitImpacts: { loyaltyVsFreedom: 6, ambitionVsContentment: -3 },
        satisfactionModifier: 5,
        regretModifier: 10,
      },
      risky: {
        abstractOutcome: "Reject the mentor's path for your own",
        traitImpacts: { loyaltyVsFreedom: -6, ambitionVsContentment: 5 },
        satisfactionModifier: 0,
        regretModifier: 5,
      },
    },
  },

  // 19. The Public Shame
  {
    id: 'public-shame',
    name: 'The Public Shame',
    abstractDilemma: 'Admit fault publicly vs maintain facade',
    primaryTrait: 'truthVsPeace',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Maintain your public image at all costs',
        traitImpacts: { truthVsPeace: -7, selfVsOthers: 5 },
        satisfactionModifier: 10,
        regretModifier: 20,
      },
      risky: {
        abstractOutcome: 'Confess publicly and accept shame',
        traitImpacts: { truthVsPeace: 7, selfVsOthers: -4 },
        satisfactionModifier: -15,
        regretModifier: -10,
      },
    },
  },

  // 20. The Resource Allocation
  {
    id: 'resource-allocation',
    name: 'The Resource Allocation',
    abstractDilemma: 'Invest in yourself vs support those who depend on you',
    primaryTrait: 'selfVsOthers',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Put others first as always',
        traitImpacts: { selfVsOthers: -7, ambitionVsContentment: -4 },
        satisfactionModifier: 5,
        regretModifier: 15,
      },
      risky: {
        abstractOutcome: 'Invest in your own growth for once',
        traitImpacts: { selfVsOthers: 7, ambitionVsContentment: 5 },
        satisfactionModifier: 0,
        regretModifier: 5,
      },
    },
  },

  // 21. The Opportunity Cost
  {
    id: 'opportunity-cost',
    name: 'The Opportunity Cost',
    abstractDilemma: 'Seize rare opportunity vs honor existing commitments',
    primaryTrait: 'spontaneityVsPlanning',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Honor your existing commitments',
        traitImpacts: { spontaneityVsPlanning: -6, loyaltyVsFreedom: 5 },
        satisfactionModifier: 5,
        regretModifier: 20,
      },
      risky: {
        abstractOutcome: 'Seize the unexpected opportunity',
        traitImpacts: { spontaneityVsPlanning: 6, loyaltyVsFreedom: -4 },
        satisfactionModifier: 5,
        regretModifier: 5,
      },
    },
  },

  // 22. The Guilty Knowledge
  {
    id: 'guilty-knowledge',
    name: 'The Guilty Knowledge',
    abstractDilemma: "Share damaging truth about someone vs protect them",
    primaryTrait: 'truthVsPeace',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Keep their secret safe',
        traitImpacts: { truthVsPeace: -6, forgivenessVsJustice: 4 },
        satisfactionModifier: 5,
        regretModifier: 15,
      },
      risky: {
        abstractOutcome: 'Reveal what you know',
        traitImpacts: { truthVsPeace: 6, forgivenessVsJustice: -5 },
        satisfactionModifier: -5,
        regretModifier: 5,
      },
    },
  },

  // 23. The Power Vacuum
  {
    id: 'power-vacuum',
    name: 'The Power Vacuum',
    abstractDilemma: 'Seize power in chaos vs support established order',
    primaryTrait: 'ambitionVsContentment',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Support the restoration of order',
        traitImpacts: { ambitionVsContentment: -6, loyaltyVsFreedom: 5, riskTolerance: -4 },
        satisfactionModifier: 5,
        regretModifier: 15,
      },
      risky: {
        abstractOutcome: 'Seize the moment for yourself',
        traitImpacts: { ambitionVsContentment: 7, loyaltyVsFreedom: -4, riskTolerance: 6 },
        satisfactionModifier: 0,
        regretModifier: 10,
      },
    },
  },

  // 24. The Uncertain Alliance
  {
    id: 'uncertain-alliance',
    name: 'The Uncertain Alliance',
    abstractDilemma: 'Trust a former enemy for mutual benefit vs go it alone',
    primaryTrait: 'forgivenessVsJustice',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Accept the alliance despite history',
        traitImpacts: { forgivenessVsJustice: 6, riskTolerance: 4 },
        satisfactionModifier: 5,
        regretModifier: 10,
      },
      risky: {
        abstractOutcome: 'Refuse to trust and face challenges alone',
        traitImpacts: { forgivenessVsJustice: -6, riskTolerance: -3 },
        satisfactionModifier: 0,
        regretModifier: 15,
      },
    },
  },

  // 25. The Final Stand
  {
    id: 'final-stand',
    name: 'The Final Stand',
    abstractDilemma: 'Die fighting for beliefs vs survive by compromise',
    primaryTrait: 'riskTolerance',
    choiceTemplate: {
      safe: {
        abstractOutcome: 'Compromise to survive another day',
        traitImpacts: { riskTolerance: -8, truthVsPeace: -5, ambitionVsContentment: -4 },
        satisfactionModifier: 10,
        regretModifier: 25,
      },
      risky: {
        abstractOutcome: 'Stand firm regardless of cost',
        traitImpacts: { riskTolerance: 8, truthVsPeace: 6, ambitionVsContentment: 5 },
        satisfactionModifier: -15,
        regretModifier: -20,
      },
    },
  },
];

export default skeletons;
