/**
 * Created by leojpod on 3/3/16.
 */
import jsonApiSerializer = require('jsonapi-serializer');

namespace PollSerializer {
  'use strict';

  export const pollSerializer: jsonApiSerializer.Serializer = new jsonApiSerializer.Serializer('polls', {
    attributes: ['title', 'questions', 'author'],
    author: {
      attributes: ['name', 'email'],
      ref: '_id'
    },
    id: '_id',
    typeForAttribute: function (attribute: string): string {
      if (attribute === 'author') {
        return 'users';
      } else {
        return attribute;
      }
    }
  });
}

export = PollSerializer;
