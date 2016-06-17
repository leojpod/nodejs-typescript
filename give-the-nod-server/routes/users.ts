import * as async from 'async';
import * as bcrypt from 'bcrypt';
import {Router, Response} from 'express';
import {NextFunction} from 'express';
import jsonApiSerializer = require('jsonapi-serializer');
import {IUser} from '../models/user';
import {Authentication} from '../authentication';
import {userSerializer} from '../serializers/user-serializer';
import {IRequest} from '../interfaces';
import {ObjectID} from "mongodb";

namespace UserRoutes {
  'use strict';

  export const router: Router = Router();
  // router.use(function (req, res, next) {
  //   console.log('this is just an empty middleware');
  //   next();
  // });
  router.post('/', function (req: IRequest, res: Response, next: NextFunction): void {
    console.log('let us create a user please');
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
      console.log('about to create a new user');
      // let's create the new user:
      new jsonApiSerializer.Deserializer().deserialize(req.body, (err: Error, user: IUser): void => {
        if (err) {
          console.log('deserialize failed');
          res.status(400).json({
            errors: err.toString(),
            success: false
          });
          return;
        }
        // at this point we "parsed" the data from the request's body into a IUser
        let insertedUser: IUser;
        async.series([
          (done) => {
            // 1 - check for existing user
            req.db.collection('users')
              .find({$or: [{name: user.name}, {email: user.email}]})
              .toArray((userLookupErr, users) => {
                if (userLookupErr) {
                  next(userLookupErr);
                }
                if (users.length > 0) {
                  // there is already a user:
                  done(new Error('name or email already taken'));
                  // of course in reality we would check for which field is already taken
                } else {
                  // all good dude
                  done();
                }
              });
          },
          (done) => {
            // 2 - encrypt the password
            bcrypt.hash(user.password, 10, (hashErr, hashedPwd) => {
              if (hashErr) {
                next(hashErr);
                done(hashErr);
                return;
              }
              user.password = hashedPwd;
              done();
            });
          },
          (done) => {
            // 3 - create the user if we are good
            req.db.collection('users').insertOne(user, (insertError, report) => {
              if (insertError) {
                console.log('insertion failed');
                next(insertError);
                done(new Error('500 db messed up'));
                return;
              }
              if (!report.insertedId) {
                console.log('there was no insert');
                next(new Error('the user creation failed!'));
                done(new Error('500 db messed up'));
                return;
              }
              insertedUser = report.ops[0];
              done();
            });
          }
        ], (processErr) => {
          if (processErr) {
            res.status(403).json({error: processErr.toString(), success: false});
          } else {
            res.status(200).json(userSerializer.serialize(insertedUser));
          }
        });
      });
    }
  });

  router.use(Authentication.authenticatedRoute);

  router.get('/', function (req: IRequest, res: Response, next: NextFunction): void {
    req.db.collection('users').find().toArray((err, users) => {
      if (err) {
        next(err);
        return;
      }
      res.status(200).json(userSerializer.serialize(users));
    });
  });

  router.get('/:id', function (req: IRequest, res: Response, next: NextFunction): void {
    req.checkParams('id', 'not a valid ObjectId').isMongoId();
    let errors: Dictionary<any> = req.validationErrors();
    if (errors) {
      res.status(403).json({
        errors: errors,
        success: false
      });
      return;
    }
    console.log('req.params.id -> ', req.params.id);
    req.db.collection('users')
      .find({_id: new ObjectID(req.params.id)}).limit(1)
      .toArray((err, users) => {
        if (err) {
          next(err);
          return;
        }
        if (users.length > 0) {
          res.json(userSerializer.serialize(users[0]));
        } else {
          res.json(userSerializer.serialize(null));
        }
      });
  });
}

export = UserRoutes;
