$.fn.classChange = function(cb) {
    return $(this).each((_, el) => {
      new MutationObserver(mutations => {
        mutations.forEach(mutation => cb && cb(mutation.target, $(mutation.target).prop(mutation.attributeName)));
      }).observe(el, {
        attributes: true,
        attributeFilter: ['class'] 
      });
    });
  }
  
  function updateChevron() {
    if ($(".dp-carousel__nav-label").first().hasClass("cmp-carousel__indicator--active") === true) {
        $("button.cmp-carousel__action--previous").attr("disabled", "true");
        $("button.cmp-carousel__action--next").removeAttr("disabled");
    } else if ($(".dp-carousel__nav-label").last().hasClass("cmp-carousel__indicator--active") === true) {
        $("button.cmp-carousel__action--next").attr("disabled", "true");
        $("button.cmp-carousel__action--previous").removeAttr("disabled");
    } else {
        $("button.cmp-carousel__action--next").removeAttr("disabled");
        $("button.cmp-carousel__action--previous").removeAttr("disabled");
    }
};

$(".cmp-carousel-slide div[role=tablist] a[role=tab]").classChange(() => updateChevron());