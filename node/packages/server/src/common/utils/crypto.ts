import crypto from 'crypto';

export const KEY_SIZE = 64;
export const ITERATIONS = 10000;
export const DIGEST = 'sha512';

export function generateSalt(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(KEY_SIZE, (err, buf) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(buf.toString('base64'));
    });
  });
}

export function encryptedPassword(salt: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_SIZE, DIGEST, (err, key) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(key.toString('base64'));
    });
  });
}

export async function isSamePassword(salt: string, target: string, origin: string): Promise<boolean> {
  const password = await encryptedPassword(salt, target);
  return password === origin;
}