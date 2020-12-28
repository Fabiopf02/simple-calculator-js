const columns = [
  [
    { class: '', id: 'clear', value: 'clear', text: 'CE' },
    { class: ['dig'], value: '7', text: '7' },
    { class: ['dig'], value: '4', text: '4' },
    { class: ['dig'], id: '', value: '1', text: '1' },
    { class: ['dig'], value: '0', text: '0' },
  ],
  [
    { class: ['dig'], value: '√', text: '√' },
    { class: ['dig'], value: '8', text: '8' },
    { class: ['dig'], value: '5', text: '5' },
    { class: ['dig'], id: '', value: '2', text: '2' },
    { class: ['dig'], value: '.', text: ',' },
  ],
  [
    { class: ['dig'], value: '%', text: '%' },
    { class: ['dig'], value: '9', text: '9' },
    { class: ['dig'], value: '6', text: '6' },
    { class: ['dig'], id: '', value: '3', text: '3' },
    { class: '', id: 'resultbtn', value: '=', text: '=' },
  ],
  [
    { class: ['dig'], value: '÷', text: '÷' },
    { class: ['dig'], value: 'x', text: 'x' },
    { class: ['dig'], value: '-', text: '-' },
    { class: ['dig', 'sum'], value: '+', text: '+' },
  ],
];
const buttonsElement = document.querySelector('div.buttons');

columns.forEach((column) => {

  const col = document.createElement('div');
  col.classList.add('col');

  column.forEach((item) => {
    const button = document.createElement('button');
    button.classList.add('btn');

    button.dataset.value = item.value;
    if (item.class) {
      button.classList.add(...item.class);
    }
    if (item.id) {
      button.id = item.id;
    }
    button.innerText = item.text;

    col.appendChild(button);
  });

  buttonsElement.appendChild(col);
});