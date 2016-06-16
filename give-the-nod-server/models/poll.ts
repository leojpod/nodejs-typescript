import {IUser} from './user';
/**
 * Created by leojpod on 2016-06-14.
 */
export interface IPoll {
  id: string;
  userId?: string;
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
