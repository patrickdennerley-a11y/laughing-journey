// PARALLEL - Insights Screen
// Displays the player's psychological profile and behavioral patterns

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TraitName } from '../types';
import { useProfileStore } from '../stores/profileStore';

type InsightsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Insights'>;

interface InsightsScreenProps {
  navigation: InsightsScreenNavigationProp;
}

const TRAIT_LABELS: Record<TraitName, { low: string; high: string }> = {
  riskTolerance: { low: 'Cautious', high: 'Daring' },
  loyaltyVsFreedom: { low: 'Free Spirit', high: 'Loyal' },
  truthVsPeace: { low: 'Peacekeeper', high: 'Truth Seeker' },
  ambitionVsContentment: { low: 'Content', high: 'Ambitious' },
  forgivenessVsJustice: { low: 'Just', high: 'Forgiving' },
  spontaneityVsPlanning: { low: 'Planner', high: 'Spontaneous' },
  selfVsOthers: { low: 'Selfless', high: 'Self-focused' },
};

const TRAIT_NAMES: Record<TraitName, string> = {
  riskTolerance: 'Risk Tolerance',
  loyaltyVsFreedom: 'Loyalty vs Freedom',
  truthVsPeace: 'Truth vs Peace',
  ambitionVsContentment: 'Ambition vs Contentment',
  forgivenessVsJustice: 'Forgiveness vs Justice',
  spontaneityVsPlanning: 'Spontaneity vs Planning',
  selfVsOthers: 'Self vs Others',
};

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ navigation }) => {
  const { profile, getInsights } = useProfileStore();
  const insights = useMemo(() => getInsights(), [profile]);

  const handleBack = () => {
    navigation.goBack();
  };

  const renderTraitBar = (trait: TraitName, value: number) => {
    const labels = TRAIT_LABELS[trait];
    const isLeftLeaning = value < 50;
    const isRightLeaning = value > 50;
    const intensity = Math.abs(value - 50);

    return (
      <View style={styles.traitItem} key={trait}>
        <Text style={styles.traitName}>{TRAIT_NAMES[trait]}</Text>
        <View style={styles.traitBarContainer}>
          <Text style={[styles.traitLabel, isLeftLeaning && styles.activeLabel]}>
            {labels.low}
          </Text>
          <View style={styles.traitBar}>
            {/* Center marker */}
            <View style={styles.centerMarker} />
            {/* Value indicator */}
            <View
              style={[
                styles.traitIndicator,
                { left: `${value}%` },
              ]}
            />
            {/* Fill from center to value */}
            {value !== 50 && (
              <View
                style={[
                  styles.traitFill,
                  value < 50
                    ? { right: '50%', width: `${50 - value}%` }
                    : { left: '50%', width: `${value - 50}%` },
                  {
                    backgroundColor:
                      value < 50 ? 'rgba(147, 112, 219, 0.5)' : 'rgba(233, 69, 96, 0.5)',
                  },
                ]}
              />
            )}
          </View>
          <Text style={[styles.traitLabel, isRightLeaning && styles.activeLabel]}>
            {labels.high}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Mirror</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Traits Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Traits</Text>
            <Text style={styles.sectionSubtitle}>
              How your choices have shaped you
            </Text>

            <View style={styles.traitsContainer}>
              {(Object.keys(profile.traits) as TraitName[]).map((trait) =>
                renderTraitBar(trait, profile.traits[trait])
              )}
            </View>
          </View>

          {/* Fixed Points Section */}
          {profile.fixedPoints.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fixed Points</Text>
              <Text style={styles.sectionSubtitle}>
                Behaviors that define you
              </Text>

              {profile.fixedPoints.map((fp) => (
                <View key={fp.id} style={styles.fixedPointCard}>
                  <View style={styles.fixedPointHeader}>
                    <Text style={styles.fixedPointDirection}>
                      {fp.direction === 'always' ? 'ALWAYS' : 'NEVER'}
                    </Text>
                    <Text style={styles.fixedPointConfidence}>
                      {Math.round(fp.confidence * 100)}% consistent
                    </Text>
                  </View>
                  <Text style={styles.fixedPointBehavior}>{fp.behavior}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Patterns Section */}
          {profile.patterns.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detected Patterns</Text>
              <Text style={styles.sectionSubtitle}>
                Recurring themes in your choices
              </Text>

              {profile.patterns.map((pattern) => (
                <View key={pattern.id} style={styles.patternCard}>
                  <Text style={styles.patternName}>{pattern.name}</Text>
                  <Text style={styles.patternDescription}>{pattern.description}</Text>
                  <View style={styles.patternFrequency}>
                    <View
                      style={[
                        styles.frequencyBar,
                        { width: `${pattern.frequency * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.patternFrequencyText}>
                    Occurs {Math.round(pattern.frequency * 100)}% of the time
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.totalLives}</Text>
                <Text style={styles.statLabel}>Total Lives</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.patternCount}</Text>
                <Text style={styles.statLabel}>Patterns Found</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.fixedPointCount}</Text>
                <Text style={styles.statLabel}>Fixed Points</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {profile.unlockedArchetypes.length}
                </Text>
                <Text style={styles.statLabel}>Archetypes</Text>
              </View>
            </View>
          </View>

          {/* Empty state */}
          {profile.totalLivesPlayed < 5 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Live more lives to discover deeper patterns about yourself.
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {5 - profile.totalLivesPlayed} more lives until first insights
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width } = Dimensions.get('window');

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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 16,
  },
  traitsContainer: {
    gap: 20,
  },
  traitItem: {
    marginBottom: 8,
  },
  traitName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    textAlign: 'center',
  },
  traitBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  traitLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    width: 70,
    textAlign: 'center',
  },
  activeLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  traitBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginHorizontal: 8,
    position: 'relative',
  },
  centerMarker: {
    position: 'absolute',
    left: '50%',
    top: -2,
    bottom: -2,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginLeft: -1,
  },
  traitIndicator: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginLeft: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  traitFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
  fixedPointCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  fixedPointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fixedPointDirection: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e94560',
    letterSpacing: 1,
  },
  fixedPointConfidence: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  fixedPointBehavior: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  patternCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  patternName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  patternDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
    marginBottom: 12,
  },
  patternFrequency: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  frequencyBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  patternFrequencyText: {
    marginTop: 4,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 48 - 12) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyStateSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});

export default InsightsScreen;
