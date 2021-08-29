import React, { FC } from 'react';
import Form from '@components/molecules/form/Form';
import Input from '@components/molecules/form/Input';
import Submit from '@components/molecules/form/Submit';
import Textarea from '@components/molecules/form/Textarea';
import { CreateArticleRequest } from '@interfaces/article';
import EditorTagsInput from './EditorTagsInput';

interface PropsType {
  loading?: boolean;
  onFinish: (request: CreateArticleRequest) => Promise<void>;
}

const EditorNewContentTemplate: FC<PropsType> = props => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Form onFinish={props.onFinish}>
        <Input
          className="text-xl font-bold px-6 py-3"
          disabled={props.loading}
          type="text"
          name="title"
          placeholder="Article Title"
          options={{ required: true }}
          data-cy="content-form-input-title"
        />
        <Input
          disabled={props.loading}
          type="text"
          name="description"
          placeholder="What's this article about?"
          options={{ required: true }}
          data-cy="content-form-input-description"
        />
        <Textarea
          disabled={props.loading}
          name="body"
          placeholder="Write your article (in markdown)"
          rows={8}
          options={{ required: true }}
          data-cy="content-form-input-body"
        />
        <EditorTagsInput />
        <Submit disabled={props.loading} className="ml-auto" data-cy="content-form-button-submit">
          Publish Article
        </Submit>
      </Form>
    </div>
  );
};

export default EditorNewContentTemplate;
