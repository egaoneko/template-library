import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import {mainRoutes} from './routes';
import {COLOR_SET} from '../enums/color';
import useDarkMode from '../hooks/useDarkMode';
import {NavigationState} from '@react-navigation/core';
import { COMMON_NAVIGATION_TYPE } from '../enums/common-navigation';
import { MAIN_NAVIGATION_TYPE } from '../enums/main-navigation';

const Tab = createBottomTabNavigator();

const DEFAULT_OPTIONS = {
  headerShown: false,
};

const MainNavigator = () => {
  const isDarkMode = useDarkMode();

  return (
    <Tab.Navigator
      initialRouteName={COMMON_NAVIGATION_TYPE.SPLASH}
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({color, size}) => {
          let name: string;

          switch (route.name) {
            case MAIN_NAVIGATION_TYPE.HOME:
              name = 'home';
              break;
            case MAIN_NAVIGATION_TYPE.FEED:
              name = 'select1';
              break;
            case MAIN_NAVIGATION_TYPE.POST_ARTICLE:
              name = 'form';
              break;
            case MAIN_NAVIGATION_TYPE.SETTINGS:
              name = 'user';
              break;
            default:
              name = 'question';
              break;
          }

          return <Icon name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLOR_SET.PRIMARY,
        tabBarInactiveTintColor: isDarkMode
          ? COLOR_SET.DARK_MODE_TEXT
          : COLOR_SET.LIGHT_MODE_TEXT,
        tabBarStyle: {
          backgroundColor: isDarkMode
            ? COLOR_SET.DARK_MODE_BACKGROUND
            : COLOR_SET.LIGHT_MODE_BACKGROUND,
        },
      })}
      screenListeners={({navigation}) => ({
        state: ({data}) => {
          // Do something with the state
          const state = (data as {state: NavigationState}).state;
          const {index, routes} = state;
          console.log('state changed', routes[index]);
        },
      })}>
      {mainRoutes.map(route => {
        const {name, options, ...other} = route;
        return (
          <Tab.Screen
            key={name}
            name={name}
            options={{...DEFAULT_OPTIONS, ...options}}
            {...other}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default MainNavigator;
