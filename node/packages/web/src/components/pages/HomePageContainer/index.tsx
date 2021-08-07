import HeaderTemplates from '@components/templates/layout/HeaderTemplates';
import Head from '@components/atoms/layout/Head';
import React, { FC, ReactNode } from 'react';
import HomeContentTemplate from './templates/HomeContentTemplate';

interface PropsType {
  children?: ReactNode;
}

const HomePageContainer: FC<PropsType> = props => {
  return (
    <>
      <Head title={'HOME'} />
      <HeaderTemplates
        headingTitle={'conduit'}
        bannerTitle={'conduit'}
        bannerDescription={'A place to share your knowledge.'}
      />
      <HomeContentTemplate />
    </>
  );
};

export default HomePageContainer;
