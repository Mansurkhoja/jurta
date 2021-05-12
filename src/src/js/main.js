'use strict';
//vh
var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', ''.concat(vh, 'px'));
window.addEventListener('resize', function () {
	var vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', ''.concat(vh, 'px'));
});

//swiper video init
const swiperVideo = new Swiper('.main-container', {
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

const loaderClose = document.getElementById('loader-close');
const pageLoading = document.querySelector('.page-loading');
const playBtn = document.querySelectorAll('.btn--play');
const orientationDiv = document.querySelector('.orientation');
const breakpoint = window.matchMedia('(max-height:560px)');
const modals = document.querySelectorAll('.modal');
const modalToggle = document.querySelectorAll('[data-toggle="modal"]');
const firstVideo = document.querySelector('.first-video');
const tabToggle = document.querySelectorAll('[data-toggle="tab"]');
const tabContent = document.querySelectorAll('[data-tab-content]');
const objectLiked = document.querySelectorAll('.object-heart');
const searchAdditionalOpener = document.querySelector(
	'.open-additional-search'
);
const search = document.querySelector('.search');
const searchResult = document.querySelector('.search-result');
const searchSubmit = document.querySelector('.search-submit');
const searchResultHide = document.querySelector('.search-result-hide');
const actionToggle = document.querySelectorAll('[data-toggle="action"]');
const commentClose = document.querySelector('.comment__close');
document.addEventListener('DOMContentLoaded', function () {
	//loader
	loaderClose.addEventListener('click', function () {
		loaderClose.parentElement.remove();
		pageLoading.classList.remove('page-loading');
		videoStop();
		videoUnmute();
		document.querySelector('.main__item').querySelector('.video').play();
	});
	//orientation
	if (window.orientation == 90 || window.orientation == '-' + 90) {
		if (breakpoint.matches === true) {
			orientationDiv.classList.add('changed');
			alert('Поверните обратно для лучшей работы');
		}
	} else {
		orientationDiv.classList.remove('changed');
	}
	window.addEventListener(
		'orientationchange',
		function () {
			if (window.orientation == 90 || window.orientation == '-' + 90) {
				if (breakpoint.matches === true) {
					orientationDiv.classList.add('changed');
					alert('Поверните обратно для лучшей работы');
				}
			} else {
				orientationDiv.classList.remove('changed');
			}
		},
		false
	);
	//swipe video
	swiperVideo.on('transitionEnd', function () {
		var activeSlide = this.el.querySelector('.swiper-slide-active'),
			activeSlideVideo = activeSlide.querySelector('.video'),
			activeSlideBtn = activeSlide.querySelector('.btn--play');
		allVideo.forEach(function (el) {
			if (
				el.parentElement.parentElement.parentElement.classList.contains(
					'swiper-slide-active'
				) === false
			) {
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
	});
	//play video btn
	playBtn.forEach(function (el) {
		el.addEventListener('click', function () {
			var btnCurr = el.getAttribute('data-mans');
			var videoCurr = document.getElementById(btnCurr);
			//  playPauseToggle()
			if (videoCurr.paused) {
				videoCurr.play();
				this.classList.remove('play');
			} else {
				videoCurr.pause();
				this.classList.add('play');
			}
		});
	});
	//data-toggle modals
	firstVideo.addEventListener('click', function (e) {
		e.preventDefault();
		this.classList.add('active');
		removeToggleActive();
		closeModals();
		swiperVideo.slideTo(0);
	});
	modalToggle.forEach((modalToggleEl) => {
		modalToggleEl.addEventListener(
			'click',
			function (e) {
				e.preventDefault();
				closeModals();
				removeToggleActive();
				firstVideo.classList.remove('active');
				const modalToggle = document.querySelectorAll(
					`[data-target="${modalToggleEl.getAttribute('data-target')}"]`
				);
				modalToggle.forEach((el) => {
					el.classList.add('active');
				});
				//var modalToggleTarget = modalToggleEl.getAttribute('data-target');
				var modalTargetId = document.getElementById(
					modalToggleEl.getAttribute('data-target')
				);
				modalTargetId.classList.add('active');
			},
			false
		);
	});

	modals.forEach((el) => {
		el.addEventListener('click', function (e) {
			const modalToggle = document.querySelectorAll(
				`[data-target="${el.id}"]`
			);
			const target = e.target;
			if (
				target.classList.contains('modal') ||
				target.classList.contains('modal__inner')
			) {
				el.classList.remove('active');
				firstVideo.classList.add('active');
				modalToggle.forEach((el) => {
					el.classList.remove('active');
					if (el.classList.contains('footer__link')) {
						firstVideo.classList.add('active');
					}
				});
			} else {
				return;
			}
		});
	});
	//tabs
	tabToggle.forEach((el) => {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			const tabTarget = el.getAttribute('data-target');
			const tabContentTarget = document.querySelectorAll(
				`[data-tab-content="${tabTarget}"]`
			);
			tabToggle.forEach((el) => {
				el.classList.remove('active');
			});
			this.classList.add('active');
			closeTabContent();
			tabContentTarget.forEach((el) => {
				el.classList.add('active');
			});
		});
	});
	//objectLiked
	objectLiked.forEach((el) => {
		el.addEventListener('click', function () {
			this.classList.toggle('liked');
		});
	});
	//search
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
	});
	//action
	actionToggle.forEach((el) => {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			var actionTarget = el.getAttribute('data-target');
			document.getElementById(actionTarget).classList.add('active');
		});
	});
	commentClose.addEventListener('click', function () {
		document.querySelector('#comment').classList.remove('active');
	});
});

