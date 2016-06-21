import {IUser} from './user';
import * as mongoose from 'mongoose';
import {Document} from 'mongoose';
import {Model} from 'mongoose';
import {Schema} from 'mongoose';
import {ObjectID} from "mongodb";

/**
 * Created by leojpod on 2016-06-14.
 */

namespace Poll {
  'use strict';

  export interface IPoll extends Document {
    // author_id?: string;
    author?: IUser| ObjectID;
    title: string;
    questions: Array<string>;
  }

  const pollSchema: Schema = new Schema({
    title: {type: String, required: true, unique: true},
    questions: [String],
    author: {type: Schema.Types.ObjectId, ref: 'User'}
  });

  pollSchema.static('findAll', function (cb: {(err: Error, polls: IPoll[]): void}): Promise<IPoll[]> {
    return this.find(cb);
  });
  pollSchema.static('findByAuthor', function (authorId: string, cb: {(err: Error, polls: IPoll[]): void}): Promise<IPoll[]> {
    return this.find({author: authorId}, cb);
  });

  pollSchema.method('getResults', function (cb: {(err: Error, results: any[]): void}): Promise<any[]> {
    cb(new Error('not implemented yet'), undefined);
    return (Promise.reject(new Error('not implemented yet')) as Promise<any[]>);
  });

  export const Poll: Model<IPoll> = mongoose.model<IPoll>('Poll', pollSchema);
}

export = Poll;
