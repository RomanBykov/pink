'use strict';

var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.main-nav__toggle');
var submitBtn = document.querySelector('#submitFormBtn');
var modalSucces = document.querySelector('.modal--succes');
var closeModalSuccesBtn = document.querySelector('#closeSucces');

var hiddenClass = 'modal--hidden';

navMain.classList.remove('main-nav--nojs');

navToggle.addEventListener('click', function() {
    if (navMain.classList.contains('main-nav--closed')) {
        navMain.classList.remove('main-nav--closed');
        navMain.classList.add('main-nav--opened');
    } else {
        navMain.classList.add('main-nav--closed');
        navMain.classList.remove('main-nav--opened');
    }
});

submitBtn.addEventListener('click', function() {
    if (modalSucces.classList.contains(hiddenClass)) {
        modalSucces.classList.remove(hiddenClass);
    } else {
        modalSucces.classList.add(hiddenClass);
    }
});

closeModalSuccesBtn.addEventListener('click', function() {
    modalSucces.classList.add(hiddenClass);
});
