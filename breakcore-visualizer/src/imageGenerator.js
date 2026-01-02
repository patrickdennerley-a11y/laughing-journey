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

  for (let i = 0; i < IMAGE_COUNT; i++) {
    // Distribute keywords evenly across all images
    const keywordIndex = i % KEYWORDS.length;
    const keyword = KEYWORDS[keywordIndex];

    // Create URL with keyword and unique lock parameter for cache-busting
    // Replace spaces with commas for loremflickr compatibility
    const formattedKeyword = keyword.replace(/\s+/g, ',');
    const url = `https://loremflickr.com/${IMAGE_WIDTH}/${IMAGE_HEIGHT}/${formattedKeyword}?lock=${i}`;

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
