import React, { forwardRef } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { useFormContext } from './FormContext';

interface PropsType extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  name: string;
  className?: string;
  options?: RegisterOptions;
}

const Input = forwardRef<HTMLInputElement, PropsType>((props, ref) => {
  const { register, formState } = useFormContext();
  const { name, className, options, ...formProps } = props;
  const errors = formState?.errors[name];

  return (
    <div>
      {register && (
        <input
          className={[
            !formProps.hidden && className,
            !formProps.hidden &&
              'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
          ].join(' ')}
          {...formProps}
          {...register(name, options)}
          ref={ref}
        />
      )}
      {errors?.type === 'required' && (
        <p className="mt-2 ml-4 text-red-500 text-xs italic">
          <span className="font-bold">{name}</span>
          <span> is required</span>
        </p>
      )}
    </div>
  );
});

export default Input;
