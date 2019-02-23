let model;
let webcamElement;
let descriptionElement;
let loaderElement;

window.onload = async () => {
  webcamElement = document.querySelector('#webcam');
  descriptionElement = document.querySelector('#description');
  loaderElement = document.querySelector('#loader');

  await setupWebcam(webcamElement, isMobileDevice());

  model = await mobilenet.load();

  console.log('will remove loader');
  loaderElement.remove();
};

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
