import React, { FC, ReactNode } from 'react';
import Button from '../../atoms/common/Button';

interface PropsType {
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

const Submit: FC<PropsType> = props => {
  return (
    <Button styleType="primary" fill disabled={props.disabled} type="submit" className={props.className}>
      {props.children}
    </Button>
  );
};

export default Submit;
