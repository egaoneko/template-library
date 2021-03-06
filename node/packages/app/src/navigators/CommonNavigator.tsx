import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COMMON_NAVIGATION_TYPE } from 'src/enums/common-navigation';

import { articleRoutes, commonRoutes, myRoutes } from './routes';

const Stack = createNativeStackNavigator();

const DEFAULT_OPTIONS = {
  headerShown: false,
};

const CommonNavigator: FC = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName={COMMON_NAVIGATION_TYPE.SPLASH}>
      {commonRoutes.map(route => {
        const { name, options, ...other } = route;
        return <Stack.Screen key={name} name={name} options={{ ...DEFAULT_OPTIONS, ...options }} {...other} />;
      })}
      {myRoutes.map(route => {
        const { name, options, ...other } = route;
        return <Stack.Screen key={name} name={name} options={{ ...DEFAULT_OPTIONS, ...options }} {...other} />;
      })}
      {articleRoutes.map(route => {
        const { name, options, ...other } = route;
        return <Stack.Screen key={name} name={name} options={{ ...DEFAULT_OPTIONS, ...options }} {...other} />;
      })}
    </Stack.Navigator>
  </NavigationContainer>
);

export default CommonNavigator;
