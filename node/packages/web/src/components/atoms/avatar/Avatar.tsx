import React, { FC } from 'react';

interface PropsType {
  url?: string;
  size?: 'small' | 'middle' | 'large';
}

const Avatar: FC<PropsType> = props => {
  let size: number = 12;

  switch (props.size) {
    case 'middle':
      size = 24;
      break;
    case 'large':
      size = 48;
      break;
    case 'small':
      size = 12;
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
