import Link from 'next/link';
import React, { FC, ReactNode } from 'react';
import { UrlObject } from 'url';

interface PropsType {
  href: string | UrlObject;
  as?: string | UrlObject;
  icon?: ReactNode;
  active?: boolean;
  children?: ReactNode;
}

const Menu: FC<PropsType> = props => {
  const { active, href, as, icon, children, ...containerProps } = props;
  return (
    <div
      className={['py-2 ml-4 cursor-pointer first:ml-0 hover:text-gray-800 flex', active ? 'text-primary' : ''].join(
        ' ',
      )}
      {...containerProps}
    >
      <Link href={href} as={as} passHref>
        <div className={'flex items-center'}>
          <span className="mr-1">{icon}</span>
          <span>{children}</span>
        </div>
      </Link>
    </div>
  );
};

export default Menu;
