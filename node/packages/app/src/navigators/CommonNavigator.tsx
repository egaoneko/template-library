import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION_TYPE} from '../enums/navigation';
import {commonRoutes} from './routes';

const Stack = createNativeStackNavigator();

const DEFAULT_OPTIONS = {
  headerShown: false,
};

const CommonNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName={NAVIGATION_TYPE.SPLASH}>
      {commonRoutes.map(route => {
        const {name, options, ...other} = route;
        return (
          <Stack.Screen
            key={name}
            name={name}
            options={{...DEFAULT_OPTIONS, ...options}}
            {...other}
          />
        );
      })}
    </Stack.Navigator>
  </NavigationContainer>
);

export default CommonNavigator;
