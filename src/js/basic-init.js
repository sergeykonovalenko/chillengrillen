$(document).ready(function () {
    'use strict';

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

    // switching tile display mode
    $('.catalog-mode__button').on('click', function () {
        $('.catalog-mode__button').removeClass('catalog-mode__button--active');
        $(this).addClass('catalog-mode__button--active');
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

    // rater
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

    $('.rating').rate(options);

    // initialise Ion.RangeSlider
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

    // numberWithSpaces
    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

}); // end ready
