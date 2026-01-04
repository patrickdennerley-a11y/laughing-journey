import { useEffect, useRef, useState, useCallback } from 'react';
import { generateImagePlaylist, KEYWORDS } from '../utils/imageGenerator';
import './Visualizer.css';

const FRAME_INTERVAL = 33; // ~30 FPS
const PRELOAD_BUFFER = 50; // Number of images to preload ahead
const TEXT_FLASH_CHANCE = 0.15; // 15% chance to show keyword text

export default function Visualizer() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [effects, setEffects] = useState({});
  const [textOverlay, setTextOverlay] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const frameRef = useRef(null);
  const preloadedImagesRef = useRef({});

  // Generate playlist on mount
  useEffect(() => {
    const images = generateImagePlaylist(2000);
    setPlaylist(images);
  }, []);

  // Preload images ahead of current position
  const preloadImages = useCallback((startIndex) => {
    if (playlist.length === 0) return;

    for (let i = 0; i < PRELOAD_BUFFER; i++) {
      const index = (startIndex + i) % playlist.length;
      const imageData = playlist[index];

      if (!preloadedImagesRef.current[index]) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
        };
        img.src = imageData.url;
        preloadedImagesRef.current[index] = img;
      }
    }
  }, [playlist]);

  // Generate random glitch effects
  const generateEffects = useCallback(() => {
    return {
      hueRotate: Math.floor(Math.random() * 360),
      invert: Math.random() > 0.7 ? 100 : 0,
      saturate: 100 + Math.floor(Math.random() * 300),
      brightness: 80 + Math.floor(Math.random() * 80),
      contrast: 80 + Math.floor(Math.random() * 80),
      scaleX: Math.random() > 0.9 ? -1 : 1,
      scaleY: Math.random() > 0.95 ? -1 : 1,
      skewX: Math.random() > 0.85 ? (Math.random() - 0.5) * 20 : 0,
      blur: Math.random() > 0.92 ? Math.random() * 3 : 0,
    };
  }, []);

  // Generate random text overlay
  const generateTextOverlay = useCallback(() => {
    if (Math.random() < TEXT_FLASH_CHANCE) {
      const keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
      return {
        text: keyword.toUpperCase(),
        x: Math.random() * 60 + 20, // 20-80% from left
        y: Math.random() * 60 + 20, // 20-80% from top
        fontSize: Math.floor(Math.random() * 40) + 24,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        rotation: (Math.random() - 0.5) * 30,
      };
    }
    return null;
  }, []);

  // Main animation loop
  useEffect(() => {
    if (playlist.length === 0) return;

    const animate = () => {
      setCurrentFrame(prev => {
        const next = (prev + 1) % playlist.length;
        preloadImages(next);
        return next;
      });
      setEffects(generateEffects());
      setTextOverlay(generateTextOverlay());
    };

    // Start preloading immediately
    preloadImages(0);

    const intervalId = setInterval(animate, FRAME_INTERVAL);
    return () => clearInterval(intervalId);
  }, [playlist, preloadImages, generateEffects, generateTextOverlay]);

  if (playlist.length === 0) {
    return <div className="visualizer loading">Loading...</div>;
  }

  const currentImage = playlist[currentFrame];
  const filterStyle = {
    filter: `
      hue-rotate(${effects.hueRotate || 0}deg)
      invert(${effects.invert || 0}%)
      saturate(${effects.saturate || 100}%)
      brightness(${effects.brightness || 100}%)
      contrast(${effects.contrast || 100}%)
      blur(${effects.blur || 0}px)
    `,
    transform: `
      scaleX(${effects.scaleX || 1})
      scaleY(${effects.scaleY || 1})
      skewX(${effects.skewX || 0}deg)
    `,
  };

  return (
    <div className="visualizer" ref={frameRef}>
      <div className="frame-container" style={filterStyle}>
        <img
          src={currentImage.url}
          alt=""
          className="frame-image"
          loading="eager"
        />
      </div>

      {textOverlay && (
        <div
          className="text-overlay"
          style={{
            left: `${textOverlay.x}%`,
            top: `${textOverlay.y}%`,
            fontSize: `${textOverlay.fontSize}px`,
            color: textOverlay.color,
            transform: `translate(-50%, -50%) rotate(${textOverlay.rotation}deg)`,
            textShadow: `0 0 10px ${textOverlay.color}, 0 0 20px ${textOverlay.color}`,
          }}
        >
          {textOverlay.text}
        </div>
      )}

      <div className="frame-counter">
        FRAME: {currentFrame} / {playlist.length}
      </div>
    </div>
  );
}
