/**
 * Created by leojpod on 2/23/16.
 */
import * as jwt from 'jsonwebtoken';
import {users} from '../mock-up-data';
import {secretTokenKey} from '../config';
import {AugmentedRequest} from '../augmented-request';
import {ServerResponse} from 'http';

interface IAuthenticationInformation {
  identifier: string;
  password: string;
}
function isAuthInformation(obj: any): obj is IAuthenticationInformation {
  'use strict';
  let authInfo: IAuthenticationInformation = obj as IAuthenticationInformation;
  return authInfo.identifier !== undefined && authInfo.password !== undefined;
}

export class Authenticate {
  public static authenticateUser(nameOrEmail: string, candidatePassword: string): boolean {
    // fake DATA for now:
    console.log('authenticate user with %s and %s', nameOrEmail, candidatePassword);
    console.log('test user is : ', users[0]);
    if (users[0].name !== nameOrEmail
      && users[0].email !== nameOrEmail) {
      console.log('wrong id');
      return false;
    }
    // check the password:
    return (users[0].password === candidatePassword);
  };

  public static isRequestAuthenticated(req: AugmentedRequest, next: (error: Error|boolean, token?: string) => any): void {
    let params: {token?: string } = req.post || req.query;
    let token: string = params.token || req.request.headers['x-access-token'] || undefined;
    if (token === undefined) {
      next(false);
    } else {
      jwt.verify(token, secretTokenKey, function (err: Error, decoded: string): void {
        console.log('err -> ', err);
        console.log('decoded -> ', decoded);
        next(err === null ? true : err , decoded);
      });
    }
  };

  public static handleRequest(req: AugmentedRequest, res: ServerResponse): void {
    console.log('request for authentication');
    switch (req.request.method) {
      case 'GET':
        // return authentication status
        // i.e. check for authentication token in the request and check it's validity
        Authenticate.isRequestAuthenticated(req, function (isAuth: Error|boolean): void {
          console.log('isAuth -> ', isAuth);
          res.writeHead(200);
          if (isAuth instanceof Error || isAuth === false) {
            // then return failure message
            res.write('{ "success": false, "message": "you are not authenticated"}');
          } else {
            // then return success message
            res.write('{ "success": true, "message": "you are authenticated"}');
          }
          res.end();
        });
        break;
      case 'POST':
        // extract authentication parameter, check if they are correct and return a token if they are
        if (req.post === undefined) {
          res.writeHead(403);
          res.write('{ "success": false, "error": "no parameters given" }');
          res.end();
          return;
        }
        let post: any = req.post;
        if (isAuthInformation(post)) {
          let authInfo: IAuthenticationInformation = post;
          if (Authenticate.authenticateUser(authInfo.identifier, authInfo.password)) {
            // use jwt to generate a token and send it
            jwt.sign(
              {userId: users[0].id},
              secretTokenKey, {
                expiresIn: 86400 // = 24h * 60m * 60s
              },
              (errOrToken: Error|string): void => {
                if (errOrToken instanceof Error) {
                  res.writeHead(500);
                  res.write('{ "success": false, "error": "something went wrong with the JWT generation"}');
                  res.end();
                } else {
                  let token: string = errOrToken;
                  res.writeHead(200);
                  res.write('{ "success": true, "token": "' + token + '"}');
                  res.end();
                }
              }
            );
          } else {
            res.writeHead(403);
            res.write('{ "success": false, "message": "wrong combination of password/identification"}');
            res.end();
          }
        } else {
          res.writeHead(403);
          res.write('{ "success": false, "error": "wrong type of parameters" }');
          res.end();
          return;
        }
        break;
      default:
        res.writeHead(405);
        res.write('{ "error": "method unavailable for given url"}');
        res.end();
    }
  }
}
