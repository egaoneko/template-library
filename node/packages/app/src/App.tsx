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
import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import Navigator from './navigators/Navigator';
import {stores} from './stores/stores';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Provider {...stores}>
        <Navigator />
      </Provider>
    </>
  );
};

export default App;
