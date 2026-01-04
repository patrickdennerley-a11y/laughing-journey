# 🔥 STROBE VIDEO WEB PLAYER 🔥

A rapid-fire visual experience that plays 3600 images at 30 FPS with glitch effects, random CSS filters, and strobe aesthetics. Runs for exactly 2 minutes (120 seconds) with 30 different images per second.

## ⚠️ EPILEPSY WARNING ⚠️

**This application contains rapidly flashing lights, strobing effects, and high-contrast imagery that may trigger seizures in people with photosensitive epilepsy.**

Viewer discretion is strongly advised.

## Features

- **30 FPS Strobe Effect**: Displays images at exactly ~33ms per frame (30 images per second)
- **3600 Image Playlist**: Exactly 2 minutes of content (30 fps × 120 seconds = 3600 images)
- **Full Preloading**: ALL images are preloaded before playback starts for guaranteed smooth playback
- **Loading Progress**: Visual progress bar shows preloading status (0-100%)
- **Random Glitch Effects**: Every frame gets randomized CSS filters including:
  - Hue rotation (0-360°)
  - Invert (flash effects)
  - Saturation boost
  - Brightness & contrast variation
  - Random scaling and mirroring
- **Text Overlays**: Random keyword overlays with neon glitch styling
- **Time Counter**: Shows elapsed time and total duration
- **Auto Loop**: Automatically loops back to start after 2 minutes
- **Safety First**: Start screen with clear epilepsy warning

## Image Sources

The visualizer uses actual mathematical diagrams from Wikimedia Commons, including:
- Markov chains and state transition diagrams
- Stochastic processes and random walks
- Brownian motion and diffusion
- Probability distributions (Normal, Exponential, Gamma, Poisson, etc.)
- Queueing theory and branching processes
- Fractals (Mandelbrot set, Julia sets, Sierpinski triangle, Lorenz attractor)
- Fourier analysis and signal processing
- Topology (Möbius strip, torus, knots)
- Complex analysis and differential equations

## Technology Stack

- **React** - UI framework with hooks for state management
- **Vite** - Fast build tool and dev server
- **Wikimedia Commons** - Real mathematical diagrams and visualizations

## Getting Started

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Build for Production

```bash
npm run build
```

## How It Works

1. **Image Generation**: A playlist of 3600 unique image URLs is generated from Wikimedia Commons diagrams with size variations
2. **Full Preloading**: ALL 3600 images are preloaded before playback starts, with a progress bar showing status
3. **Frame Loop**: A setInterval runs every ~33ms (30 FPS) to update the current frame
4. **Effects**: Each frame gets randomized CSS filters and transforms
5. **Text Overlays**: Random keywords appear with glitch text effects
6. **Duration Control**: Plays for exactly 2 minutes (120 seconds) then loops back to start

## Customization

To modify the keywords/themes, edit the `KEYWORDS` array in `src/imageGenerator.js`:

```javascript
const KEYWORDS = [
  'your keyword 1',
  'your keyword 2',
  // ... add more
];
```

## Audio Placeholder

The visualizer includes a placeholder for audio integration. You can add background music by implementing an audio player in the `BreakcoreVisualizer` component.

## Performance Notes

- Images are preloaded to minimize lag
- CSS transforms use `will-change` for GPU acceleration
- Transitions are disabled for instant visual updates
- Frame counter shows current progress

## License

MIT

## Disclaimer

Use responsibly. Not recommended for extended viewing sessions or individuals sensitive to flashing lights.
