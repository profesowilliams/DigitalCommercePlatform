/**
 * Represents a PopupExit class for handling popups and button clicks.
 */
export default class PopupExit {
  /**
   * Constructs a PopupExit instance.
   */
  constructor() {
    /** @type {NodeList} */
    this.links = document.querySelectorAll('a[data-is-global="true"]');
    /** @type {Element} */
    this.modal = document.querySelector('.cmp-popup__modal');
    /** @type {NodeList} */
    this.buttons = this.modal.querySelectorAll('.cmp-popup__modal button');

    this.handleClick = this.handleClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  /**
   * Handles the click event on links.
   * @param {Event} event - The click event.
   */
  handleClick(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    const firstButton = this.buttons[0];
    firstButton.addEventListener('click', function handleFirstButtonClick() {
      window.location.href = href;
    });
    this.modal.classList.add('cmp-popup__modal--open');
  }

  /**
   * Closes the modal and removes event listeners.
   */
  closeModal() {
    const firstButton = this.buttons[0];
    const lastButton = this.buttons[this.buttons.length - 1];

    firstButton.removeEventListener('click', handleFirstButtonClick);
    firstButton.removeAttribute('data-href');
    this.modal.classList.remove('cmp-popup__modal--open');
  }

  /**
   * Initializes the PopupExit instance by adding event listeners.
   */
  initialize() {
    if (this.links && this.links.length > 0) {
      for (let i = 0; i < this.links.length; i++) {
        this.links[i].addEventListener('click', this.handleClick);
      }
    }

    const closeButton = this.buttons[this.buttons.length - 1];
    closeButton.addEventListener('click', this.closeModal);
  }
}
