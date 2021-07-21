$(document).on('ready', function () {
  $(".center").slick({
      infinite: true,
      autoplay: false,
      autoplaySpeed: 4000,
      slidesToShow: 3,
      slidesToScroll: 1,
      speed: 2000,
      dots: true,
      arrows: false
  });
  $(".lazy").slick({
      lazyLoad: 'ondemand', 
      infinite: true
  });
});