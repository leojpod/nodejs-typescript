// let's start
import {
  createServer,
  IncomingMessage,
  Server,
  ServerResponse
} from "http";

/**
 * A very naive and bad implementation of the fibonacci serie
 * define fibo(n) as fibo(n-1) + fibo(n-2)
 * @param {int} n
 * @return {int}
 */
function fibo(n: number): number {

}

let clientCount: number = 0;

function handleRequest(request: IncomingMessage, response: ServerResponse): void {
  clientCount ++;
  console.log('incoming request #'+clientCount);
  
}

const server: Server = createServer(handleRequest);
server.listen(8888);

console.log('server started');
