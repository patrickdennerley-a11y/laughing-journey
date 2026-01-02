# 🔥 BREAKCORE VISUALIZER 🔥

A rapid-fire visual experience that plays 2000 images at 30 FPS with glitch effects, random CSS filters, and breakcore aesthetics.

## ⚠️ EPILEPSY WARNING ⚠️

**This application contains rapidly flashing lights, strobing effects, and high-contrast imagery that may trigger seizures in people with photosensitive epilepsy.**

Viewer discretion is strongly advised.

## Features

- **30 FPS Engine**: Displays images at ~33ms per frame for smooth rapid-fire playback
- **2000 Image Playlist**: Dynamically generated URLs based on curated keywords
- **Random Glitch Effects**: Every frame gets randomized CSS filters including:
  - Hue rotation (0-360°)
  - Invert (flash effects)
  - Saturation boost
  - Brightness & contrast variation
  - Random scaling and mirroring
- **Text Overlays**: Random keyword overlays with neon glitch styling
- **Safety First**: Start screen with clear epilepsy warning

## Keywords/Themes

- Differential equation graphs
- Physics forces
- Monkeys
- High school bands
- Slingshots
- Retro anime
- Circuit boards
- Glitch art

## Technology Stack

- **React** - UI framework
- **Vite** - Fast build tool and dev server
- **LoremFlickr API** - Placeholder image service with keyword support

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

1. **Image Generation**: A playlist of 2000 unique image URLs is generated using the LoremFlickr API with cache-busting parameters
2. **Preloading**: Images are preloaded in batches of 50 to ensure smooth playback
3. **Frame Loop**: A setInterval runs every ~33ms to update the current frame
4. **Effects**: Each frame gets randomized CSS filters and transforms
5. **Text Overlays**: Random keywords appear with glitch text effects

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
