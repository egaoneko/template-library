import React, { FC, useRef } from 'react';
import styled from 'styled-components/native';
import { TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { MyParamList } from 'src/interfaces/common';
import { useStores } from 'src/stores/stores';
import Input from 'src/components/molecules/form/Input';
import { emailValidator, validate } from 'src/utils/validate';
import { handleFocusNext } from 'src/utils/input';
import useDarkMode from 'src/hooks/useDarkMode';
import BaseButton, { ButtonSize, ButtonVariant } from 'src/components/atoms/button/BaseButton';

type PropsType = NativeStackScreenProps<MyParamList, 'MY_SETTINGS'>;

const MySettingsPageContainer: FC<PropsType> = observer(({ navigation }) => {
  const { userStore } = useStores();
  const {
    control,
    handleSubmit,
    formState: { isSubmitted, errors, isDirty },
  } = useForm({
    defaultValues: {
      username: userStore.user?.username,
      bio: userStore.user?.bio,
      email: userStore.user?.email,
      password: '',
    },
  });
  const inputRefs: Array<React.RefObject<TextInput>> = [];
  inputRefs[0] = useRef<TextInput>(null);
  inputRefs[1] = useRef<TextInput>(null);
  inputRefs[2] = useRef<TextInput>(null);
  inputRefs[3] = useRef<TextInput>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const onSubmit = async data => {
    const user = await userStore.update({
      id: userStore.user?.id,
      ...data,
    });

    if (!user) {
      return;
    }
    navigation.goBack();
  };

  return (
    <BaseLayoutTemplate
      title="Settings"
      showBackButton
      onBackButtonPress={handleBack}
      topBarButton={
        <BaseButton
          title="Save"
          size={ButtonSize.Small}
          variant={ButtonVariant.Outlined}
          disabled={!isDirty}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      <Container darkMode={useDarkMode()}>
        <Input
          autoFocus
          control={control}
          rules={{
            required: 'Username is required',
          }}
          name={'username'}
          error={isSubmitted && errors.username}
          errorMessage={errors.username?.message}
          ref={inputRefs[0]}
          placeholder="Username"
          returnKeyType="next"
          onSubmitEditing={() => handleFocusNext(inputRefs, 0)}
        />
        <Input
          multiline
          numberOfLines={4}
          control={control}
          name={'bio'}
          error={isSubmitted && errors.bio}
          errorMessage={errors.bio?.message}
          ref={inputRefs[1]}
          placeholder="Short bio about you"
          returnKeyType="next"
          onSubmitEditing={() => handleFocusNext(inputRefs, 1)}
        />
        <Input
          control={control}
          rules={{
            required: 'Email is required',
            validate: validate({
              validators: [emailValidator('Email is not valid')],
            }),
          }}
          name={'email'}
          error={isSubmitted && errors.email}
          errorMessage={errors.email?.message}
          ref={inputRefs[2]}
          placeholder="Email"
          returnKeyType="next"
          onSubmitEditing={() => handleFocusNext(inputRefs, 2)}
        />
        <Input
          control={control}
          name={'password'}
          secureTextEntry
          error={isSubmitted && errors.password}
          errorMessage={errors.password?.message}
          ref={inputRefs[3]}
          placeholder="Password"
          returnKeyType="done"
          onSubmitEditing={() => handleFocusNext(inputRefs, 3)}
        />
      </Container>
    </BaseLayoutTemplate>
  );
});

export default MySettingsPageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
  font-size: 20px;
  padding: 36px 20px;
`;
