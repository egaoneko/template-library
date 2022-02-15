import React, { FC } from 'react';
import styled from 'styled-components/native';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { CommonParamList, MainParamList } from 'src/interfaces/common';
import TouchableView from 'src/components/atoms/view/TouchableView';
import { Body18, ButtonText18 } from 'src/components/atoms/common/typography';
import Avatar from 'src/components/atoms/avatar/Avatar';
import { useStores } from 'src/stores/stores';
import { MY_NAVIGATION_TYPE } from 'src/enums/my-navigation';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'MY'>
>;
const MyPageContainer: FC<PropsType> = observer(({ navigation }) => {
  const { userStore } = useStores();

  const handleMoveToEdit = async () => navigation.navigate(MY_NAVIGATION_TYPE.MY_SETTINGS);
  const handleMoveToMyArticles = () => navigation.navigate(MY_NAVIGATION_TYPE.MY_ARTICLES);
  const handleMoveToFavoritedArticles = () => navigation.navigate(MY_NAVIGATION_TYPE.MY_FAVORITED_ARTICLES);
  const handleLogout = () => userStore.logout();

  return (
    <BaseLayoutTemplate>
      <Container>
        <Top>
          <Edit onPress={handleMoveToEdit}>
            <ButtonText18>Edit</ButtonText18>
          </Edit>
        </Top>
        <Profile>
          <Avatar size={180} uri={userStore.user?.image} />
          <Body18>{userStore.user?.username}</Body18>
        </Profile>
        <Actions>
          <Action onPress={handleMoveToMyArticles}>
            <Body18>My Articles</Body18>
          </Action>
          <Action onPress={handleMoveToFavoritedArticles}>
            <Body18>Favorited Articles</Body18>
          </Action>
          <Action onPress={handleLogout}>
            <Logout>Logout</Logout>
          </Action>
        </Actions>
      </Container>
    </BaseLayoutTemplate>
  );
});

export default MyPageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
  font-size: 20px;
`;

const Top = styled.View`
  width: 100%;
  display: flex;
  align-items: flex-end;
  padding: 12px 16px;
`;

const Edit = styled(TouchableView)`
  padding: 4px;
`;

const Profile = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Actions = styled.View`
  width: 100%;
  flex: 1;
  justify-content: center;
`;

const Action = styled(TouchableView)`
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 16px 24px;
`;

const Logout = styled(Body18)`
  color: ${({ theme }) => theme.error};
`;
