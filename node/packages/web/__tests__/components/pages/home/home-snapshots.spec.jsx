import React from 'react';
import renderer from 'react-test-renderer';
import { UserStore } from '../../../../src/stores/UserStore';
import { Provider } from 'mobx-react';
import HomePageContainer from '../../../../src/components/pages/HomePageContainer';
import { useQuery } from 'react-query';

jest.mock('react-query', () => ({
  useQuery: jest.fn(args => {
    const response = {
      isLoading: false,
      isError: false,
    };
    if (args[0] === 'article-list') {
      response.data = require('../../../../__mocks__/article/articles.json');
    } else if (args[0] === 'tag-list') {
      response.data = require('../../../../__mocks__/article/tags.json');
    }
    return response;
  }),
}));

describe('Home Snapshots', () => {
  let userStore;

  beforeEach(() => {
    userStore = new UserStore();
  });

  it('renders home before login', () => {
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <HomePageContainer />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders home after login', async () => {
    await userStore.hydrate(require('../../../../__mocks__/user/user.json'));
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <HomePageContainer />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
