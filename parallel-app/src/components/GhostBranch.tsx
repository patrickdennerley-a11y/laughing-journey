// PARALLEL - Ghost Branch Component
// Displays the alternate path not taken

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

interface GhostBranchProps {
  text: string;
  onTap: () => void;
}

export const GhostBranch: React.FC<GhostBranchProps> = ({ text, onTap }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Shimmer animation
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    // Float animation
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 5,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    float.start();

    return () => {
      shimmer.stop();
      float.stop();
    };
  }, [shimmerAnim, floatAnim]);

  return (
    <TouchableOpacity onPress={onTap} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: floatAnim }],
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.6, 1, 0.6],
            }),
          },
        ]}
      >
        {/* Ghost effect layers */}
        <View style={styles.ghostLayer1} />
        <View style={styles.ghostLayer2} />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.prefixText}>In another life...</Text>
          <Text style={styles.mainText}>{text}</Text>
          <Text style={styles.tapText}>Tap to explore</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  ghostLayer1: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(147, 112, 219, 0.3)',
    opacity: 0.5,
  },
  ghostLayer2: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(147, 112, 219, 0.2)',
    opacity: 0.3,
  },
  content: {
    alignItems: 'center',
  },
  prefixText: {
    fontSize: 14,
    color: 'rgba(147, 112, 219, 0.9)',
    fontStyle: 'italic',
    marginBottom: 8,
    letterSpacing: 1,
  },
  mainText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
  },
  tapText: {
    marginTop: 16,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default GhostBranch;
