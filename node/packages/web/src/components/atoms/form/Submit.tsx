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
        'px-6 py-3 bg-primary hover:bg-secondary text-white font-bold rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed',
        props.className,
      ].join(' ')}
    >
      {props.children}
    </button>
  );
};

export default Submit;
