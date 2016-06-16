/**
 * Created by leojpod on 3/3/16.
 */
import * as express from 'express';
import {NextFunction, Response, Router} from 'express';
import {Authentication} from '../authentication';
import {IUser} from '../models/user';
import {findUser} from '../mock-up-data';
import {IRequest} from '../interfaces';

namespace privateRoutes {
  'use strict';

  export const router: Router = express.Router();

  router.use(Authentication.authenticatedRoute);

  router.all('/', function (req: IRequest, res: Response, next: NextFunction): void {
    let userId: string = req.decoded.userId;

    let currentUser: IUser = findUser(userId);

    if (!currentUser) {
      throw new Error('the user should be authenticated but is not');
    }

    res.json({
      message: `Hello ${currentUser.name} you are authenticated`,
      success: true,
      userId: userId
    });
  });
}

export = privateRoutes;
