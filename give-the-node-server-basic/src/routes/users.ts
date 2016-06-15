/**
 * Created by leojpod on 2/29/16.
 */

import * as url from 'url';
import {users} from '../mock-up-data';
import {Normalizer} from '../normalizer';
import {AugmentedRequest} from '../augmented-request';
import {ServerResponse} from 'http';
import {IUser, IJsonMessage, IJsonUser} from '../models/models-interfaces';

interface IUsersCallback {
  (err: Object|boolean, users?: Array<IUser>): void;
}
interface IUserCallback {
  (err: Object|boolean, users?: IUser): void;
}

export class Users {
  public static handleRequest(req: AugmentedRequest, res: ServerResponse): void {
    let segments: string[] = url.parse(req.request.url).pathname.split('/');
    switch (segments.length) {
      case 2:
        // collection request
        switch (req.request.method) {
          case 'GET':
            Users.getAllUsers(function (err: any, users: Array<IUser>): void {
              if (err) {
                res.writeHead(500, {'Content-type': 'application/json'});
                res.write(JSON.stringify({'error': err}));
                res.end();
              } else {
                res.writeHead(200, {'Content-type': 'application/json'});

                let jsonMessage: IJsonMessage<Array<IJsonUser>, void> = {
                  data: [],
                  included: undefined
                };

                jsonMessage.data = Normalizer.normalizeArray(users, Normalizer.normalizeUser);

                res.write(JSON.stringify(jsonMessage));
                res.end();
              }
            });
            break;
          default:
            res.writeHead(405, {'content-type': 'application/json'});
            res.write('{ "error": "method unavailable for given url"}');
            res.end();
        }
        break;
      case 3:
        switch (req.request.method) {
          case 'GET':
            Users.getUserById(Number.parseInt(segments[2]), function (err: any, user: IUser): void {
              if (!err) {
                res.writeHead(200, {'content-type': 'application/json'});
                let message: IJsonMessage<IJsonUser, void> = {
                  data: user !== undefined ? Normalizer.normalizeUser(user) : undefined,
                  included: undefined
                };
                res.write(JSON.stringify(message));
                res.end();
              } else {
                res.writeHead(500, {'content-type': 'application/json'});
                res.write(JSON.stringify({'error': err}));
                res.end();
              }
            });
            break;
          default:
            res.writeHead(405, {'content-type': 'application/json'});
            res.write('{"error": "method unavailable for given url"}');
            res.end();
        }
        break;
      case 4:
        res.writeHead(500, {'content-type': 'application/json'});
        res.write('{ "error": "not implemented yet"}');
        res.end();
        break;
      default:
        res.writeHead(404, {'content-type': 'application/json'});
        res.write('{ "error": "unknown route"}');
        res.end();
    }
  }

  private static getAllUsers(cb: IUsersCallback): void {
    cb(false, users);
  }

  private static getUserById(id: number, cb: IUserCallback): void {
    let theUser: IUser = undefined;
    for (let user of users) {
      if (user.id === id) {
        theUser = user;
        break;
      }
    }
    cb(false, theUser);
  }
}
