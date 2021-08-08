import HeaderTemplates from '@components/templates/layout/HeaderTemplates';
import Head from '@components/atoms/layout/Head';
import React, { FC, ReactNode } from 'react';
import HomeContentTemplate from './templates/HomeContentTemplate';
import { BasePropsType } from '@interfaces/common';

interface PropsType extends BasePropsType {
  children?: ReactNode;
}

const HomePageContainer: FC<PropsType> = props => {
  return (
    <>
      <Head title={'HOME'} />
      <HeaderTemplates
        pathname={props.pathname}
        headingTitle={'conduit'}
        bannerTitle={'conduit'}
        bannerDescription={'A place to share your knowledge.'}
      />
      <HomeContentTemplate />
    </>
  );
};

export default HomePageContainer;
