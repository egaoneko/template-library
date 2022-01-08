import { IS_SSR } from 'src/constants/common';

export function avoid(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const method: Function = descriptor.value;

  descriptor.value = function (...args: any[]): any {
    if (IS_SSR) {
      return null;
    }
    return method.apply(this, args);
  };
}
