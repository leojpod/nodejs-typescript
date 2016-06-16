/**
 * Created by leojpod on 2/25/16.
 */

import * as supertest from 'supertest';
import {Normalizer} from './normalizer';
import {Response} from 'superagent';
import {ISimpleCallback} from './test-utils';
import {users} from '../../mock-up-data';
import {SuperTest} from 'supertest';
import * as async from 'async';
import * as chai from 'chai';
import ExpectStatic = Chai.ExpectStatic;

const expect: ExpectStatic = chai.expect;

const server: SuperTest = supertest.agent('http://localhost:8888');

describe('specify the user resource management with this API', function (): void {

  it('should return the list of all the users available on GET /users', function (done: MochaDone): void {
    server.get('/users')
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err: Error, res: Response): void {
        expect(res.status).to.equal(200);
        expect(res.body.error).to.not.exist;
        expect(res.body.data).to.eql(
          Normalizer.normalizeArray([users[0], users[1], users[2]], Normalizer.normalizeUser));
        done();
      });
  });

  it('should return specific information on a user when doing GET /user/:number', function (done: MochaDone): void {
    async.parallel(
      [
        function (cb: ISimpleCallback): void {
          server.get('/users/0')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function (err: Error, res: Response): void {
              if (err) {
                throw err;
              }
              expect(res.body.error).to.not.exist;
              expect(res.body.data).to.eql(Normalizer.normalizeUser(users[0]));
              cb();
            });
        },
        function (cb: ISimpleCallback): void {
          server.get('/users/3')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function (err: Error, res: Response): void {
              if (err) {
                throw err;
              }
              expect(res.body.error).to.not.exist;
              expect(res.body.data).to.eql(Normalizer.normalizeUser(users[1]));
              cb();
            });
        }
      ],
      done
    );
  });

  it(
    'should return an empty resources message if GET /user/:number ' +
    'is looking for a non existing number or a malformed number',
    function (done: MochaDone): void {
      async.parallel(
        [
          function (cb: ISimpleCallback): void {
            server.get('/users/asd')
              .expect('Content-type', /json/)
              .expect(200)
              .end(function (err: Error, res: Response): void {
                if (err) {
                  throw err;
                }
                expect(res.body.error).to.not.exist;
                expect(res.body.data).to.eql(null);
                cb();
              });
          },
          function (cb: ISimpleCallback): void {
            server.get('/users/1')
              .expect('Content-type', /json/)
              .expect(200)
              .end(function (err: Error, res: Response): void {
                if (err) {
                  throw err;
                }
                expect(res.body.error).to.not.exist;
                expect(res.body.data).to.eql(null);
                expect(res.body.included).to.eql(undefined);
                cb();
              });
          }
        ],
        done
      );
    });


});
