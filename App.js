import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider, DataProvider } from './src/context';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { adMobService } from './src/services';

export default function App() {
  useEffect(() => {
    // AdMob'u başlat
    adMobService.initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <UserProvider>
        <DataProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <BottomTabNavigator />
          </NavigationContainer>
        </DataProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
