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
  // slow
  { i: 1, t: 30 },
  // medium
  { i: 2, t: 20 },
  // fast
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
  num: 1,
  // speeds (%)
  speeds: [1],
  // variants (%)
  vars: [1]
}, {
  // LEVEL 2
  num: 3,
  speeds: [1, 1],
  vars: [f, f * 3]
}, {
  // LEVEL 3
  num: 5,
  speeds: [t, t, t],
  vars: [f, f, f * 2]
}, {
  // LEVEL 4
  num: 5,
  speeds: [h, h],
  vars: [0, f, f * 2, f]
}, {
  // LEVEL 5
  num: 1,
  speeds: [1],
  vars: [0, 0, 0, 0, 1]
}, {
  // LEVEL 6
  num: 8,
  speeds: [h, h],
  vars: [0, f, f, f]
}, {
  // LEVEL 7
  num: 5,
  speeds: [h, h],
  vars: [i, i, i, i, i]
}, {
  // LEVEL 8
  num: 5,
  speeds: [0, h, h],
  vars: [0, f, f, f * 2]
}, {
  // LEVEL 9
  num: 5,
  speeds: [0, h, h],
  vars: [0, 0, h, h]
}, {
  // LEVEL 10
  num: 5,
  speeds: [0, h, h],
  vars: [t, 0, 0, t, t]
}];
