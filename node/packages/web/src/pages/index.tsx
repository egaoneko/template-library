import HomePageContainer from '@components/pages/HomePageContainer';
import { withAuth } from '@utils/auth';
import { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <HomePageContainer {...props} />;
}

export default Index;

export const getServerSideProps = withAuth<PropsType>(null, { optional: true });
