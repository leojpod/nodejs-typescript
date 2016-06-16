import {Router, Response, Request} from 'express';
import {IUser} from '../models/user';
import {polls, findUser, findPoll} from '../mock-up-data';
import {IPoll} from '../models/poll';
import {pollSerializer} from '../serializers/poll-serializer';
import {Authentication} from '../authentication';
import jsonApiSerializer = require('jsonapi-serializer');

/**
 * Created by leojpod on 3/2/16.
 */


namespace PollRouter {
  'use strict';

  export const router: Router = Router();

  router.get('/', function (req: Request, res: Response): void {
    // mockup data for now:
    let pollsWithAuthor: Array<IPoll> = polls.map(function (poll: IPoll): IPoll {
      let author: IUser = findUser(poll.userId);
      if (author === undefined) {
        res.status(500).json({
          error: 'corrupted data',
          status: false
        });
        throw new Error('corrupted data');
      } else {
        poll.author = author;
      }
      return poll;
    });
    // we now have all the required authored and the polls available
    res.status(200).json(pollSerializer.serialize(pollsWithAuthor));
  });

  router.get('/:id', function (req: Request, res: Response): void {
    req.checkParams('id', 'not a valid id').notEmpty();
    let errors: Dictionary<any> = req.validationErrors();
    if (errors) {
      res.status(400).json({
        errors: errors,
        success: false
      });
      return;
    }
    let poll: IPoll = findPoll(req.params.id);
    if (poll) {
      // - TODO load the author to go with it!
      let author: IUser = findUser(poll.userId);
      if (author === undefined) {
        throw new Error('corrupted data!');
      }
      poll.author = author;
      res.json(pollSerializer.serialize(poll));
    } else {
      res.json(pollSerializer.serialize(null));
    }
  });

  // router.use(Authentication.authenticatedRoute);

  router.post('/', function (req: Request, res: Response): void {
    // validate the incoming data:
    req.checkBody('data.type', 'not a poll record').equals('polls');
    req.checkBody('data.attributes.title', 'missing').len(1);
    req.checkBody('data.attributes.questions', 'missing').notEmpty();
    req.checkBody('data.attributes', 'missing').notEmpty();

    let errors: Dictionary<any> = req.validationErrors();
    if (errors) {
      res.status(400).json({errors: 'malformed JSON-API resource'});
      return;
    }
    new jsonApiSerializer.Deserializer({
      users: {
        valueForRelationship: function (relationship: any): number {
          return relationship.id;
        }
      }
    }).deserialize(req.body, function (err: Error, poll: IPoll): void {
      if (err) {
        res.status(400).json({errors: 'malformed JSON-API resource'});
      }
      console.log('poll', poll);
      console.log('arguments -> ', arguments);
      res.status(500).json({error: 'not implemented yet!'});
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
