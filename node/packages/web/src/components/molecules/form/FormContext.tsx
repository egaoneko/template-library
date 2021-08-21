import { createContext, useContext } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';

export const FORM_INITIAL_VALUE: FormContextType = {};

export interface FormContextType {
  register?: UseFormRegister<Record<string, unknown>>;
  formState?: FormState<Record<string, unknown>>;
}

const FormContext = createContext<FormContextType>(FORM_INITIAL_VALUE);

export default FormContext;

export function useFormContext(): FormContextType {
  return useContext(FormContext);
}
