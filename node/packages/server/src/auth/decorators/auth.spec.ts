import { NoAuth } from './auth';
import { Reflector } from '@nestjs/core';
import { NO_AUTH_META_DATA_KEY } from '../constants/auth.constant';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
describe('auth decorator', () => {
  it('NoAuth', async () => {
    const refactor = new Reflector();
    let context: any;

    const SetTarget = (target: object, key?: string, descriptor?: any) => {
      context = descriptor.value;
    };

    class TestWithMethod {
      @SetTarget
      @NoAuth()
      public static test() {}
    }

    TestWithMethod.test();
    expect(refactor.get(NO_AUTH_META_DATA_KEY, context as () => {})).toBeTruthy();
  });
});
