// let's start
import {fibo} from 'async-fibo';
import {IncomingMessage} from 'http';
import {ServerResponse} from 'http';
import {createServer} from 'http';

let clientCount = 0;

function handleRequest(request: IncomingMessage, response: ServerResponse): void {
  clientCount ++;
  console.log('incoming request #'+clientCount);
  
}

const server = createServer(handleRequest);
server.listen(8888);

console.log('server started');
