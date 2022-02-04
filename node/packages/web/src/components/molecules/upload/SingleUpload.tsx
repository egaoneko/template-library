import { IFile } from '@my-app/core/lib/interfaces/file';
import React, { ChangeEvent, FC, ReactNode, useRef } from 'react';
import { CSSProperties } from 'styled-components';

import FileAPI from 'src/api/file';
import Button from 'src/components/atoms/common/Button';
import { CONTEXT } from 'src/constants/common';
import { notifyError } from 'src/utils/notifiy';

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

  const handleOnClick = () => fileInputRef.current?.click();

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(name, (e.target.files as FileList)[0]);

    try {
      const file = await FileAPI.upload(CONTEXT, formData);
      onFinish?.(file);
    } catch (e) {
      notifyError((e as Error).message);
    }
    e.target.value = '';
  };

  return (
    <div {...containerProps}>
      <Button onClick={handleOnClick}>{children ?? 'Upload'}</Button>
      <input hidden type="file" accept={accept} multiple={false} ref={fileInputRef} onChange={handleOnChange} />
    </div>
  );
};

export default SingleUpload;
