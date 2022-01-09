import React, { ReactNode } from 'react';

import SignUpPageContainer from 'src/components/pages/auth/SignUpPageContainer';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <SignUpPageContainer {...props} />;
}

export default Index;
