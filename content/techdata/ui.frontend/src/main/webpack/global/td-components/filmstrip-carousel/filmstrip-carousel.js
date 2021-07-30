import $ from 'jquery';

(function() {
    $('.center').slick({
        infinite: true,
        autoplay: false,
        autoplaySpeed: 4000,
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 1000,
        dots: true,
        arrows: false
    });
    $('.lazy').slick({
        lazyLoad: 'ondemand',
        infinite: true
    });
})($);
