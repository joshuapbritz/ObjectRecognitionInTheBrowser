let model;
let webcamElement;
let descriptionElement;
let captureButton;
let loaderElement;

let predictionThreshold = 0.3;

let showingresult = false;

window.onload = async () => {
  webcamElement = document.querySelector('#webcam');
  descriptionElement = document.querySelector('#description');
  captureButton = document.querySelector('#capture');
  loaderElement = document.querySelector('#loader');

  await setupWebcam(webcamElement, isMobileDevice());

  model = await mobilenet.load();

  descriptionElement.textContent = 'Scan an item';

  loaderElement.remove();

  captureButton.addEventListener('click', classifyImage.bind(this));
};

async function classifyImage() {
  if (!showingresult) {
    showingresult = true;
    setupVideoForClassification();

    const predictions = await model.classify(webcamElement);

    console.log(predictions);

    if (predictions[0].probability > predictionThreshold) {
      descriptionElement.textContent = `${getCleanClassName(
        predictions[0].className
      )} (${getCleanPercentage(predictions[0].probability)} sure)`;
    } else {
      descriptionElement.textContent = 'Not sure';
    }

    captureButton.textContent = 'Scan Something Else';
  } else cleanUpVideoAfterClassification();
}

function setupVideoForClassification() {
  webcamElement.width = webcamElement.clientWidth;
  webcamElement.height = webcamElement.clientHeight;
  webcamElement.pause();
}

function cleanUpVideoAfterClassification() {
  descriptionElement.textContent = 'Scan an item';
  captureButton.textContent = 'PREDICT';
  showingresult = false;
  webcamElement.play();
}

/**
 *
 * @param {Number} value
 */
function getCleanPercentage(value) {
  return (value * 100).toFixed(2) + '%';
}

/**
 *
 * @param {String} className
 */
function getCleanClassName(className) {
  return className.split(',')[0].trim();
}

/**
 *
 * @param {HTMLVideoElement} webcamElement
 * @param {Boolean} ismobile
 */
function setupWebcam(webcamElement, ismobile) {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigatorAny.webkitGetUserMedia ||
      navigatorAny.mozGetUserMedia ||
      navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        ismobile
          ? { video: { facingMode: { exact: 'environment' } } }
          : { video: true },
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata', () => resolve(), false);
        },
        error => reject()
      );
    } else {
      reject();
    }
  });
}

function isMobileDevice() {
  return (
    typeof window['orientation'] !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}
