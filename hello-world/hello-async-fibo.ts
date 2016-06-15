// let's start
// import fibo = require('async-fibo');
import {fibo} from 'async-fibo';
import {IncomingMessage} from 'http';
import {ServerResponse} from 'http';
import {createServer} from 'http';
import {Server} from 'http';

let clientCount: number = 0;

function handleRequest(request: IncomingMessage, response: ServerResponse): void {
  'use strict';
  clientCount ++;
  console.log('incoming request #' + clientCount);
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  // generate an integer between 50 and 100
  let randInt: number = Math.ceil(Math.random() * 5 + 40);
  let currentClient: number = clientCount;
  console.log('picked %s for client %s', randInt, currentClient);
  fibo(randInt, function (value: number): void {
    response.write('Hello client #' + currentClient + ' did you know that fibonacci\'s ' + randInt + 'th element is ' + value);
    response.end();
  });
}

const server: Server = createServer(handleRequest);
server.listen(8888);

console.log('server started');
