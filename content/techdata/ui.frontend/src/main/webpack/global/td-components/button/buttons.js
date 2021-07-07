// JUMP TO TOP Button ///

(function () {
  "use strict";

  const scrollToTopButton = document.getElementById("js-jumptotop");
  if (!scrollToTopButton) return;
  
  // On scrolls down the document, the button appear
  window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollToTopButton.style.display = "block";
    } else {
      scrollToTopButton.style.display = "none";
    }
  };

})();

// end of JUMP TO TOP Button ///