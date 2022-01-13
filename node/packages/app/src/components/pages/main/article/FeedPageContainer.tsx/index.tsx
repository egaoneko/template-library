import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import BaseLayoutTemplate from '../../../../templates/layout/BaseLayoutTemplate';
import IconButton from '../../../../atoms/button/IconButton';
import { CommonParamList, MainParamList } from '../../../../../interfaces/common';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'FEED'>
>;

const FeedPageContainer: FC<PropsType> = () => {
  return (
    <BaseLayoutTemplate title="Your feed" topBarButton={<IconButton name="search1" size={20} />}>
      <Container>
        <Text>Your feed</Text>
      </Container>
    </BaseLayoutTemplate>
  );
};

export default FeedPageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
