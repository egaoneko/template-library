import React from 'react';
import renderer from 'react-test-renderer';
import { UserStore } from '../../../../../src/stores/UserStore';
import { Provider } from 'mobx-react';
import SettingsPageContainer from '../../../../../src/components/pages/user/SettingsPageContainer';

describe('User Settings Snapshots', () => {
  let userStore;

  beforeEach(() => {
    userStore = new UserStore();
  });

  it('renders user settings', async () => {
    await userStore.hydrate(require('../../../../../__mocks__/user/user.json'));
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <SettingsPageContainer />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
