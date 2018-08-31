import make from './computer';

// todo: cleanup
function aliasSampler(inputProbabilities) {
  let probabilities;
  let aliases;
  probabilities = inputProbabilities.map(Number);
  const probMultiplier = inputProbabilities.length;
  probabilities = probabilities.map((p) => p * probMultiplier);

  const overFull = [], underFull = [];
  probabilities.forEach((p, i) => {
    if (p > 1) overFull.push(i);
    else if (p < 1) underFull.push(i);
  });

  aliases = [];
  while (overFull.length || underFull.length) {
    if (overFull.length && underFull.length) {
      aliases[underFull[0]] = overFull[0];
      probabilities[overFull[0]] += probabilities[underFull[0]] - 1;
      underFull.shift();
      if (probabilities[overFull[0]] > 1) overFull.push(overFull.shift());
      else if (probabilities[overFull[0]] < 1) underFull.push(overFull.shift());
      else overFull.shift();
    } else {
      const notEmptyArray = overFull.length > 0 ? overFull : underFull;
      notEmptyArray.forEach((index) => probabilities[index] = 1);
      notEmptyArray.length = 0;
    }
  }

  return () => {
    const r = Math.random;
    const index = Math.floor(r() * probabilities.length);
    return r() < probabilities[index] ? index : aliases[index];
  };
}

/**
 *
 * @param {LevelObject} l
 * @returns {Sprite[]}
 */
export default (l) => {
  let a = {}, m = [], d = l.num, s = l.speeds, v = l.vars;

  const randomSpeed = aliasSampler(s);
  const randomVariant = aliasSampler(v);

  for (let i = 0; i < d; i++) {
    m.push({ s: randomSpeed() });
  }

  for (let i = 0; i < d; i++) {
    m[i].v = randomVariant();
  }
  for (let j = 0; j < d; j++) {
    m[j].id = j;
    a[j] = make(m[j]);
  }

  return a;
};
