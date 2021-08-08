import SignUpPageContainer from '@components/pages/auth/SignUpPageContainer';
import BaseLayoutTemplate from '@components/templates/layout/BaseLayoutTemplate';
import React, { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <SignUpPageContainer {...props} />;
}

Index.layout = BaseLayoutTemplate;

export default Index;
