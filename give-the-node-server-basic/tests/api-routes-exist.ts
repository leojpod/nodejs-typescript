///<reference path="../typings/index.d.ts"/>
/**
 * Created by leojpod on 2/24/16.
 */

import * as supertest from 'supertest';
import {Response} from 'superagent';
import {SuperTest} from 'supertest';
import * as chai from 'chai';
import ExpectStatic = Chai.ExpectStatic;

const expect: ExpectStatic = chai.expect;

// get the API server
const server: SuperTest = supertest.agent('http://localhost:8888');

// start describing the API
describe('check that routes are defined', function(): void {
  // routes:
  //  - POST GET /authenticate
  //  - GET POST /polls
  //  - GET /polls/0
  //  - POST /polls/0/answers
  //  - ...

  it('should be possible to access /authenticate with GET', function(done: MochaDone): void {

    server.get('/authenticate').end(function(err: Error|boolean, res: Response): void {
      if (err) { throw err; }
      expect(res.status).to.not.equal(404);
      done();
    });
  });
  it('should be possible to access /authenticate with POST', function(done: MochaDone): void {
    server.post('/authenticate').end(function(err: Error|boolean, res: Response): void {
      if (err) { throw err; }
      expect(res.status).to.not.equal(404);
      done();
    });
  });

  it('should be possible to access /polls with GET', function(done: MochaDone): void {
    server.get('/polls').end(function(err: Error, res: Response): void {
      if (err) { throw err; }
      expect(res.status).to.not.equal(404);
      done();
    });
  });
  it('should be possible to access /polls with POST', function(done: MochaDone): void {
    server.post('/polls').end(function(err: Error, res: Response): void {
      if (err) { throw err; }
      expect(res.status).to.not.equal(404);
      done();
    });
  });

  it('should be possible to access /polls/0 with GET', function(done: MochaDone): void {
    server.get('/polls/0').end(function(err: Error, res: Response): void {
      if (err) { throw err; }
      expect(res.status).to.not.equal(404);
      done();
    });
  });

  it('should be possible to access /polls/0/answers with POST', function(done: MochaDone): void {
    server.post('/polls/0').end(function(err: Error, res: Response): void {
      if (err) { throw err; }
      expect(res.status).to.not.equal(404);
      done();
    });
  });

  it('should be possible to access /polls/0/results with GET', function(done: MochaDone): void {
    server.get('/polls/0/results').end(function(err: Error, res: Response): void {
      if (err) { throw err; }
      expect(res.status).to.not.equal(404);
      done();
    });
  });
});
