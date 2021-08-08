import HomePageContainer from '@components/pages/HomePageContainer';
import BaseLayoutTemplate from '@components/templates/layout/BaseLayoutTemplate';
import { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <HomePageContainer {...props} />;
}

Index.layout = BaseLayoutTemplate;

export default Index;
