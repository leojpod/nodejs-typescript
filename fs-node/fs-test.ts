/**
 * Created by leojpod on 2016-06-15.
 */

import {readdir, stat, Stats} from 'fs';
import * as async from 'async';

// console.log('about to list the current folder content');
// readdir('./', function(err: Error, stuff: string[]): void {
//   console.log('current content is: ', stuff);
// });

// dupliquer
// link('slides.txt', 'some-url.txt', (linkErr: Error): void => {
//   if (linkErr) {
//     throw linkErr;
//   }
//   // ajouter un peu de texte
//   appendFile('some-url.txt', 'example.com', (appendErr: Error): void => {
//     if (appendErr) {
//       throw appendErr;
//     }
//     // afficher le contenu
//     readFile('some-url.txt', 'utf-8', (readErr: Error, content: string): void => {
//       if (readErr) {
//         throw readErr;
//       }
//       console.log('content -> ', content);
//       throw new Error('there is nothing else to do !');
//     });
//   });
// });

console.log('about to list the current folder content');
readdir('./', function (err: Error, stuff: string[]): void {
  async.map(
    stuff,
    (item: string, cb) => {
      stat(item, (statErr: Error, stats: Stats): void => {
        cb(statErr, stats);
      });
    },
    (doneError: Error, res: Stats[]): void => {
      console.log('stats for all files -> ', res);
    }
  );

});
