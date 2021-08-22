import React, { FC, ReactNode } from 'react';
import Button from '../../atoms/common/Button';

interface PropsType {
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  children?: ReactNode;
}

const Submit: FC<PropsType> = props => {
  return (
    <Button
      styleType="primary"
      fill
      size={props.size}
      disabled={props.disabled}
      type="submit"
      className={props.className}
    >
      {props.children}
    </Button>
  );
};

export default Submit;
