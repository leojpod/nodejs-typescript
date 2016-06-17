/**
 * Created by leojpod on 2016-06-14.
 */

/**
 * Created by leojpod on 3/5/16.
 */
import * as mongoose from 'mongoose';
import {Document} from 'mongoose';
import {Model} from 'mongoose';
import {Schema} from 'mongoose';
import {ObjectID} from 'mongodb';

namespace User {
  'use strict';

  export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
  }

  const userSchema: Schema = new Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  });

  userSchema.static.findAll = function (cb: {(err: Error, user: IUser[]): void}) {
    return this.find(cb);
  };

  export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

}
export = User;
