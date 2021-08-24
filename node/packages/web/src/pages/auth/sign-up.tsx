import SignUpPageContainer from '@components/pages/auth/SignUpPageContainer';
import { withAuth } from '@utils/auth';
import React, { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <SignUpPageContainer {...props} />;
}

export default Index;

export const getServerSideProps = withAuth<PropsType>(null, { optional: true, bypass: true });
