import Link from 'next/link';
import React, { FC, ReactNode } from 'react';
import { UrlObject } from 'url';

interface PropsType {
  href: string | UrlObject;
  as?: string | UrlObject;
  icon?: ReactNode;
  children?: ReactNode;
}

const Menu: FC<PropsType> = props => {
  return (
    <div className={'py-2 ml-4 cursor-pointer first:ml-0 hover:text-gray-800'}>
      <Link href={props.href} as={props.as}>
        <div className={'flex items-center'}>
          <span className="mr-1">{props.icon}</span>
          <span>{props.children}</span>
        </div>
      </Link>
    </div>
  );
};

export default Menu;
