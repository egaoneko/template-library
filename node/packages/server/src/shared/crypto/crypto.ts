import crypto from 'crypto';

export class Crypto {
  public static readonly KEY_SIZE = 64;
  public static readonly ITERATIONS = 10000;
  public static readonly DIGEST = 'sha512';

  static async generateSalt(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(Crypto.KEY_SIZE, (err, buf) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(buf.toString('base64'));
      });
    });
  }

  static async encryptedPassword(salt: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, Crypto.ITERATIONS, Crypto.KEY_SIZE, Crypto.DIGEST, (err, key) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(key.toString('base64'));
      });
    });
  }

  static async isSamePassword(salt: string, target: string, origin: string): Promise<boolean> {
    const password = await Crypto.encryptedPassword(salt, target);
    return password === origin;
  }
}
