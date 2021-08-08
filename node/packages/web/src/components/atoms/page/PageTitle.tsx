import React, { FC, ReactNode } from 'react';

interface PropsType {
  children?: ReactNode;
}

const PageTitle: FC<PropsType> = props => {
  return <h1 className="text-4xl text-center mb-4">{props.children}</h1>;
};

export default PageTitle;
