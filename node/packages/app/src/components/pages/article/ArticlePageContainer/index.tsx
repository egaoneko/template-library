import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { ArticleParamList } from 'src/interfaces/common';

type PropsType = NativeStackScreenProps<ArticleParamList, 'ARTICLE'>;

const ArticlePageContainer: FC<PropsType> = ({ route, navigation }) => {
  console.log(route.params);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <BaseLayoutTemplate title="Article" showBackButton onBackButtonPress={handleBack}>
      <Container>
        <Text>Article Page</Text>
      </Container>
    </BaseLayoutTemplate>
  );
};

export default ArticlePageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
