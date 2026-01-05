// PARALLEL - Death Screen Component
// Displays death summary, ghost branch, and options for continuing

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Life, GhostBranch } from '../types';
import { deathFeedback } from '../utils/haptics';
import GhostBranchComponent from './GhostBranch';

interface DeathScreenProps {
  summary: string;
  ghostBranch: GhostBranch;
  onGhostBranch: (scenarioId: string) => void;
  onNewLife: () => void;
  life: Life;
}

export const DeathScreen: React.FC<DeathScreenProps> = ({
  summary,
  ghostBranch,
  onGhostBranch,
  onNewLife,
  life,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const summaryFadeAnim = useRef(new Animated.Value(0)).current;
  const ghostFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonsFadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Trigger death haptic feedback
    deathFeedback();

    // Sequence of fade-ins
    Animated.sequence([
      // Fade in black screen
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Wait a moment
      Animated.delay(500),
      // Fade in summary
      Animated.parallel([
        Animated.timing(summaryFadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Wait then fade in ghost branch
      Animated.delay(1500),
      Animated.timing(ghostFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Fade in buttons
      Animated.delay(500),
      Animated.timing(buttonsFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, summaryFadeAnim, ghostFadeAnim, buttonsFadeAnim, slideAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#000000', '#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Life stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Lived {life.currentAge} years in the {life.era} era
            </Text>
          </View>

          {/* Death summary */}
          <Animated.View
            style={[
              styles.summaryContainer,
              {
                opacity: summaryFadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.summaryText}>{summary}</Text>
          </Animated.View>

          {/* Ghost branch */}
          <Animated.View
            style={[
              styles.ghostContainer,
              { opacity: ghostFadeAnim },
            ]}
          >
            <GhostBranchComponent
              text={ghostBranch.text}
              onTap={() => onGhostBranch(ghostBranch.pivotScenarioId)}
            />
          </Animated.View>

          {/* Action buttons */}
          <Animated.View
            style={[
              styles.buttonsContainer,
              { opacity: buttonsFadeAnim },
            ]}
          >
            <TouchableOpacity
              style={styles.ghostButton}
              onPress={() => onGhostBranch(ghostBranch.pivotScenarioId)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#4a4e69', '#22223b']}
                style={styles.buttonGradient}
              >
                <Text style={styles.ghostButtonText}>Live That Life</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newLifeButton}
              onPress={onNewLife}
              activeOpacity={0.7}
            >
              <Text style={styles.newLifeButtonText}>Start New Life</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Life scores */}
          <Animated.View
            style={[
              styles.scoresContainer,
              { opacity: buttonsFadeAnim },
            ]}
          >
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Satisfaction</Text>
              <View style={styles.scoreBar}>
                <View
                  style={[
                    styles.scoreFill,
                    {
                      width: `${life.satisfactionScore}%`,
                      backgroundColor: '#4CAF50',
                    },
                  ]}
                />
              </View>
              <Text style={styles.scoreValue}>{life.satisfactionScore}%</Text>
            </View>

            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Regret</Text>
              <View style={styles.scoreBar}>
                <View
                  style={[
                    styles.scoreFill,
                    {
                      width: `${life.regretScore}%`,
                      backgroundColor: '#F44336',
                    },
                  ]}
                />
              </View>
              <Text style={styles.scoreValue}>{life.regretScore}%</Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  statsContainer: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
  },
  statsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  summaryContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  summaryText: {
    fontSize: 22,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  ghostContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  buttonsContainer: {
    marginTop: 60,
    alignItems: 'center',
    gap: 16,
  },
  ghostButton: {
    width: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  ghostButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  newLifeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  newLifeButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textDecorationLine: 'underline',
  },
  scoresContainer: {
    position: 'absolute',
    bottom: 60,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  scoreLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 2,
  },
  scoreValue: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
});

export default DeathScreen;
