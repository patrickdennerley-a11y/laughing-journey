// PARALLEL - Death Summary Templates
// Poignant single-sentence summaries for different types of deaths

import { DeathCategory } from '../types';

export const deathSummaries: Record<DeathCategory, string[]> = {
  peaceful: [
    'In the end, you closed your eyes in a warm bed, surrounded by the quiet hum of a life well-lived.',
    'The {era} sun set on your final day as gently as it had risen on your first.',
    "At {age}, you slipped away in sleep, dreaming of choices you'd make exactly the same way.",
    'Your last breath came easy, carrying with it the satisfaction of paths well-chosen.',
    'The world you left at {age} was slightly better for your having passed through it.',
    'They found you smiling - as if death was just another threshold you were ready to cross.',
    'In the {era} tradition, you departed with dignity, your story complete.',
    'Your final sunset was unremarkable, which is to say: perfect.',
    'At {age}, surrounded by evidence of your choices, you let go without struggle.',
    'The end came softly, a period at the end of a sentence you had written well.',
  ],

  tragic: [
    'The risk you took at {age} was your last - some doors, once opened, cannot be closed.',
    'In the {era} world, bold choices carry bold consequences, and yours finally caught up.',
    'They said you flew too close to the sun, but you knew that was always the plan.',
    'Your final gamble did not pay off, but even in losing, you played the game your way.',
    "The {era} streets claimed another dreamer who reached too far - you wouldn't have it any other way.",
    'At {age}, the universe collected on the debt your courage had been accumulating.',
    'You died as you lived: refusing to take the safe path, even when it cost everything.',
    'The risk was calculated, but you were never very good at math - and never wanted to be.',
    'In another timeline, the gamble paid off; in this one, it became your epitaph.',
    'Your ending was written the moment you chose to reach for more than was offered.',
  ],

  heroic: [
    'You gave everything for someone else, and in the {era} world, that kind of sacrifice is remembered.',
    'At {age}, you discovered that some things are worth dying for - and acted accordingly.',
    'They will tell stories of what you did in your final moments for generations.',
    'The sacrifice you made at {age} saved others - your ending was their beginning.',
    'In the {era} tradition, you became a legend: the one who gave all for others.',
    'Your final act of selflessness proved what you had always suspected about yourself.',
    'They called you a hero, but you just called it the only choice that made sense.',
    'At {age}, you discovered that the greatest risk is often giving yourself away.',
    'Your death gave others life - a trade you made without hesitation.',
    'In the end, you were not remembered for what you kept, but for what you gave.',
  ],

  lonely: [
    'The {era} world moved on without you long before you stopped breathing at {age}.',
    'You had burned so many bridges that when you finally fell, no one was there to catch you.',
    'At {age}, you realized too late that freedom and isolation are separated by a thin line.',
    'They found you alone, surrounded by the empty spaces where connections might have been.',
    'Your independence was absolute, even at the end - especially at the end.',
    'The price of always leaving is dying with no one left to mourn you.',
    'In the {era} world, lone wolves die alone - you had known this, and chosen it anyway.',
    'At {age}, the silence around you was deafening, a monument to every relationship you had severed.',
    'You died as you lived: needing no one, wanted by no one, remembered by fewer.',
    'The ending you engineered through a lifetime of departures arrived exactly as designed.',
  ],

  fulfilled: [
    'At {age}, you had become exactly who you set out to be - and that is the rarest death of all.',
    'The {era} world witnessed something unusual: a person who got what they wanted and recognized it.',
    'Your final moments were spent in the satisfaction of roads taken and destinations reached.',
    'At {age}, you could account for every choice and would not change a single one.',
    'They asked if you had regrets; you could not think of any worth mentioning.',
    'The life you built through countless choices stood complete at {age}, exactly as designed.',
    'In the {era} world, few die having achieved their dreams - you were one of the few.',
    'Your ending was less a death and more a graduation: the final test passed.',
    'At {age}, looking back at the tapestry of your choices, you saw it was good.',
    'You died rich in the only currency that matters: a life aligned with your values.',
  ],

  regretful: [
    'In the end, it was not the risks you took but the ones you avoided that haunted you.',
    'At {age}, the ghosts of paths not taken gathered around your bed, whispering of what might have been.',
    'The {era} world forgot your name because you never gave it a reason to remember.',
    "Your final thought was of the safe choice you'd made at {age} - and whether it was worth it.",
    'They said you lived a good life, but you knew every cautious compromise it had cost.',
    'At {age}, you realized too late that the biggest risk was taking no risks at all.',
    'The comfort you had chosen so consistently became the prison you died in.',
    'In the {era} world, they buried you with honors you had never earned by playing it safe.',
    'Your epitaph could have been so much more - but you never let it be.',
    'At {age}, the weight of unlived lives finally proved too heavy to carry.',
  ],
};

// Helper function to get a random summary from a category
export const getDeathSummary = (
  category: DeathCategory,
  era: string,
  age: number,
  lastChoice?: string
): string => {
  const templates = deathSummaries[category];
  const template = templates[Math.floor(Math.random() * templates.length)];

  return template
    .replace(/{era}/g, era)
    .replace(/{age}/g, age.toString())
    .replace(/{lastChoice}/g, lastChoice || 'your final decision');
};

// Determine death category based on life stats
export const determineDeathCategory = (
  satisfactionScore: number,
  regretScore: number,
  lastChoiceWasRisky: boolean,
  wasSacrifice: boolean,
  socialIsolation: number, // 0-100
  age: number
): DeathCategory => {
  // Heroic deaths trump other categories
  if (wasSacrifice) {
    return 'heroic';
  }

  // Tragic deaths from risky choices
  if (lastChoiceWasRisky && age < 70) {
    return 'tragic';
  }

  // Lonely deaths from isolation
  if (socialIsolation > 70) {
    return 'lonely';
  }

  // Fulfilled vs regretful based on scores
  if (satisfactionScore > 70 && regretScore < 30) {
    return 'fulfilled';
  }

  if (regretScore > 70) {
    return 'regretful';
  }

  // Default to peaceful
  return 'peaceful';
};

export default deathSummaries;
