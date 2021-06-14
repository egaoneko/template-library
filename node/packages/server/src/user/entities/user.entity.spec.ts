import { User } from './user.entity';
import { createSequelize } from '@root/test/sequelize';

describe('UserController', () => {
  let user: User;

  beforeEach(async () => {
    createSequelize({ models: [User] });
    user = new User({
      email: 'test@test.com',
      username: 'test',
      password: '1234',
      salt: 'salt',
      bio: 'bio',
      image: 'image',
    });
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  it('should return dto', () => {
    const actual = user.toDto();
    expect(actual.id).toBe(user.id);
    expect(actual.email).toBe(user.email);
    expect(actual.username).toBe(user.username);
    expect(actual.bio).toBe(user.bio);
    expect(actual.image).toBe(user.image);
  });
});
