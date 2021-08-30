import React from 'react';
import renderer from 'react-test-renderer';
import { UserStore } from '../../../../../src/stores/UserStore';
import { Provider } from 'mobx-react';
import EditorNewPageContainer from '../../../../../src/components/pages/editor/EditorNewPageContainer';

describe('Editor New Snapshots', () => {
  let userStore;

  beforeEach(() => {
    userStore = new UserStore();
  });

  it('renders editor new', async () => {
    await userStore.hydrate(require('../../../../../__mocks__/user/user.json'));
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <EditorNewPageContainer />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
