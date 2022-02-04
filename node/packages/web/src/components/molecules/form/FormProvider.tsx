import React, { FC, ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import FormContext from './FormContext';

interface PropsType {
  onFinish?: (data: unknown) => unknown;
  resetAfterFinish?: boolean;
  children?: ReactNode;
}

const FormProvider: FC<PropsType> = props => {
  const { onFinish, resetAfterFinish } = props;
  const { children } = props;
  const { register, handleSubmit, formState, reset } = useForm();

  const handleFinish = async (data): Promise<unknown> => {
    const result = await onFinish?.(data);

    if (resetAfterFinish) {
      reset();
    }

    return result;
  };

  return (
    <FormContext.Provider
      value={{
        register,
        formState,
      }}
    >
      <form onSubmit={handleSubmit(handleFinish)}>{children}</form>
    </FormContext.Provider>
  );
};

export default FormProvider;
