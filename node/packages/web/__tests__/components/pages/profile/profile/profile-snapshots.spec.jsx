import React from 'react';
import renderer from 'react-test-renderer';
import { UserStore } from '../../../../../src/stores/UserStore';
import { Provider } from 'mobx-react';
import ProfilePageContainer from '../../../../../src/components/pages/profile/ProfilePageContainer';

import { useQuery } from 'react-query';

jest.mock('react-query', () => ({
  useQuery: jest.fn(args => {
    const response = {
      isLoading: false,
      isError: false,
    };
    if (args[0] === 'article-list') {
      response.data = require('../../../../../__mocks__/article/articles.json');
    } else if (args[0] === 'profile') {
      response.data = require('../../../../../__mocks__/profile/user.json');
    }
    return response;
  }),
}));

describe('Profile Snapshots', () => {
  let userStore;

  beforeEach(() => {
    userStore = new UserStore();
  });

  it('renders profile before login', async () => {
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <ProfilePageContainer />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders profile after login', async () => {
    await userStore.hydrate(require('../../../../../__mocks__/user/user.json'));
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <ProfilePageContainer />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders profile after login with other user', async () => {
    await userStore.hydrate(require('../../../../../__mocks__/user/other-user.json'));
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <ProfilePageContainer />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
