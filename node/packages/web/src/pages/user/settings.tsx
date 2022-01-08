import SettingsPageContainer from 'src/components/pages/user/SettingsPageContainer';
import React, { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <SettingsPageContainer {...props} />;
}

export default Index;
