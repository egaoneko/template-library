import { createMock } from '@golevelup/ts-jest';
import { CurrentUser } from './current-user.decorator';
import { UserDto } from '../dto/user.response';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ExecutionContext } from '@nestjs/common';

describe('Current User Decorator', () => {
  it('should be return user', async () => {
    const metadata = getParamDecoratorMetadata<UserDto>(CurrentUser);
    const mockUser = createMock<UserDto>({ id: 1 });
    const actual = metadata.factory(metadata.data, getExecutionContext(mockUser));

    expect(actual).toBeDefined();
    expect(actual).toBe(mockUser);
  });

  it('should be return id', async () => {
    const metadata = getParamDecoratorMetadata<UserDto>(CurrentUser, 'id');
    const mockUser = createMock<UserDto>({ id: 1 });
    const actual = metadata.factory(metadata.data, getExecutionContext(mockUser));

    expect(actual).toBeDefined();
    expect(actual).toBe(mockUser.id);
  });
});

function getParamDecoratorMetadata<T = unknown>(decorator: typeof CurrentUser, key?: keyof UserDto) {
  class Test {
    public test(@decorator(key) value: T) {
      expect(value).toBeDefined();
    }
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]];
}

function getExecutionContext(user: UserDto): ExecutionContext {
  return createMock<ExecutionContext>({
    switchToHttp: jest.fn(() => ({
      getRequest: () => ({
        originalUrl: '/',
        method: 'GET',
        params: undefined,
        query: undefined,
        body: undefined,
        user,
      }),
      getResponse: () => ({
        statusCode: 200,
      }),
    })),
    // method I needed recently so I figured I'd add it in
    getType: jest.fn(() => 'http'),
  });
}
