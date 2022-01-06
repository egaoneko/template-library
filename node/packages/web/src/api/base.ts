import AuthAPI from '@api/auth';
import { stringify } from 'query-string';
import { getCookie, setCookie, removeCookie } from '@utils/cookie';
import { CookieName } from '@enums/cookie';

export default class BaseAPI {
  static async get<P, R>(url: string, request?: P, requestInit?: RequestInit): Promise<R> {
    return this.request<P, R>(url, request, {
      method: 'GET',
      ...requestInit,
    });
  }
  static async post<P, R>(url: string, request?: P, requestInit?: RequestInit): Promise<R> {
    return this.request<P, R>(url, request, {
      method: 'POST',
      ...requestInit,
    });
  }
  static async put<P, R>(url: string, request?: P, requestInit?: RequestInit): Promise<R> {
    return this.request<P, R>(url, request, {
      method: 'PUT',
      ...requestInit,
    });
  }
  static async delete<P, R>(url: string, request?: P, requestInit?: RequestInit): Promise<R> {
    return this.request<P, R>(url, request, {
      method: 'DELETE',
      ...requestInit,
    });
  }
  static async request<P, R>(url: string, request?: P, { headers, ...requestInit }: RequestInit = {}): Promise<R> {
    const accessToken = getCookie(CookieName.ACCESS_TOKEN);
    const refreshToken = getCookie(CookieName.REFRESH_TOKEN);
    const init: RequestInit = {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache', // for HTTP/1.0 compatibility
        ...(accessToken && { Authorization: 'Bearer ' + accessToken }),
        ...headers,
      },
      ...requestInit,
    };

    let queryParams = '';
    if (init.method === 'GET') {
      if (request instanceof Object && Object.keys(request).length > 0) {
        queryParams = (url.includes('?') ? '&' : '?') + stringify(request);
      }
    } else if (typeof FormData !== 'undefined' && request instanceof FormData) {
      init.body = request;
    } else {
      init.headers = {
        'Content-Type': 'application/json',
        ...init.headers,
      };
      init.body = JSON.stringify(request);
    }

    let response = await fetch(url, init);
    let data: R = await BaseAPI.refineResponse<R>(response);

    if (response.status === 200 || response.status === 201) {
      return data;
    }

    if (response.status === 401 && refreshToken) {
      let newAccessToken = '';
      try {
        const user = await AuthAPI.refresh({ refreshToken });
        newAccessToken = user.token ?? '';
      } catch (e) {}

      if (newAccessToken) {
        setCookie(CookieName.ACCESS_TOKEN, newAccessToken);

        response = await fetch(url, init);
        data = await BaseAPI.refineResponse<R>(response);

        if (response.status === 200 || response.status === 201) {
          return data;
        }
      } else {
        removeCookie(CookieName.ACCESS_TOKEN);
        removeCookie(CookieName.REFRESH_TOKEN);
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
