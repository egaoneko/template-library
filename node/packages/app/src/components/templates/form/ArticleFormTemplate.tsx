import React, { FC, useRef } from 'react';
import styled from 'styled-components/native';
import { TextInput } from 'react-native';
import { useForm } from 'react-hook-form';
import { CreateArticleRequest, UpdateArticleRequest } from '@my-app/core/lib/interfaces/article';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import BaseButton, { ButtonSize, ButtonVariant } from 'src/components/atoms/button/BaseButton';
import useDarkMode from 'src/hooks/useDarkMode';
import Input from 'src/components/molecules/form/Input';
import { handleFocusNext } from 'src/utils/input';
import TagsInput from 'src/components/molecules/form/TagsInput';

interface PropsType {
  loading?: boolean;
  onFinish: (request: CreateArticleRequest | UpdateArticleRequest) => Promise<void>;
}

const ArticleFormTemplate: FC<PropsType> = props => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitted, errors, isDirty },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      body: '',
      tags: [],
    },
  });
  const inputRefs: Array<React.RefObject<TextInput>> = [];
  inputRefs[0] = useRef<TextInput>(null);
  inputRefs[1] = useRef<TextInput>(null);
  inputRefs[2] = useRef<TextInput>(null);
  inputRefs[3] = useRef<TextInput>(null);

  const onSubmit = async data => {
    await props.onFinish(data);
  };

  return (
    <BaseLayoutTemplate
      title="Post"
      topBarButton={
        <BaseButton
          title="Post"
          size={ButtonSize.Small}
          variant={ButtonVariant.Outlined}
          disabled={!isDirty || Boolean(props.loading)}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      <Wrapper>
        <Container darkMode={useDarkMode()}>
          <Input
            autoFocus
            control={control}
            rules={{
              required: 'Title is required',
            }}
            name={'title'}
            error={isSubmitted && errors.title}
            errorMessage={errors.title?.message}
            ref={inputRefs[0]}
            placeholder="Article Title"
            returnKeyType="next"
            onSubmitEditing={() => handleFocusNext(inputRefs, 0)}
          />
          <Input
            control={control}
            name={'description'}
            rules={{
              required: 'Description is required',
            }}
            error={isSubmitted && errors.description}
            errorMessage={errors.description?.message}
            ref={inputRefs[1]}
            placeholder="What's this article about?"
            returnKeyType="next"
            onSubmitEditing={() => handleFocusNext(inputRefs, 1)}
          />
          <Input
            multiline
            numberOfLines={4}
            control={control}
            rules={{
              required: 'Body is required',
            }}
            name={'body'}
            error={isSubmitted && errors.body}
            errorMessage={errors.body?.message}
            ref={inputRefs[2]}
            placeholder="Write your article (in markdown)"
            returnKeyType="next"
            onSubmitEditing={() => handleFocusNext(inputRefs, 2)}
          />
          <TagsInput
            control={control}
            name={'tags'}
            error={isSubmitted && errors.tags}
            errorMessage={errors.tags?.message}
            ref={inputRefs[3]}
            placeholder="Enter tags"
            returnKeyType="done"
            onSubmitEditing={() => handleFocusNext(inputRefs, 3)}
          />
        </Container>
      </Wrapper>
    </BaseLayoutTemplate>
  );
};

export default ArticleFormTemplate;

const Wrapper = styled.ScrollView`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  align-items: center;
  font-size: 20px;
  padding: 36px 20px;
`;
