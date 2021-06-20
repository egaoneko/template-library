import { Crypto } from './crypto';

describe('Crypto', () => {
  it('should be defined', () => {
    expect(Crypto).toBeDefined();
  });

  it('salt should be valid key size', async () => {
    const actual = await Crypto.generateSalt();
    expect(Buffer.from(actual, 'base64').length).toBe(Crypto.KEY_SIZE);
  });

  it('encrypted password should be valid key size', async () => {
    const salt = await Crypto.generateSalt();
    const actual = await Crypto.encryptedPassword(salt, '1234');
    expect(Buffer.from(actual, 'base64').length).toBe(Crypto.KEY_SIZE);
  });

  it('should be truthy between same passwords', async () => {
    const salt = await Crypto.generateSalt();
    const origin = await Crypto.encryptedPassword(salt, '1234');
    const actual = await Crypto.isSamePassword(salt, '1234', origin);
    expect(actual).toBeTruthy();
  });

  it('should be falsy between different passwords', async () => {
    const salt = await Crypto.generateSalt();
    const origin = await Crypto.encryptedPassword(salt, '1234');
    const actual = await Crypto.isSamePassword(salt, '5678', origin);
    expect(actual).toBeFalsy();
  });
});
