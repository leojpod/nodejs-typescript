/**
 * Created by leojpod on 2/23/16.
 */

import {IUser, IPoll} from './models/models-interfaces';

export const users: Array<IUser> = [
  {
    email: 'john@smith.com',
    id: 0,
    name: 'john',
    password: 'password'
  },
  {
    email: 'joe@smith.com',
    id: 3,
    name: 'joe',
    password: 'password'
  },
  {
    email: 'anders@andersson.com',
    id: 4,
    name: 'anders',
    password: 'password'
  }
];

export const polls: Array<IPoll> = [
  {
    id: 1,
    questions: [
      'what ... is your name?',
      'what ... is your quest?',
      'what ... is your favorite color?'
    ],
    title: 'holy grail bridge',
    userId: users[0].id
  },
  {
    id: 2,
    questions: [
      "How would you rate this movie's plot?",
      "How would you rate this movie's cast?",
      "How would you rate this movie's soundtracks?",
      'Was the movie great?'
    ],
    title: 'was the movie great?',
    userId: users[0].id
  },
  {
    id: 5,
    questions: [
      "How would you rate last night's game?",
      "What do you think of the game's speed?",
      'How would you rate the defence quality?',
      'Was the game too technical for you?',
      'some other question about the game...'
    ],
    title: 'was it a good game?',
    userId: users[1].id
  }
];
