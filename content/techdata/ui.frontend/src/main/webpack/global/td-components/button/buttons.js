// JUMP TO TOP Button ///

(function () {
    "use strict";

const scrollToTopButton = document.getElementById('js-jumptotop');

const scrollFunc = () => {
 
  let y = window.scrollY;

  if (y > 0) {
    scrollToTopButton.className = "cmp-jump-to-top show";
  } else {
    scrollToTopButton.className = "cmp-jump-to-top hide";
  }
};

window.addEventListener("scroll", scrollFunc);

const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 10);
  }
};

// on click: run our ScrolltoTop function above!
scrollToTopButton.onclick = function(e) {
  e.preventDefault();
  scrollToTop();
}
})();

// end of JUMP TO TOP Button ///