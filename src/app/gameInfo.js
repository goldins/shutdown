import { levels } from './levels';
import makeAll from './computers';

// Static game session information for easy global access.
export default class GameInfo {
  constructor() {
    GameInfo.makeLevel(0);
  }

  static removeSprite(id) {
    delete GameInfo.sp[id];
    GameInfo.makeSpritesArray();
  }

  static spriteLost(target) {
    --GameInfo.numLeft;
    GameInfo.removeSprite(target.id);
  }

  static spriteSaved(target) {
    ++GameInfo.wins;
    --GameInfo.numLeft;
    GameInfo.updateScore(target);
    GameInfo.removeSprite(target.id);
  }

  static makeSpritesArray() {
    GameInfo.spArr = Object.values(GameInfo.sp).reduce((r, b) => r.concat(b), []);
  }

  static checkEnd() {
    return !GameInfo.numLeft;
  }

  static set gameLoop(loop) {
    const _update = loop.update;
    loop.update = () => {
      GameInfo.elapsed += 1 / GameInfo.fps;
      _update();
    };
    GameInfo.loop = loop;
  }

  static updateScore(clickedTarget) {
    ++GameInfo.score;
  }

  static updateScoreBonus(clickedTarget) {
    ++GameInfo.chatWins;
  }

  static makeLevel(level) {
    GameInfo.level = level;
    GameInfo.elapsed = 0;
    GameInfo.sp = makeAll(levels[level]);
    const levelTargets = Object.keys(GameInfo.sp).length;
    GameInfo.numTotal += levelTargets;
    GameInfo.numLeft = levelTargets;
    GameInfo.makeSpritesArray();
  }

  static nextLevel() {
    GameInfo.makeLevel(++GameInfo.level);
  }
}

GameInfo.elapsed = 0;
GameInfo.score = 0;
GameInfo.chatWins = 0;
GameInfo.wins = 0;
GameInfo.numTotal = 0;
GameInfo.numLeft = 0;
GameInfo.spArr = null;
GameInfo.sp = null;
GameInfo.fps = 30;
