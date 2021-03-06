import 'jquery-ui/ui/widgets/tabs';
import 'waypoints/lib/noframework.waypoints.min';
import '@fancyapps/fancybox';
import './vendor/rater.min';
import 'ion-rangeslider';
import 'slick-carousel';
import 'jquery.nice-number/dist/jquery.nice-number';
import './vendor/jquery.mb.browser';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min';
import './vendor/google-maps';
import 'jquery.maskedinput/src/jquery.maskedinput';
import 'mmenu-js/dist/mmenu';

$(document).ready(function () {
    'use strict';

    const element = document.documentElement;

    // preload
    window.onload = function () {
        element.classList.remove('preload');
    };

    // is mobile
    const is_mobile = isMobile();
    if (is_mobile) {
        element.classList.add('is-mobile');
    }

    // init modal
    $('.light-box-img').fancybox({
        backFocus: false,
    });

    $('.btn-modal').fancybox({
        touch : false,
        backFocus : false,
        btnTpl: {
            smallBtn: `
                <button class="modal-common__close fancybox-button fancybox-close-small" type="button" data-fancybox-close title="Закрыть">
                    <svg width="15" height="15" viewBox="0 0 320 320" fill="#000" xmlns="http://www.w3.org/2000/svg"><path d="M207.6 160L315.3 52.3c6.2-6.2 6.2-16.3 0-22.6l-25-25c-6.2-6.2-16.3-6.2-22.6 0L160 112.4 52.3 4.7c-6.2-6.2-16.3-6.2-22.6 0l-25 25c-6.2 6.2-6.2 16.3 0 22.6L112.4 160 4.7 267.7c-6.2 6.2-6.2 16.3 0 22.6l25 25c6.2 6.2 16.3 6.2 22.6 0L160 207.6l107.7 107.7c6.2 6.2 16.3 6.2 22.6 0l25-25c6.2-6.2 6.2-16.3 0-22.6L207.6 160z"/></svg>
                </button>`
        },
        afterLoad: function( instance, slide ) {
            // update the positioning of the sliders
            $('.product-gallery').slick('setPosition');
            $('.product-gallery-side').slick('setPosition');
        }
    });

    // sticky menu
    let mainHeader = document.querySelector('.main-header');
    let mainHeaderWrapper = document.querySelector('.main-header__wr');
    let waypointOffset = 50;

    if (mainHeaderWrapper) {
        let waypoint = new Waypoint({
            element: mainHeader,
            handler: function (direction) {
                if (direction === 'down') {
                    mainHeader.style.height = mainHeaderWrapper.offsetHeight + 'px';
                    mainHeaderWrapper.classList.add('main-header__wr--sticky');
                    mainHeaderWrapper.classList.remove('main-header__wr--end-sticky');
                } else {
                    mainHeader.style.height = 'auto';
                    mainHeaderWrapper.classList.remove('main-header__wr--sticky');
                    mainHeaderWrapper.classList.add('main-header__wr--end-sticky');
                }
            },
            offset: function() {
                return -(this.element.clientHeight + waypointOffset);
            }
        });
    }

    // init mmenu
    new Mmenu( "#js-main-nav-mobile", {
        // wrappers: ["wordpress"],
        extensions: [
            'border-full',
            'fx-menu-slide',
            'fx-listitems-slide',
            'multiline',
            'pagedim-black',
        ],
        'counters': true,
        'setSelected': {
            'hover': true
        },
        navbar: {
            title: 'МЕНЮ'
        },
        'navbars': [
            {
                'position': 'top',
                'content': `<a class="main-nav-mobile__logo" href="/">
                                <img src="../img/base/logo.svg" width="150" height="41" alt="Chillengrillen.ru">
                            </a>`
            },
        ]
    });

    // switching tile display mode
    $('.catalog-mode__button').on('click', function () {
        $('.catalog-mode__button').removeClass('catalog-mode__button--active');
        $(this).addClass('catalog-mode__button--active');
    });

    $('.catalog-mode__button--list').on('click', function () {
        $('.products-list').addClass('products-list--mode--list');
    });

    $('.catalog-mode__button--grid').on('click', function () {
        $('.products-list').removeClass('products-list--mode--list');
    });

    // show/hide subcategories
    $('.categories__caret').on('click', function () {
        let categoriesItem = $('.categories__item');
        let thisCategoriesItem = $(this).closest('.categories__item');

        categoriesItem.not(thisCategoriesItem).removeClass('categories__item--open');
        $(this).closest('.categories__item').toggleClass('categories__item--open');

        categoriesItem.not(thisCategoriesItem).find('.categories__children').slideUp(300);
        $(this).closest('.categories__item').find('.categories__children').slideToggle(300);
    });

    // rating
    let options = {
        max_value: 5,
        step_size: 0.5,
        initial_value: 0,
        selected_symbol_type: 'utf8_star', // Must be a key from symbols
        cursor: 'default',
        readonly: true,
        change_once: false, // Determines if the rating can only be set once
        ajax_method: 'POST',
        // url: 'http://localhost/test.php',
        // additional_data: {} // Additional data to send to the server
    };

    $('.js-rating--readonly--true').rate(options);

    options.readonly = false;

    $('.js-rating--readonly--false').rate(options);

    // init Ion.RangeSlider
    let rangeField = $('.range__field');
    let minPrice;
    let maxPrice;
    let priceFilterMinPrice = $('#price-filter-min-price');
    let priceFilterMaxPrice = $('#price-filter-max-price');

    rangeField.ionRangeSlider({
        skin: 'round',
        type: 'double',
        // min: 1000,
        // max: 1000,
        // from: 200,
        // to: 500,
        grid: true,
        // prefix: '₽ ',
        // postfix: ' ₽',
        onStart: function (data) {
            minPrice = data.min;
            maxPrice = data.max;
            priceFilterMinPrice.val(numberWithSpaces(data.from));
            priceFilterMaxPrice.val(numberWithSpaces(data.to));
        },
        onChange: function (data) {
            priceFilterMinPrice.val(numberWithSpaces(data.from));
            priceFilterMaxPrice.val(numberWithSpaces(data.to));
        },
    });

    let range = rangeField.data('ionRangeSlider');

    priceFilterMinPrice.on('input', function () {
        range.update({
            from: $(this).val()
        });
    });

    priceFilterMaxPrice.on('input', function () {
        range.update({
            to: $(this).val()
        });
    });

    priceFilterMinPrice.on('change', function () {
        if ($(this).val() < minPrice) {
            $(this).val(minPrice)
        }
    });

    priceFilterMaxPrice.on('change', function () {
        if ($(this).val() > maxPrice) {
            $(this).val(maxPrice)
        }
    });

    // slider offer
    $('.slider-offer').slick({
        lazyLoad: 'progressive',
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        // autoplay: true,
        autoplaySpeed: 4000,
        pauseOnFocus: false,
        pauseOnHover: false,
        // focusOnSelect: true,
        prevArrow: `<button class="slider-offer__arrow slider-offer__arrow--prev" type="button">
                        <span class="visually-hidden">Назад</span> 
                        <svg width="14" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 119.5l117.8-116c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L43.1 128l102.2 100.4c4.7 4.7 4.7 12.3 0 17l-7.1 7.1c-4.7 4.7-12.3 4.7-17 0L3.4 136.5c-4.6-4.7-4.6-12.3.1-17z"/></svg>
                    </button>`,
        nextArrow: `<button class="slider-offer__arrow slider-offer__arrow--next" type="button">
                        <span class="visually-hidden">Вперед</span> 
                        <svg width="14" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M145.4 136.5l-117.8 116c-4.7 4.7-12.3 4.7-17 0l-7.1-7.1c-4.7-4.7-4.7-12.3 0-17L105.8 128 3.6 27.6c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0l117.8 116c4.6 4.7 4.6 12.3-.1 17z"/></svg>
                    </button>`,
        responsive: [
            {
                breakpoint: 993,
                settings: {
                    arrows: false,
                }
            }
        ]
    });

    // slider category
    $('.slider-category').slick({
        dots: false,
        slidesToShow: 6,
        slidesToScroll: 6,
        pauseOnFocus: false,
        pauseOnHover: false,
        // focusOnSelect: true,
        prevArrow: `<button class="slider-category__arrow slider-category__arrow--prev slider-arrow slider-arrow--prev" type="button">
                        <span class="visually-hidden">Назад</span> 
                        <svg class="slider-arrow__icon" width="9" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 119.5l117.8-116c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L43.1 128l102.2 100.4c4.7 4.7 4.7 12.3 0 17l-7.1 7.1c-4.7 4.7-12.3 4.7-17 0L3.4 136.5c-4.6-4.7-4.6-12.3.1-17z"/></svg>
                    </button>`,
        nextArrow: `<button class="slider-category__arrow slider-category__arrow--next slider-arrow slider-arrow--next" type="button">
                        <span class="visually-hidden">Вперед</span> 
                        <svg class="slider-arrow__icon" width="9" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M145.4 136.5l-117.8 116c-4.7 4.7-12.3 4.7-17 0l-7.1-7.1c-4.7-4.7-4.7-12.3 0-17L105.8 128 3.6 27.6c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0l117.8 116c4.6 4.7 4.6 12.3-.1 17z"/></svg>
                    </button>`,
        responsive: [
            {
                breakpoint: 1441,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                }
            },
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                }
            },
            {
                breakpoint: 769,
                settings: {
                    arrows: false,
                    dots: true,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 577,
                settings: {
                    arrows: false,
                    dots: true,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            }
        ]
    });

    // product slider
    $('.product-slider').slick({
        dots: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        pauseOnFocus: false,
        pauseOnHover: false,
        // focusOnSelect: true,
        prevArrow: `<button class="product-slider__arrow product-slider__arrow--prev slider-arrow slider-arrow--prev" type="button">
                        <span class="visually-hidden">Назад</span> 
                        <svg class="slider-arrow__icon" width="9" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 119.5l117.8-116c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L43.1 128l102.2 100.4c4.7 4.7 4.7 12.3 0 17l-7.1 7.1c-4.7 4.7-12.3 4.7-17 0L3.4 136.5c-4.6-4.7-4.6-12.3.1-17z"/></svg>
                    </button>`,
        nextArrow: `<button class="product-slider__arrow product-slider__arrow--next slider-arrow slider-arrow--next" type="button">
                        <span class="visually-hidden">Вперед</span> 
                        <svg class="slider-arrow__icon" width="9" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M145.4 136.5l-117.8 116c-4.7 4.7-12.3 4.7-17 0l-7.1-7.1c-4.7-4.7-4.7-12.3 0-17L105.8 128 3.6 27.6c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0l117.8 116c4.6 4.7 4.6 12.3-.1 17z"/></svg>
                    </button>`,
        responsive: [
            {
                breakpoint: 993,
                settings: {
                    arrows: false,
                    dots: true,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    dots: true,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
        ]
    });

    // reviews slider
    $('.reviews-slider').slick({
        dots: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        pauseOnFocus: false,
        pauseOnHover: false,
        // focusOnSelect: true,
        prevArrow: `<button class="reviews-slider__arrow reviews-slider__arrow--prev slider-arrow slider-arrow--white slider-arrow--prev" type="button">
                        <span class="visually-hidden">Назад</span> 
                        <svg class="slider-arrow__icon" width="9" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 119.5l117.8-116c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L43.1 128l102.2 100.4c4.7 4.7 4.7 12.3 0 17l-7.1 7.1c-4.7 4.7-12.3 4.7-17 0L3.4 136.5c-4.6-4.7-4.6-12.3.1-17z"/></svg>
                    </button>`,
        nextArrow: `<button class="reviews-slider__arrow reviews-slider__arrow--next slider-arrow slider-arrow--white slider-arrow--next" type="button">
                        <span class="visually-hidden">Вперед</span> 
                        <svg class="slider-arrow__icon" width="9" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M145.4 136.5l-117.8 116c-4.7 4.7-12.3 4.7-17 0l-7.1-7.1c-4.7-4.7-4.7-12.3 0-17L105.8 128 3.6 27.6c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0l117.8 116c4.6 4.7 4.6 12.3-.1 17z"/></svg>
                    </button>`,
        responsive: [
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 769,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    });

    // slider product gallery
    $('.product-gallery').slick({
        dots: false,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.product-gallery-side',
        pauseOnFocus: false,
        pauseOnHover: false,
    });

    // slider product gallery side
    $('.product-gallery-side').slick({
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.product-gallery',
        pauseOnFocus: false,
        pauseOnHover: false,
        focusOnSelect: true,
        prevArrow: `<button class="product-gallery-side__arrow product-gallery-side__arrow--prev" type="button">
                        <span class="visually-hidden">Назад</span> 
                        <svg width="14" viewBox="0 0 149 256.1" fill="#999999" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 119.5l117.8-116c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L43.1 128l102.2 100.4c4.7 4.7 4.7 12.3 0 17l-7.1 7.1c-4.7 4.7-12.3 4.7-17 0L3.4 136.5c-4.6-4.7-4.6-12.3.1-17z"/></svg>
                    </button>`,
        nextArrow: `<button class="product-gallery-side__arrow product-gallery-side__arrow--next" type="button">
                        <span class="visually-hidden">Вперед</span> 
                        <svg width="14" viewBox="0 0 149 256.1" fill="#999999" xmlns="http://www.w3.org/2000/svg"><path d="M145.4 136.5l-117.8 116c-4.7 4.7-12.3 4.7-17 0l-7.1-7.1c-4.7-4.7-4.7-12.3 0-17L105.8 128 3.6 27.6c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0l117.8 116c4.6 4.7 4.6 12.3-.1 17z"/></svg>
                    </button>`,
        responsive: [
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 501,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 371,
                settings: {
                    slidesToShow: 2,
                }
            }
        ]
    });

    // slider product gallery main
    $('.product-gallery-main').slick({
        dots: false,
        arrows: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        pauseOnFocus: false,
        pauseOnHover: false,
        prevArrow: `<button class="product-gallery-main__arrow product-gallery-main__arrow--prev slider-arrow slider-arrow--prev" type="button">
                        <span class="visually-hidden">Назад</span> 
                        <svg class="slider-arrow__icon" width="14" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 119.5l117.8-116c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L43.1 128l102.2 100.4c4.7 4.7 4.7 12.3 0 17l-7.1 7.1c-4.7 4.7-12.3 4.7-17 0L3.4 136.5c-4.6-4.7-4.6-12.3.1-17z"/></svg>
                    </button>`,
        nextArrow: `<button class="product-gallery-main__arrow product-gallery-main__arrow--next slider-arrow slider-arrow--next" type="button">
                        <span class="visually-hidden">Вперед</span> 
                        <svg class="slider-arrow__icon" width="14" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M145.4 136.5l-117.8 116c-4.7 4.7-12.3 4.7-17 0l-7.1-7.1c-4.7-4.7-4.7-12.3 0-17L105.8 128 3.6 27.6c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0l117.8 116c4.6 4.7 4.6 12.3-.1 17z"/></svg>
                    </button>`,
        responsive: [
            {
                breakpoint: 1441,
                settings: {
                    dots: true,
                }
            },
            {
                breakpoint: 769,
                settings: {
                    dots: true,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 577,
                settings: {
                    dots: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    });

    // product group slider
    $('.product-group-slider__box').slick({
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        pauseOnFocus: false,
        pauseOnHover: false,
        // focusOnSelect: true,
        prevArrow: `<button class="product-group-slider__arrow product-group-slider__arrow--prev slider-arrow slider-arrow--prev" type="button">
                        <span class="visually-hidden">Назад</span> 
                        <svg class="slider-arrow__icon" width="9" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 119.5l117.8-116c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L43.1 128l102.2 100.4c4.7 4.7 4.7 12.3 0 17l-7.1 7.1c-4.7 4.7-12.3 4.7-17 0L3.4 136.5c-4.6-4.7-4.6-12.3.1-17z"/></svg>
                    </button>`,
        nextArrow: `<button class="product-group-slider__arrow product-group-slider__arrow--next slider-arrow slider-arrow--next" type="button">
                        <span class="visually-hidden">Вперед</span> 
                        <svg class="slider-arrow__icon" width="9" viewBox="0 0 149 256.1" fill="#222222" xmlns="http://www.w3.org/2000/svg"><path d="M145.4 136.5l-117.8 116c-4.7 4.7-12.3 4.7-17 0l-7.1-7.1c-4.7-4.7-4.7-12.3 0-17L105.8 128 3.6 27.6c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0l117.8 116c4.6 4.7 4.6 12.3-.1 17z"/></svg>
                    </button>`,
        responsive: [
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 769,
                settings: {
                    dots: true,
                    arrows: false,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            }
        ]
    });

    // init nice number
    $('.js-nice-number').niceNumber({
        autoSize: false,
        buttonDecrement: '–',
        buttonIncrement: "+",
        buttonPosition: 'right',
    });

    // init custom scrollbar
    $('.mini-cart__list-wr').mCustomScrollbar({
        theme: 'dark-2',
    });

    $('.product-options__list-wr').mCustomScrollbar({
        theme: 'dark-2',
    });

    // init tabs
    $('.subcategory-tabs').tabs({
        heightStyle: 'auto',
        activate: function( event, ui ) {
            $('.product-slider').slick('setPosition');
        }
    });

    $('.product-tabs').tabs();

    $('.tabs-login-modal').tabs({
        // heightStyle: 'auto',
    });

    // show/hide mini cart
    $('.dropdown__link--cart').on('click', function (e) {
        if (window.innerWidth < 993) {
            e.preventDefault();
            $(document.body).toggleClass('mini-cart-open');
        }
    });

    $('.mini-cart-backdrop, .mini-cart__close').on('click', function () {
        $(document.body).removeClass('mini-cart-open');
    });

    // show/hide shipping calculator
    $('.table-cart-totals__btn-shipping-calculator').on('click', function () {
        $('.shipping-calculator').slideToggle(300);
    });

    // show/hide breadcrumbs dropdown
    $('.breadcrumbs-extra__button').on('click', function () {
        let currentBreadcrumbsExtraItem = $(this).closest('.breadcrumbs-extra__item');

        $('.breadcrumbs-extra__item').not(currentBreadcrumbsExtraItem).removeClass('breadcrumbs-extra__item--show-dropdown');
        $('.breadcrumbs-extra__item').not(currentBreadcrumbsExtraItem).find('.breadcrumbs-extra__dropdown').slideUp(300);
        currentBreadcrumbsExtraItem.toggleClass('breadcrumbs-extra__item--show-dropdown');
        currentBreadcrumbsExtraItem.find('.breadcrumbs-extra__dropdown').slideToggle(300);
    });

    // numberWithSpaces
    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    // masked input
    $('input[type="tel"]').mask("+7 (999) 999 99 99");

    // is mobile
    function isMobile() {
        return $.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    }

}); // end ready
