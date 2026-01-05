// PARALLEL - Game Screen
// Main gameplay screen where players make choices and live out lives

import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Choice, Era } from '../types';
import { useGameStore } from '../stores/gameStore';
import { getProteusEngine } from '../engine/ProteusEngine';
import { LifeTimer } from '../components/LifeTimer';
import { ChoiceButton } from '../components/ChoiceButton';
import { HesitationOverlay } from '../components/HesitationOverlay';
import { DeathScreen } from '../components/DeathScreen';

type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;

interface GameScreenProps {
  navigation: GameScreenNavigationProp;
}

const getEraColors = (era: Era): [string, string, string] => {
  switch (era) {
    case 'modern':
      return ['#1a1a2e', '#16213e', '#0f3460'];
    case 'medieval':
      return ['#2d2d2d', '#4a3728', '#3d2914'];
    case 'future':
      return ['#0d0d1a', '#1a1a3e', '#2d2d5a'];
    case 'ancient':
      return ['#3d2914', '#4a3728', '#2d2d2d'];
    case 'victorian':
      return ['#1a1a1a', '#2d2d2d', '#3d3d3d'];
    case 'renaissance':
      return ['#2d1a1a', '#3d2d1a', '#4a3d2d'];
  }
};

export const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
  const {
    currentLife,
    currentScenario,
    isPlaying,
    isPaused,
    hesitationActive,
    deathScreen,
    setHesitation,
    showDeathScreen,
    dismissDeathScreen,
  } = useGameStore();

  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);
  const engine = getProteusEngine();

  // Initialize game on mount
  useEffect(() => {
    if (!currentLife) {
      startNewLife();
    }
  }, []);

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (deathScreen) {
        return true; // Prevent back during death screen
      }
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [deathScreen, navigation]);

  // Start a new life
  const startNewLife = useCallback(() => {
    const life = engine.startNewLife();
    // Get first scenario
    engine.getNextScenario(life);
  }, [engine]);

  // Handle choice selection
  const handleChoice = useCallback(
    (choice: Choice) => {
      if (!currentLife || !currentScenario) return;

      // If life-defining choice, show hesitation first
      if (choice.isLifeDefining && !hesitationActive) {
        setPendingChoice(choice);
        setHesitation(true);
        return;
      }

      // Process the choice
      const result = engine.processChoice(currentLife, choice);

      if (result.isDead && result.deathData) {
        // Show death screen
        showDeathScreen({
          visible: true,
          summary: result.deathData.summary,
          ghostBranch: result.deathData.ghostBranch,
        });
      } else {
        // Get next scenario
        engine.getNextScenario(result.updatedLife);
      }
    },
    [currentLife, currentScenario, hesitationActive, engine, setHesitation, showDeathScreen]
  );

  // Handle hesitation complete
  const handleHesitationComplete = useCallback(() => {
    setHesitation(false);
    if (pendingChoice) {
      // Now process the choice without hesitation
      if (!currentLife || !currentScenario) return;

      const result = engine.processChoice(currentLife, pendingChoice);
      setPendingChoice(null);

      if (result.isDead && result.deathData) {
        showDeathScreen({
          visible: true,
          summary: result.deathData.summary,
          ghostBranch: result.deathData.ghostBranch,
        });
      } else {
        engine.getNextScenario(result.updatedLife);
      }
    }
  }, [pendingChoice, currentLife, currentScenario, engine, setHesitation, showDeathScreen]);

  // Handle ghost branch selection
  const handleGhostBranch = useCallback(
    (scenarioId: string) => {
      if (!currentLife) return;
      dismissDeathScreen();
      engine.startFromGhostBranch(scenarioId, currentLife);
      // Get the scenario for the new life
      const newLife = useGameStore.getState().currentLife;
      if (newLife) {
        engine.getNextScenario(newLife);
      }
    },
    [currentLife, engine, dismissDeathScreen]
  );

  // Handle new life from death screen
  const handleNewLife = useCallback(() => {
    dismissDeathScreen();
    startNewLife();
  }, [dismissDeathScreen, startNewLife]);

  // Handle pause/back
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const eraColors = currentLife ? getEraColors(currentLife.era) : getEraColors('modern');

  return (
    <LinearGradient colors={eraColors} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {currentLife && (
            <View style={styles.headerCenter}>
              <LifeTimer currentAge={currentLife.currentAge} isPaused={isPaused} />
            </View>
          )}

          {currentLife && (
            <View style={styles.eraIndicator}>
              <Text style={styles.eraText}>{currentLife.era.toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Main content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Scenario narrative */}
          {currentScenario && (
            <View style={styles.scenarioSection}>
              <Text style={styles.narrativeText}>{currentScenario.narrativeText}</Text>
            </View>
          )}

          {/* Context info */}
          {currentLife && currentScenario && (
            <View style={styles.contextSection}>
              <Text style={styles.contextText}>
                Age {currentLife.currentAge} • {formatEra(currentLife.era)} era
              </Text>
            </View>
          )}

          {/* Choices */}
          {currentScenario && (
            <View style={styles.choicesSection}>
              {currentScenario.choices.map((choice) => (
                <ChoiceButton
                  key={choice.id}
                  choice={choice}
                  onChoose={handleChoice}
                  disabled={hesitationActive || !!deathScreen}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Overlays */}
        <HesitationOverlay
          visible={hesitationActive}
          onComplete={handleHesitationComplete}
        />

        {deathScreen && currentLife && deathScreen.ghostBranch && (
          <DeathScreen
            summary={deathScreen.summary}
            ghostBranch={deathScreen.ghostBranch}
            onGhostBranch={handleGhostBranch}
            onNewLife={handleNewLife}
            life={currentLife}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const formatEra = (era: Era): string => {
  const formatted: Record<Era, string> = {
    modern: 'Modern',
    medieval: 'Medieval',
    future: 'Future',
    ancient: 'Ancient',
    victorian: 'Victorian',
    renaissance: 'Renaissance',
  };
  return formatted[era];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  eraIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  eraText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  scenarioSection: {
    marginBottom: 24,
  },
  narrativeText: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 28,
    textAlign: 'center',
  },
  contextSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  contextText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  choicesSection: {
    gap: 12,
  },
});

export default GameScreen;
