import React from 'react';
import renderer from 'react-test-renderer';
import { UserStore } from '../../../../../src/stores/UserStore';
import { Provider } from 'mobx-react';
import EditorEditPageContainer from '../../../../../src/components/pages/editor/EditorEditPageContainer';

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
          <EditorEditPageContainer article={require('../../../../../__mocks__/article/article.json')} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
