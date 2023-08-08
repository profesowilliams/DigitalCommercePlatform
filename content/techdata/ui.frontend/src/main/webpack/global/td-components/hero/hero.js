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

class ScrollListener {
  constructor() {
    this.lastScrollTop = 0;
    this.element = document.querySelector('.cmp-teaser__bottom-section');
    this.overlay = document.querySelector('.cmp-image__overlay');
    this.addScrollListener();
  }

  addScrollListener() {
    window.addEventListener('scroll', () => {
      this.onScroll();
    }, false);
  }

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

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-unused-vars
  const scrollListener = new ScrollListener();
});
