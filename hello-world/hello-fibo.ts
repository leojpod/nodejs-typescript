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
  if (n < 1) {
    throw 'huston we have a problem';
  }
  if (n == 1) {
    return 0;
  }
  if (n == 2) {
    return 1;
  }
  return fibo(n - 1) + fibo(n - 2);
}

let clientCount: number = 0;

function handleRequest(request: IncomingMessage, response: ServerResponse): void {
  clientCount ++;
  console.log('incoming request #'+clientCount);
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  //generate an integer between 35 and 40
  let randInt: number = Math.ceil(Math.random() * 5 + 35);
  console.log('picked %s for client %s', randInt, clientCount);
  response.write(`Hello client #${clientCount} did you know that fibonacci's ${randInt}th element is ${fibo(randInt)}`);
  response.end();
}

const server: Server = createServer(handleRequest);
server.listen(8888);

console.log('server started');
