import { useState, useEffect, useRef } from 'react';
import { generateImagePlaylist, getRandomKeyword } from './imageGenerator';
import './BreakcoreVisualizer.css';

const FPS = 30; // 30 frames per second for strobe effect
const FRAME_DURATION = 1000 / FPS; // ~33ms
const TOTAL_DURATION = 120; // 120 seconds (2 minutes)
const TOTAL_FRAMES = FPS * TOTAL_DURATION; // 3600 frames

function BreakcoreVisualizer() {
  const [phase, setPhase] = useState('warning'); // warning, loading, playing
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [filters, setFilters] = useState({});
  const [showText, setShowText] = useState(false);
  const [overlayText, setOverlayText] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });

  const playlistRef = useRef([]);
  const intervalRef = useRef(null);
  const preloadedImagesRef = useRef([]);
  const loadedCountRef = useRef(0);

  // Generate playlist on mount
  useEffect(() => {
    playlistRef.current = generateImagePlaylist();
  }, []);

  // Preload ALL images
  const preloadAllImages = async () => {
    setPhase('loading');
    setLoadProgress(0);
    loadedCountRef.current = 0;

    const totalImages = playlistRef.current.length;
    const imagePromises = [];

    for (let i = 0; i < totalImages; i++) {
      const imageUrl = playlistRef.current[i].url;

      const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          loadedCountRef.current++;
          setLoadProgress(Math.floor((loadedCountRef.current / totalImages) * 100));
          preloadedImagesRef.current[i] = img;
          resolve();
        };

        img.onerror = () => {
          // Still count as loaded to prevent blocking
          loadedCountRef.current++;
          setLoadProgress(Math.floor((loadedCountRef.current / totalImages) * 100));
          preloadedImagesRef.current[i] = img; // Store anyway
          resolve();
        };

        img.src = imageUrl;
      });

      imagePromises.push(promise);
    }

    // Wait for all images to load
    await Promise.all(imagePromises);

    // Start playing automatically after loading
    setPhase('playing');
  };

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
    if (phase === 'playing') {
      intervalRef.current = setInterval(() => {
        // Update frame
        setCurrentFrame((prev) => {
          const nextFrame = prev + 1;
          // Loop back to start after 2 minutes
          return nextFrame >= TOTAL_FRAMES ? 0 : nextFrame;
        });

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
  }, [phase]);

  const handleStart = () => {
    preloadAllImages();
  };

  // Warning screen
  if (phase === 'warning') {
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
            <p>STROBE VIDEO PLAYER</p>
            <p>{TOTAL_FRAMES} FRAMES @ {FPS} FPS</p>
            <p>DURATION: {TOTAL_DURATION} SECONDS</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading screen
  if (phase === 'loading') {
    return (
      <div className="start-screen">
        <div className="warning-container">
          <h1 className="warning-title">LOADING IMAGES...</h1>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${loadProgress}%` }}></div>
          </div>
          <p className="warning-text">
            {loadProgress}% ({loadedCountRef.current} / {playlistRef.current.length})
          </p>
          <div className="info">
            <p>Preloading all {TOTAL_FRAMES} images before playback</p>
            <p>This ensures smooth 30 FPS playback</p>
          </div>
        </div>
      </div>
    );
  }

  // Playing screen
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

  const elapsedSeconds = Math.floor(currentFrame / FPS);
  const remainingSeconds = TOTAL_DURATION - elapsedSeconds;

  return (
    <div className="visualizer">
      <div className="image-container">
        <img
          key={currentFrame}
          src={currentImage?.url}
          alt={`Frame ${currentFrame}`}
          className="visualizer-image"
          style={imageStyle}
          loading="eager"
          decoding="sync"
        />
      </div>

      {showText && (
        <div className="text-overlay" style={textStyle}>
          {overlayText}
        </div>
      )}

      <div className="frame-counter">
        FRAME: {currentFrame + 1} / {TOTAL_FRAMES} | TIME: {elapsedSeconds}s / {TOTAL_DURATION}s
      </div>
    </div>
  );
}

export default BreakcoreVisualizer;
