import SignUpPageContainer from '@components/pages/auth/SignUpPageContainer';
import React, { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <SignUpPageContainer {...props} />;
}

export default Index;
