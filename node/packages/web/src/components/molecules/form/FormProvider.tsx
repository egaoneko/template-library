/* eslint-disable @typescript-eslint/no-explicit-any */

import { NOOP } from '@utils/common';
import React, { FC, ReactNode, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import FormContext from './FormContext';

interface PropsType {
  onFinish?: (data: any) => unknown;
  resetAfterFinish?: boolean;
  children?: ReactNode;
}

const FormProvider: FC<PropsType> = props => {
  const { onFinish = NOOP, resetAfterFinish } = props;
  const { children } = props;
  const { register, handleSubmit, formState, reset } = useForm();

  const finish = useCallback(
    async (data): Promise<unknown> => {
      const result = await onFinish(data);

      if (resetAfterFinish) {
        reset();
      }

      return result;
    },
    [onFinish, resetAfterFinish, reset],
  );

  return (
    <FormContext.Provider
      value={{
        register,
        formState,
      }}
    >
      <form onSubmit={handleSubmit(finish)}>{children}</form>
    </FormContext.Provider>
  );
};

export default FormProvider;
