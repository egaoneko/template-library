import { User } from '@user/entities/user.entity';
import {
  encryptedPassword,
  generateSalt
} from '@auth/utils/crypto';

export async function createTempUser(): Promise<User> {
  const salt = await generateSalt();
  const password = await encryptedPassword(salt, '1234');
  return User.create({
    email: 'test@test.com',
    username: 'test',
    password,
    salt,
  });
}