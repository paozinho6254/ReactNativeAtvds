import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import TankDetailsScreen from '../screens/TankDetailsScreen';

const Stack = createNativeStackNavigator();

const COLORS = {
  background: '#121212',
  primaryText: '#EAEAEA',
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="TankDetails"
          component={TankDetailsScreen}
          options={({ route }) => ({
            title: route.params.tankTitle,
            headerShown: true,
            headerStyle: {
              backgroundColor: COLORS.background,
            },
            headerTintColor: COLORS.primaryText,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;