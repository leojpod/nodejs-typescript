/**
 * Created by leojpod on 2/25/16.
 */

import * as supertest from 'supertest';
import {Normalizer} from './normalizer';
import {Response} from 'superagent';
import {ISimpleCallback} from './test-utils';
import { polls, users } from '../../mock-up-data';
import {SuperTest} from 'supertest';
import * as async from 'async';
import * as chai from 'chai';
import ExpectStatic = Chai.ExpectStatic;

const expect: ExpectStatic = chai.expect;

const server: SuperTest = supertest.agent('http://localhost:8888');

describe('specify the polls resource management with this API', function (): void {

  it('should return the list of all the polls available on GET /polls', function (done: MochaDone): void {
    server.get('/polls')
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err: Error, res: Response): void {
        expect(res.status).to.equal(200);
        expect(res.body.error).to.not.exist;
        expect(res.body.data).to.eql(Normalizer.normalizeArray(polls, Normalizer.normalizePoll));
        expect(res.body.included).to.eql(Normalizer.normalizeArray([users[0], users[1]], Normalizer.normalizeUser));
        done();
      });
  });

  it('should return specific information on a poll when doing GET /polls/:number', function (done: MochaDone): void {
    async.parallel(
      [
        function (cb: ISimpleCallback): void {
          server.get('/polls/1')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function (err: Error, res: Response): void {
              if (err) {
                throw err;
              }
              expect(res.body.error).to.not.exist;
              expect(res.body.data).to.eql(Normalizer.normalizePoll(polls[0]));
              expect(res.body.included).to.eql([Normalizer.normalizeUser(users[0])]);
              cb();
            });
        },
        function (cb: ISimpleCallback): void {
          server.get('/polls/2')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function (err: Error, res: Response): void {
              if (err) {
                throw err;
              }
              expect(res.body.error).to.not.exist;
              expect(res.body.data).to.eql(Normalizer.normalizePoll(polls[1]));
              expect(res.body.included).to.eql([Normalizer.normalizeUser(users[0])]);
              cb();
            });
        }
      ],
      done);
  });

  it(
    'should return an empty resources message if GET /polls/:number is looking for a ' +
      'non existing number or a malformed number',
    function (done: MochaDone): void {
      async.parallel(
        [
          function (cb: ISimpleCallback): void {
            server.get('/polls/asd')
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
          },
          function (cb: ISimpleCallback): void {
            server.get('/polls/0')
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
        done);
    });


});
