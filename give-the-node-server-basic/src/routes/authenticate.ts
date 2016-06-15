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
  };

  public static isRequestAuthenticated(req: AugmentedRequest, next: (error: Error|boolean, token?: string) => any): void {
  };

  public static handleRequest(req: AugmentedRequest, res: ServerResponse): void {
  };
}
