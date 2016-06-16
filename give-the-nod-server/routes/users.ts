import {Router, Request, Response} from 'express';
import {findUser, users} from '../mock-up-data';
import {IUser} from '../models/user';
import {Authentication} from '../authentication';
import {userSerializer} from '../serializers/user-serializer';

namespace UserRoutes {
  'use strict';

  export const router: Router = Router();

  router.post('/', function (req: Request, res: Response): void {
    // validate incoming data:
    // we need a user name of min 6 char long
    req.checkBody('data.type', 'not a user record').equals('users');
    req.checkBody('data.attributes.name', 'not alphanumeric').isAlphanumeric();
    req.checkBody('data.attributes.name', 'too short (6 char min)').len(6, undefined);
    // we need an email that is a proper email
    req.checkBody('data.attributes.email', 'invalid email').isEmail();
    // we need a password that is at least 6 char long
    req.checkBody('data.attributes.password', 'password too short  (6 char min)').len(6, undefined);

    let errors: Dictionary<any> = req.validationErrors(true);
    // if any of these parameter does not fit the criteria
    if (errors) {
      res.status(403).json({
        errors: errors,
        success: false,
      });
      return;
    } else {
      res.status(500).json({error: 'not implemented yet!'});
    }
  });

  // router.use(Authentication.authenticatedRoute);

  router.get('/', function (req: Request, res: Response): void {
    res.status(200).json(userSerializer.serialize(users));
  });

  router.get('/:id', function (req: Request, res: Response): void {
    req.checkParams('id', 'not a valid ObjectId').notEmpty();
    let errors: Dictionary<any> = req.validationErrors();
    if (errors) {
      res.status(403).json({
        errors: errors,
        success: false
      });
      return;
    }

    let user: IUser = findUser(req.params.id);
    if (user) {
      res.json(userSerializer.serialize(user));
    } else {
      res.json(userSerializer.serialize(null));
    }
  });
}

export = UserRoutes;
