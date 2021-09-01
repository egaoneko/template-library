import React, {FC} from 'react';
import styled from 'styled-components/native';
import {Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import BaseLayoutTemplate from '../../../../templates/layout/BaseLayoutTemplate';
import IconButton from '../../../../atoms/button/IconButton';
import {RootStackParamList} from '../../../../../interfaces/common';

type PropsType = NativeStackScreenProps<RootStackParamList, 'Home'>;

const FeedPageContainer: FC<PropsType> = ({route}) => {
  return (
    <BaseLayoutTemplate
      route={route.name}
      title="Your feed"
      topBarButton={<IconButton name="search" size={20} />}>
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
