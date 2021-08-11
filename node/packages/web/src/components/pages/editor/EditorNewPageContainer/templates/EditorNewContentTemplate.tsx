import React, { FC, ReactNode } from 'react';
import Form from '@components/atoms/form/Form';
import Input from '@components/atoms/form/Input';
import Submit from '@components/atoms/form/Submit';
import Textarea from '@components/atoms/form/Textarea';
import { CreateArticleRequest } from '@interfaces/article';
import EditorTagsInput from './EditorTagsInput';

interface PropsType {
  loading?: boolean;
  onFinish: (request: CreateArticleRequest) => Promise<void>;
  children?: ReactNode;
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
        />
        <Input
          disabled={props.loading}
          type="text"
          name="description"
          placeholder="What's this article about?"
          options={{ required: true }}
        />
        <Textarea
          disabled={props.loading}
          name="body"
          placeholder="Write your article (in markdown)"
          rows={8}
          options={{ required: true }}
        />
        <EditorTagsInput />
        <Submit disabled={props.loading} loading={props.loading} className="ml-auto">
          Publish Article
        </Submit>
      </Form>
    </div>
  );
};

export default EditorNewContentTemplate;
