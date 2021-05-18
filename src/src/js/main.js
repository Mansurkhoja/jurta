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
const additionalOpener = document.querySelectorAll('.open-additional');
const search = document.querySelector('.search');
const searchResult = document.querySelector('.search-result');
const searchSubmit = document.querySelector('.search-submit');
const searchResultHide = document.querySelector('.search-result-hide');
const actionToggle = document.querySelectorAll('[data-toggle="action"]');
const commentClose = document.querySelector('.comment__close');
const closer = document.querySelectorAll('[data-close]');
//book vars
const bookHeader = document.querySelector('.book__header');
const bookDays = document.querySelector('.book__days');
const bookTimes = document.querySelector('.book__times');
const btnLike = document.querySelectorAll('.btn-like');
const pageProfile = document.querySelector('#page-profile');
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
		if (firstVideo.classList.contains('.active')) {
			swiperVideo.slideTo(0);
		}
	});
	modalToggle.forEach((modalToggleEl) => {
		modalToggleEl.addEventListener(
			'click',
			function (e) {
				e.preventDefault();
				closeModals();
				removeToggleActive();
				firstVideo.classList.remove('active');
				if (modalToggleEl.hasAttribute('data-target')) {
					const modalToggle = document.querySelectorAll(
						`[data-target="${modalToggleEl.getAttribute('data-target')}"]`
					);
					modalToggle.forEach((el) => {
						el.classList.add('active');
					});
					var modalTargetId = document.getElementById(
						modalToggleEl.getAttribute('data-target')
					);
					modalTargetId.classList.add('active');
				}

				if (modalToggleEl.hasAttribute('data-profile')) {
					const profileTarget = this.getAttribute('data-profile');
					pageProfile.setAttribute('data-active', profileTarget);
					pageProfile.classList.add('active');
				}
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
	//search
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
	//additionalOpener
	additionalOpener.forEach((el) => {
		el.addEventListener('click', function () {
			this.classList.toggle('opened');
			this.parentElement.classList.toggle('active');
		});
	});
	//action
	actionToggle.forEach((el) => {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			if (el.closest('.modal.pop-up')) {
				el.closest('.modal').classList.remove('active');
			}

			var actionTarget = el.getAttribute('data-target');
			document.getElementById(actionTarget).classList.add('active');
		});
	});

	//closer modal pop-up
	closer.forEach((el) => {
		el.addEventListener('click', function () {
			// var close = el.getAttribute('data-close');
			// if (close === 'modal') {
			// 	closeModals();
			// }
			// if (close === 'pop-up') {
			// 	el.closest('.modal').classList.remove('active');
			// }
			el.closest('.modal').classList.remove('active');
			if (!document.querySelector('.modal.active')) {
				firstVideo.classList.add('active');
			}
		});
	});
	//book clicked
	const bookTime = document.querySelectorAll('.book__time');
	const bookDay = document.querySelectorAll('.book__day');
	bookClicked(bookDay);
	bookClicked(bookTime);
	//like
	btnLike.forEach((el) => {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			el.classList.toggle('liked');
		});
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
//book
const weeksShort = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const weeks = [
	'Понедельник',
	'Вторник',
	'Среда',
	'Четверг',
	'Пятница',
	'Суббота',
	'Воскресенье'
];
const months = [
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
];
//book title header
function bookHeaderTitle() {
	var today = new Date();
	var month = today.getMonth();
	var date = today.getDate();
	var year = today.getFullYear();
	var weekDay = today.getDay();
	return `<span class="book__header-day">${date}</span><span class="book__header-month">${months[month]}</span>,<span class="book__header-year">${year}</span>•<span class="book__header-day-week">${weeks[weekDay]}</span>`;
}

bookHeader.innerHTML = bookHeaderTitle();
//book days
function formatDate(date) {
	var dd = date.getDate();
	if (dd < 10) {
		dd = '0' + dd;
	}
	date = dd;
	return date;
}
function bookDay(e) {
	var result = [];
	for (var i = 0; i < e; i++) {
		var d = new Date();
		d.setDate(d.getDate() + i);
		var weekDays = d.getDay();
		result.push(
			`<div class="book__day" data-day="${formatDate(d)}" data-month="${
				months[d.getMonth()]
			}" data-year="${d.getFullYear()}" data-week="${weeks[weekDays]}">
			<span>
			${formatDate(d)}
			</span>
			<span>
			${weeksShort[weekDays]}
			</span>
			</div>`
		);
	}
	return result.join('');
}

bookDays.innerHTML = bookDay(14);
//book times
function bookTime() {
	var times = [];
	var timeInterval = ['00', '30'];
	for (var i = 9; i < 21; i++) {
		for (var s = 0; s < 2; s++) {
			times.push(
				`<div class="book__time"> 
					 ${i + ':' + timeInterval[s]}
				</div>`
			);
		}
	}
	return times.join('');
}

bookTimes.innerHTML = bookTime();
//bookClicked
function bookClicked(e) {
	e.forEach((el) => {
		el.addEventListener('click', function () {
			if (!el.classList.contains('active')) {
				e.forEach((el) => {
					el.classList.remove('active');
				});
			}
			if (el.classList.contains('book__day')) {
				if (!el.classList.contains('active')) {
					bookHeader.querySelector('.book__header-day').innerHTML =
						el.getAttribute('data-day');
					bookHeader.querySelector('.book__header-month').innerHTML =
						el.getAttribute('data-month');
					bookHeader.querySelector('.book__header-year').innerHTML =
						el.getAttribute('data-year');
					bookHeader.querySelector('.book__header-day-week').innerHTML =
						el.getAttribute('data-week');
				}
				document.querySelector('.book__btn').classList.remove('disabled');
			}
			el.classList.add('active');
		});
	});
}
//lightgaller
lightGallery(document.getElementById('lightgallery'), {
	download: false,
	slideEndAnimatoin: false,
	counter: true,
	enableDrag: true,
	enableTouch: true,
	cssEasing: 'ease',
	//loop:false,
	loop: true
});
