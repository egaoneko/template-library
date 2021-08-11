import Head from '@components/atoms/layout/Head';
import React, { FC, ReactNode } from 'react';
import HomeContentTemplate from './templates/HomeContentTemplate';
import { BasePropsType } from '@interfaces/common';
import BaseLayoutTemplate from '@components/templates/layout/BaseLayoutTemplate';

interface PropsType extends BasePropsType {
  children?: ReactNode;
}

const HomePageContainer: FC<PropsType> = props => {
  return (
    <BaseLayoutTemplate
      pathname={props.pathname}
      bannerTitle={'conduit'}
      bannerDescription={'A place to share your knowledge.'}
    >
      <Head title={'HOME'} />
      <HomeContentTemplate />
    </BaseLayoutTemplate>
  );
};

export default HomePageContainer;
