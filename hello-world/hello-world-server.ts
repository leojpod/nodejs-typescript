import * as http from 'http';
import {IncomingMessage} from 'http';
import {ServerResponse} from 'http';
import {Server} from 'http';

function handleRequest(request: IncomingMessage, response: ServerResponse): void {
  'use strict';
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello World without planes\n');
  response.end();
}

const svr: Server = http.createServer(handleRequest);
svr.listen(8888);

console.log('server started!');
