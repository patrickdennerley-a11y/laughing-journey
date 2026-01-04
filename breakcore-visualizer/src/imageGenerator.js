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
 */
export function generateImagePlaylist() {
  const playlist = [];
  const timestamp = Date.now();

  for (let i = 0; i < IMAGE_COUNT; i++) {
    // Pick a RANDOM keyword instead of cycling through them
    const keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];

    // Randomize dimensions slightly to get different images
    const width = IMAGE_WIDTH + Math.floor(Math.random() * 200) - 100; // 700-900
    const height = IMAGE_HEIGHT + Math.floor(Math.random() * 200) - 100; // 500-700

    // Create highly randomized lock parameter
    const randomSeed = Math.floor(Math.random() * 999999);
    const lockParam = timestamp + i + randomSeed;

    // Replace spaces with commas for loremflickr compatibility
    const formattedKeyword = keyword.replace(/\s+/g, ',');
    const url = `https://loremflickr.com/${width}/${height}/${formattedKeyword}?lock=${lockParam}`;

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
