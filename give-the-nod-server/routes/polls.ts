import {Router, Response, Request} from 'express';
import jsonApiSerializer = require('jsonapi-serializer');
import {NextFunction} from 'express';
import * as async from 'async';
import {IPoll} from '../models/poll';
import {pollSerializer} from '../serializers/poll-serializer';
import {Authentication} from '../authentication';
import {IRequest} from '../interfaces';
import {ObjectID} from "mongodb";

/**
 * Created by leojpod on 3/2/16.
 */


namespace PollRouter {
  'use strict';

  export const router: Router = Router();

  router.get('/', function (req: IRequest, res: Response, next: NextFunction): void {
    req.db.collection('polls').find().toArray((err, polls: IPoll[]) => {
      if (err) {
        next(err);
        return;
      }
      // we now have the polls:
      // let's load the authors
      async.each(polls, (poll: IPoll, done) => {
        req.db.collection('users').find({_id: new ObjectID(poll.author_id)}).toArray((userErr, users) => {
          if (userErr) {
            done(userErr);
            return;
          }
          if (users.length !== 1) {
            done(new Error('there is something wrong in our data'));
            return;
          }
          // we got the author let's put it in our record
          poll.author = users[0];
          done();
        });
      }, (authorFetchingErr) => {
        if (authorFetchingErr) {
          next(authorFetchingErr);
        } else {
          res.status(200).json(pollSerializer.serialize(polls));
        }
      });
    });
  });

  router.get('/:id', function (req: IRequest, res: Response, next: NextFunction): void {
    req.checkParams('id', 'not a valid id').isMongoId();
    let errors: Dictionary<any> = req.validationErrors();
    if (errors) {
      res.status(400).json({
        errors: errors,
        success: false
      });
      return;
    }
    req.db.collection('polls').find({_id: req.params.id}).toArray((err, polls) => {
      if (err) {
        next(err);
        return;
      }
      if (polls.length > 1) {
        // that should never happen
        next(new Error('database corrupted: more than one id'));
      } else if (polls.length === 0) {
        // no poll
        res.json(pollSerializer.serialize(null));
      } else {
        // let's load the author:
        let poll: IPoll = polls[0];
        req.db.collection('users').find({_id: poll.author_id}).toArray((userErr, users) => {
          if (userErr) {
            next(userErr);
            return;
          }
          if (users.length !== 1) {
            next(new Error('there is something wrong in our data'));
            return;
          }
          // we got the author let's put it in our record
          poll.author = users[0];
          res.json(pollSerializer.serialize(poll));
        });
      }
    });
  });

  router.use(Authentication.authenticatedRoute);

  router.post('/', function (req: IRequest, res: Response, next: NextFunction): void {
    // validate the incoming data:
    console.log('creating a poll');
    req.checkBody('data.type', 'not a poll record').equals('polls');
    req.checkBody('data.attributes.title', 'missing').len(1);
    req.checkBody('data.attributes.questions', 'missing').notEmpty();
    req.checkBody('data.attributes', 'missing').notEmpty();

    let errors: Dictionary<any> = req.validationErrors();
    if (errors) {
      res.status(400).json({errors: 'malformed JSON-API resource'});
      return;
    }
    console.log('deserializing...');
    new jsonApiSerializer.Deserializer({
      users: {
        valueForRelationship: function (relationship: any): number {
          return relationship.id;
        }
      }
    }).deserialize(req.body, function (err: Error, poll: IPoll): void {
      if (err) {
        res.status(400).json({errors: 'malformed JSON-API resource'});
        return;
      }
      console.log('deserialized poll -> ', poll);
      poll.author_id = poll.author as String;
      delete(poll.id);
      delete(poll.author);
      let insertedPoll: IPoll;
      console.log('making the insertion');
      req.db.collection('polls')
        .insertOne(poll, (insertErr, report) => {
          if (insertErr) {
            next(insertErr);
            return;
          }
          if (!report.insertedId) {
            next(new Error('the poll creation process failed'));
            return;
          }
          insertedPoll = report.ops[0];
          res.status(200).json(pollSerializer.serialize(pollSerializer));
        });
    });
  });

  router.get('/:id/answers', function (req: Request, res: Response): void {
    res.status(500).json({error: 'unimplemented'}).end();
  });
  router.post('/:id/answers', function (req: Request, res: Response): void {
    res.status(500).json({error: 'unimplemented'}).end();
  });
  router.get('/:id/results', function (req: Request, res: Response): void {
    res.status(500).json({error: 'unimplemented'}).end();
  });
}

export = PollRouter;
