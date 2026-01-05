// PARALLEL - App Navigator
// Stack-based navigation setup for the app

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { GameScreen } from '../screens/GameScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { ArchetypeGalleryScreen } from '../screens/ArchetypeGalleryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        contentStyle: {
          backgroundColor: '#1a1a2e',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{
          gestureEnabled: false, // Disable gesture during gameplay
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="Insights"
        component={InsightsScreen}
      />
      <Stack.Screen
        name="ArchetypeGallery"
        component={ArchetypeGalleryScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
