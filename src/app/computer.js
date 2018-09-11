import { sMap, V_MAP } from './levels';
import OG from './gameInfo';
import { closeSuccessFn, hidePopup, makeChat, makeForce, makeSave, makeTimed } from './variants';

let xy = {};

const overlay = document.getElementById('screen_overlay');
const content = overlay.querySelector('.content');
const modal = document.getElementById('screen');
const starts = Array.from(document.getElementsByClassName('start'));

const icons = `💺 🔝 🚞 😁 😾 🚸 ☸ 🍛 🔖 🗃 🦁 💠 🛀 ♓ 🙎 🙀 🛃 💔 🐌 🐠 🌲 🗓 🐒 😑 🚏 🏺 🏭 🗝 🌼 🚩 🍾 🕢 🌁 🔱 🔘 📵 🕟 🦂 🚇 ❗ 🐱 🕋 📯 💓 😣 🏆 💅 👴 🦃 🚀 🐹
 😄 🚴 ⏸ ❎ 🕵 🎠 🏃 🍎 🍦 🏏 🌳 💜 🐈 👿 🔕 🕛 😈 🍒 ⛹ 🚚 🏢 🕌 💁 ⛪ 🔠 🌶 🏄 🌙 ♈ 🤒 📚 👳 🖱 🏉 📛 👄 🔗 🌈 😧 🀄 🗳 ⏩ 🌯 🎞 🙈 😗 🤐 🔀 ⛔ ⛄ ☘ 🐽 🌡 🔃 🌚 🏑
 🚼 🍈 🏊 👟 😀 📶 🕰 🐗 🙎 🏄 💁‍ 🙍 👎 👮 🕉 😹 🎖 😻 💚 👷 ✅ 🌗 🤕 🏤 👔 ⛰ 🙋 🗂 🚣 🎍 🏊 👩 🍄 👙 🚫 🙆 😅 🏞 💻 🏌 🙎‍ 🙏 🎫 🏄‍ 💆 💁‍ 👨 🚠 🔫 👦 👰 👃 🚧 👊
 👩‍ 💅 🛢 🚣‍ 🐕 😛`.split(' ');

/** @type {number} computer size */
let s = 40;
const n = (dim) => Math.floor(dim / s);
const r = (dim) => Math.round(Math.random() * (dim - s) / n(dim)) * n(dim);

/**
 * @typedef {object} ComputerMeta
 * @param {number} s - speed - will render different images
 * @param {number} v - variant
 * @param {number} i - id/index
 */

/**
 *
 * @param {ComputerMeta} m
 * @returns {Sprite[]} - [computerSprite, timerRect]
 */
const make = (m) => {
  let mappedS = sMap[m.s];
  let image = kontra.assets.images[`c${mappedS.i}`];
  const w = kontra.canvas.width;
  const h = kontra.canvas.height;
  // todo: make sure this is never out of view!!
  let x = r(w), y = r(h);
  if (!xy[x]) xy[x] = {};
  if (xy[x][y]) {
    return make(m);
  }
  xy[x][y] = 1;
  let timeElapsed = 0;
  const c = kontra.sprite({
    x,
    y,
    image,
    ttl: mappedS.t * OG.fps,
    color: 'transparent',
    onDown: () => showPopup(m),
    render: function() {
      this.draw();
      this.width = s;
      this.height = s - 5;
    },
    update: function() {
      const ttlCheck = timeElapsed * OG.fps;
      if (ttlCheck >= this.ttl) {
        hidePopup(m, false);
      }
    }
  });

  const t = kontra.sprite({
    height: 5,
    x,
    y: y + s - 5,
    ttl: mappedS.t * OG.fps,
    onDown: () => showPopup(m),
    render: function() {
      this.draw();
      this.context.strokeRect(this.x, this.y, this.width, this.height);
    },
    update: function() {
      timeElapsed += 1 / OG.fps;
      /** @var {number} percent of life remaining */
      const lifeLeft = getLifeLeft(mappedS, timeElapsed);
      this.color = getColor(lifeLeft);
      this.width = Math.max(0, s * lifeLeft);
    }
  });
  return [c, t];
};

/**
 *
 * @param {ComputerMeta} m
 */
export const showInfo = (m) => {
  const infoHtml = document.getElementById('info');
  infoHtml.style.display = 'block';
  console.log(m.s);
  const infoOkay = document.createElement('button');
  infoHtml.innerHTML = `I'm a ${m.s === 0 ? 'slow' : m.s === 1 ? 'medium' : 'fast'} computer.`;
  infoOkay.innerText = 'Cancel';
  infoHtml.appendChild(infoOkay);
  infoOkay.onclick = (e) => {
    e.stopPropagation();
    infoHtml.style.display = 'none';
    infoHtml.innerHTML = '';
  };
};

/**
 * @param {ComputerMeta} m
 */
const showPopup = (m) => {
  const numIcons = Math.round(Math.random() * 20);
  const thisIcons = [];
  for (let i = 0; i < numIcons; i++) {
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    thisIcons.push(randomIcon);
    if (Math.random() > 0.8) {
      thisIcons.push('<br />');
    }
  }
  content.innerHTML = thisIcons.join(' ');
  const oneStart = starts[Math.floor(Math.random() * starts.length)];
  const shutdown = oneStart.querySelector('.shutdown');
  const info = oneStart.querySelector('.info');
  info.onclick = () => showInfo(m);
  oneStart.parentNode.parentNode.style.display = 'block';
  overlay.style.display = modal.style.display = 'block';

  oneStart.onclick = () => {
    shutdown.parentNode.style.display = 'block';
  };

  switch (m.v) {
    case V_MAP.NORMAL:
      shutdown.onclick = (event) => closeSuccessFn(event, m);
      break;
    case V_MAP.TIMED:
      shutdown.onclick = () => makeTimed(m);
      break;
    case V_MAP.FORCE:
      shutdown.onclick = () => makeForce(m);
      break;
    case V_MAP.SAVE:
      shutdown.onclick = () => makeSave(m);
      break;
    case V_MAP.CHAT:
      const chat = makeChat(m);
      shutdown.onclick = (event) => {
        closeSuccessFn(event, m);
        chat.parentNode.removeChild(chat);
      };
      break;
    default:
      break;
  }
};

const getColor = (lifeLeft) => lifeLeft < 0.25 ? 'red' : lifeLeft < 0.7 ? '#FF0' : '#0F0';

const getLifeLeft = (mappedS, timeElapsed) => 1 - timeElapsed / mappedS.t;

export default make;
