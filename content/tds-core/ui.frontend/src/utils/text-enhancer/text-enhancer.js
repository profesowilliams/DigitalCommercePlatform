document.addEventListener(
  'DOMContentLoaded',
  () => {
    const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }
    const animation = async (htmlElement) => {
      const firstWord = htmlElement.innerText;
      const extraWords = htmlElement.dataset.extraWords;
      const dataSet = [firstWord, ...JSON.parse(extraWords)];

      let wordIndex = 0;

      const performTypeWriterAnimation = async (text) => {
        let index = 0;
        while (index < text.length) {
          htmlElement.innerHTML =
          text.substring(0, index + 1) + '<span aria-hidden="true"></span>';
          index++;
          await sleep(100);
        }
      }

      const cycleWords = async () => {
        while (true) {
          await performTypeWriterAnimation(dataSet[wordIndex]);
          wordIndex = (wordIndex + 1) % dataSet.length;
          await sleep(2000);
        }
      }

      cycleWords();
    }

    const animatedElements = document.querySelectorAll(
      '.animation-typewriter-effect[data-extra-words]'
    );

    if (animatedElements) {
      Array.from(animatedElements).forEach(element => animation(element));
    }
  },
  1000
);
