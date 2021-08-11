import React, { FC, ReactNode } from 'react';

interface PropsType {
  children?: ReactNode;
}

const ContentTemplate: FC<PropsType> = props => {
  return <div className="container mx-auto mt-8">{props.children}</div>;
};

export default ContentTemplate;
