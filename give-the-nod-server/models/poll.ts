import {IUser} from './user';
import * as mongoose from 'mongoose';
import {Document} from 'mongoose';
import {Model} from 'mongoose';
import {Schema} from 'mongoose';

/**
 * Created by leojpod on 2016-06-14.
 */

namespace Poll {
  'use strict';

  export interface IPoll extends Document {
    author_id?: string;
    author?: IUser;
    title: string;
    questions: Array<string>;
  }
  export interface IJsonPoll {
    type: string;
    id: string;
    attributes: {
      title: string;
      questions: string[];
    };
    relationships: {
      author: {
        data: {
          type: string;
          id: string;
        };
      };
    };
  }

  const poolSchema: Schema = new Schema({
    title: {type: String, required: true, unique: true},
    questions: [String],
    author: {type: Schema.Types.ObjectId, ref: 'User'}
  });

  export const Pool: Model<IPoll> = mongoose.model<IPoll>('Pool', poolSchema);

}

export = Poll;
