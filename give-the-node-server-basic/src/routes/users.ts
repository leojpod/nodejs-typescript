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

  }

  private static getAllUsers(cb: IUsersCallback): void {

  }

  private static getUserById(id: number, cb: IUserCallback): void {
    
  }
}
