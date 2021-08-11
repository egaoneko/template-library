import HomePageContainer from '@components/pages/HomePageContainer';
import { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <HomePageContainer {...props} />;
}

export default Index;
