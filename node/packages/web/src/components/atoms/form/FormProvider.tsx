import { NOOP } from '@utils/common';
import React, { FC, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import FormContext from './FormContext';

interface PropsType {
  onFinish?: (data: any) => unknown;
  children?: ReactNode;
}

const FormProvider: FC<PropsType> = props => {
  const { children, onFinish } = props;
  const { register, handleSubmit, formState } = useForm();

  return (
    <FormContext.Provider
      value={{
        register,
        formState,
      }}
    >
      <form onSubmit={handleSubmit(onFinish ?? NOOP)}>{children}</form>
    </FormContext.Provider>
  );
};

export default FormProvider;
