import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StorageItem<T = unknown> {
  ttl?: number;
  created: number;
  val: T;
}

export default class Storage<T = unknown> {
  private prefix = '';

  constructor(prefix?: string) {
    this.setPrefix(prefix);
  }

  setPrefix(prefix?: string): void {
    this.prefix = `@${prefix}_`;
  }

  getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async set(key: string, val: T, ttl?: number): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.getKey(key),
        JSON.stringify({
          ttl,
          val,
          created: new Date().getTime(),
        }),
      );
    } catch (e) {}
  }

  async get(key: string): Promise<T | null> {
    try {
      const data = JSON.parse((await AsyncStorage.getItem(this.getKey(key))) || '') as StorageItem<T>;
      const { ttl, created, val } = data;
      if (ttl && Storage.isExpired(created, ttl)) {
        await this.delete(key);
        return null;
      }

      return val;
    } catch (e) {
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.getKey(key));
    } catch (e) {
      console.error(e);
    }
  }

  private static isExpired(created: number, ttl: number) {
    return Date.now() > created + ttl * 1000;
  }
}
