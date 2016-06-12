import * as http from 'http';
import {IncomingMessage} from 'http';
import {ServerResponse} from 'http';
import {randomName} from './random/name';
import {Server} from 'http';


function handleRequest(request: IncomingMessage, response: ServerResponse): void {
}

const server: Server = http.createServer(handleRequest);
server.listen(8888);

console.log('server started');
