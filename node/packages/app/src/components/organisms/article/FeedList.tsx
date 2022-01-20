import { IArticle } from '@my-app/core/lib/interfaces/article';
import React, { FC } from 'react';
import { FlatList } from 'react-native';

import Separator from 'src/components/atoms/common/Separator';

import Feed from './Feed';

interface PropsType {
  articles: IArticle[];
}

const FeedList: FC<PropsType> = props => {
  return (
    <FlatList
      data={props.articles}
      renderItem={({ item }) => <Feed article={item} />}
      keyExtractor={item => item.slug}
      ItemSeparatorComponent={() => <Separator />}
    />
  );
};

export default FeedList;
