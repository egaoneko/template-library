import React, { FC, ReactNode } from 'react';

interface PropsType {
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

const Submit: FC<PropsType> = props => {
  return (
    <button
      disabled={props.disabled}
      type="submit"
      className={[
        'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed',
        props.className,
      ].join(' ')}
    >
      {props.children}
    </button>
  );
};

export default Submit;
