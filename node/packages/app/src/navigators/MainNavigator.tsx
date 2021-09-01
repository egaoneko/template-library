import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import {NAVIGATION_TYPE} from '../enums/navigation';
import {mainRoutes} from './routes';
import {COLOR_SET} from '../enums/color';
import useDarkMode from '../hooks/useDarkMode';

const Tab = createBottomTabNavigator();

const DEFAULT_OPTIONS = {
  headerShown: false,
};

const MainNavigator = () => {
  const isDarkMode = useDarkMode();

  return (
    <Tab.Navigator
      initialRouteName={NAVIGATION_TYPE.SPLASH}
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({color, size}) => {
          let name: string;

          switch (route.name) {
            case NAVIGATION_TYPE.HOME:
              name = 'home';
              break;
            case NAVIGATION_TYPE.FEED:
              name = 'select1';
              break;
            case NAVIGATION_TYPE.POST_ARTICLE:
              name = 'form';
              break;
            case NAVIGATION_TYPE.SETTINGS:
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
