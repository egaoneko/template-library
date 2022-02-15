import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MY_NAVIGATION_TYPE } from 'src/enums/my-navigation';

import { myRoutes } from './routes';

const Stack = createNativeStackNavigator();

const DEFAULT_OPTIONS = {
  headerShown: false,
};

const MyNavigator: FC = () => (
  <NavigationContainer independent={true}>
    <Stack.Navigator initialRouteName={MY_NAVIGATION_TYPE.MY_MAIN}>
      {myRoutes.map(route => {
        const { name, options, ...other } = route;
        return <Stack.Screen key={name} name={name} options={{ ...DEFAULT_OPTIONS, ...options }} {...other} />;
      })}
    </Stack.Navigator>
  </NavigationContainer>
);

export default MyNavigator;
