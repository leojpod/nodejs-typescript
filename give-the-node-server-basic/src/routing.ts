'use strict';
/**
 * Created by leojpod on 2/24/16.
 */

import * as url from 'url';
import { Authenticate } from './routes/authenticate';
import { AugmentedRequest } from './augmented-request';
import { ServerResponse } from 'http';
import { Polls } from './routes/polls';
import { Users } from './routes/users';
import { Url } from 'url';

export function routeRequest(req: AugmentedRequest, res: ServerResponse): void {
  let reqUrl: Url = url.parse(req.request.url);
  let segments: string[] = reqUrl.pathname.split('/');
  switch (segments[1]) {
    case 'authenticate':
      Authenticate.handleRequest(req, res);
      break;
    case 'polls':
      Polls.handleRequest(req, res);
      break;
    case 'users':
      Users.handleRequest(req, res);
      break;
    default:
      // unknown route:
      res.writeHead(404, { 'content-type': 'application/json' });
      res.write('{ "error": "unknown route"}');
      res.end();
  }
}
