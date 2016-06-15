/**
 * Created by leojpod on 2/26/16.
 */
import * as url from 'url';
import {polls, users} from '../mock-up-data';
import {Normalizer} from '../normalizer';
import {AugmentedRequest} from '../augmented-request';
import {ServerResponse} from 'http';
import {IPoll, IUser, IJsonMessage, IJsonPoll, IJsonUser} from '../models/models-interfaces';

interface IPollsCallback {
  (err: Object|boolean, pools?: Array<IPoll>, users?: Array<IUser>): void;
}
interface IPollCallback {
  (err: Object|boolean, pool?: IPoll, user?: IUser): void;
}

export class Polls {
  public static handleRequest(req: AugmentedRequest, res: ServerResponse): void {
    let segments: string[] = url.parse(req.request.url).pathname.split('/');
    switch (segments.length) {
      case 2:
        // collection request
        switch (req.request.method) {
          case 'GET':
            Polls.getAllPolls(function (err: Object, polls: Array<IPoll>, users: Array<IUser>): void {
              if (err) {
                res.writeHead(500, {'Content-type': 'application/json'});
                res.write(JSON.stringify({'error': err}));
                res.end();
              } else {
                res.writeHead(200, {'Content-type': 'application/json'});

                let jsonMessage: IJsonMessage<Array<IJsonPoll>, Array<IJsonUser>> = {
                  data: [],
                  included: []
                };
                jsonMessage.data = Normalizer.normalizeArray(polls, Normalizer.normalizePoll);
                jsonMessage.included = Normalizer.normalizeArray(users, Normalizer.normalizeUser);
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
            Polls.getPollById(Number.parseInt(segments[2]), function (err: Object, poll: IPoll, author: IUser): void {
              if (err) {
                res.writeHead(500, {'content-type': 'application/json'});
                res.write(JSON.stringify({'error': err}));
                res.end();
              } else {
                console.log('user -> ', author);
                console.log('poll -> ', poll);
                res.writeHead(200, {'content-type': 'application/json'});
                let message: IJsonMessage<IJsonPoll, IJsonUser> = {
                  data: poll ? Normalizer.normalizePoll(poll) : undefined,
                  included: author ? Normalizer.normalizeUser(author) : undefined
                };
                res.write(JSON.stringify(message));
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

  private static getAllPolls(cb: IPollsCallback): void {
    let authorsByIds: {[id: number]: IUser} = {};
    polls.forEach(function (poll: IPoll): void {
      authorsByIds[poll.userId] = undefined;
    });
    for (let user of users) {
      if (authorsByIds.hasOwnProperty(user.id)) { // i.e. if we need this author
        authorsByIds[user.id] = user;
      }
    }
    let authors: Array<IUser> = [];
    for (let authorId in authorsByIds) {
      if (authorsByIds.hasOwnProperty(authorId)) {
        let author: IUser = authorsByIds[authorId];
        if (author === undefined) {
          cb('data corrupted');
          return;
        } else {
          authors.push(author);
        }
      }
    }
    cb(false, polls, authors);
  }

  private static getPollById(id: number, cb: IPollCallback): void {
    let thePoll: IPoll;
    for (let poll of polls) {
      if (poll.id === id) {
        thePoll = poll;
        break;
      }
    }
    if (thePoll === undefined) {
      // poll not found
      cb(false);
    } else {
      for (let user of users) {
        if (user.id === thePoll.userId) {
          // we found the matching user!
          cb(false, thePoll, user);
          return;
        }
      }
      // we have a poll but no user: i.e. data corrupt
      cb('data corrupted');
    }
  }
}
