/**
 * Created by leojpod on 3/7/16.
 */

const names = [
];

export function randomName() {
  return names[Math.floor(Math.random()*names.length)];
};
