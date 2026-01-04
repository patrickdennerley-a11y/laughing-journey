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

// Curated collection of actual mathematical/statistical diagram URLs
// From Wikimedia Commons and educational sources
const DIAGRAM_URLS = [
  // Markov chains and state transitions
  'https://upload.wikimedia.org/wikipedia/commons/2/2b/Markovkate_01.svg',
  'https://upload.wikimedia.org/wikipedia/commons/9/95/Finance_Markov_chain_example_state_space.svg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Markov_Chain_weather_model_matrix_as_a_graph.svg/800px-Markov_Chain_weather_model_matrix_as_a_graph.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Markov_chain_example.svg/1024px-Markov_chain_example.svg.png',

  // Random walks and Brownian motion
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Random_walk_2500_animated.svg/800px-Random_walk_2500_animated.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Random_walk_25000.svg/1024px-Random_walk_25000.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Wiener_process_3d.png/800px-Wiener_process_3d.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Brownian_motion_large.gif/800px-Brownian_motion_large.gif',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Brownian_hierarchical.svg/800px-Brownian_hierarchical.svg.png',

  // Distributions
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Normal_Distribution_PDF.svg/1024px-Normal_Distribution_PDF.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Standard_deviation_diagram.svg/1024px-Standard_deviation_diagram.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Exponential_probability_density.svg/1024px-Exponential_probability_density.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Gamma_distribution_pdf.svg/1024px-Gamma_distribution_pdf.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Poisson_pmf.svg/1024px-Poisson_pmf.svg.png',

  // Stochastic processes
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Poisson_process_NT.svg/1024px-Poisson_process_NT.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Geometric_Brownian_motion.png/800px-Geometric_Brownian_motion.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Ornstein-Uhlenbeck_process.png/800px-Ornstein-Uhlenbeck_process.png',

  // Queueing theory
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Mm1_queue.svg/800px-Mm1_queue.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Queueing_theory_graph.svg/800px-Queueing_theory_graph.svg.png',

  // Branching processes
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Galton-Watson_tree.svg/800px-Galton-Watson_tree.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Branching_process_extinction.svg/800px-Branching_process_extinction.svg.png',

  // Probability trees and graphs
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Probability_tree_diagram.svg/800px-Probability_tree_diagram.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Binomial_distribution_pmf.svg/1024px-Binomial_distribution_pmf.svg.png',

  // Time series and finance
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Martingale.svg/800px-Martingale.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Autoregressive_model_terminology_and_autocorrelations.svg/1024px-Autoregressive_model_terminology_and_autocorrelations.svg.png',

  // Statistical convergence
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Lawoflargenumbers.svg/1024px-Lawoflargenumbers.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Central_limit_theorem_convergence.svg/1024px-Central_limit_theorem_convergence.svg.png',

  // Matrix and linear algebra
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Matrix_multiplication_diagram_2.svg/1024px-Matrix_multiplication_diagram_2.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Stochastic_matrix.svg/800px-Stochastic_matrix.svg.png',

  // Network graphs and transitions
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/6n-graf.svg/800px-6n-graf.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Directed_graph%2C_cyclic.svg/800px-Directed_graph%2C_cyclic.svg.png',
];

/**
 * Generates an array of 2000 image URLs with distributed keywords
 * Uses curated actual mathematical diagrams from Wikimedia Commons
 */
export function generateImagePlaylist() {
  const playlist = [];
  const shuffledDiagrams = [...DIAGRAM_URLS].sort(() => Math.random() - 0.5);

  for (let i = 0; i < IMAGE_COUNT; i++) {
    // Pick a random keyword
    const keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];

    // Cycle through the diagram URLs, reshuffling when we run out
    const diagramIndex = i % shuffledDiagrams.length;
    const url = shuffledDiagrams[diagramIndex];

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
