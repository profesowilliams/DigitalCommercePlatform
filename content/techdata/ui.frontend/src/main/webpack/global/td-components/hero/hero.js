// Get all cmp-teaser__bottom-section--wrapper div elements
const wrapperDivs = document.querySelectorAll('.cmp-teaser__bottom-section--wrapper');

// Iterate over each wrapper div
wrapperDivs.forEach((wrapperDiv) => {
  // Get the first child link element
  const link = wrapperDiv.querySelector('.cmp-teaser__bottom-section--link');

  // Add click event listener to the wrapper div
  wrapperDiv.addEventListener('click', () => {
    // Check if the first child link exists and has a href attribute
    if (link && link.href) {
      // Redirect to the link's URL
      window.location.href = link.href;
    }
  });
});

/**
 * Class representing a listener for scroll events.
 */
class ScrollListener {
  /**
   * Creates a ScrollListener.
   * It listens to scroll events and toggles a class when specific conditions are met.
   */
  constructor() {
    /** @private {number} - Tracks the last scroll position. */
    this.lastScrollTop = 0;

    /** @private {Element|null} - Element representing the bottom section of a teaser. */
    this.element = document.querySelector('.cmp-teaser__bottom-section');

    /** @private {Element|null} - Overlay element on the page. */
    this.overlay = document.querySelector('.cmp-image__overlay');

    if (!this.element || !this.overlay) {
      return;
    }

    this.addScrollListener();
  }

  /**
   * Adds a scroll listener to the window.
   * @private
   */
  addScrollListener() {
    window.addEventListener('scroll', () => {
      this.onScroll();
    }, false);
  }

  /**
   * Handles the onScroll event. Checks the positions of the elements and
   * toggles a class based on certain conditions.
   * @private
   */
  onScroll() {
    const elementRect = this.element.getBoundingClientRect();
    const overlayRect = this.overlay.getBoundingClientRect();
    const st = window.pageYOffset || document.documentElement.scrollTop;

    // If we're scrolling down and the element bottom reaches the overlay bottom
    if (st > this.lastScrollTop && elementRect.bottom >= overlayRect.bottom) {
      this.element.classList.add('reached-bottom');
    // eslint-disable-next-line brace-style
    }
    // If we're scrolling up and the element bottom is above the overlay bottom
    else if (st < this.lastScrollTop && elementRect.bottom < overlayRect.bottom) {
      this.element.classList.remove('reached-bottom');
    }

    this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  }
}

// Instantiate the class once the DOM is fully loaded and viewport width is greater than
// or equal to 992px
document.addEventListener('DOMContentLoaded', () => {
  /** Checks the viewport width before instantiating the ScrollListener class. */
  if (window.innerWidth >= 992) {
    /** @type {ScrollListener} - The instance of the ScrollListener class. */
    // eslint-disable-next-line no-unused-vars
    const scrollListener = new ScrollListener();
  }
});
