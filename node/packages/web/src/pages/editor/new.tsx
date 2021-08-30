import EditorNewPageContainer from '@components/pages/editor/EditorNewPageContainer';
import { withAuth } from '@utils/auth';
import React, { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <EditorNewPageContainer {...props} />;
}

export default Index;

export const getServerSideProps = withAuth<PropsType>(null, { successUrl: '/editor/new' });
