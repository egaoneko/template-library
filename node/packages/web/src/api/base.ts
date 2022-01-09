import { stringify } from 'query-string';

import AuthAPI from 'src/api/auth';
import { getCookie, setCookie, removeCookie, getCookieExpires } from 'src/utils/cookie';
import { CookieName } from 'src/enums/cookie';
import Context from 'src/libs/Context';
import { CookieExpires } from 'src/constants/cookie';

const DEFAULT_OPTION: ApiOption = {
  refresh: true,
};

export interface ApiOption {
  refresh: boolean;
}

export default class BaseAPI {
  static async get<P, R>(
    context: Context,
    url: string,
    request?: P,
    requestInit?: RequestInit,
    apiOption?: ApiOption,
  ): Promise<R> {
    return this.request<P, R>(
      context,
      url,
      request,
      {
        method: 'GET',
        ...requestInit,
      },
      apiOption,
    );
  }

  static async post<P, R>(
    context: Context,
    url: string,
    request?: P,
    requestInit?: RequestInit,
    apiOption?: ApiOption,
  ): Promise<R> {
    return this.request<P, R>(
      context,
      url,
      request,
      {
        method: 'POST',
        ...requestInit,
      },
      apiOption,
    );
  }

  static async put<P, R>(
    context: Context,
    url: string,
    request?: P,
    requestInit?: RequestInit,
    apiOption?: ApiOption,
  ): Promise<R> {
    return this.request<P, R>(
      context,
      url,
      request,
      {
        method: 'PUT',
        ...requestInit,
      },
      apiOption,
    );
  }

  static async delete<P, R>(
    context: Context,
    url: string,
    request?: P,
    requestInit?: RequestInit,
    apiOption?: ApiOption,
  ): Promise<R> {
    return this.request<P, R>(
      context,
      url,
      request,
      {
        method: 'DELETE',
        ...requestInit,
      },
      apiOption,
    );
  }

  static async request<P, R>(
    context: Context,
    url: string,
    request?: P,
    { headers, ...requestInit }: RequestInit = {},
    apiOption: ApiOption = DEFAULT_OPTION,
  ): Promise<R> {
    const accessToken = getCookie(context, CookieName.ACCESS_TOKEN);
    const refreshToken = getCookie(context, CookieName.REFRESH_TOKEN);
    const init: RequestInit = {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache', // for HTTP/1.0 compatibility
        ...(accessToken && { Authorization: 'Bearer ' + accessToken }),
        ...headers,
      },
      ...requestInit,
    } as RequestInit;

    if (init.method === 'GET') {
      if (request instanceof Object && Object.keys(request).length > 0) {
        url += (url.includes('?') ? '&' : '?') + stringify(request);
      }
    } else if (typeof FormData !== 'undefined' && request instanceof FormData) {
      init.body = request;
    } else {
      init.headers = {
        'Content-Type': 'application/json',
        ...init.headers,
      } as HeadersInit;
      init.body = JSON.stringify(request);
    }

    let response = await fetch(url, init);
    let data: R = await BaseAPI.refineResponse<R>(response);

    if (response.status === 200 || response.status === 201) {
      return data;
    }

    if (response.status === 401 && apiOption.refresh && refreshToken) {
      let newAccessToken = '';
      try {
        const user = await AuthAPI.refresh(context, { refreshToken });
        newAccessToken = user.token ?? '';
      } catch (e) {}

      if (newAccessToken) {
        setCookie(context, CookieName.ACCESS_TOKEN, newAccessToken, {
          expires: getCookieExpires(CookieExpires[CookieName.ACCESS_TOKEN]),
        });

        (init.headers as Record<string, string>)['Authorization'] = 'Bearer ' + newAccessToken;
        response = await fetch(url, init);
        data = await BaseAPI.refineResponse<R>(response);

        if (response.status === 200 || response.status === 201) {
          return data;
        }
      } else {
        removeCookie(context, CookieName.ACCESS_TOKEN);
        removeCookie(context, CookieName.REFRESH_TOKEN);
      }
    }
    throw data;
  }

  static async refineResponse<R>(response: Response): Promise<R> {
    if (response.headers.get('content-type')?.toLowerCase().includes('application/json')) {
      return await response.json();
    } else {
      // eslint-disable-next-line
      return (await response.text()) as any;
    }
  }
}
