/**
 * Created by leojpod on 3/3/16.
 */

import * as supertest from 'supertest';
import {Response} from 'superagent';
import {ISimpleCallback} from './test-utils';
import {SuperTest} from 'supertest';
import * as async from 'async';
import * as chai from 'chai';
import ExpectStatic = Chai.ExpectStatic;

const expect: ExpectStatic = chai.expect;

const server: SuperTest = supertest.agent('http://localhost:8888');


describe('the /private url should be accessible only for authenticated users', function() {
  it('should send 403 response to unauthenticated attempts', function (done) {
    async.parallel([
      function (cb: ISimpleCallback): void {
        server.get('/private')
          .expect('Content-type', /json/)
          .expect(403)
          .end(function(err: Error, res: Response): void {
            if (err) {
              throw err;
            }
            expect(res.status).to.eql(403);
            expect(res.body.success).to.eql(false);
            cb();
          });
      },
      function (cb: ISimpleCallback): void {
        server.put('/private')
          .expect('Content-type', /json/)
          .expect(403)
          .end(function(err: Error, res: Response) {
            if (err) {
              throw err;
            }
            expect(res.status).to.eql(403);
            expect(res.body.success).to.eql(false);
            cb();
          });
      },
      function (cb: ISimpleCallback): void {
        server.post('/private')
          .expect('Content-type', /json/)
          .expect(403)
          .end(function(err: Error, res: Response): void {
            if (err) {
              throw err;
            }
            expect(res.status).to.eql(403);
            expect(res.body.success).to.equal(false);
            cb();
          });
      },
      function (cb: ISimpleCallback): void {
        server.patch('/private')
          .expect('Content-type', /json/)
          .expect(403)
          .end(function(err: Error, res: Response): void {
            if (err) {
              throw err;
            }
            expect(res.status).to.equal(403);
            expect(res.body.success).to.equal(false);
            cb();
          });
      },
      function (cb: ISimpleCallback): void {
        server.delete('/private')
          .expect('Content-type', /json/)
          .expect(403)
          .end(function(err: Error, res: Response): void {
            if (err) {
              throw err;
            }
            expect(res.status).to.equal(403);
            expect(res.body.success).to.equal(false);
            cb();
          });
      }
    ], done);
  });

  it('should be fine once authenticated', function(done: MochaDone): void {
    let token: string;
    async.series([
      function(cb: ISimpleCallback): void {
        server.post('/authenticate')
          .send({identifier: 'john', password: 'password'})
          .expect('Content-type', /json/)
          .expect(200)
          .end(function(err: Error, res: Response): void {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(true);
            expect(res.body.token).to.match(/^[\w\-]+\.[\w\-]+\.[\w\-]+$/);
            token = res.body.token;
            cb();
          });
      },
      function (callback: ISimpleCallback): void {
        async.parallel([
          function (cb: ISimpleCallback): void {
            server.get('/private')
              .set('x-access-token', token)
              .expect('Content-type', /json/)
              .expect(200)
              .end(function(err: Error, res: Response): void {
                if (err) {
                  throw err;
                }
                expect(res.status).to.equal(200);
                expect(res.body.success).to.equal(true);
                cb();
              });
          },
          function (cb: ISimpleCallback): void {
            server.put('/private')
              .set('x-access-token', token)
              .expect('Content-type', /json/)
              .expect(200)
              .end(function(err: Error, res: Response): void {
                if (err) {
                  throw err;
                }
                expect(res.status).to.equal(200);
                expect(res.body.success).to.equal(true);
                cb();
              });
          },
          function (cb: ISimpleCallback): void {
            server.post('/private')
              .set('x-access-token', token)
              .expect('Content-type', /json/)
              .expect(200)
              .end(function(err: Error, res: Response): void {
                if (err) {
                  throw err;
                }
                expect(res.status).to.equal(200);
                expect(res.body.success).to.equal(true);
                cb();
              });
          },
          function (cb: ISimpleCallback): void {
            server.patch('/private')
              .set('x-access-token', token)
              .expect('Content-type', /json/)
              .expect(200)
              .end(function(err: Error, res: Response): void {
                if (err) {
                  throw err;
                }
                expect(res.status).to.equal(200);
                expect(res.body.success).to.equal(true);
                cb();
              });
          },
          function (cb: ISimpleCallback): void {
            server.delete('/private')
              .set('x-access-token', token)
              .expect('Content-type', /json/)
              .expect(200)
              .end(function(err: Error, res: Response): void {
                if (err) {
                  throw err;
                }
                expect(res.status).to.equal(200);
                expect(res.body.success).to.equal(true);
                cb();
              });
          }
        ], callback);
      }
    ], done);
  });
});
