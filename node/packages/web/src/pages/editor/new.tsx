import React, { ReactNode } from 'react';

import EditorNewPageContainer from 'src/components/pages/editor/EditorNewPageContainer';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <EditorNewPageContainer {...props} />;
}

export default Index;
