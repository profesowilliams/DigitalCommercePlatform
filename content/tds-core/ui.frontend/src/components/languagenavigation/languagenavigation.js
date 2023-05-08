import events from '../../utils/events';

(function () {
  "use strict";
  var countriesListModal = document.getElementById("countriesListModal");
  const isExtraReloadDisabled = () => document.body.hasAttribute("data-disable-extra-reload");
  let userIsLoggedIn = !isExtraReloadDisabled() && localStorage.getItem("sessionId") ? true : false;
  if (!countriesListModal) return;

  if (isExtraReloadDisabled()) {
    const listener = (isLoggedIn) => {
      userIsLoggedIn = isLoggedIn;
      hideCountriesModal();
      console.log(`language selector loggedin1`, isLoggedIn);
    };

    events.addLoginListener(listener);
  }

  /**
 * Shows the region select dropdown when the user clicks on the menu icon or the language selector.
 * @param {Event} event - The click event.
 */
function showRegionSelectDropdown(event) {
  // If the event was triggered by clicking on the language selector, show the region select dropdown.
  if (event && event.target.closest('.languagenavigation')) {
    const langEle = event.target.closest('.languagenavigation');
    langEle.querySelector(".regionSelectDropdown").classList.add("cmp-show");
  } else {
    /* if (event && event.target.closest(".app-open-language-selector")) { */
      // If the event was triggered by clicking on the menu icon or outside of the language selector, show the mobile menu.
      const mobileQuery = window.matchMedia("(max-width: 1023px)");

      if (mobileQuery.matches) {
        setTimeout(function() {
          // Select the header element.
          const header = document.getElementsByClassName("cmp-experiencefragment--header-mobile")[0];
  
          // Add the header-active class to the masthead element.
          const masthead = header.querySelector("[id^='masthead-']");
          masthead.classList.add("header-active");
  
          // Add the active class to the hamburger menu icon or the language modal, depending on the header state.
          const hamburger = header.querySelector(".cmp-td-hamburgerMenu");
          if (hamburger) {
            hamburger.classList.add("active");
          } else {
            const languageModal = document.querySelector(".language-modal__content");
            languageModal.classList.add("language-modal--open");
            const checkbox = document.querySelector(".menu-icon__checkbox");
            checkbox.checked = true;
            const menuIcon = document.querySelector(".menu-icon");
            menuIcon.classList.add("active");
            menuIcon.dispatchEvent(new Event('click'));
          }
          
          // Add the megamenu--open class to the megamenu element.
          const megamenu = header.querySelector(".megamenu");
          megamenu.classList.add("megamenu--open");
          
          // Add the cmp-show class to the region select dropdown element.
          // Specifically select the second regionSelectDropdown, which is the one that is used for the mobile menu.
          const region = document.querySelectorAll(".regionSelectDropdown")[1];
          region.classList.add("cmp-show");
        }, 100); 
      } else {
        document.querySelector(".regionSelectDropdown").classList.add("cmp-show");
      }
  }
}

  function hideRegionSelectDropdown() {
    if (userIsLoggedIn) {
      document.getElementsByClassName("languagenavigation")[0].style.display = "none";
    }
    else if(isExtraReloadDisabled()) {
      document.getElementsByClassName("languagenavigation")[0].style.display = "block";
    }
    const languageSelectorOpeners = document.querySelectorAll('.regionSelectDropdown');

    for (var i = 0; i < languageSelectorOpeners.length; i++) {
        languageSelectorOpeners[i].classList.remove('cmp-show');
    }
  }

  function showCountriesListPopup(event) {
    showRegionSelectDropdown(); // this is necessary since countries pop-up is inside this div.
    if (userIsLoggedIn) {
      document.getElementsByClassName("languagenavigation")[0].style.display = "block";
    }
    if (event && event.target.closest('.languagenavigation')) {
        const langEle = event.target.closest('.languagenavigation');
        langEle.querySelector("#countriesListModal").style.display = "block";
    } else {
        document.querySelector("#countriesListModal").style.display = "block";
    }
  }

  function hideCountriesModal() {
    hideRegionSelectDropdown();

    const countryModals = document.querySelectorAll('.language-modal');

    for (var i = 0; i < countryModals.length; i++) {
        countryModals[i].style.display = "none";
    }
  }

  function onDocumentReady() {
    hideCountriesModal();

    const languageSelectorOpeners = document.querySelectorAll(
      '.app-open-language-selector'
    );

    for (var i = 0; i < languageSelectorOpeners.length; i++) {
      languageSelectorOpeners[i].addEventListener('click', function(event) {
          event.preventDefault();
          showCountriesListPopup(event);
      });
    }
  }
  document.addEventListener("DOMContentLoaded", onDocumentReady);

  function hideRegionDropdown() {
    var dropdowns = document.getElementsByClassName("cmp-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("cmp-show")) {
        openDropdown.classList.remove("cmp-show");
      }
    }
  }

  window.addEventListener("click", function (event) {   
    if (event.target.matches(".app-open-language-selector") ||
      event.target.closest(".app-open-language-selector")) {
      return;
    } else if (event.target.matches(".cmp-button__region-select")) {
      showCountriesListPopup(event);
    } else if (event.target.matches(".cmp-dropbtn") || event.target.closest('.cmp-dropbtn')) {
      showRegionSelectDropdown(event);
    }
    else if (!event.target.matches(".cmp-button__region-select")) {
      hideCountriesModal();
    } else if (
      !event.target.matches(".cmp-dropbtn") &&
      !event.target.matches(".cmp-button__region-select")
    ) {
      hideCountriesModal();
      hideRegionDropdown();
    }
    /**
     * Logic to show popup on footer icon click when enabled via AEM.
     * The popup will be shown when the click is inside footer icon and
     * has data-displayLocation attribute set to true.
     */
    const isInsideLinkList = event.target.closest(".cmp-link-list__item a");

    /**
     * Turns out AEM changes camel-cased data attributes to lowercase when
     * rendered as HTML. Hence, data-displaylocation is all lowercase.
     */
    const hasDisplayLocationEnabled =
      isInsideLinkList &&
      isInsideLinkList.hasAttribute("data-displaylocation") === true &&
      isInsideLinkList.dataset.displaylocation === "true";

    if (isInsideLinkList && hasDisplayLocationEnabled) {
      showCountriesListPopup();
    }
  });
})();
