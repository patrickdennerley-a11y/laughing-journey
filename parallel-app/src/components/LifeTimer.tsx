// PARALLEL - Life Timer Component
// Displays the player's current age as a circular progress indicator

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LifeTimerProps {
  currentAge: number;
  isPaused: boolean;
}

const MIN_AGE = 18;
const MAX_AGE = 85;

export const LifeTimer: React.FC<LifeTimerProps> = ({ currentAge, isPaused }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Calculate progress percentage
  const progress = Math.min(1, (currentAge - MIN_AGE) / (MAX_AGE - MIN_AGE));

  // Determine color based on age
  const getColors = (): [string, string] => {
    if (currentAge < 35) {
      return ['#4CAF50', '#81C784']; // Green - young
    } else if (currentAge < 55) {
      return ['#FFC107', '#FFD54F']; // Yellow - middle
    } else if (currentAge < 70) {
      return ['#FF9800', '#FFB74D']; // Orange - mature
    } else {
      return ['#F44336', '#E57373']; // Red - old
    }
  };

  // Animate on age change
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [currentAge, scaleAnim, opacityAnim]);

  const colors = getColors();
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: isPaused ? 0.5 : opacityAnim,
        },
      ]}
    >
      <View style={styles.timerContainer}>
        {/* Background circle */}
        <View style={styles.circleBackground} />

        {/* Progress arc */}
        <View style={styles.svgContainer}>
          <View
            style={[
              styles.progressArc,
              {
                borderColor: colors[0],
                borderWidth: 4,
                borderRadius: 50,
                transform: [{ rotate: '-90deg' }],
              },
            ]}
          />
        </View>

        {/* Inner content */}
        <LinearGradient
          colors={colors}
          style={styles.innerCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.ageText}>{currentAge}</Text>
          <Text style={styles.labelText}>years</Text>
        </LinearGradient>
      </View>

      {/* Life stage label */}
      <Text style={styles.stageText}>{getLifeStage(currentAge)}</Text>
    </Animated.View>
  );
};

// Get life stage description
const getLifeStage = (age: number): string => {
  if (age < 25) return 'Youth';
  if (age < 35) return 'Early Adulthood';
  if (age < 50) return 'Prime Years';
  if (age < 65) return 'Maturity';
  if (age < 75) return 'Golden Years';
  return 'Final Chapter';
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBackground: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  svgContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  progressArc: {
    width: 100,
    height: 100,
    position: 'absolute',
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  ageText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  labelText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stageText: {
    marginTop: 8,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
});

export default LifeTimer;
