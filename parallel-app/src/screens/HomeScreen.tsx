// PARALLEL - Home Screen
// Main menu with options to start game, view insights, and browse archetypes

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useProfileStore } from '../stores/profileStore';
import { archetypes } from '../data/archetypes';
import { selectionFeedback } from '../utils/haptics';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { profile, isLoaded, loadProfile } = useProfileStore();

  useEffect(() => {
    if (!isLoaded) {
      loadProfile();
    }
  }, [isLoaded, loadProfile]);

  const handleStartGame = () => {
    selectionFeedback();
    navigation.navigate('Game');
  };

  const handleViewInsights = () => {
    selectionFeedback();
    navigation.navigate('Insights');
  };

  const handleViewArchetypes = () => {
    selectionFeedback();
    navigation.navigate('ArchetypeGallery');
  };

  // Get most recently unlocked archetype
  const recentArchetype = profile.unlockedArchetypes.length > 0
    ? archetypes.find(
        (a) => a.id === profile.unlockedArchetypes[profile.unlockedArchetypes.length - 1]
      )
    : null;

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>PARALLEL</Text>
          <Text style={styles.tagline}>Play your death. Win your life.</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.totalLivesPlayed}</Text>
            <Text style={styles.statLabel}>Lives Lived</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.unlockedArchetypes.length}</Text>
            <Text style={styles.statLabel}>Archetypes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.fixedPoints.length}</Text>
            <Text style={styles.statLabel}>Fixed Points</Text>
          </View>
        </View>

        {/* Recent Archetype */}
        {recentArchetype && (
          <View style={styles.recentArchetypeSection}>
            <Text style={styles.recentLabel}>Recently Unlocked</Text>
            <View style={styles.recentArchetype}>
              <Text style={styles.recentIcon}>{recentArchetype.icon}</Text>
              <Text style={styles.recentName}>{recentArchetype.name}</Text>
            </View>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartGame}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#e94560', '#c62a48']}
              style={styles.primaryButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.primaryButtonText}>Start New Life</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewInsights}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#4a4e69', '#22223b']}
              style={styles.secondaryButtonGradient}
            >
              <Text style={styles.secondaryButtonText}>Your Mirror</Text>
              <Text style={styles.secondaryButtonSubtext}>View insights about yourself</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewArchetypes}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#4a4e69', '#22223b']}
              style={styles.secondaryButtonGradient}
            >
              <Text style={styles.secondaryButtonText}>Archetypes</Text>
              <Text style={styles.secondaryButtonSubtext}>
                {profile.unlockedArchetypes.length}/{archetypes.length} discovered
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Every choice reveals who you really are
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: height * 0.08,
    marginBottom: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: '100',
    color: '#FFFFFF',
    letterSpacing: 16,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  recentArchetypeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  recentLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  recentArchetype: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(147, 112, 219, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recentIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  recentName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonsSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  secondaryButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
    fontStyle: 'italic',
  },
});

export default HomeScreen;
