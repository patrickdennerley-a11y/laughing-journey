import './StartScreen.css';

export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="warning-container">
        <div className="warning-box">
          <h1 className="warning-title">EPILEPSY WARNING</h1>
          <div className="warning-icon">⚠️</div>
          <p className="warning-text">
            This experience contains <strong>FLASHING LIGHTS</strong>,{' '}
            <strong>STROBE EFFECTS</strong>, and <strong>RAPID IMAGE CHANGES</strong>{' '}
            at 30 frames per second.
          </p>
          <p className="warning-text">
            If you have photosensitive epilepsy or are sensitive to flashing lights,
            <strong> DO NOT PROCEED</strong>.
          </p>
        </div>

        <div className="title-section">
          <h2 className="main-title">BREAKCORE VISUALIZER</h2>
          <p className="subtitle">2000+ FRAMES • STOCHASTIC PROCESSES • GLITCH AESTHETICS</p>
        </div>

        <button className="start-button" onClick={onStart}>
          <span className="button-text">CLICK TO START</span>
          <span className="button-subtext">I understand the risks</span>
        </button>

        <div className="audio-placeholder">
          <p>🎵 Audio placeholder - Add your breakcore track here</p>
          <code>{"<audio src='your-track.mp3' />"}</code>
        </div>
      </div>
    </div>
  );
}
