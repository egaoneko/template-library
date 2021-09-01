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
import {StatusBar} from 'react-native';
import useDarkMode from './hooks/useDarkMode';
import CommonNavigator from './navigators/CommonNavigator';
import {stores} from './stores/stores';

const App = () => {
  return (
    <>
      <StatusBar barStyle={useDarkMode() ? 'light-content' : 'dark-content'} />
      <Provider {...stores}>
        <CommonNavigator />
      </Provider>
    </>
  );
};

export default App;
