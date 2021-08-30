import React from 'react';
import renderer from 'react-test-renderer';
import { UserStore } from '../../../../../src/stores/UserStore';
import { Provider } from 'mobx-react';
import SignInPageContainer from '../../../../../src/components/pages/auth/SignInPageContainer';

describe('Sign in Snapshots', () => {
  let userStore;

  beforeEach(() => {
    userStore = new UserStore();
  });

  it('renders sign in', () => {
    const tree = renderer
      .create(
        <Provider userStore={userStore}>
          <SignInPageContainer />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
