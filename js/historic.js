function handleHistoric(newValue) {
  const historic = document.querySelector('#historic main');
  let savedHistoric = null;
  if (!newValue)
    savedHistoric = JSON.parse(localStorage.getItem('historic'));
  else
    savedHistoric = [newValue];
  
  if (!savedHistoric)
    savedHistoric = [];

  const buttons = [
    {class: 'd', text: '🗑'},
    // {class: 's', text: '✔'},
  ];

  savedHistoric.forEach((Item, index) => {
    const item = document.createElement('div');
    item.classList.add('item');
    item.dataset.index = Item + '_' + index;
    const p = document.createElement('p');
    p.innerText = Item;
    const span = document.createElement('span');
    const right = document.createElement('div');
    right.classList.add('right');

    buttons.forEach((button) => {
      const btn = document.createElement('button');
      btn.dataset.divIndex = Item + '_' + index;
      btn.addEventListener('click', deleteItem);
      const strong = document.createElement('strong');
      strong.classList.add(button.class);
      strong.innerText = button.text;
      btn.appendChild(strong);
      span.appendChild(btn);
    });
    
    right.appendChild(span);
    item.appendChild(p);
    item.appendChild(right);
    if (newValue)
      return historic.prepend(item);

    historic.appendChild(item);
  });
}

function deleteItem(event) {
  const { divIndex } = event.path[1].dataset;
  const element = document.querySelector(`[data-index='${divIndex}']`);
  const historic = getSavedHistoric();
  const separated = divIndex.split('_');
  const newHistoric = historic.filter((value) => value !== separated[0]);
  localStorage.setItem('historic', JSON.stringify(newHistoric));
  element.remove();
}
function deleteAll() {
  localStorage.clear();
  const items = document.querySelectorAll('.item');
  items.forEach((item) => {
    item.remove();
  });
}