import NextHead from 'next/head';
import React, { FC, ReactNode } from 'react';

interface PropsType {
  title: string;
  children?: ReactNode;
}

const Head: FC<PropsType> = props => {
  return (
    <NextHead>
      <title data-cy="head-title">{props.title}</title>
      {props.children}
    </NextHead>
  );
};

export default Head;
