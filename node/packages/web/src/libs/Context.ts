import Cookie from 'src/libs/Cookie';
import SuperCookie, {
  NextContext,
  NextMiddlewareContext
} from 'src/libs/SuperCookie';

export interface ContextOptions {
  nextContext?: NextContext;
  nextMiddlewareContext?: NextMiddlewareContext;
}

export default class Context {
  private readonly _cookie: SuperCookie;

  public get cookie(): Cookie {
    return this._cookie;
  }

  constructor(options: ContextOptions = {}) {
    this._cookie = new SuperCookie(options.nextContext, options.nextMiddlewareContext);
  }
}

