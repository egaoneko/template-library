import React, { FC, ReactNode } from 'react';

interface PropsType extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  styleType?: ButtonStyleType;
  fill?: boolean;
  children?: ReactNode;
}

const Button: FC<PropsType> = props => {
  const { styleType, fill, children, ...buttonProps } = props;
  const { backgroundColor, borderColor, textColor } = getButtonStyle(styleType, fill);

  return (
    <button
      type="button"
      {...buttonProps}
      className={[
        `px-6 py-3 hover:text-opacity-80 hover:bg-opacity-80 hover:border-opacity-80 font-bold border rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed`,
        buttonProps.style?.backgroundColor ? null : backgroundColor,
        buttonProps.style?.borderColor ? null : borderColor,
        buttonProps.style?.color ? null : textColor,
        props.className,
      ].join(' ')}
    >
      {children}
    </button>
  );
};

export default Button;

type ButtonStyleType = 'default' | 'primary' | 'text' | 'danger';

interface ButtonStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

function getButtonStyle(styleType: ButtonStyleType = 'default', fill = false): ButtonStyle {
  let backgroundColor: string;
  let borderColor: string;
  let textColor: string;

  switch (styleType) {
    case 'primary':
      if (fill) {
        backgroundColor = 'bg-primary';
        borderColor = 'border-primary';
        textColor = 'text-white';
      } else {
        backgroundColor = 'bg-white';
        borderColor = 'border-primary';
        textColor = 'text-primary';
      }
      break;
    case 'danger':
      if (fill) {
        backgroundColor = 'bg-red-500';
        borderColor = 'border-red-500';
        textColor = 'text-white';
      } else {
        backgroundColor = 'bg-white';
        borderColor = 'border-red-500';
        textColor = 'text-red-500';
      }
      break;
    case 'text':
      backgroundColor = 'bg-white';
      borderColor = 'border-transparent';
      textColor = 'text-gray-900';
      break;
    case 'default':
    default:
      if (fill) {
        backgroundColor = 'bg-gray-800';
        borderColor = 'border-gray-800';
        textColor = 'text-white';
      } else {
        backgroundColor = 'bg-white';
        borderColor = 'border-gray-900';
        textColor = 'text-gray-900';
      }
  }

  return {
    backgroundColor,
    borderColor,
    textColor,
  };
}
