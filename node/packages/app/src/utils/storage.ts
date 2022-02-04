import Context from 'src/libs/Context';
import { StorageName } from 'src/enums/storage';

export function getStorage<T = unknown>(context: Context, name: StorageName): Promise<T | null> {
  return context.storage.get(name);
}

export function setStorage<T = unknown>(context: Context, name: StorageName, value: T, ttl?: number): Promise<void> {
  return context.storage.set(name, value, ttl);
}

export function deleteStorage(context: Context, name: StorageName): Promise<void> {
  return context.storage.delete(name);
}

const expireUnit = 60; // minutes
// const expireUnit = 86400; // days
export function getStorageTtl(ttl: number): number {
  return ttl * expireUnit;
}
