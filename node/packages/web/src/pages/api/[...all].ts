/* eslint-disable import/no-anonymous-default-export */

import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export default (req: NextApiRequest, res: NextApiResponse): Promise<unknown> =>
  httpProxyMiddleware(req, res, {
    target: 'http://localhost:8080',
    pathRewrite: [{
      patternStr: '^/api',
      replaceStr: '/api'
    }],
  });
