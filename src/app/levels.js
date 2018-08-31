/**
 * @typedef {object} LevelObject
 * @property {number} num - number of computers
 * @property {number[]} speeds - distribution: must add up to 1 and each must divide nicely into `num`.
 *                               [.5, .5] denote 50-50 split between 0 (image 1, 30 second timer)
 *                               and 1 (image 2, 20 seconds)
 * @property {number[]} vars - distribution: must add up to 1 and each must divide nicely into `num`.
 *                                 [.5, .5] denote 50-50 split between normal (0) and timed (1)
 */

export const V_MAP = {
  NORMAL: 0,
  TIMED: 1,
  FORCE: 2,
  SAVE: 3,
  CHAT: 4
};

/**
 * @type {{i: number, t: number}[]}
 * i: computer type (used for image)
 * t: start timer
 */
export const sMap = [
  { i: 1, t: 30 },
  { i: 2, t: 20 },
  { i: 3, t: 10 }
];

const [h, t, f, i] = [1 / 2, 1 / 3, 1 / 4, 1 / 5];

/**
 *
 * @type {LevelObject[]}
 */
export const levels = [{
  // LEVEL 1
  // number of computers
  num: 10,
  // speed of computers (%)
  speeds: [1],
  // (%)
  vars: [0,1]
}, {
  // LEVEL 2
  num: 3,
  speeds: [h, h],
  vars: [1]
}, {
  // LEVEL 3
  num: 3,
  speeds: [1],
  vars: [t, t + t]
}, {
  // LEVEL 4
  num: 5,
  speeds: [t,t,t],
  vars: [0,t,t,t]
}];
