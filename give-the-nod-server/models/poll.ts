import {IUser} from './user';
/**
 * Created by leojpod on 2016-06-14.
 */
export interface IPoll {
  _id: string;
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
