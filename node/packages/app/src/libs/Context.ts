import Storage from 'src/libs/Storage';

export interface ContextOptions {
  prefix?: string;
}

export default class Context {
  private readonly _storage: Storage;

  public get storage(): Storage {
    return this._storage;
  }

  constructor(
    options: ContextOptions = {
      prefix: 'RW',
    },
  ) {
    this._storage = new Storage(options.prefix);
  }
}
