import {Router} from 'express';
import {Response} from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import {Authentication} from '../authentication';
import {IRequest} from '../interfaces';
import {secretTokenKey} from '../config';
import {IUser} from '../models/user';
import {NextFunction} from 'express';

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

  router.post('/', function (req: IRequest, res: Response, next: NextFunction): void {
    req.checkBody('identifier', 'required').notEmpty();
    req.checkBody('password', 'required').notEmpty();
    let errors: Object = req.validationErrors();
    if (errors) {
      res.status(400).json({error: errors});
      return;
    }
    let userIdentifier: string = req.body.identifier;
    let password: string = req.body.password;

    req.db.collection('users')
      .find({$or: [{name: userIdentifier}, {email: userIdentifier}]}).limit(1)
      .toArray((toArrayErr: Error, users: IUser[]) => {
        if (users.length > 1) {
          next(new Error('something is wrong: there are more than one user matching the authentication params'));
        } else if (users.length === 0) {
          console.log('user %s does not exists', userIdentifier);
          res.status(403).json({
            'success': false,
            'message': 'wrong combination of password/identification'
          });
        } else {
          // let's compare the password then:
          bcrypt.compare(password, users[0].password, (err: Error, isValid: boolean): void => {
            if (err) {
              next(err);
              return;
            }
            if (isValid) {
              console.log('about to sign the token');
              jwt.sign(
                {userId: users[0]._id},
                secretTokenKey,
                {expiresIn: 86400000},
                (errorOrToken: Error|string): void => {
                  console.log('token signed ');
                  console.log('errorOrToken -> ', errorOrToken);
                  // - NOTE: at this point we're borderline pyramid of death and we should consider using async
                  if (errorOrToken instanceof Error) {
                    res.status(500).json({
                      'error': 'something went wrong with the JWT generation',
                      'success': false
                    });
                    next(errorOrToken);
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
      });
  });
}

export = AuthenticateRouter;
