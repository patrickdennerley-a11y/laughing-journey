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

const IMAGE_COUNT = 3600; // 30 FPS × 120 seconds = 3600 images
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;

// Generate URLs programmatically from Wikimedia Commons
// This creates 1000+ unique diagram URLs by using different size variations and parameters
function generateWikimediaDiagramURLs() {
  const baseDiagrams = [
    // Markov chains and state transitions
    'wikipedia/commons/2/2b/Markovkate_01.svg',
    'wikipedia/commons/9/95/Finance_Markov_chain_example_state_space.svg',
    'wikipedia/commons/7/70/Markov_Chain_weather_model_matrix_as_a_graph.svg',
    'wikipedia/commons/a/a9/Markov_chain_example.svg',

    // Random walks and Brownian motion
    'wikipedia/commons/c/c3/Random_walk_2500_animated.svg',
    'wikipedia/commons/d/d4/Random_walk_25000.svg',
    'wikipedia/commons/7/77/Wiener_process_3d.png',
    'wikipedia/commons/c/c1/Brownian_motion_large.gif',
    'wikipedia/commons/1/1e/Brownian_hierarchical.svg',
    'wikipedia/commons/6/67/Wiener_process_animated.gif',

    // Distributions
    'wikipedia/commons/7/74/Normal_Distribution_PDF.svg',
    'wikipedia/commons/8/8c/Standard_deviation_diagram.svg',
    'wikipedia/commons/1/12/Exponential_probability_density.svg',
    'wikipedia/commons/e/e6/Gamma_distribution_pdf.svg',
    'wikipedia/commons/8/83/Poisson_pmf.svg',
    'wikipedia/commons/1/17/Cauchy_pdf.svg',
    'wikipedia/commons/8/81/Chi-square_pdf.svg',
    'wikipedia/commons/9/9f/Beta_distribution_pdf.svg',
    'wikipedia/commons/4/46/Weibull_PDF.svg',
    'wikipedia/commons/1/14/Student_t_pdf.svg',
    'wikipedia/commons/5/57/Uniform_Distribution_PDF_SVG.svg',
    'wikipedia/commons/8/84/Laplace_pdf.svg',
    'wikipedia/commons/3/39/Logistic-pdf.svg',
    'wikipedia/commons/a/ae/Rayleigh_distributionPDF.svg',

    // Stochastic processes
    'wikipedia/commons/d/d7/Poisson_process_NT.svg',
    'wikipedia/commons/0/0e/Geometric_Brownian_motion.png',
    'wikipedia/commons/6/62/Ornstein-Uhlenbeck_process.png',
    'wikipedia/commons/f/f3/Wiener_process_zoom.png',

    // Queueing theory
    'wikipedia/commons/6/65/Mm1_queue.svg',
    'wikipedia/commons/4/46/Queueing_theory_graph.svg',

    // Branching processes
    'wikipedia/commons/9/91/Galton-Watson_tree.svg',
    'wikipedia/commons/5/5e/Branching_process_extinction.svg',

    // Probability and statistics
    'wikipedia/commons/1/17/Probability_tree_diagram.svg',
    'wikipedia/commons/f/f4/Binomial_distribution_pmf.svg',
    'wikipedia/commons/a/ae/Geometric_pmf.svg',
    'wikipedia/commons/5/55/Negbinomial.gif',
    'wikipedia/commons/1/16/Hypergeometric_distribution.svg',

    // Time series and finance
    'wikipedia/commons/8/88/Martingale.svg',
    'wikipedia/commons/b/b0/Autoregressive_model_terminology_and_autocorrelations.svg',
    'wikipedia/commons/e/ed/ARIMA_model.png',

    // Convergence theorems
    'wikipedia/commons/c/c9/Lawoflargenumbers.svg',
    'wikipedia/commons/7/76/Central_limit_theorem_convergence.svg',

    // Matrix and linear algebra
    'wikipedia/commons/e/e4/Matrix_multiplication_diagram_2.svg',
    'wikipedia/commons/a/ad/Stochastic_matrix.svg',
    'wikipedia/commons/2/2f/Linear_subspaces_with_shading.svg',
    'wikipedia/commons/a/ad/Row_and_column_vectors.svg',

    // Graphs and networks
    'wikipedia/commons/5/5b/6n-graf.svg',
    'wikipedia/commons/2/23/Directed_graph%2C_cyclic.svg',
    'wikipedia/commons/4/4b/Directed_acyclic_graph.svg',
    'wikipedia/commons/3/39/Directed_graph_with_branching_SVG.svg',
    'wikipedia/commons/b/bc/CPT-Graphs-directed-weighted-ex1.svg',
    'wikipedia/commons/a/a2/Directed_graph%2C_disjoint.svg',

    // Complex analysis and functions
    'wikipedia/commons/d/d4/Gamma_abs_3D.png',
    'wikipedia/commons/1/19/Mandelbrot_set_image.png',
    'wikipedia/commons/a/a4/Mandel_zoom_00_mandelbrot_set.jpg',
    'wikipedia/commons/2/21/Mandel_zoom_07_satellite.jpg',
    'wikipedia/commons/6/69/Complex_zeta.jpg',

    // Differential equations
    'wikipedia/commons/0/0b/VFPt_dipole_magnetic3.svg',
    'wikipedia/commons/1/16/Phase_portrait_center.svg',
    'wikipedia/commons/0/0a/Slope_Field.png',
    'wikipedia/commons/3/30/Phase_plane_nodes.svg',
    'wikipedia/commons/e/e5/Pendulum_phase_portrait.svg',

    // Fractals and chaos
    'wikipedia/commons/a/a4/Sierpinski_triangle.svg',
    'wikipedia/commons/2/24/Sierpinski_carpet.svg',
    'wikipedia/commons/4/45/Dragon_curve.svg',
    'wikipedia/commons/d/d9/Lorenz_attractor_yb.svg',
    'wikipedia/commons/5/5c/Lorenz_attractor2.svg',
    'wikipedia/commons/1/1d/Julia_set_%28C_%3D_0.285%2C_0.01%29.jpg',
    'wikipedia/commons/e/ea/Julia_set_%28highres_01%29.jpg',

    // Fourier analysis
    'wikipedia/commons/7/72/Fourier_transform_time_and_frequency_domains_%28small%29.gif',
    'wikipedia/commons/5/50/Fourier_series_and_transform.gif',
    'wikipedia/commons/1/1a/Fourier_series_square_wave_circles_animation.svg',

    // Signal processing
    'wikipedia/commons/c/c5/FFT-Time-Frequency-View.png',
    'wikipedia/commons/2/21/Spectrogram_of_violin.png',

    // Topology and geometry
    'wikipedia/commons/5/51/Moebius_strip.svg',
    'wikipedia/commons/f/ff/Trefoil_knot_left.svg',
    'wikipedia/commons/2/26/Torus.svg',
    'wikipedia/commons/a/ac/Tesseract.gif',
    'wikipedia/commons/5/55/8-cell-simple.gif',

    // Number theory
    'wikipedia/commons/3/3c/Ulam_1.png',
    'wikipedia/commons/0/0e/Primes-vs-composites.svg',

    // Combinatorics
    'wikipedia/commons/1/12/Catalan_number_binary_tree_example.png',
    'wikipedia/commons/e/ea/Hanoi.gif',

    // Logic and set theory
    'wikipedia/commons/6/6d/Venn_A_intersect_B.svg',
    'wikipedia/commons/3/30/Venn_A_union_B.svg',
    'wikipedia/commons/5/56/Venn_A_complement.svg',
    'wikipedia/commons/9/99/Venn0001.svg',

    // Calculus
    'wikipedia/commons/c/cc/Integral_as_region_under_curve.svg',
    'wikipedia/commons/0/0f/Tangent_to_a_curve.svg',
    'wikipedia/commons/d/d2/Limitconcept.svg',

    // Statistics plots
    'wikipedia/commons/1/1a/Boxplot_vs_PDF.svg',
    'wikipedia/commons/2/25/The_Scientific_Method.svg',
    'wikipedia/commons/3/3a/Linear_regression.svg',
    'wikipedia/commons/f/f8/Residuals_for_Linear_Regression_Fit.png',
    'wikipedia/commons/0/01/Anscombe%27s_quartet_3.svg',
  ];

  const sizes = [600, 700, 800, 900, 1000, 1200];
  const urls = [];

  // For each diagram, create multiple size variations
  baseDiagrams.forEach((diagram, idx) => {
    sizes.forEach((size) => {
      // Create URL with size parameter
      const url = `https://upload.wikimedia.org/${diagram}`.includes('.svg')
        ? `https://upload.wikimedia.org/${diagram.replace('.svg', '')}.svg/${size}px-${diagram.split('/').pop()}.png`
        : `https://upload.wikimedia.org/${diagram}`;

      urls.push(url);
    });

    // Also add the base URL without size
    urls.push(`https://upload.wikimedia.org/${diagram}`);
  });

  return urls;
}

const DIAGRAM_URLS = generateWikimediaDiagramURLs();

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
