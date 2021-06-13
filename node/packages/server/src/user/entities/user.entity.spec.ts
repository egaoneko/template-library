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

  it('should return schema', () => {
    expect(user.toSchema()).toEqual({
      email: 'test@test.com',
      username: 'test',
      bio: 'bio',
      image: 'image',
    });
  });
});
