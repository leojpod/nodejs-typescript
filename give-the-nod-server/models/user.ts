/**
 * Created by leojpod on 2016-06-14.
 */
export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}
export interface IJsonUser {
  type: string;
  id: string;
  attributes: {
    name: string;
    email: string;
  };
}
