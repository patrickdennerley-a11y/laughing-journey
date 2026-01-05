// PARALLEL - Archetype Card Component
// Displays an archetype in the collection gallery

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Archetype, Rarity } from '../types';

interface ArchetypeCardProps {
  archetype: Archetype;
  isUnlocked: boolean;
  progress: number; // 0-100 for locked archetypes
  onPress?: () => void;
}

const getRarityColors = (rarity: Rarity): [string, string] => {
  switch (rarity) {
    case 'common':
      return ['#607D8B', '#455A64'];
    case 'uncommon':
      return ['#4CAF50', '#388E3C'];
    case 'rare':
      return ['#2196F3', '#1565C0'];
    case 'legendary':
      return ['#9C27B0', '#6A1B9A'];
  }
};

const getRarityLabel = (rarity: Rarity): string => {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
};

export const ArchetypeCard: React.FC<ArchetypeCardProps> = ({
  archetype,
  isUnlocked,
  progress,
  onPress,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isUnlocked && archetype.rarity === 'legendary') {
      // Legendary cards get a shimmer effect
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
      return () => shimmer.stop();
    }
  }, [isUnlocked, archetype.rarity, shimmerAnim]);

  const rarityColors = getRarityColors(archetype.rarity);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <LinearGradient
        colors={isUnlocked ? rarityColors : ['#2a2a3a', '#1a1a2a']}
        style={[styles.card, !isUnlocked && styles.lockedCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Legendary shimmer overlay */}
        {isUnlocked && archetype.rarity === 'legendary' && (
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                opacity: shimmerAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0.3, 0],
                }),
              },
            ]}
          />
        )}

        {/* Rarity indicator */}
        <View
          style={[
            styles.rarityBadge,
            { backgroundColor: isUnlocked ? rarityColors[0] : 'rgba(100, 100, 100, 0.5)' },
          ]}
        >
          <Text style={styles.rarityText}>
            {getRarityLabel(archetype.rarity)}
          </Text>
        </View>

        {/* Icon */}
        <View style={[styles.iconContainer, !isUnlocked && styles.lockedIcon]}>
          <Text style={styles.iconText}>
            {isUnlocked ? archetype.icon : '?'}
          </Text>
        </View>

        {/* Name */}
        <Text
          style={[
            styles.nameText,
            !isUnlocked && styles.lockedText,
          ]}
          numberOfLines={2}
        >
          {isUnlocked ? archetype.name : '???'}
        </Text>

        {/* Description or progress */}
        {isUnlocked ? (
          <Text style={styles.descriptionText} numberOfLines={3}>
            {archetype.description}
          </Text>
        ) : (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{progress}% discovered</Text>
          </View>
        )}

        {/* Locked overlay */}
        {!isUnlocked && (
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48 - 16) / 2; // 48 = padding, 16 = gap

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    minHeight: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  lockedCard: {
    opacity: 0.7,
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  rarityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  lockedIcon: {
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
  },
  iconText: {
    fontSize: 28,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  lockedText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  descriptionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
  },
  progressText: {
    marginTop: 4,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  lockIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
});

export default ArchetypeCard;
