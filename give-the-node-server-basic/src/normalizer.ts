/**
 * Created by leojpod on 2/29/16.
 */
import {IUser, IJsonUser, IPoll, IJsonPoll} from './models/models-interfaces';

export class Normalizer {
  public static normalizeUser(user: IUser): IJsonUser {
    return {
      attributes: {
        email: user.email,
        name: user.name
      },
      id: user.id,
      type: 'user'
    };
  }

  public static normalizePoll(poll: IPoll): IJsonPoll {
    return {
      attributes: {
        questions: poll.questions,
        title: poll.title
      },
      id: poll.id,
      relationships: {
        author: {
          data: {
            id: poll.userId,
            type: 'user'
          }
        }
      },
      type: 'poll'
    };
  }

  public static normalizeArray<O, J>(collection: Array<O>, normalizerMethod: (object: O) => J): Array<J> {
    let normalizedArray: Array<J> = [];
    for (let i: number = 0; i < collection.length; i ++) {
      normalizedArray.push(normalizerMethod(collection[i]));
    }
    return normalizedArray;
  }
}
