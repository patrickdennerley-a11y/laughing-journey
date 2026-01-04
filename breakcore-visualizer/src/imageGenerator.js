/**
 * Generates 2000 unique image URLs for the breakcore visualizer
 * Uses loremflickr with cache-busting parameters
 */

const KEYWORDS = [
  'markov chain state transition diagram',
  'stochastic matrix rows and columns',
  'random walk jagged path graph',
  'brownian motion particle diffusion',
  'poisson process timeline dots',
  'exponential distribution decay curve',
  'queueing theory waiting line',
  'gamma distribution density plot',
  'martingale stock market chart',
  'gamblers ruin probability tree',
  'galton watson branching process',
  'population extinction graph',
  'normal distribution bell curve',
  'ito calculus stochastic integral',
  'geometric brownian motion finance',
  'mean reverting ornstein uhlenbeck',
  'chapman kolmogorov equation',
  'recurrence and transience states',
  'random variable filtration concept',
  'law of large numbers limit',
  'conditional expectation formula',
  'stationary distribution equilibrium',
  'ergodic theorem time average',
  'first passage hitting time',
  'birth death process chain'
];

const IMAGE_COUNT = 2000;
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;

/**
 * Generates an array of 2000 image URLs with distributed keywords
 * Uses Unsplash Source for keyword-based image search
 */
export function generateImagePlaylist() {
  const playlist = [];
  const timestamp = Date.now();

  for (let i = 0; i < IMAGE_COUNT; i++) {
    // Pick a random keyword
    const keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];

    // Randomize dimensions for variety
    const width = 700 + Math.floor(Math.random() * 300); // 700-1000
    const height = 500 + Math.floor(Math.random() * 300); // 500-800

    // Extract key search terms from the full keyword phrase
    // Take just the main concept words for better image matching
    const searchTerms = keyword.split(' ').slice(0, 3).join(',');

    // Use Unsplash Source with keyword search and sig parameter for uniqueness
    const randomSig = timestamp + i + Math.floor(Math.random() * 99999);
    const url = `https://source.unsplash.com/${width}x${height}/?${searchTerms}&sig=${randomSig}`;

    playlist.push({
      url,
      keyword,
      index: i
    });
  }

  return playlist;
}

/**
 * Get random keyword for text overlay
 */
export function getRandomKeyword() {
  return KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
}

export { KEYWORDS };
