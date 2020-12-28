const zoom = document.querySelector('.zoom');
const previewElement = document.querySelector('.preview');
const imageElement = document.querySelector('.preview .image');
const changeImage = document.getElementById('change_image');
const animatedElement = document.getElementById('animated');
const noImage = document.getElementById('noimage');
const inputType = document.getElementById('type');
const colorInput = document.getElementById('color');
const calculator = document.querySelector('.calculator-container');

let image = {};

colorInput.addEventListener('change', (event) => {
  const {value:color} = event.target;
  if (!color) {
    return;
  }
  setConfig('color', color);
  return loadConfig();
});

inputType.addEventListener('change', (event) => {
  changeImage.classList.toggle('h', !event.target.checked);
  if (event.target.checked) {
    cancelPreview();
  }
  colorInput.classList.toggle('h', event.target.checked);
  setConfig('color', event.target.checked?'#000000':null);
  setConfig('has_background_image', !event.target.checked);
  loadConfig();
});

function preview(event) {
  if (event.files[0].size > 1048576*5) {
    event.value = "";
    return alert('A imagem selecionada é muito grande, escolha outra');
  }
  document.getElementById('confirm').style.display = 'block';
  const reader = new FileReader();
  reader.onload = function (e) {
    image = {
      source: e.target.result,
      name: event.files[0].name,
      size: event.files[0].size,
      type: event.files[0].type,
      created_at: new Date().getTime(),
    };

    let size = image.size/Math.pow(1024, 2);
    const ext = parseInt(size)<1?'KB':'MB';
    size = ext==='KB'?`${size.toFixed(3)}`.substring(2, size.length):size.toFixed(2);
    image.size =  size + ' ' + ext;

    imageElement.src = image.source;
    updateImageProperties(image);
    previewElement.classList.add('visible');
  }

  reader.readAsDataURL(event.files[0]);
}

function loadConfig() {
  createElementsProperty();
  const config = JSON.parse(localStorage.getItem('config'));
  if (config) {
    //animated
    animatedElement.checked = config.has_animated;
    animation(animatedElement);

    //color
    inputType.checked = config.color!==null?true:false;
    calculator.style.background = config.color?config.color:'';
    changeImage.classList[config.has_background_image?'add':'remove']('h');
    colorInput.classList[config.has_background_image?'remove':'add']('h');
    colorInput.value = config.color!==null?config.color:'#000000';

    //image
    noImage.checked = !config.has_background_image;
    background(noImage, config.has_background_image);
  }

  if (config!==null && (config.color!==null || config.has_background_image===false)) {
    return;
  }

  const image = JSON.parse(localStorage.getItem('image'));
  if (!image)
    return;
  updateImageProperties(image);
  zoom.src = image.source;
  zoom.style.opacity = 1;
  document.getElementById('confirm').style.display = 'none';
  previewElement.classList.add('visible');
  imageElement.src = image.source;
}

function confirmPreview(event) {
  zoom.src = image.source;
  zoom.style.opacity = 1;
  event.style.display = 'none';

  return localStorage.setItem('image', JSON.stringify(image));
}
function cancelPreview() {
  zoom.src = '';
  document.getElementById('confirm').style.display = 'block';
  localStorage.removeItem('image');
  updateImageProperties();
  changeImage.value = '';
  zoom.style.opacity = 0;
  imageElement.src = '';
  previewElement.classList.remove('visible');
}

function updateImageProperties(properties = {}) {
  const propertiesElement = document.querySelector('.properties');
  if (properties && !properties.source) {
    return propertiesElement.classList.remove('visible');
  }
  
  properties.created_at = new Date(properties.created_at);

  propertiesElement.classList.add('visible');
  const classList = ['name', 'size', 'type', 'created_at'];
  classList.forEach((cls) => {
    document.querySelector(`code.${cls}`).innerHTML = properties[cls];
  });
}

function createElementsProperty() {
  const verify = document.querySelector('code.created_at');
  if (verify) {
    return;
  }
  const properties = [
    [{ class: ['propertie'], text: 'Nome' }, { class: ['value', 'name'], text: '' }],
    [{ class: ['propertie'], text: 'Tamanho' }, { class: ['value', 'size'], text: '' }],
    [{ class: ['propertie'], text: 'Tipo' }, { class: ['value', 'type'], text: '' }],
    [{ class: ['propertie'], text: 'Em' }, { class: ['value', 'created_at'], text: '' }],
  ];
  const propertiesElement = document.getElementById('properties');

  properties.forEach((propertie) => {
    const row = document.createElement('div');
    row.classList.add('row');
    propertie.forEach((p) => {
      const codeElement = document.createElement('code');
      codeElement.classList.add(...p.class);
      codeElement.innerHTML = p.text;
      row.appendChild(codeElement);
    });
    propertiesElement.appendChild(row);
  });

}

function animation(event) {
  const elements = ['.zoom', '.container', 'body'];
  setConfig('has_animated', event.checked);
  elements.forEach((element) => {
    const fct = event.checked?'add':'remove';
    document.querySelector(element).classList[fct]('animated');
  });
}
function background(event, current = null) {
  setConfig('has_background_image', current!==null?current:!event.checked);
  zoom.style.opacity = event.checked?0:1;
  if (current===null && event.checked) {
    cancelPreview();
  }
}

function setConfig(key, value) {
  const saved = JSON.parse(localStorage.getItem('config'));
  if (saved) {
    saved[key] = value;
    return localStorage.setItem('config', JSON.stringify(saved));
  }
  const newConfig = {has_animated: false, has_background_image: true};
  newConfig[key] = value;

  localStorage.setItem('config', JSON.stringify(newConfig));
}