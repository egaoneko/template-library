import React, { FC } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { useFormContext } from './FormContext';

interface PropsType
  extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  name: string;
  options?: RegisterOptions;
}

const Textarea: FC<PropsType> = props => {
  const { register, formState } = useFormContext();
  const { name, options, ...formProps } = props;
  const errors = formState?.errors[props.name];

  return (
    <div>
      {register && (
        <textarea
          className={[
            !props.hidden &&
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
          ].join(' ')}
          {...formProps}
          {...register(props.name, props.options)}
        />
      )}
      {errors?.type === 'required' && (
        <p className="mt-2 ml-4 text-red-500 text-xs italic">
          <span className="font-bold">{props.name}</span>
          <span> is required</span>
        </p>
      )}
    </div>
  );
};

export default Textarea;
