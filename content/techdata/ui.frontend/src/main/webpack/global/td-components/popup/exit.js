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
      /** @type {Element|null} */
      this.modal = document.querySelector('.cmp-popup__modal');
      /** @type {NodeList|null} */
      this.buttons = this.modal ? this.modal.querySelectorAll('.cmp-popup__modal button') : null;
  
      this.handleClick = this.handleClick.bind(this);
      this.handleFirstButtonClick = this.handleFirstButtonClick.bind(this);
      this.closeModal = this.closeModal.bind(this);
    }
  
    /**
     * Handles the click event on links.
     * @param {Event} event - The click event.
     */
    handleClick(event) {
      event.preventDefault();
      const href = event.target.getAttribute('href');
      const firstButton = this.buttons ? this.buttons[0] : null;
  
      if (firstButton) {
        firstButton.setAttribute('data-href', href);
        firstButton.addEventListener('click', this.handleFirstButtonClick);
      }
  
      if (this.modal) {
        this.modal.classList.add('cmp-popup__modal--open');
      }
    }
  
    /**
     * Handles the click event on the first button.
     */
    handleFirstButtonClick() {
      const href = this.buttons ? this.buttons[0].getAttribute('data-href') : null;
      if (href) {
        window.location.href = href;
      }
    }
  
    /**
     * Closes the modal and removes event listeners.
     */
    closeModal() {
      const firstButton = this.buttons ? this.buttons[0] : null;
  
      if (firstButton) {
        firstButton.removeEventListener('click', this.handleFirstButtonClick);
        firstButton.removeAttribute('data-href');
      }
  
      if (this.modal) {
        this.modal.classList.remove('cmp-popup__modal--open');
      }
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
  
      if (this.buttons) {
        const closeButton = this.buttons[this.buttons.length - 1];
        closeButton.addEventListener('click', this.closeModal);
      }
    }
  }
  