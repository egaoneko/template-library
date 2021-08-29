/* eslint-disable  @next/next/no-img-element */

import React, { FC } from 'react';

interface PropsType {
  url?: string;
  size?: 'small' | 'middle' | 'large';
}

const Avatar: FC<PropsType> = props => {
  const { url, size, ...containerProps } = props;
  let width: number;

  switch (props.size) {
    case 'small':
      width = 5;
      break;
    case 'large':
      width = 32;
      break;
    case 'middle':
    default:
      width = 8;
      break;
  }

  return (
    <div className="flex flex-row justify-center" {...containerProps}>
      <div className={`relative flex justify-center items-center rounded-full w-${width} h-${width}`}>
        <img className="rounded-full" src={props.url ?? DEFAULT_IMAGE} alt="avatar" />
      </div>
    </div>
  );
};

export default Avatar;

const DEFAULT_IMAGE = 'https://static.productionready.io/images/smiley-cyrus.jpg';
