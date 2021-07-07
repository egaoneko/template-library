import { AuthUserDto } from './auth-user.dto';

describe('AuthUserDto', () => {
  let dto: AuthUserDto;

  beforeEach(async () => {
    dto = new AuthUserDto();
    dto.id = 1;
    dto.email = 'test@test.com';
    dto.username = 'test';
    dto.bio = 'bio';
    dto.image = 'http://localhost:8080/api/file/1';
    dto.password = 'password';
    dto.salt = 'salt';
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should to user dto', async () => {
    const actual = dto.toUserDto();
    expect(actual.id).toBe(dto.id);
    expect(actual.email).toBe(dto.email);
    expect(actual.username).toBe(dto.username);
    expect(actual.bio).toBe(dto.bio);
    expect(actual.image).toBe(dto.image);
  });
});
