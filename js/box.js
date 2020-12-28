const buttons = document.querySelectorAll('[data-box]');
const boxes = document.querySelectorAll('.box');

const changeClass = {
  to_right: 'reverse_right',
  to_left: 'reverse_left',
};

let lastAnimation = null, clicked = false;

function randomAnimation() {
  const animations = ['to_right', 'to_left', 'to_left', 'to_right'];
  const randomValue = Math.floor(Math.random() * animations.length);
  
  return animations[randomValue];
}

buttons.forEach((button) => {
  button.addEventListener('click', showBox);
});

document.addEventListener('keydown', (event) => {
  const { key } = event;
  if (key!=='c' & key!=='h' & key!=='b') {
    return;
  }
  const button = document.querySelector(`button[data-key=${key}]`);
  if (key === 'c' && clicked === true) {
    const c = document.querySelector('.'+lastAnimation+' header .close');
    if (c) {
      return c.click();
    }
  }
  if (button) {
    return button.click();
  }
});

boxes.forEach((box) => {
  const closeButton = box.querySelector('.close');
  closeButton.addEventListener('click', () => {
    box.classList.add(changeClass[lastAnimation]);
    box.style.zIndex = -1;
    box.style.transform = 'scale(0)';
    clicked = false;
    return box.classList.remove(box.classList[1]);
  })
});

function showBox(event) {
  if (clicked) {
    return;
  }
  const { box } = event.target.dataset;
  const boxElement = document.getElementById(box);
  
  const animation = randomAnimation();

  boxElement.style.zIndex = 9;
  boxElement.style.transform = 'scale(1.16)';
  lastAnimation = animation;
  
  boxElement.classList.toggle(animation);
  clicked = true;
  return boxElement.classList.remove(boxElement.classList[1]);
}