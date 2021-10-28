import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {commonRoutes} from './routes';
import { COMMON_NAVIGATION_TYPE } from '../enums/common-navigation';

const Stack = createNativeStackNavigator();

const DEFAULT_OPTIONS = {
  headerShown: false,
};

const CommonNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName={COMMON_NAVIGATION_TYPE.SPLASH}>
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
