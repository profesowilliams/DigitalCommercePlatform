import { onEscapeKey } from '../../utils/keyboard';
(function () {
  const CLASS_MODAL = 'cmp-popup__modal';
  const CLASS_MODAL_OPENED = 'cmp-popup__modal--open';
  const CLASS_MODAL_CLOSE_BUTTON = 'cmp-popup__modal__content__close';

  const configureModal = (modal) => {
    const closeButton = modal.getElementsByClassName(
      CLASS_MODAL_CLOSE_BUTTON
    )[0];

    modal.dataset.openerIds.split(',').map((item) => {
      const btn = document.getElementById(item);

      if (btn) {
        btn.onclick = function () {
          modal.classList.add(CLASS_MODAL_OPENED);
        };
      }
    });

    closeButton.onclick = function () {
      modal.classList.remove(CLASS_MODAL_OPENED);
    };
  };

  const isModalTarget = (target, modals) => {
    for (let element of modals) {
      if (element == target) {
        return element;
      }
    }
    return null;
  };

  document.addEventListener('DOMContentLoaded', () => {
    const modals = document.getElementsByClassName(CLASS_MODAL);

    if (modals && modals.length > 0) {
      for (let element of modals) {
        configureModal(element);
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function (event) {
        const currentOpenPopup = isModalTarget(event.target, modals);
        if (currentOpenPopup) {
          currentOpenPopup.classList.remove(CLASS_MODAL_OPENED);
        }
      };

      onEscapeKey(() => {
        for (let element of modals) {
          element.classList.remove(CLASS_MODAL_OPENED);
        }
      });
    }
  });
})();