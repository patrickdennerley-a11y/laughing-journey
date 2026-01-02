import { useState, useEffect, useRef } from 'react';
import { generateImagePlaylist, getRandomKeyword } from './imageGenerator';
import './BreakcoreVisualizer.css';

const FPS = 30;
const FRAME_DURATION = 1000 / FPS; // ~33ms

function BreakcoreVisualizer() {
  const [started, setStarted] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [filters, setFilters] = useState({});
  const [showText, setShowText] = useState(false);
  const [overlayText, setOverlayText] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });

  const playlistRef = useRef([]);
  const intervalRef = useRef(null);
  const preloadedImagesRef = useRef(new Set());

  // Generate playlist on mount
  useEffect(() => {
    playlistRef.current = generateImagePlaylist();
  }, []);

  // Preload images in batches to prevent lag
  useEffect(() => {
    if (started && playlistRef.current.length > 0) {
      // Preload next 50 images
      const startIdx = currentFrame;
      const endIdx = Math.min(startIdx + 50, playlistRef.current.length);

      for (let i = startIdx; i < endIdx; i++) {
        const url = playlistRef.current[i].url;
        if (!preloadedImagesRef.current.has(url)) {
          const img = new Image();
          img.src = url;
          preloadedImagesRef.current.add(url);
        }
      }
    }
  }, [currentFrame, started]);

  // Generate random CSS filters
  const generateRandomFilters = () => {
    return {
      hueRotate: Math.random() * 360,
      invert: Math.random() > 0.7 ? 100 : 0, // 30% chance of invert
      saturate: 100 + Math.random() * 200, // 100-300%
      brightness: 80 + Math.random() * 40, // 80-120%
      contrast: 80 + Math.random() * 60, // 80-140%
      scale: 0.95 + Math.random() * 0.15, // 0.95-1.1
      rotate: Math.random() > 0.9 ? (Math.random() * 10 - 5) : 0, // occasional slight rotation
      flipX: Math.random() > 0.9 ? -1 : 1, // occasional mirror
    };
  };

  // Main 30 FPS loop
  useEffect(() => {
    if (started) {
      intervalRef.current = setInterval(() => {
        // Update frame
        setCurrentFrame((prev) => (prev + 1) % playlistRef.current.length);

        // Generate new random filters
        setFilters(generateRandomFilters());

        // Randomly show text overlay (20% chance)
        if (Math.random() > 0.8) {
          setShowText(true);
          setOverlayText(getRandomKeyword().toUpperCase());
          setTextPosition({
            x: Math.random() * 80 + 10, // 10-90%
            y: Math.random() * 80 + 10, // 10-90%
          });

          // Hide text after random duration
          setTimeout(() => setShowText(false), 100 + Math.random() * 400);
        }
      }, FRAME_DURATION);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [started]);

  const handleStart = () => {
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="start-screen">
        <div className="warning-container">
          <h1 className="warning-title">⚠️ EPILEPSY WARNING ⚠️</h1>
          <p className="warning-text">
            This experience contains rapidly flashing lights, strobing effects,
            and high-contrast imagery that may trigger seizures in people with
            photosensitive epilepsy.
          </p>
          <p className="warning-text">
            Viewer discretion is advised.
          </p>
          <button className="start-button" onClick={handleStart}>
            CLICK TO START
          </button>
          <div className="info">
            <p>BREAKCORE VISUALIZER</p>
            <p>2000 FRAMES @ 30 FPS</p>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = playlistRef.current[currentFrame];

  const imageStyle = {
    filter: `
      hue-rotate(${filters.hueRotate}deg)
      invert(${filters.invert}%)
      saturate(${filters.saturate}%)
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
    `,
    transform: `
      scale(${filters.scale})
      scaleX(${filters.flipX})
      rotate(${filters.rotate}deg)
    `,
  };

  const textStyle = {
    left: `${textPosition.x}%`,
    top: `${textPosition.y}%`,
  };

  return (
    <div className="visualizer">
      <div className="image-container">
        <img
          src={currentImage?.url}
          alt={`Frame ${currentFrame}`}
          className="visualizer-image"
          style={imageStyle}
          loading="eager"
        />
      </div>

      {showText && (
        <div className="text-overlay" style={textStyle}>
          {overlayText}
        </div>
      )}

      <div className="frame-counter">
        FRAME: {currentFrame + 1} / {playlistRef.current.length}
      </div>

      {/* Placeholder for audio */}
      <div className="audio-placeholder">
        {/* Audio element can be added here */}
      </div>
    </div>
  );
}

export default BreakcoreVisualizer;
