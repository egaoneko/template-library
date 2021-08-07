import React, { FC, ReactNode } from 'react';

interface PropsType {
  children?: ReactNode;
}

const Menus: FC<PropsType> = props => {
  return <div className="text-base leading-6 text-gray-400 font-sans flex items-center">{props.children}</div>;
};

export default Menus;
