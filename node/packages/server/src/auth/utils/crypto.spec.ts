import { encryptedPassword, generateSalt, isSamePassword } from './crypto';
import { KEY_SIZE } from '../constants/auth';

describe('crypto', () => {
  it('salt should be valid key size', async () => {
    const actual = await generateSalt();
    expect(Buffer.from(actual, 'base64').length).toBe(KEY_SIZE);
  });

  it('encrypted password should be valid key size', async () => {
    const salt = await generateSalt();
    const actual = await encryptedPassword(salt, '1234');
    expect(Buffer.from(actual, 'base64').length).toBe(KEY_SIZE);
  });

  it('should be truthy between same passwords', async () => {
    const salt = await generateSalt();
    const origin = await encryptedPassword(salt, '1234');
    const actual = await isSamePassword(salt, '1234', origin);
    expect(actual).toBeTruthy();
  });

  it('should be falsy between different passwords', async () => {
    const salt = await generateSalt();
    const origin = await encryptedPassword(salt, '1234');
    const actual = await isSamePassword(salt, '5678', origin);
    expect(actual).toBeFalsy();
  });
});
