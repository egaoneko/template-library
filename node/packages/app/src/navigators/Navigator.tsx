import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationType} from '../enums/navigation';
import {commonRoutes} from './routes';

const Stack = createNativeStackNavigator();
const Navigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName={NavigationType.SPLASH}>
      {commonRoutes.map(route => (
        <Stack.Screen key={route.name} {...route} />
      ))}
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigator;
