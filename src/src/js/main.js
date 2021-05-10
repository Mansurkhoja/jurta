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
const modal = document.querySelectorAll('.modal');
const modalToggle = document.querySelectorAll('[data-toggle="modal"]');
const firstVideo = document.querySelector('.first-video');
const tabToggle = document.querySelectorAll('[data-toggle="tab"]');
const tabContent = document.querySelectorAll('[data-tab-content]');
console.log(tabContent);
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
		toggleActive();
		closeModals();
		swiperVideo.slideTo(0);
	});
	modalToggle.forEach((el) => {
		el.addEventListener(
			'click',
			function (e) {
				e.preventDefault();
				closeModals();
				if (el.classList.contains('footer__link')) {
					toggleActive();
					firstVideo.classList.remove('active');
				}
				var modalTarget = el.getAttribute('data-target');
				var modalTargetId = document.getElementById(modalTarget);
				el.classList.add('active');
				modalTargetId.classList.add('active');
			},
			false
		);
	});
	modal.forEach((el) => {
		el.addEventListener('click', function (e) {
			const modalToggle = document.querySelectorAll(`[data-target="${el.id}"]`);
			const target = e.target;
			modalToggle.forEach(el => {
				el.classList.remove('active');
				if (el.classList.contains('footer__link')) {
					firstVideo.classList.add('active');
				}
			});
			//modalToggle.classList.remove('active');
			
			if (
				target.classList.contains('modal') ||
				target.classList.contains('modal__inner')
			) {
				el.classList.remove('active');
			} else {
				return;
			}
		});
	});
	//tabs

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
	modal.forEach((el) => {
		el.classList.remove('active');
	});
}
// active toggle link
function toggleActive() {
	modalToggle.forEach((el) => {
		el.classList.remove('active');
	});
}
