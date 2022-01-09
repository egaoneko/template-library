import React, { ReactNode } from 'react';

import SettingsPageContainer from 'src/components/pages/user/SettingsPageContainer';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <SettingsPageContainer {...props} />;
}

export default Index;
