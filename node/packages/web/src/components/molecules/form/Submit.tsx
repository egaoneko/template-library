import React, { FC, ReactNode } from 'react';

import Button from '../../atoms/common/Button';

interface PropsType {
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  children?: ReactNode;
}

const Submit: FC<PropsType> = props => {
  const { size, className, disabled, children, ...formProps } = props;
  return (
    <Button styleType="primary" fill size={size} disabled={disabled} type="submit" className={className} {...formProps}>
      {children}
    </Button>
  );
};

export default Submit;
