import React, {FC} from 'react';
import styled from 'styled-components/native';
import {Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import BaseLayoutTemplate from '../../../../templates/layout/BaseLayoutTemplate';
import {RootStackParamList} from '../../../../../interfaces/common';

type PropsType = NativeStackScreenProps<RootStackParamList, 'POST_ARTICLE'>;

const PostArticlePageContainer: FC<PropsType> = () => {
  return (
    <BaseLayoutTemplate>
      <Container>
        <Text>Post article</Text>
      </Container>
    </BaseLayoutTemplate>
  );
};

export default PostArticlePageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
