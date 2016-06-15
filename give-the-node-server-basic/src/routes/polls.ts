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

  }

  private static getAllPolls(cb: IPollsCallback): void {

  }

  private static getPollById(id: number, cb: IPollCallback): void {
    
  }
}
