/**
 * Created by leojpod on 2016-06-04.
 */
export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}
export interface IJsonUser {
  type: string;
  id: number;
  attributes: {
    name: string;
    email: string;
  };
}
export interface IPoll {
  id: number;
  userId: number;
  title: string;
  questions: Array<string>;
}
export interface IJsonPoll {
  type: string;
  id: number;
  attributes: {
    title: string;
    questions: string[];
  };
  relationships: {
    author: {
      data: {
        type: string;
        id: number;
      };
    };
  };
}

export interface IJsonMessage<T, U> {
  data: T;
  included: U;
}

