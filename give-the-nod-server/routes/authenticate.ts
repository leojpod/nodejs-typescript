import {Router} from 'express';
import {Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {Authentication} from '../authentication';
import {users} from '../mock-up-data';
import {IRequest} from '../interfaces';
import {secretTokenKey} from '../config';

namespace AuthenticateRouter {
  'use strict';

  export const router: Router = Router();

  router.get('/', function (req: IRequest, res: Response): void {
    Authentication.checkAuthentication(req, function (isAuth: boolean): void {
      if (isAuth === false) {
        res.json({
          message: 'you are not authenticated',
          success: false
        });
      } else {
        res.json({success: true});
      }
    });
  });

  router.post('/', function (req: IRequest, res: Response): void {
    req.checkBody('identifier', 'required').notEmpty();
    req.checkBody('password', 'required').notEmpty();
    let errors: Object = req.validationErrors();
    if (errors) {
      res.status(400).json({error: errors});
      return;
    }
    let userIdentifier: string = req.body.identifier;
    let password: string = req.body.password;

    // fake DATA for now:
    let isAuthenticable: boolean;
    console.log('authenticate user with %s and %s', userIdentifier, password);
    console.log('test user is : ', users[0]);
    if (users[0].name !== userIdentifier
      && users[0].email !== userIdentifier) {
      console.log('wrong id');
      isAuthenticable = false;
    } else if (users[0].password !== password) {
      console.log('wrong pwd');
      isAuthenticable = false;
    } else {
      // good id and good pwd
      console.log('can authenticate');
      isAuthenticable = true;
    }

    if (isAuthenticable) {
      console.log('about to sign the token');
      jwt.sign(
        {userId: users[0].id},
        secretTokenKey,
        {
          expiresIn: 86400 // = 24h * 60m * 60s
        },
        (errorOrToken: Error|string): void => {
          console.log('token signed ');
          console.log('errorOrToken -> ', errorOrToken);
          if (errorOrToken instanceof Error) {
            res.status(500).json({
              'error': 'something went wrong with the JWT generation',
              'success': false
            });
          } else {
            let token: string = errorOrToken;
            res.status(200).json({
              'success': true,
              'token': token
            });
          }
        }
      );
    } else {
      res.status(403).json({
        'success': false,
        'message': 'wrong combination of password/identification'
      });
    }
  });
}

export = AuthenticateRouter;
