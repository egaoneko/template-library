import FileAPI from '@api/file';
import Button from '@components/atoms/common/Button';
import { IFile } from '@interfaces/file';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
      e.preventDefault;
      const formData = new FormData();
      formData.append('file', (e.target.files as FileList)[0]);

      try {
        const file = await FileAPI.upload(formData);
        props.onFinish?.(file);
      } catch (e) {
        notifyError(e.response?.data?.message ?? e.message);
      }
      e.target.value = '';
    },
    [props.name, props.onFinish],
  );

  return (
    <div className={props.className} style={props.style}>
      <Button onClick={() => fileInputRef.current?.click()}>{props.children ?? 'Upload'}</Button>
      <input hidden type="file" accept={props.accept} multiple={false} ref={fileInputRef} onChange={onChange} />
    </div>
  );
};

export default SingleUpload;
