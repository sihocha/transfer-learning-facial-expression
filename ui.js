const CONTROLS = ['angry', 'happy', 'surprised', 'sad', 'inexpressive', 'disgusted', 'feared'];
const CONTROL_CODES = [38, 40, 37, 39, 36, 35, 34];

export function init() {
  document.getElementById('controller').style.display = '';
  statusElement.style.display = 'none';
}

const trainStatusElement = document.getElementById('train-status');

// UI에서 하이퍼파라미터를 가져옵니다.
const learningRateElement = document.getElementById('learningRate');
export const getLearningRate = () => +learningRateElement.value;

const batchSizeFractionElement = document.getElementById('batchSizeFraction');
export const getBatchSizeFraction = () => +batchSizeFractionElement.value;

const epochsElement = document.getElementById('epochs');
export const getEpochs = () => +epochsElement.value;

const denseUnitsElement = document.getElementById('dense-units');
export const getDenseUnits = () => +denseUnitsElement.value;
const statusElement = document.getElementById('status');

export function startPacman() {
  google.pacman.startGameplay();
}

export function predictClass(classId) {
  google.pacman.keyPressed(CONTROL_CODES[classId]);
  document.body.setAttribute('data-active', CONTROLS[classId]);
}

export function isPredicting() {
  statusElement.style.visibility = 'visible';
}
export function donePredicting() {
  statusElement.style.visibility = 'hidden';
}
export function trainStatus(status) {
  trainStatusElement.innerText = status;
}

export let addExampleHandler;
export function setExampleHandler(handler) {
  addExampleHandler = handler;
}
let mouseDown = false;
const totals = [0, 0, 0, 0, 0, 0, 0];

const angryButton = document.getElementById('angry');
const happyButton = document.getElementById('happy');
const surprisedButton = document.getElementById('surprised');
const sadButton = document.getElementById('sad');
const inexpressiveButton = document.getElementById('inexpressive');
const disgustedButton = document.getElementById('disgusted');
const fearedButton = document.getElementById('feared');

const thumbDisplayed = {};

async function handler(label) {
  mouseDown = true;
  const className = CONTROLS[label];
  const button = document.getElementById(className);
  const total = document.getElementById(className + '-total');
  while (mouseDown) {
    addExampleHandler(label);
    document.body.setAttribute('data-active', CONTROLS[label]);
    total.innerText = ++totals[label];
    await tf.nextFrame();
  }
  document.body.removeAttribute('data-active');
}

angryButton.addEventListener('mousedown', () => handler(0));
angryButton.addEventListener('mouseup', () => mouseDown = false);

happyButton.addEventListener('mousedown', () => handler(1));
happyButton.addEventListener('mouseup', () => mouseDown = false);

surprisedButton.addEventListener('mousedown', () => handler(2));
surprisedButton.addEventListener('mouseup', () => mouseDown = false);

sadButton.addEventListener('mousedown', () => handler(3));
sadButton.addEventListener('mouseup', () => mouseDown = false);

inexpressiveButton.addEventListener('mousedown', () => handler(4));
inexpressiveButton.addEventListener('mouseup', () => mouseDown = false);

disgustedButton.addEventListener('mousedown', () => handler(5));
disgustedButton.addEventListener('mouseup', () => mouseDown = false);

fearedButton.addEventListener('mousedown', () => handler(6));
fearedButton.addEventListener('mouseup', () => mouseDown = false);

export function drawThumb(img, label) {
  //console.log('Image:', img, 'Label:', label); 
  if (thumbDisplayed[label] == null) {
    const thumbCanvas = document.getElementById(CONTROLS[label] + '-thumb');
    //console.log(thumbCanvas);
    //draw(img, thumbCanvas);
    const imageData = draw(img, thumbCanvas); // ImageData 객체를 반환하도록 draw() 함수를 수정
    console.log('ImageData:', imageData); // 여기에 로그 추가
  }
}

export function draw(image, canvas) {
  const [width, height] = [224, 224];
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = image.dataSync();
  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
    imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
    imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return imageData; // 생성된 ImageData 객체 반환
}
