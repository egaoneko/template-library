import React, { FC, ReactNode } from 'react';

interface PropsType {
  children?: ReactNode;
}

const BaseLayoutTemplate: FC<PropsType> = props => {
  return <div className="max-w-full">{props.children}</div>;
};

export default BaseLayoutTemplate;
