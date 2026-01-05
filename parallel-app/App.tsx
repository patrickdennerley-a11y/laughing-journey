// PARALLEL - Main App Entry Point
// Life simulation game with psychological insights

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useProfileStore } from './src/stores/profileStore';

// Loading screen component
const LoadingScreen: React.FC = () => (
  <LinearGradient
    colors={['#1a1a2e', '#16213e', '#0f3460']}
    style={styles.loadingContainer}
  >
    <Text style={styles.loadingTitle}>PARALLEL</Text>
    <ActivityIndicator size="large" color="#e94560" style={styles.loader} />
    <Text style={styles.loadingText}>Loading your mirror...</Text>
  </LinearGradient>
);

export default function App() {
  const { isLoaded, loadProfile } = useProfileStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load user profile from AsyncStorage
        await loadProfile();
        // Small delay for smooth transition
        setTimeout(() => setIsReady(true), 500);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Still allow app to start even if profile fails to load
        setIsReady(true);
      }
    };

    initializeApp();
  }, [loadProfile]);

  if (!isReady) {
    return (
      <>
        <LoadingScreen />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: '#e94560',
            background: '#1a1a2e',
            card: '#16213e',
            text: '#FFFFFF',
            border: 'rgba(255, 255, 255, 0.1)',
            notification: '#e94560',
          },
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400' as const,
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500' as const,
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700' as const,
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900' as const,
            },
          },
        }}
      >
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 48,
    fontWeight: '100',
    color: '#FFFFFF',
    letterSpacing: 16,
    marginBottom: 40,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
});
