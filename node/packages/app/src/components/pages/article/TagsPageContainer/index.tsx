import React, { FC } from 'react';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from 'react-query';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { ArticleParamList } from 'src/interfaces/common';
import ArticleAPI from 'src/api/article';
import { CONTEXT } from 'src/constants/common';
import Loading from 'src/components/atoms/common/Loading';
import { Heading1 } from 'src/components/atoms/common/typography';
import TouchableView from 'src/components/atoms/view/TouchableView';
import Separator from 'src/components/atoms/common/Separator';
import { MAIN_NAVIGATION_TYPE } from 'src/enums/main-navigation';

type PropsType = NativeStackScreenProps<ArticleParamList, 'TAGS'>;

const TagsPageContainer: FC<PropsType> = ({ navigation }) => {
  const tagsResult = useQuery<string[], unknown, string[]>(['tag-list'], () => ArticleAPI.getTags(CONTEXT));

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClickTag = tag => {
    navigation.navigate(MAIN_NAVIGATION_TYPE.HOME, {
      tag,
    });
  };

  return (
    <BaseLayoutTemplate title="Tags" showBackButton onBackButtonPress={handleBack}>
      <Container>
        {tagsResult.data ? (
          <FlatList
            data={tagsResult.data}
            renderItem={({ item }) => (
              <TagContainer onPress={() => handleClickTag(item)}>
                <TagText>{item}</TagText>
              </TagContainer>
            )}
            ItemSeparatorComponent={() => <Separator />}
            keyExtractor={item => item}
          />
        ) : (
          <Loading size={'large'} />
        )}
      </Container>
    </BaseLayoutTemplate>
  );
};

export default TagsPageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
`;

const FlatList = styled.FlatList`
  width: 100%;
`;

const TagContainer = styled(TouchableView)`
  width: 100%;
  padding: 16px 20px;
`;

const TagText = styled(Heading1)`
  color: ${({ theme }) => theme.primary};
`;
