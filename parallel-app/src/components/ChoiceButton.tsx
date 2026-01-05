// PARALLEL - Choice Button Component
// Interactive button for making choices with hold-to-confirm for risky options

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Choice, RiskLevel } from '../types';
import { tapFeedback, holdFeedback, commitFeedback } from '../utils/haptics';

interface ChoiceButtonProps {
  choice: Choice;
  onChoose: (choice: Choice) => void;
  disabled: boolean;
}

const HOLD_DURATION = 1500; // 1.5 seconds for risky choices
const HOLD_TICK_INTERVAL = 50; // Update progress every 50ms

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  choice,
  onChoose,
  disabled,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Get colors based on risk level
  const getColors = (): { gradient: [string, string]; border: string; glow: string } => {
    switch (choice.riskLevel) {
      case 'safe':
        return {
          gradient: ['#2E7D32', '#4CAF50'],
          border: '#81C784',
          glow: 'rgba(76, 175, 80, 0.3)',
        };
      case 'moderate':
        return {
          gradient: ['#F57C00', '#FF9800'],
          border: '#FFB74D',
          glow: 'rgba(255, 152, 0, 0.3)',
        };
      case 'risky':
        return {
          gradient: ['#C62828', '#F44336'],
          border: '#EF5350',
          glow: 'rgba(244, 67, 54, 0.5)',
        };
    }
  };

  // Start pulse animation for risky choices
  React.useEffect(() => {
    if (choice.riskLevel === 'risky' && !disabled) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [choice.riskLevel, disabled, pulseAnim]);

  // Handle press start
  const handlePressIn = useCallback(() => {
    if (disabled) return;

    setIsPressed(true);
    holdStartRef.current = Date.now();

    if (choice.riskLevel === 'risky') {
      // Start hold timer for risky choices
      holdTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - holdStartRef.current;
        const progress = Math.min(1, elapsed / HOLD_DURATION);
        setHoldProgress(progress);

        // Haptic feedback during hold
        holdFeedback(progress);

        // Animate glow
        Animated.timing(glowAnim, {
          toValue: progress,
          duration: HOLD_TICK_INTERVAL,
          useNativeDriver: false,
        }).start();

        if (progress >= 1) {
          // Choice confirmed!
          clearInterval(holdTimerRef.current!);
          commitFeedback();
          onChoose(choice);
        }
      }, HOLD_TICK_INTERVAL);
    }
  }, [disabled, choice, onChoose, glowAnim]);

  // Handle press end
  const handlePressOut = useCallback(() => {
    setIsPressed(false);
    setHoldProgress(0);

    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    // Reset glow animation
    Animated.timing(glowAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [glowAnim]);

  // Handle tap for safe/moderate choices
  const handlePress = useCallback(() => {
    if (disabled) return;

    if (choice.riskLevel !== 'risky') {
      tapFeedback();
      onChoose(choice);
    }
  }, [disabled, choice, onChoose]);

  const colors = getColors();
  const isRisky = choice.riskLevel === 'risky';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: isRisky ? pulseAnim : 1 }],
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {/* Glow effect for risky choices */}
      {isRisky && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              backgroundColor: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(244, 67, 54, 0)', 'rgba(244, 67, 54, 0.4)'],
              }),
              transform: [
                {
                  scale: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  }),
                },
              ],
            },
          ]}
        />
      )}

      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.pressable,
          pressed && !isRisky && styles.pressed,
        ]}
      >
        <LinearGradient
          colors={colors.gradient}
          style={[
            styles.button,
            { borderColor: colors.border },
            isRisky && styles.riskyButton,
            choice.isLifeDefining && styles.lifeDefiningButton,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Progress indicator for risky choices */}
          {isRisky && holdProgress > 0 && (
            <View
              style={[
                styles.progressOverlay,
                { width: `${holdProgress * 100}%` },
              ]}
            />
          )}

          {/* Risk indicator */}
          <View style={styles.riskIndicator}>
            <Text style={styles.riskText}>
              {choice.riskLevel === 'safe' && '●'}
              {choice.riskLevel === 'moderate' && '●●'}
              {choice.riskLevel === 'risky' && '●●●'}
            </Text>
          </View>

          {/* Choice text */}
          <Text style={styles.choiceText} numberOfLines={3}>
            {choice.text}
          </Text>

          {/* Life-defining indicator */}
          {choice.isLifeDefining && (
            <View style={styles.lifeDefiningBadge}>
              <Text style={styles.lifeDefiningText}>Defining Moment</Text>
            </View>
          )}

          {/* Hold instruction for risky choices */}
          {isRisky && !isPressed && (
            <Text style={styles.holdInstruction}>Hold to commit</Text>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  glowEffect: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 20,
  },
  pressable: {
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  button: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    minHeight: 80,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  riskyButton: {
    borderWidth: 3,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  lifeDefiningButton: {
    borderStyle: 'solid',
    borderWidth: 3,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  riskIndicator: {
    position: 'absolute',
    top: 8,
    right: 12,
  },
  riskText: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 2,
  },
  choiceText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    lineHeight: 22,
    paddingRight: 20,
  },
  lifeDefiningBadge: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lifeDefiningText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  holdInstruction: {
    marginTop: 8,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
});

export default ChoiceButton;
