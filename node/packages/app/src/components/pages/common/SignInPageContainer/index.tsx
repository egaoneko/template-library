import React, { FC, useRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TextInput } from 'react-native';
import { useForm } from 'react-hook-form';

import AuthLayoutTemplate from 'src/components/templates/layout/AuthLayoutTemplate';
import { CommonParamList } from 'src/interfaces/common';
import { handleFocusNext } from 'src/utils/input';
import Input from 'src/components/molecules/form/Input';
import { emailValidator, validate } from 'src/utils/validate';
import { COMMON_NAVIGATION_TYPE } from 'src/enums/common-navigation';
import { useStores } from 'src/stores/stores';

type PropsType = NativeStackScreenProps<CommonParamList, 'SIGN_IN'>;

const SignInPageContainer: FC<PropsType> = ({ navigation }) => {
  const { userStore } = useStores();
  const {
    control,
    handleSubmit,
    formState: { isSubmitted, errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const inputRefs: Array<React.RefObject<TextInput>> = [];
  inputRefs[0] = useRef<TextInput>(null);
  inputRefs[1] = useRef<TextInput>(null);

  const handlePressHelp = () => {
    navigation.replace(COMMON_NAVIGATION_TYPE.SIGN_UP);
  };
  const onSubmit = async data => {
    const user = await userStore.login({
      email: data.email,
      password: data.password,
    });

    if (!user) {
      return;
    }
    navigation.replace(COMMON_NAVIGATION_TYPE.MAIN);
  };

  return (
    <AuthLayoutTemplate
      title="Sign in"
      help="Need an account?"
      button="Sign in"
      onPressHelp={handlePressHelp}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        control={control}
        rules={{
          required: 'Email is required',
          validate: validate({
            validators: [emailValidator('Email is not valid')],
          }),
        }}
        name={'email'}
        autoFocus
        error={isSubmitted && errors.email}
        errorMessage={errors.email?.message}
        ref={inputRefs[0]}
        placeholder="Email"
        returnKeyType="next"
        onSubmitEditing={() => handleFocusNext(inputRefs, 0)}
      />
      <Input
        control={control}
        rules={{ required: 'Password is required' }}
        name={'password'}
        secureTextEntry
        error={isSubmitted && errors.password}
        errorMessage={errors.password?.message}
        ref={inputRefs[1]}
        placeholder="Password"
        returnKeyType="done"
        onSubmitEditing={() => handleFocusNext(inputRefs, 1)}
      />
    </AuthLayoutTemplate>
  );
};

export default SignInPageContainer;
