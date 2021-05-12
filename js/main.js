'use strict'; //vh

var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', ''.concat(vh, 'px'));
window.addEventListener('resize', function () {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', ''.concat(vh, 'px'));
}); //swiper video init

var swiperVideo = new Swiper('.main-container', {
  direction: 'vertical',
  slidesPerView: 1,
  speed: 399,
  observeParents: true,
  observeSlideChildren: true,
  observer: true,
  resizeObserver: true,
  watchOverflow: true,
  watchActiveIndex: true,
  watchSlidesVisibility: true,
  touchAngle: 30,
  touchRatio: 1,
  mousewheel: {
    sensitivity: 2
  },
  preventInteractionOnTransition: true
});
var loaderClose = document.getElementById('loader-close');
var pageLoading = document.querySelector('.page-loading');
var playBtn = document.querySelectorAll('.btn--play');
var orientationDiv = document.querySelector('.orientation');
var breakpoint = window.matchMedia('(max-height:560px)');
var modals = document.querySelectorAll('.modal');
var modalToggle = document.querySelectorAll('[data-toggle="modal"]');
var firstVideo = document.querySelector('.first-video');
var tabToggle = document.querySelectorAll('[data-toggle="tab"]');
var tabContent = document.querySelectorAll('[data-tab-content]');
var objectLiked = document.querySelectorAll('.object-heart');
var searchAdditionalOpener = document.querySelector('.open-additional-search');
var search = document.querySelector('.search');
var searchResult = document.querySelector('.search-result');
var searchSubmit = document.querySelector('.search-submit');
var searchResultHide = document.querySelector('.search-result-hide');
var actionToggle = document.querySelectorAll('[data-toggle="action"]');
var commentClose = document.querySelector('.comment__close');
document.addEventListener('DOMContentLoaded', function () {
  //loader
  loaderClose.addEventListener('click', function () {
    loaderClose.parentElement.remove();
    pageLoading.classList.remove('page-loading');
    videoStop();
    videoUnmute();
    document.querySelector('.main__item').querySelector('.video').play();
  }); //orientation

  if (window.orientation == 90 || window.orientation == '-' + 90) {
    if (breakpoint.matches === true) {
      orientationDiv.classList.add('changed');
      alert('Поверните обратно для лучшей работы');
    }
  } else {
    orientationDiv.classList.remove('changed');
  }

  window.addEventListener('orientationchange', function () {
    if (window.orientation == 90 || window.orientation == '-' + 90) {
      if (breakpoint.matches === true) {
        orientationDiv.classList.add('changed');
        alert('Поверните обратно для лучшей работы');
      }
    } else {
      orientationDiv.classList.remove('changed');
    }
  }, false); //swipe video

  swiperVideo.on('transitionEnd', function () {
    var activeSlide = this.el.querySelector('.swiper-slide-active'),
        activeSlideVideo = activeSlide.querySelector('.video'),
        activeSlideBtn = activeSlide.querySelector('.btn--play');
    allVideo.forEach(function (el) {
      if (el.parentElement.parentElement.parentElement.classList.contains('swiper-slide-active') === false) {
        el.pause();
      }
    });

    if (activeSlideVideo !== null) {
      activeSlideVideo.play();

      if (activeSlideBtn.classList.contains('play')) {
        activeSlideBtn.classList.remove('play');
      }
    } else {
      videoStop();
      console.log(90);
    }
  }); //play video btn

  playBtn.forEach(function (el) {
    el.addEventListener('click', function () {
      var btnCurr = el.getAttribute('data-mans');
      var videoCurr = document.getElementById(btnCurr); //  playPauseToggle()

      if (videoCurr.paused) {
        videoCurr.play();
        this.classList.remove('play');
      } else {
        videoCurr.pause();
        this.classList.add('play');
      }
    });
  }); //data-toggle modals

  firstVideo.addEventListener('click', function (e) {
    e.preventDefault();
    this.classList.add('active');
    removeToggleActive();
    closeModals();
    swiperVideo.slideTo(0);
  });
  modalToggle.forEach(function (modalToggleEl) {
    modalToggleEl.addEventListener('click', function (e) {
      e.preventDefault();
      closeModals();
      removeToggleActive();
      firstVideo.classList.remove('active');
      var modalToggle = document.querySelectorAll("[data-target=\"".concat(modalToggleEl.getAttribute('data-target'), "\"]"));
      modalToggle.forEach(function (el) {
        el.classList.add('active');
      }); //var modalToggleTarget = modalToggleEl.getAttribute('data-target');

      var modalTargetId = document.getElementById(modalToggleEl.getAttribute('data-target'));
      modalTargetId.classList.add('active');
    }, false);
  });
  modals.forEach(function (el) {
    el.addEventListener('click', function (e) {
      var modalToggle = document.querySelectorAll("[data-target=\"".concat(el.id, "\"]"));
      var target = e.target;

      if (target.classList.contains('modal') || target.classList.contains('modal__inner')) {
        el.classList.remove('active');
        firstVideo.classList.add('active');
        modalToggle.forEach(function (el) {
          el.classList.remove('active');

          if (el.classList.contains('footer__link')) {
            firstVideo.classList.add('active');
          }
        });
      } else {
        return;
      }
    });
  }); //tabs

  tabToggle.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var tabTarget = el.getAttribute('data-target');
      var tabContentTarget = document.querySelectorAll("[data-tab-content=\"".concat(tabTarget, "\"]"));
      tabToggle.forEach(function (el) {
        el.classList.remove('active');
      });
      this.classList.add('active');
      closeTabContent();
      tabContentTarget.forEach(function (el) {
        el.classList.add('active');
      });
    });
  }); //objectLiked

  objectLiked.forEach(function (el) {
    el.addEventListener('click', function () {
      this.classList.toggle('liked');
    });
  }); //search

  searchAdditionalOpener.addEventListener('click', function () {
    this.classList.toggle('opened');
    this.parentElement.classList.toggle('active');
  });
  searchSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    search.classList.remove('active');
    searchResult.classList.add('active');
  });
  searchResultHide.addEventListener('click', function (e) {
    e.preventDefault();
    search.classList.add('active');
    searchResult.classList.remove('active');
  }); //action

  actionToggle.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var actionTarget = el.getAttribute('data-target');
      document.getElementById(actionTarget).classList.add('active');
    });
  });
  commentClose.addEventListener('click', function () {
    document.querySelector('#comment').classList.remove('active');
  });
}); //functions
// stop all video

