// Keywords for stochastic/probability themed images
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

// Generate 2000+ unique image URLs
export function generateImagePlaylist(count = 2000) {
  const images = [];

  for (let i = 0; i < count; i++) {
    // Pick a random keyword
    const keyword = KEYWORDS[i % KEYWORDS.length];
    // URL encode the keyword for the API
    const encodedKeyword = encodeURIComponent(keyword.replace(/\s+/g, ','));

    // Use loremflickr with lock parameter for cache-busting unique images
    // The lock parameter ensures different images for each index
    const url = `https://loremflickr.com/800/600/${encodedKeyword}?lock=${i}`;

    images.push({
      url,
      keyword,
      index: i
    });
  }

  // Shuffle the array for more random playback
  return shuffleArray(images);
}

// Fisher-Yates shuffle
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Export keywords for text overlay use
export { KEYWORDS };
