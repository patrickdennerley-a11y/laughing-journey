// PARALLEL - Archetype Gallery Screen
// Displays all archetypes as a collection to unlock

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Archetype, Rarity } from '../types';
import { useProfileStore } from '../stores/profileStore';
import { archetypes } from '../data/archetypes';
import { ArchetypeCard } from '../components/ArchetypeCard';
import { calculateArchetypeProgress } from '../utils/analytics';

type ArchetypeGalleryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ArchetypeGallery'
>;

interface ArchetypeGalleryScreenProps {
  navigation: ArchetypeGalleryScreenNavigationProp;
}

type FilterType = 'all' | 'unlocked' | 'locked';
type SortType = 'rarity' | 'recent' | 'progress';

export const ArchetypeGalleryScreen: React.FC<ArchetypeGalleryScreenProps> = ({
  navigation,
}) => {
  const { profile } = useProfileStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('rarity');
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  // Calculate progress for all archetypes
  const archetypeProgress = useMemo(() => {
    const progressMap = new Map<string, number>();
    archetypes.forEach((archetype) => {
      progressMap.set(
        archetype.id,
        profile.unlockedArchetypes.includes(archetype.id)
          ? 100
          : calculateArchetypeProgress(profile, archetype)
      );
    });
    return progressMap;
  }, [profile]);

  // Filter and sort archetypes
  const displayedArchetypes = useMemo(() => {
    let filtered = [...archetypes];

    // Apply filter
    switch (filter) {
      case 'unlocked':
        filtered = filtered.filter((a) =>
          profile.unlockedArchetypes.includes(a.id)
        );
        break;
      case 'locked':
        filtered = filtered.filter(
          (a) => !profile.unlockedArchetypes.includes(a.id)
        );
        break;
    }

    // Apply sort
    const rarityOrder: Record<Rarity, number> = {
      legendary: 0,
      rare: 1,
      uncommon: 2,
      common: 3,
    };

    switch (sort) {
      case 'rarity':
        filtered.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        break;
      case 'recent':
        // Sort unlocked first, then by order in unlockedArchetypes
        filtered.sort((a, b) => {
          const aUnlocked = profile.unlockedArchetypes.includes(a.id);
          const bUnlocked = profile.unlockedArchetypes.includes(b.id);
          if (aUnlocked && !bUnlocked) return -1;
          if (!aUnlocked && bUnlocked) return 1;
          if (aUnlocked && bUnlocked) {
            return (
              profile.unlockedArchetypes.indexOf(b.id) -
              profile.unlockedArchetypes.indexOf(a.id)
            );
          }
          return 0;
        });
        break;
      case 'progress':
        filtered.sort((a, b) => {
          const aProgress = archetypeProgress.get(a.id) || 0;
          const bProgress = archetypeProgress.get(b.id) || 0;
          return bProgress - aProgress;
        });
        break;
    }

    return filtered;
  }, [filter, sort, profile, archetypeProgress]);

  const handleArchetypePress = (archetype: Archetype) => {
    setSelectedArchetype(archetype);
  };

  const closeModal = () => {
    setSelectedArchetype(null);
  };

  const unlockedCount = profile.unlockedArchetypes.length;
  const totalCount = archetypes.length;

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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Archetypes</Text>
            <Text style={styles.headerSubtitle}>
              {unlockedCount}/{totalCount} discovered
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {/* Filter buttons */}
            <View style={styles.filterGroup}>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                onPress={() => setFilter('all')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === 'all' && styles.filterButtonTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'unlocked' && styles.filterButtonActive]}
                onPress={() => setFilter('unlocked')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === 'unlocked' && styles.filterButtonTextActive,
                  ]}
                >
                  Unlocked
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'locked' && styles.filterButtonActive]}
                onPress={() => setFilter('locked')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === 'locked' && styles.filterButtonTextActive,
                  ]}
                >
                  Locked
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterDivider} />

            {/* Sort buttons */}
            <View style={styles.filterGroup}>
              <TouchableOpacity
                style={[styles.filterButton, sort === 'rarity' && styles.filterButtonActive]}
                onPress={() => setSort('rarity')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    sort === 'rarity' && styles.filterButtonTextActive,
                  ]}
                >
                  Rarity
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, sort === 'progress' && styles.filterButtonActive]}
                onPress={() => setSort('progress')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    sort === 'progress' && styles.filterButtonTextActive,
                  ]}
                >
                  Progress
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, sort === 'recent' && styles.filterButtonActive]}
                onPress={() => setSort('recent')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    sort === 'recent' && styles.filterButtonTextActive,
                  ]}
                >
                  Recent
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Gallery Grid */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {displayedArchetypes.map((archetype) => (
              <ArchetypeCard
                key={archetype.id}
                archetype={archetype}
                isUnlocked={profile.unlockedArchetypes.includes(archetype.id)}
                progress={archetypeProgress.get(archetype.id) || 0}
                onPress={() => handleArchetypePress(archetype)}
              />
            ))}
          </View>

          {displayedArchetypes.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {filter === 'unlocked'
                  ? 'No archetypes unlocked yet. Keep playing!'
                  : 'No archetypes match this filter.'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Archetype Detail Modal */}
        <Modal
          visible={!!selectedArchetype}
          animationType="fade"
          transparent
          onRequestClose={closeModal}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeModal}
          >
            {selectedArchetype && (
              <View style={styles.modalContent}>
                <LinearGradient
                  colors={['#2a2a3a', '#1a1a2a']}
                  style={styles.modalCard}
                >
                  <Text style={styles.modalIcon}>{selectedArchetype.icon}</Text>
                  <Text style={styles.modalName}>{selectedArchetype.name}</Text>
                  <Text style={styles.modalRarity}>
                    {selectedArchetype.rarity.toUpperCase()}
                  </Text>
                  {profile.unlockedArchetypes.includes(selectedArchetype.id) ? (
                    <Text style={styles.modalDescription}>
                      {selectedArchetype.description}
                    </Text>
                  ) : (
                    <View style={styles.modalLocked}>
                      <Text style={styles.modalLockedText}>
                        Keep playing to discover this archetype
                      </Text>
                      <View style={styles.modalProgressBar}>
                        <View
                          style={[
                            styles.modalProgressFill,
                            {
                              width: `${archetypeProgress.get(selectedArchetype.id) || 0}%`,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.modalProgressText}>
                        {archetypeProgress.get(selectedArchetype.id) || 0}% discovered
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.modalCloseButtonText}>Close</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  headerSpacer: {
    width: 44,
  },
  filtersContainer: {
    paddingVertical: 12,
  },
  filtersScroll: {
    paddingHorizontal: 16,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: '#e94560',
  },
  filterButtonText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
  },
  modalCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  modalName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalRarity: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 2,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalLocked: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalLockedText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  modalProgressFill: {
    height: '100%',
    backgroundColor: '#e94560',
    borderRadius: 4,
  },
  modalProgressText: {
    marginTop: 8,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  modalCloseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  modalCloseButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default ArchetypeGalleryScreen;
