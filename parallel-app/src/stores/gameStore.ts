// PARALLEL - Game Store
// Zustand store for managing game state during gameplay

import { create } from 'zustand';
import {
  GameState,
  GameActions,
  Life,
  Scenario,
  Choice,
  DeathScreenData,
} from '../types';

interface GameStore extends GameState, GameActions {}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentLife: null,
  currentScenario: null,
  isPlaying: false,
  isPaused: false,
  hesitationActive: false,
  deathScreen: null,

  // Start a new life
  startNewLife: () => {
    set({
      currentLife: null,
      currentScenario: null,
      isPlaying: true,
      isPaused: false,
      hesitationActive: false,
      deathScreen: null,
    });
  },

  // Set the current life
  setCurrentLife: (life: Life) => {
    set({ currentLife: life });
  },

  // Update the current life with partial changes
  updateCurrentLife: (updates: Partial<Life>) => {
    const { currentLife } = get();
    if (!currentLife) return;

    set({
      currentLife: {
        ...currentLife,
        ...updates,
      },
    });
  },

  // Load a scenario for display
  loadScenario: (scenario: Scenario) => {
    set({
      currentScenario: scenario,
      hesitationActive: false,
    });
  },

  // Make a choice (actual processing happens in ProteusEngine)
  makeChoice: (choice: Choice) => {
    const { currentLife, currentScenario } = get();
    if (!currentLife || !currentScenario) return;

    // Record the choice in the current life
    const updatedLife: Life = {
      ...currentLife,
      choicesMade: [
        ...currentLife.choicesMade,
        {
          scenarioId: currentScenario.id,
          choiceId: choice.id,
          age: currentLife.currentAge,
          timestamp: Date.now(),
        },
      ],
    };

    set({ currentLife: updatedLife });
  },

  // Set hesitation overlay state
  setHesitation: (active: boolean) => {
    set({ hesitationActive: active });
  },

  // Show death screen
  showDeathScreen: (data: DeathScreenData) => {
    set({
      deathScreen: data,
      isPlaying: false,
    });
  },

  // Dismiss death screen
  dismissDeathScreen: () => {
    set({ deathScreen: null });
  },

  // Reset all game state
  resetGame: () => {
    set({
      currentLife: null,
      currentScenario: null,
      isPlaying: false,
      isPaused: false,
      hesitationActive: false,
      deathScreen: null,
    });
  },
}));

export default useGameStore;
