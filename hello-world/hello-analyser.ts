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
  let bodyString: string = '';
  request.on('data', function(chunk: string): void {
    bodyString += chunk;
  });
  request.on('end', function(): void {
    //analyse
    let reqUrl: Url = urlParse(request.url, true);
    let analysis: IAnalysis = {
      method: request.method,
      url: request.url,
      path: reqUrl.pathname,
      params: {
        query: reqUrl.query,
        body: null
      }
    };
    response.writeHead(200, { 'Content-Type': 'application/json' });
    if (bodyString.length >= 0) {
      //there was a body string
      let contentType: string = request.headers['content-type'];
      if (contentType !== undefined) {
        switch (request.headers['content-type'].toLowerCase()) {
          case 'application/x-www-form-urlencoded':
            analysis.params.body = queryStringParse(bodyString);
            break;
          case 'application/json':
            analysis.params.body = JSON.parse(bodyString);
            break;
          default:
            analysis.params.body = bodyString;
        }
        response.write(JSON.stringify(analysis, null, 2));
        response.end();
      } else {
        response.writeHead(400);
        response.write('{"error": "missing content type!"}');
        response.end();
      }
    }
  });
}

const server: Server = createServer(handleRequest);
server.listen(8888);

console.log('server started');
