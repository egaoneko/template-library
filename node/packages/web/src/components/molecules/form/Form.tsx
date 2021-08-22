/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { FC, ReactNode } from 'react';
import FormProvider from './FormProvider';

interface PropsType {
  gap?: number;
  onFinish?: (data: any) => unknown;
  children?: ReactNode;
}

const Form: FC<PropsType> = props => {
  const { children, gap = 4, ...formProps } = props;

  return (
    <FormProvider {...formProps}>
      <div className={['flex flex-col', gap && `gap-${gap}`].join(' ')}>{children}</div>
    </FormProvider>
  );
};

export default Form;
