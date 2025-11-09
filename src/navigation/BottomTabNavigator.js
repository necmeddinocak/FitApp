import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

// Screens
import { 
  HomeScreen, 
  ProgramScreen, 
  TrackingScreen, 
  MotivationScreen, 
  ProfileScreen 
} from '../screens';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  // Güvenli alan değerlerini kontrol et (web için fallback)
  const bottomInset = insets.bottom || 0;
  const tabBarHeight = Platform.OS === 'web' ? 60 : 60 + bottomInset;
  const tabBarPaddingBottom = bottomInset > 0 ? bottomInset : 8;
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Ana Sayfa') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Program') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Takip') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Motivasyon') {
            iconName = focused ? 'flame' : 'flame-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: TYPOGRAPHY.sizes.xs,
          fontWeight: TYPOGRAPHY.weights.medium,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        headerStyle: {
          backgroundColor: COLORS.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        },
        headerTitleStyle: {
          fontSize: TYPOGRAPHY.sizes.lg,
          fontWeight: TYPOGRAPHY.weights.bold,
          color: COLORS.text,
        },
      })}
    >
      <Tab.Screen 
        name="Ana Sayfa" 
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Program" 
        component={ProgramScreen}
      />
      <Tab.Screen 
        name="Takip" 
        component={TrackingScreen}
      />
      <Tab.Screen 
        name="Motivasyon" 
        component={MotivationScreen}
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

