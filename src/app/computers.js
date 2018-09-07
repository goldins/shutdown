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
 * @param {LevelObject} levelObject
 * @returns {Sprite[]}
 */
export default (levelObject) => {
  let allModels = {}, num = levelObject.num, variants = levelObject.vars;

  const randomSpeed = aliasSampler(levelObject.speeds);
  const randomVariant = aliasSampler(variants);

  for (let i = 0; i < num; i++) {
    allModels[i] = make({
      s: randomSpeed(),
      v: randomVariant(),
      i
    });
  }

  return allModels;
};
