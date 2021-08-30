import React from 'react';
import renderer from 'react-test-renderer';
import { UserStore } from '../../../../../src/stores/UserStore';
import { Provider } from 'mobx-react';
import SignInPageContainer from '../../../../../src/components/pages/auth/SignUpPageContainer';

describe('Sign up Snapshots', () => {
  let userStore;

  beforeEach(() => {
    userStore = new UserStore();
  });

  it('renders sign up', () => {
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
