// PARALLEL - Haptics Utilities
// Tactile feedback functions using expo-haptics

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Check if haptics are available on this device
const isHapticsAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

// Light tap feedback for safe choices
export const tapFeedback = async (): Promise<void> => {
  if (!isHapticsAvailable) return;

  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Silently fail if haptics unavailable
    console.debug('Haptics unavailable:', error);
  }
};

// Increasing vibration during hold (0-1 progress)
export const holdFeedback = async (progress: number): Promise<void> => {
  if (!isHapticsAvailable) return;

  try {
    // Intensity increases with progress
    if (progress < 0.33) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (progress < 0.66) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  } catch (error) {
    console.debug('Haptics unavailable:', error);
  }
};

// Strong impact when risky choice confirms
export const commitFeedback = async (): Promise<void> => {
  if (!isHapticsAvailable) return;

  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Small delay then another impact for emphasis
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 100);
  } catch (error) {
    console.debug('Haptics unavailable:', error);
  }
};

// Sequence of vibrations for death screen
export const deathFeedback = async (): Promise<void> => {
  if (!isHapticsAvailable) return;

  try {
    // Three descending impacts
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 150);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 300);
  } catch (error) {
    console.debug('Haptics unavailable:', error);
  }
};

// Selection feedback for UI interactions
export const selectionFeedback = async (): Promise<void> => {
  if (!isHapticsAvailable) return;

  try {
    await Haptics.selectionAsync();
  } catch (error) {
    console.debug('Haptics unavailable:', error);
  }
};

// Notification feedback for important events
export const notificationFeedback = async (
  type: 'success' | 'warning' | 'error'
): Promise<void> => {
  if (!isHapticsAvailable) return;

  try {
    switch (type) {
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch (error) {
    console.debug('Haptics unavailable:', error);
  }
};

// Hesitation feedback - gentle pulse during breath pause
export const hesitationFeedback = async (): Promise<void> => {
  if (!isHapticsAvailable) return;

  try {
    // Slow, gentle pulse pattern
    for (let i = 0; i < 3; i++) {
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, i * 600);
    }
  } catch (error) {
    console.debug('Haptics unavailable:', error);
  }
};

// Archetype unlock feedback - celebratory pattern
export const archetypeUnlockFeedback = async (): Promise<void> => {
  if (!isHapticsAvailable) return;

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 200);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 350);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 500);
  } catch (error) {
    console.debug('Haptics unavailable:', error);
  }
};
