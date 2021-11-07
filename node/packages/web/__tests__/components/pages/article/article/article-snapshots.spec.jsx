import React from 'react';
import renderer from 'react-test-renderer';
import { UserStore } from '../../../../../src/stores/UserStore';
import { Provider } from 'mobx-react';
import ArticlePageContainer from '../../../../../src/components/pages/article/ArticlePageContainer';

jest.mock('react-query', () => ({
  useQuery: jest.fn(args => {
    const response = {
      isLoading: false,
      isError: false,
    };
    if (args[0] === 'article') {
      if (args[1] === 'how-to-train-your-dragon') {
        response.data = require('../../../../../__mocks__/article/article.json');
      } else {
        response.data = require('../../../../../__mocks__/article/other-article.json');
      }
    } else if (args[0] === 'comment-list') {
      response.data = require('../../../../../__mocks__/article/comments.json');
    }
    return response;
  }),
}));

describe('Article Snapshots', () => {
  let userStore;

  beforeEach(() => {
    userStore = new UserStore();
  });

  it('renders article before login', async () => {
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <ArticlePageContainer slug={'how-to-train-your-dragon'} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders article after login', async () => {
    await userStore.hydrate(require('../../../../../__mocks__/user/user.json'));
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <ArticlePageContainer slug={'how-to-train-your-dragon'} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders article after login with other article', async () => {
    await userStore.hydrate(require('../../../../../__mocks__/user/user.json'));
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <ArticlePageContainer slug={'how-to-train-your-dragon-2'} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders article after login with other user', async () => {
    await userStore.hydrate(require('../../../../../__mocks__/user/other-user.json'));
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <ArticlePageContainer slug={'how-to-train-your-dragon'} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