var allVideo = document.querySelectorAll('.video');

function videoStop() {
  allVideo.forEach(function (el) {
    el.pause();
  });
} // unmute all video


function videoUnmute() {
  allVideo.forEach(function (el) {
    el.muted = false;
  });
} //close modals


function closeModals() {
  modals.forEach(function (el) {
    el.classList.remove('active');
  });
} // active toggle link


function removeToggleActive() {
  modalToggle.forEach(function (el) {
    el.classList.remove('active');
  });
} // close tab contents


function closeTabContent() {
  tabContent.forEach(function (el) {
    el.classList.remove('active');
  });
} //date


Datepicker.locales.ru = {
  daysMin: ['Вос', 'Пон', 'Вто', 'Сре', 'Чет', 'Пят', 'Суб'],
  months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  today: 'Сегодня',
  clear: 'Очистить',
  titleFormat: 'MM',
  format: 'mm/dd/yyyy',
  weekstart: 0
};
var datepicker = document.getElementById('sign-in-date');
var date = new Datepicker(datepicker, {
  nextArrow: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 24\">\n\t<path \n\t\td=\"M.8232,23.9992a.871.871,0,0,1-.78034-.93947.99986.99986,0,0,1,.35986-.79295L13.72941,11.9992.40269,1.73154A1.06165,1.06165,0,0,1,.16894.43229.70483.70483,0,0,1,1.24228.1472L15.59722,11.207a1.06121,1.06121,0,0,1,.2371,1.29851.87807.87807,0,0,1-.2371.28588L1.24228,23.8512A.68353.68353,0,0,1,.8232,23.9992Z\" />\n  </svg>",
  prevArrow: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 24\">\n\t<path\n\t\td=\"M15.1768.0008a.871.871,0,0,1,.78034.93947.99986.99986,0,0,1-.35986.79295L2.27059,12.0008,15.59731,22.26846a1.06165,1.06165,0,0,1,.23375,1.29925.70483.70483,0,0,1-1.07334.28509L.40278,12.793a1.06121,1.06121,0,0,1-.2371-1.29851.87807.87807,0,0,1,.2371-.28588L14.75772.1488A.68353.68353,0,0,1,15.1768.0008Z\"/>\n  </svg>",
  disableTouchKeyboard: true,
  minDate: new Date(2021, 0, 1),
  maxDate: new Date(2031, 0, 1),
  format: 'mm/dd/yyyy',
  titleFormat: 'MM',
  language: 'ru'
}); //time edit

var configTime = {
  target: 'sign-in-time',
  datepicker: false,
  animations: false,
  disableAmPm: true,
  minutes: {
    step: 5
  }
};
var time = new MtrDatepicker(configTime);