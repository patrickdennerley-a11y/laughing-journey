// PARALLEL - Hesitation Overlay Component
// A pause overlay that appears before life-defining choices

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { hesitationFeedback } from '../utils/haptics';

interface HesitationOverlayProps {
  visible: boolean;
  onComplete: () => void;
}

const HESITATION_DURATION = 2000; // 2 seconds

export const HesitationOverlay: React.FC<HesitationOverlayProps> = ({
  visible,
  onComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const breathAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Start breathing animation
      const breathingLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(breathAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      breathingLoop.start();

      // Haptic feedback
      hesitationFeedback();

      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          breathingLoop.stop();
          onComplete();
        });
      }, HESITATION_DURATION);

      return () => {
        clearTimeout(timer);
        breathingLoop.stop();
      };
    }
  }, [visible, fadeAnim, scaleAnim, breathAnim, onComplete]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            transform: [
              { scale: scaleAnim },
              { scale: breathAnim },
            ],
          },
        ]}
      >
        <Text style={styles.breatheText}>Breathe</Text>
        <Text style={styles.subText}>This moment matters</Text>

        {/* Breathing circle indicator */}
        <Animated.View
          style={[
            styles.breathCircle,
            {
              transform: [{ scale: breathAnim }],
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  breatheText: {
    fontSize: 36,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 8,
    textTransform: 'uppercase',
  },
  subText: {
    marginTop: 16,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
  breathCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});

export default HesitationOverlay;
