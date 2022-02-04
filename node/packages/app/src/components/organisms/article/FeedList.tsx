import { IArticle } from '@my-app/core/lib/interfaces/article';
import React, { FC } from 'react';
import { FlatList } from 'react-native';
import { ListResult } from '@my-app/core/lib/interfaces/common';

import Separator from 'src/components/atoms/common/Separator';
import Empty from 'src/components/organisms/common/Empty';

import Feed from './Feed';

interface PropsType {
  articleList: ListResult<IArticle>;
}

const FeedList: FC<PropsType> = ({ articleList }) => {
  return articleList.count > 0 ? (
    <FlatList
      data={articleList.list ?? []}
      renderItem={({ item }) => <Feed article={item} />}
      keyExtractor={item => item.slug}
      ItemSeparatorComponent={() => <Separator />}
    />
  ) : (
    <Empty>No articles.</Empty>
  );
};

export default FeedList;
