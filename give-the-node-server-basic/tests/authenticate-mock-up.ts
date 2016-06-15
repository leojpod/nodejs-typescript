///<reference path="../typings/index.d.ts"/>
import {ISimpleCallback} from './test-utils';
import {Response} from 'superagent';
import * as supertest from 'supertest';
import {SuperTest} from 'supertest';
import * as async from 'async';
import * as chai from 'chai';
import ExpectStatic = Chai.ExpectStatic;

/**
 * Created by leojpod on 2/24/16.
 */

const expect: ExpectStatic = chai.expect;
const server: SuperTest = supertest.agent('http://localhost:8888');

describe('specify the authentication message that should be returned by the application', function (): void {

  it('should return a failure JSON message with a 403 status if the authentication is not successful', function (done: MochaDone): void {
    async.parallel(
      [
        function (cb: ISimpleCallback): void {
          server.post('/authenticate')
            .send('identifier=i do not exist!')
            .send('password=password')
            .expect('Content-type', /json/)
            .expect(403)
            .end(function (err: Error, res: Response): void {
              expect(res.status).to.equal(403);
              expect(res.body.success).to.equal(false);
              cb();
            });
        },
        function (cb: ISimpleCallback): void {
          server.post('/authenticate')
            .send('identifier=john')
            .send('password=that is not the password')
            .expect('Content-type', /json/)
            .expect(403)
            .end(function (err: Error, res: Response): void {
              expect(res.status).to.equal(403);
              expect(res.body.success).to.equal(false);
              cb();
            });
        },
        function (cb: ISimpleCallback): void {
          server.post('/authenticate')
            .send('identifier=john@smith.com')
            .send('password=that is not the password')
            .expect('Content-type', /json/)
            .expect(403)
            .end(function (err: Error, res: Response): void {
              expect(res.status).to.equal(403);
              expect(res.body.success).to.equal(false);
              cb();
            });
        }
      ],
      done
    );

  });

  it('should return a success JSON message and a token if the authentication is successful', function (done: MochaDone): void {
    async.parallel(
      [
        function (cb: ISimpleCallback): void {
          server.post('/authenticate')
            .send('identifier=john')
            .send('password=password')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function (err: Error, res: Response): void {
              expect(res.status).to.equal(200);
              expect(res.body.success).to.equal(true);
              expect(res.body.token).to.match(/^[\w\-]+\.[\w\-]+\.[\w\-]+$/);
              cb();
            });
        },
        function (cb: ISimpleCallback): void {
          server.post('/authenticate')
            .send('identifier=john@smith.com')
            .send('password=password')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function (err: Error, res: Response): void {
              expect(res.status).to.equal(200);
              expect(res.body.success).to.equal(true);
              expect(res.body.token).to.match(/^[\w\-]+\.[\w\-]+\.[\w\-]+$/);
              cb();
            });
        }
      ],
      done
    );
  });

  it('should tell whether or not the incoming request is duly authenticated: if it IS', function (done: MochaDone): void {
    let token: string;
    async.series(
      [
        function (cb: ISimpleCallback): void {
          // authenticate first
          server.post('/authenticate')
            .send('identifier=john')
            .send('password=password')
            .expect(200)
            .expect('Content-type', /json/)
            .end(function (err: Error, res: Response): void {
              if (err) {
                throw err;
              }
              expect(res.body.success).to.equal(true);
              token = res.body.token;
              cb();
            });
        },
        function (cb: ISimpleCallback): void {
          // -> GET request with token as query param
          server.get('/authenticate')
            .query('token=' + token)
            .expect(200)
            .expect('Content-type', /json/)
            .end(function (err: Error, res: Response): void {
              if (err) {
                throw err;
              }
              expect(res.body.success).to.equal(true);
              cb();
            });
        },
        function (cb: ISimpleCallback): void {
          // -> GET request with token as header
          server.get('/authenticate')
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-type', /json/)
            .end(function (err: Error, res: Response): void {
              if (err) {
                throw err;
              }
              expect(res.body.success).to.equal(true);
              cb();
            });
        }
      ],
      done);
  });

  it('should tell whether or not the incoming request is duly authenticated: if it use a BOGUS token', function (done: MochaDone): void {
    let token: string = 'aaaa.bbbb.cccc';
    async.series(
      [
        function (cb: ISimpleCallback): void {
          // -> GET request with token as query param
          server.get('/authenticate')
            .query('token=' + token)
            .expect(200)
            .expect('Content-type', /json/)
            .end(function (err: Error, res: Response): void {
              if (err) {
                throw err;
              }
              expect(res.body.success).to.equal(false);
              cb();
            });
        },
        function (cb: ISimpleCallback): void {
          // -> GET request with token as header
          server.get('/authenticate')
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-type', /json/)
            .end(function (err: Error, res: Response): void {
              if (err) {
                throw err;
              }
              expect(res.body.success).to.equal(false);
              cb();
            });
        }
      ],
      done);
  });

  it('should tell whether or not the incoming request is duly authenticated: if it IS NOT', function (done: MochaDone): void {
    async.series(
      [
        function (cb: ISimpleCallback): void {
          // -> GET request with token as query param
          server.get('/authenticate')
            .send()
            .expect(200)
            .expect('Content-type', /json/)
            .end(function (err: Error, res: Response): void {
              if (err) {
                throw err;
              }
              expect(res.body.success).to.equal(false);
              cb();
            });
        }
      ],
      done);
  });
});
