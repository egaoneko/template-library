import FileAPI from '@api/file';
import Button from '@components/atoms/common/Button';
import { CONTEXT } from '@constants/common';
import { IFile } from '@my-app/core/lib/interfaces/file';
import { notifyError } from '@utils/notifiy';
import React, { ChangeEvent, FC, ReactNode, useCallback, useRef } from 'react';
import { CSSProperties } from 'styled-components';

interface PropsType {
  name: string;
  onFinish?: (file: IFile) => void;
  accept?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const SingleUpload: FC<PropsType> = props => {
  const { name, onFinish, accept, children, ...containerProps } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
      e.preventDefault();
      const formData = new FormData();
      formData.append(name, (e.target.files as FileList)[0]);

      try {
        const file = await FileAPI.upload(CONTEXT, formData);
        onFinish?.(file);
      } catch (e) {
        notifyError(e.response?.data?.message ?? e.message);
      }
      e.target.value = '';
    },
    [name, onFinish],
  );

  return (
    <div {...containerProps}>
      <Button onClick={() => fileInputRef.current?.click()}>{children ?? 'Upload'}</Button>
      <input hidden type="file" accept={accept} multiple={false} ref={fileInputRef} onChange={onChange} />
    </div>
  );
};

export default SingleUpload;
