import React, { FC } from 'react';
import Form from '@components/molecules/form/Form';
import Input from '@components/molecules/form/Input';
import Submit from '@components/molecules/form/Submit';
import Textarea from '@components/molecules/form/Textarea';
import { IArticle, UpdateArticleRequest } from '@interfaces/article';

interface PropsType {
  loading?: boolean;
  article: IArticle;
  onFinish: (request: UpdateArticleRequest) => Promise<void>;
}

const EditorUpdateContentTemplate: FC<PropsType> = props => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Form onFinish={props.onFinish}>
        <Input
          className="text-xl font-bold px-6 py-3"
          disabled={props.loading}
          type="text"
          name="title"
          placeholder="Article Title"
          defaultValue={props.article.title}
          options={{ required: true }}
          data-cy="content-form-input-title"
        />
        <Input
          disabled={props.loading}
          type="text"
          name="description"
          placeholder="What's this article about?"
          defaultValue={props.article.description}
          options={{ required: true }}
          data-cy="content-form-input-description"
        />
        <Textarea
          disabled={props.loading}
          name="body"
          placeholder="Write your article (in markdown)"
          rows={8}
          defaultValue={props.article.body}
          options={{ required: true }}
          data-cy="content-form-input-body"
        />
        <Submit disabled={props.loading} className="ml-auto" data-cy="content-form-button-submit">
          Publish Article
        </Submit>
      </Form>
    </div>
  );
};

export default EditorUpdateContentTemplate;
