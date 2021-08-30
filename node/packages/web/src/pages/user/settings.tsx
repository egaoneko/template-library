import SettingsPageContainer from '@components/pages/user/SettingsPageContainer';
import { withAuth } from '@utils/auth';
import React, { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <SettingsPageContainer {...props} />;
}

export default Index;

export const getServerSideProps = withAuth<PropsType>(null, { successUrl: '/user/settings' });
