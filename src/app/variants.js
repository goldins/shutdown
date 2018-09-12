import OG from './gameInfo';

const modal = document.getElementById('screen');
const shutdowns = Array.from(document.getElementsByClassName('shutdown'));
const variantHtml = document.getElementById('p');
const topText = document.createElement('div');
const cancelBtn = document.createElement('button');
const overlay = document.getElementById('screen_overlay');
const starts = Array.from(document.getElementsByClassName('start'));
const infoHtml = document.getElementById('info');

const okBtn = document.createElement('button');

export const closeSuccessFn = (event, m) => {
  event.stopPropagation();
  hidePopup(m, true);
};

export const makeTimed = (m) => {
  okBtn.innerText = 'Shut down now';
  cancelBtn.innerText = 'Cancel';
  okBtn.onclick = (e) => closeSuccessFn(e, m);
  cancelBtn.onclick = () => hidePopup(m, null);
  makeTimer(m);
  addVariantChildren(false);
  showVariant();
};

export const makeForce = (m) => {
  topText.innerText = 'Waiting for programs to close';
  okBtn.innerText = 'Force';
  cancelBtn.innerText = 'Cancel';
  cancelBtn.onclick = () => hidePopup(m, null);
  okBtn.onclick = (e) => closeSuccessFn(e, m);
  addVariantChildren(true);
  showVariant();
};

export const makeSave = (m) => {
  topText.innerText = 'You have unsaved changes!';
  okBtn.innerText = 'Save';
  cancelBtn.innerText = 'Cancel';
  cancelBtn.onclick = hideVariant;
  okBtn.onclick = () => {
    okBtn.onclick = (e) => makeForce(e, m);
    topText.innerText = 'Waiting for programs to close';
    okBtn.innerText = 'Force';
    okBtn.onclick = (e) => closeSuccessFn(e, m);
    addVariantChildren(false);
  };
  addVariantChildren(true);
  showVariant();
};

export const makeChat = (m) => {
  okBtn.onclick = (e) => closeSuccessFn(e, m);
  const chat = document.createElement('div');
  chat.style.background = '#fff';
  chat.style.left = '20px';
  chat.style.position = 'absolute';
  chat.style.top = '60px';
  chat.style.width = '30vmin';
  chat.innerHTML = '<ul><li>hey</li><li>u there</li><li>i miss u</li></ul>';
  const chatUl = chat.querySelector('ul');
  const chatField = document.createElement('input');
  chatField.type = 'text';
  chatField.style.border = '1px solid #aaa';
  const chatSubmit = document.createElement('button');
  chat.appendChild(chatField);
  chat.appendChild(chatSubmit);
  chatSubmit.innerText = '>';
  const addChat = () => {
    const v = chatField.value;
    chatField.value = '';
    const newChat = document.createElement('li');
    newChat.style.textAlign = 'right';
    newChat.innerText = v;
    chatUl.appendChild(newChat);
    if (v.match(/l(ove|uv) (you|u)/ig)) {
      OG.updateScoreBonus(m);
    }
  };
  chatField.onkeyup = (v) => v.keyCode === 13 ? addChat() : void 0;
  chatSubmit.onclick = addChat;
  modal.appendChild(chat);
  return chat;
};

let interval = null;

const showVariant = () => {
  variantHtml.style.display = 'block';
};

const hideVariant = () => {
  variantHtml.innerHTML = '';
  variantHtml.style.display = 'none';
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
export const hidePopup = (m, success) => {
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
    infoHtml.style.display = overlay.style.display = modal.style.display = 'none';
    modal.className = '';
    hideVariant();
  }, 1000);

  if (success) {
    OG.spriteSaved(m);
  } else if (success === false) {
    OG.spriteLost(m);
  }
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

