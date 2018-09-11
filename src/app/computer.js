import { sMap, V_MAP } from './levels';
import OG from './gameInfo';

let xy = {};

const overlay = document.getElementById('screen_overlay');
const content = overlay.querySelector('.content');
const modal = document.getElementById('screen');
const starts = Array.from(document.getElementsByClassName('start'));
const shutdowns = Array.from(document.getElementsByClassName('shutdown'));

const variantHtml = document.getElementById('p');
const topText = document.createElement('div');
const cancelBtn = document.createElement('button');

const okBtn = document.createElement('button');

const icons = `💺 🔝 🚞 😁 😾 🚸 ☸ 🍛 🔖 🗃 🦁 💠 🛀 ♓ 🙎 🙀 🛃 💔 🐌 🐠 🌲 🗓 🐒 😑 🚏 🏺 🏭 🗝 🌼 🚩 🍾 🕢 🌁 🔱 🔘 📵 🕟 🦂 🚇 ❗ 🐱 🕋 📯 💓 😣 🏆 💅 👴 🦃 🚀 🐹
 😄 🚴 ⏸ ❎ 🕵 🎠 🏃 🍎 🍦 🏏 🌳 💜 🐈 👿 🔕 🕛 😈 🍒 ⛹ 🚚 🏢 🕌 💁 ⛪ 🔠 🌶 🏄 🌙 ♈ 🤒 📚 👳 🖱 🏉 📛 👄 🔗 🌈 😧 🀄 🗳 ⏩ 🌯 🎞 🙈 😗 🤐 🔀 ⛔ ⛄ ☘ 🐽 🌡 🔃 🌚 🏑
 🚼 🍈 🏊 👟 😀 📶 🕰 🐗 🙎 🏄 💁‍ 🙍 👎 👮 🕉 😹 🎖 😻 💚 👷 ✅ 🌗 🤕 🏤 👔 ⛰ 🙋 🗂 🚣 🎍 🏊 👩 🍄 👙 🚫 🙆 😅 🏞 💻 🏌 🙎‍ 🙏 🎫 🏄‍ 💆 💁‍ 👨 🚠 🔫 👦 👰 👃 🚧 👊
 👩‍ 💅 🛢 🚣‍ 🐕 😛`.split(' ');

let interval = null;

const showVariant = () => {
  variantHtml.style.display = 'block';
};

const hideVariant = () => {
  variantHtml.innerHTML = '';
  variantHtml.style.display = 'none';
};

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

const makeTimer = (m) => {
  let count = 30;
  const message = (ct) => `shutdown in ${ct} seconds`;
  topText.innerText = message(count);
  interval = setInterval(() => {
    count--;
    topText.innerText = message(count);
    if (!count) {
      hidePopup(m, false);
    }
  }, 1000);
  showVariant();
};

/**
 * @param {ComputerMeta} m
 */
const showPopup = (m) => {
  overlay.style.display = modal.style.display = 'block';
  const numIcons = Math.round(Math.random() * 20);
  let thisIcons = [];
  for (let i = 0; i < numIcons; i++) {
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    thisIcons = thisIcons.concat([randomIcon, ' ']);
    if (Math.random() > 0.8) {
      thisIcons.push('<br />');
    }
  }
  content.innerHTML = thisIcons.join('');
  const oneStart = starts[Math.floor(Math.random() * starts.length)];
  oneStart.parentNode.parentNode.style.display = 'block';
  const shutdown = oneStart.querySelector('.shutdown');

  function closeSuccessFn(event) {
    event.stopPropagation();
    hidePopup(m, true);
  }

  cancelBtn.innerText = 'Cancel';
  cancelBtn.onclick = (event) => {
    event.stopPropagation();
    hidePopup(m, null);
  };

  switch (m.v) {
    case V_MAP.NORMAL:
      shutdown.onclick = closeSuccessFn;
      break;
    case V_MAP.TIMED:
      okBtn.innerText = 'Shut down now';
      okBtn.onclick = closeSuccessFn;
      shutdown.onclick = () => makeTimer(m);
      addVariantChildren(false);
      break;
    case V_MAP.FORCE:
      shutdown.onclick = showVariant;
      topText.innerText = 'Waiting for programs to close';
      okBtn.innerText = 'Force';
      okBtn.onclick = closeSuccessFn;
      addVariantChildren(true);
      break;
    case V_MAP.SAVE:
      shutdown.onclick = showVariant;
      topText.innerText = 'You have unsaved changes!';
      okBtn.innerText = 'Save';
      okBtn.onclick = () => {
        topText.innerText = 'Waiting for programs to close';
        okBtn.innerText = 'Force';
        okBtn.onclick = closeSuccessFn;
        addVariantChildren(false);
      };
      addVariantChildren(true);
      break;
    case V_MAP.CHAT:
      shutdown.onclick = closeSuccessFn;
      const chat = document.createElement('div');
      chat.style.position = 'absolute';
      chat.style.width = '50%';
      chat.style.padding = '10px';
      chat.style.margin = '10px';
      chat.style.float = 'left';
      chat.style.marginTop = '40px';
      chat.style.background = '#fff';
      chat.innerHTML = '<ul><li>hey</li><li>u there</li><li>i miss u <3</li></ul>';
      const chatUl = chat.querySelector('ul');
      const chatField = document.createElement('input');
      chatField.type = 'text';
      const chatSubmit = document.createElement('button');
      chat.appendChild(chatField);
      chat.appendChild(chatSubmit);
      chatSubmit.innerText = 'send';
      const addChat = () => {
        const v = chatField.value;
        chatField.value = '';
        const newChat = document.createElement('li');
        newChat.innerText = v;
        chatUl.appendChild(newChat);
        if (v.toLowerCase().indexOf('love you') >= 0) {
          OG.updateScoreBonus(m);
        }
      };
      chatField.onkeyup = (v) => v.keyCode === 13 ? addChat() : void 0;
      chatSubmit.onclick = addChat;
      overlay.appendChild(chat);
      break;
    default:
      break;
  }
  oneStart.onclick = () => {
    shutdown.parentNode.style.display = 'inline-block';
  };
};

/**
 *
 * @param {boolean} okFirst - place OK button first
 */
function addVariantChildren(okFirst) {
  variantHtml.appendChild(topText);
  if (okFirst) {
    variantHtml.appendChild(okBtn);
  }
  variantHtml.appendChild(cancelBtn);
  if (!okFirst) {
    variantHtml.appendChild(okBtn);
  }
}

/**
 * @param {ComputerMeta} m
 * @param {boolean|null} success - true = yes, false = no, null = canceled.
 */
const hidePopup = (m, success) => {
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
  shutdowns.forEach(shutdown => shutdown.parentNode.style.display = 'none');
  if (success === false) {
    modal.classList.add('infected');
  } else {
    modal.classList.add('turn-off');
  }
  setTimeout(() => {
    starts.forEach(oneStart => {
      oneStart.onclick = () => {};
      oneStart.parentNode.parentNode.style.display = 'none';
    });
    overlay.style.display = modal.style.display = 'none';
    modal.className = '';
    hideVariant();
  }, 1000);

  if (success) {
    OG.spriteSaved(m);
  } else if (success === false) {
    OG.spriteLost(m);
  }
};

const getColor = (lifeLeft) => lifeLeft < 0.25 ? 'red' : lifeLeft < 0.7 ? '#FF0' : '#0F0';

const getLifeLeft = (mappedS, timeElapsed) => 1 - timeElapsed / mappedS.t;

export default make;
