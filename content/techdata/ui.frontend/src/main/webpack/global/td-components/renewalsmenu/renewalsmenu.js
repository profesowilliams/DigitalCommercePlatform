document.addEventListener('DOMContentLoaded', function () {
  const buttonsContainer = document.querySelector('.cmp-renewal-preview__download');
  const buttons = buttonsContainer.querySelectorAll('button');
  const moreLink = buttonsContainer.querySelector('.more-link');
  const dropdown = buttonsContainer.querySelector('.dropdown-content');

  if (buttons.length > 3) {
    moreLink.style.display = 'inline-block'; // Show the "More" link
    buttons.forEach((button, index) => {
      if (index >= 3) { // Move extra buttons to dropdown
        dropdown.appendChild(button);
      }
    });
  } else {
    moreLink.style.display = 'none'; // Hide the "More" link if not needed
  }

  moreLink.addEventListener('click', function (e) {
    e.preventDefault();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
});
