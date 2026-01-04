import { useState } from 'react';
import StartScreen from './components/StartScreen';
import Visualizer from './components/Visualizer';

function App() {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <>
      {!started ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <Visualizer />
      )}
    </>
  );
}

export default App;
