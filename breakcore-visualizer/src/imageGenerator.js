/**
 * Generates 2000 unique image URLs for the breakcore visualizer
 * Uses loremflickr with cache-busting parameters
 */

const KEYWORDS = [
  'differential equation graphs',
  'physics forces',
  'monkeys',
  'high school bands',
  'slingshots',
  'retro anime',
  'circuit boards',
  'glitch art'
];

const IMAGE_COUNT = 2000;
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;

/**
 * Generates an array of 2000 image URLs with distributed keywords
 * Uses Picsum Photos for true randomness - massive library, no repeats
 */
export function generateImagePlaylist() {
  const playlist = [];
  const timestamp = Date.now();

  for (let i = 0; i < IMAGE_COUNT; i++) {
    // Pick a random keyword for text overlay purposes
    const keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];

    // Randomize dimensions for variety
    const width = 700 + Math.floor(Math.random() * 300); // 700-1000
    const height = 500 + Math.floor(Math.random() * 300); // 500-800

    // Use Picsum with random=X parameter for truly random images
    // This service has 1000+ unique images, way better than LoremFlickr
    const randomId = Math.floor(Math.random() * 1000);
    const url = `https://picsum.photos/${width}/${height}?random=${timestamp + i + randomId}`;

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
