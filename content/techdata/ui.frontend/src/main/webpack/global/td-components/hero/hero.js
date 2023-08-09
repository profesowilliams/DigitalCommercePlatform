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
