/* eslint-disable  @next/next/no-img-element */

import React, { FC } from 'react';

interface PropsType {
  url?: string;
  size?: 'small' | 'middle' | 'large';
}

const Avatar: FC<PropsType> = props => {
  let size: number;

  switch (props.size) {
    case 'middle':
      size = 8;
      break;
    case 'large':
      size = 48;
      break;
    case 'small':
    default:
      size = 6;
      break;
  }

  return (
    <div className="flex flex-row justify-center">
      <div className={`relative flex justify-center items-center rounded-full w-${size} h-${size}`}>
        <img className="rounded-full" src={props.url ?? DEFAULT_IMAGE} alt="avatar" />
      </div>
    </div>
  );
};

export default Avatar;

const DEFAULT_IMAGE = 'https://static.productionready.io/images/smiley-cyrus.jpg';
