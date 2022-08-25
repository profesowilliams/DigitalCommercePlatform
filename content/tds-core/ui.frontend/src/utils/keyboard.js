export const onEscapeKey = (callback, element = document) => {
  $(element).on('keyup', function (e) {
    if (e.key === 'Escape') {
      callback();
    }
  });
};
