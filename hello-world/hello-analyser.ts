// let's start

import {IncomingMessage} from "http";
import {ServerResponse} from "http";
import {parse as urlParse} from "url";
import {Url} from "url";
import {parse as queryStringParse} from "querystring";
import {createServer} from "http";
import {Server} from "http";

interface IAnalysis {
  method: string;
  url: string;
  path: string;
  params: {
    query?: Object;
    body?: Object;
  };
}

function handleRequest(request: IncomingMessage, response: ServerResponse): void {

}

const server: Server = createServer(handleRequest);
server.listen(8888);

console.log('server started');
