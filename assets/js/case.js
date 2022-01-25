// let vh = window.innerHeight;
// let header = document.getElementById('header');
// let decor = document.getElementById('decor');

// function resizeBGImage() {
//     decor.style.height = vh - header.innerHeight;
// }

// window.addEventListener('DOMContentLoaded', resizeBGImage);
// window.onresize = resizeBGImage;

const slider = new Swiper('.case-slider__slider', {
    direction: 'horizontal',
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 5,
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    navigation: {
        nextEl: '.case-slider-next',
        prevEl: '.case-slider-prev',
    },
});

const Secondslider = new Swiper('.difference-slider__slider', {
    direction: 'horizontal',
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 5,
    grabCursor: true,
    centeredSlides: true,
    allowTouchMove: false,
    loop: true,
    navigation: {
        nextEl: '.difference-slider__next',
        prevEl: '.difference-slider__prev',
    },
});


$(document).ready(function () {
    $(".image-comparison").twentytwenty({
        no_overlay: true
    });
});
