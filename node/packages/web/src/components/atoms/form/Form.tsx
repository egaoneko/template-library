import React, { FC, ReactNode } from 'react';
import FormProvider from './FormProvider';

interface PropsType {
  onFinish?: (data: any) => unknown;
  children?: ReactNode;
}

const Form: FC<PropsType> = props => {
  const { children, ...formProps } = props;
  return (
    <FormProvider {...formProps}>
      <div className="flex flex-col gap-4">{props.children}</div>
    </FormProvider>
  );
};

export default Form;
