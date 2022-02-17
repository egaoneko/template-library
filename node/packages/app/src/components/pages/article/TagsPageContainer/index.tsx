import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { ArticleParamList } from 'src/interfaces/common';

type PropsType = NativeStackScreenProps<ArticleParamList, 'TAGS'>;

const TagsPageContainer: FC<PropsType> = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <BaseLayoutTemplate title="Tags" showBackButton onBackButtonPress={handleBack}>
      <Container>
        <Text>Tags Page</Text>
      </Container>
    </BaseLayoutTemplate>
  );
};

export default TagsPageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
