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

  function showRegionSelectDropdown() {
    document.getElementById("regionSelectDropdown").classList.add("cmp-show");
  }

  function hideRegionSelectDropdown() {
    if (userIsLoggedIn) {
      document.getElementsByClassName("languagenavigation")[0].style.display = "none";
    }
    else if(isExtraReloadDisabled()) {
      document.getElementsByClassName("languagenavigation")[0].style.display = "block";
    }
    document
      .getElementById("regionSelectDropdown")
      .classList.remove("cmp-show");
  }

  function showCountriesListPopup() {
    showRegionSelectDropdown(); // this is necessary since countries pop-up is inside this div.
    if (userIsLoggedIn) {
      document.getElementsByClassName("languagenavigation")[0].style.display = "block";
    }
    document.getElementById("countriesListModal").style.display = "block";
  }

  function hideCountriesModal() {
    hideRegionSelectDropdown();
    document.getElementById("countriesListModal").style.display = "none";
  }

  function onDocumentReady() {
    hideCountriesModal();

    const languageSelectorOpeners = document.querySelectorAll(
      '.app-open-language-selector'
    );

    for (var i = 0; i < languageSelectorOpeners.length; i++) {
      languageSelectorOpeners[i].addEventListener('click', function(event) {
          event.preventDefault();
          showCountriesListPopup();
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
    }

    if (event.target.matches(".cmp-button__region-select")) {
      showCountriesListPopup();
    }
    if (!event.target.matches(".cmp-button__region-select")) {
      hideCountriesModal();
    }
    if (event.target.matches(".cmp-dropbtn")) {
      showRegionSelectDropdown();
    }
    if (
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
