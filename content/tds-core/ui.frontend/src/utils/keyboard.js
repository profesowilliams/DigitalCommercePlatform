export const onEscapeKey = (callback, element = document) => {
  element.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      callback();
    }
  });
};
