$(document).ready(function () {
    'use strict';

    // switching tile display mode
    $('.catalog-mode__button').on('click', function () {
        $('.catalog-mode__button').removeClass('catalog-mode__button--active');
        $(this).addClass('catalog-mode__button--active');
    });

    // show/hide subcategories
    $('.categories__caret').on('click', function () {
        $('.categories__item').removeClass('categories__item--open');
        $(this).closest('.categories__item').toggleClass('categories__item--open');

        $('.categories__item:not(.categories__item--open) .categories__children').slideUp(300);
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

}); // end ready