//functions
// stop all video
const allVideo = document.querySelectorAll('.video');
function videoStop() {
	allVideo.forEach(function (el) {
		el.pause();
	});
}
// unmute all video
function videoUnmute() {
	allVideo.forEach(function (el) {
		el.muted = false;
	});
}
//close modals
function closeModals() {
	modals.forEach((el) => {
		el.classList.remove('active');
	});
}
// active toggle link
function removeToggleActive() {
	modalToggle.forEach((el) => {
		el.classList.remove('active');
	});
}
// close tab contents
function closeTabContent() {
	tabContent.forEach((el) => {
		el.classList.remove('active');
	});
}

//date
Datepicker.locales.ru = {
	daysMin: ['Вос', 'Пон', 'Вто', 'Сре', 'Чет', 'Пят', 'Суб'],
	months: [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь'
	],
	monthsShort: [
		'Янв',
		'Фев',
		'Мар',
		'Апр',
		'Май',
		'Июн',
		'Июл',
		'Авг',
		'Сен',
		'Окт',
		'Ноя',
		'Дек'
	],
	today: 'Сегодня',
	clear: 'Очистить',
	titleFormat: 'MM',
	format: 'mm/dd/yyyy',
	weekstart: 0
};
const datepicker = document.getElementById('sign-in-date');
const date = new Datepicker(datepicker, {
	nextArrow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 24">
	<path 
		d="M.8232,23.9992a.871.871,0,0,1-.78034-.93947.99986.99986,0,0,1,.35986-.79295L13.72941,11.9992.40269,1.73154A1.06165,1.06165,0,0,1,.16894.43229.70483.70483,0,0,1,1.24228.1472L15.59722,11.207a1.06121,1.06121,0,0,1,.2371,1.29851.87807.87807,0,0,1-.2371.28588L1.24228,23.8512A.68353.68353,0,0,1,.8232,23.9992Z" />
  </svg>`,
	prevArrow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 24">
	<path
		d="M15.1768.0008a.871.871,0,0,1,.78034.93947.99986.99986,0,0,1-.35986.79295L2.27059,12.0008,15.59731,22.26846a1.06165,1.06165,0,0,1,.23375,1.29925.70483.70483,0,0,1-1.07334.28509L.40278,12.793a1.06121,1.06121,0,0,1-.2371-1.29851.87807.87807,0,0,1,.2371-.28588L14.75772.1488A.68353.68353,0,0,1,15.1768.0008Z"/>
  </svg>`,
	disableTouchKeyboard: true,
	minDate: new Date(2021, 0, 1),
	maxDate: new Date(2031, 0, 1),
	format: 'mm/dd/yyyy',
	titleFormat: 'MM',
	language: 'ru'
});
//time edit
const configTime = {
	target: 'sign-in-time',
	datepicker: false,
	animations: false,
	disableAmPm: true,
	minutes: {
		step: 5
	}
};
const time = new MtrDatepicker(configTime);
