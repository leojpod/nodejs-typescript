/**
 * Created by leojpod on 2/22/16.
 */
'use strict';

import * as http from 'http';
import * as qs from 'querystring';
import * as url from 'url';
import {routeRequest} from './routing';
import {AugmentedRequest} from './augmented-request';
import {ServerRequest} from 'http';
import {ServerResponse} from 'http';
import {Url} from 'url';

http.createServer((request: ServerRequest, response: ServerResponse) => {
  let corsHeaders: {[id: string]: string|boolean} = {
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Max-Age': '86400', // 24 hours
    'Access-Control-Allow-Headers':
      'X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, ' +
      'Content-Type, Authorization, Accept, x-access-token'
  };
  for (let header in corsHeaders) {
    if (corsHeaders.hasOwnProperty(header)) {
      response.setHeader(header, corsHeaders[header].toString());
    }
  }
  response.setHeader('Content-Type', 'application/json');
  let augmentedRequest: AugmentedRequest = new AugmentedRequest(request);
  switch (request.method) {
    case 'GET':
      let reqUrl: Url = url.parse(request.url, true);
      augmentedRequest.query = reqUrl.query;
      routeRequest(augmentedRequest, response);
      break;
    case 'POST':
      let bodyString: string = '';
      request.on('data', function (data: string): void {
        bodyString += data;
        if (bodyString.length > 1e6) {
          // -> FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
          request.connection.destroy();
        }
      });
      request.on('end', function (): void {
        let contentType: string = request.headers['content-type'];
        if (contentType !== undefined && contentType.toLowerCase() === 'application/x-www-form-urlencoded') {
          augmentedRequest.post = qs.parse(bodyString);
        } else if (contentType !== undefined && contentType.toLowerCase() === 'application/json') {
          augmentedRequest.post = JSON.parse(bodyString);
        }
        routeRequest(augmentedRequest, response);
      });
      break;
    case 'OPTIONS':
      console.log('OPTIONS call!');
      response.writeHead(200);
      response.end();
      break;
    default:
      routeRequest(augmentedRequest, response);
  }
}).listen(8888);
