import { NoAuth } from './auth';
import { Reflector } from '@nestjs/core';
import { NO_AUTH_META_DATA_KEY } from '../constants/auth';

describe('auth decorator', () => {
  it('NoAuth', async () => {
    const refactor = new Reflector();
    class Context {
      context = null;
      getContext(): any {
        return this.context;
      }
    }
    const context = new Context();

    const SetTarget = (context: Context) => (target: object, key?: any, descriptor?: any) => {
      context.context = descriptor.value;
    };

    class TestWithMethod {
      @SetTarget(context)
      @NoAuth()
      public static test() {}
    }

    TestWithMethod.test();
    expect(refactor.get(NO_AUTH_META_DATA_KEY, context.getContext())).toBeTruthy();
  });
});