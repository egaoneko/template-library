import EditorNewPageContainer from '@components/pages/editor/EditorNewPageContainer';
import React, { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <EditorNewPageContainer {...props} />;
}

export default Index;
