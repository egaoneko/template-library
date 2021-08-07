import React, { FC, ReactNode } from 'react';
import Head from '../../atoms/layout/Head';

interface PropsType {
  children?: ReactNode;
}

const BaseLayoutTemplate: FC<PropsType> = props => {
  return <div className="max-w-full">{props.children}</div>;
};

export default BaseLayoutTemplate;
