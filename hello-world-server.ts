import * as http from "http";
import {IncomingMessage} from "http";
import {ServerResponse} from "http";
import {Server} from "http";
/**
 * Created by leojpod on 2016-06-11.
 */

function handleRequest(request: IncomingMessage, response: ServerResponse): void {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello World without planes\n');
  response.end();
};

const svr: Server = http.createServer(handleRequest);
svr.listen(8888);

console.log('server started!');
