/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {Provider} from 'mobx-react';
import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components';
import {theme} from './constants/theme';
import {THEME} from './enums/theme';
import useDarkMode from './hooks/useDarkMode';
import CommonNavigator from './navigators/CommonNavigator';
import {Stores} from './stores/stores';
import {useUserStore} from './stores/UserStore';

const App = () => {
  const [stores] = useState<Stores>({
    userStore: useUserStore(null),
  });

  return (
    <ThemeProvider
      theme={useDarkMode() ? theme[THEME.DARK] : theme[THEME.LIGHT]}>
      <StatusBar barStyle={useDarkMode() ? 'light-content' : 'dark-content'} />
      <Provider {...stores}>
        <CommonNavigator />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
