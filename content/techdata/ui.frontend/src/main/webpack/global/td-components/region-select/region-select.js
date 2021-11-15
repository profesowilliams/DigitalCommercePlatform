(function () {
  "use strict";
  var countriesListModal = document.getElementById("countriesListModal");
  if (!countriesListModal) return;

  function regionSelectDropdown() {
    document.getElementById("regionSelectDropdown").classList.toggle("cmp-show");
  }

  function countriesListPopup() {
    document.getElementById("countriesListModal").style.display = 'block';
  }

  function hideCountriesModal() {
    document.getElementById("countriesListModal").style.display = 'none';
  }

  function onDocumentReady() {
    hideCountriesModal();
  };
  document.addEventListener("DOMContentLoaded", onDocumentReady);

  function hideRegionDropdown() {
    var dropdowns = document.getElementsByClassName("cmp-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('cmp-show')) {
        openDropdown.classList.remove('cmp-show');
      }
    }
  }

  window.addEventListener("click", function (event) {
    if (event.target.matches('.cmp-button__region-select')) {
      countriesListPopup();
    } if (!event.target.matches('.cmp-button__region-select')) {
      hideCountriesModal();
    }
    if (event.target.matches('.cmp-dropbtn')) { regionSelectDropdown() }
    if (!event.target.matches('.cmp-dropbtn') && !event.target.matches('.cmp-button__region-select')) {
      hideCountriesModal();
      hideRegionDropdown();
    }

    /**
     * Logic to show popup on footer icon click when enabled via AEM.
     * The popup will be shown when the click is inside footer icon and
     * has data-displayLocation attribute set to true.
     */
     const isInsideLinkList = event.target.closest(".cmp-link-list__item a");
     const hasDisplayLocationEnabled =
       isInsideLinkList &&
       isInsideLinkList.hasAttribute("data-displayLocation") === true;
 
     if (isInsideLinkList && hasDisplayLocationEnabled) {
       countriesListPopup();
     }

  });

})();
