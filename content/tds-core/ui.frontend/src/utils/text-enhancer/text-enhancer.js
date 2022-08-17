document.addEventListener(
  'DOMContentLoaded',
  () => {
    const htmlElement = document.querySelector(
      '.animation-typewriter-effect[data-extra-words]'
    );
    // This replaces the HTML format with one JSON can read.
    const firstWord = htmlElement.innerText;
    const extraWords = htmlElement.dataset.extraWords;
    const dataSet = [firstWord, ...JSON.parse(extraWords)];

    // type one text in the typwriter
    // keeps calling itself until the text is finished
    const typeWriter = (text, i, fnCallback) => {
      // check if text isn't finished yet
      if (i < text.length) {
        // add next character to htmlElement
        htmlElement.innerHTML =
          text.substring(0, i + 1) + '<span aria-hidden="true"></span>';

        // wait for a while and call this function again for next character
        setTimeout(() => {
          typeWriter(text, i + 1, fnCallback);
        }, 100);
      }
      // text finished, call callback if there is a callback function
      else if (typeof fnCallback === 'function') {
        // call callback after timeout
        setTimeout(fnCallback, 2000);
      }
    };
    // start a typewriter animation for a text in the dataText array
    StartTextAnimation = (i) => {
      if (typeof dataSet[i] === 'undefined') {
        setTimeout(() => {
          StartTextAnimation(0);
        }, 2000);
      }

      // check if dataText[i] exists
      if (i < dataSet.length) {
        // text exists! start typewriter animation
        typeWriter(dataSet[i], 0, () => {
          // after callback (and whole text has been animated), start next text
          StartTextAnimation(i + 1);
        });
      }
    };

    // start the text animation
    StartTextAnimation(0);
  },
  1000
);
