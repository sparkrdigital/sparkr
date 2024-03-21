import { expertiseHover } from './expertiseHoverimg.js';
import { mouseMoveParallaxLine } from './verticleLine.js';

document.addEventListener('DOMContentLoaded', () => {
	gsap.registerPlugin(ScrollTrigger);
	[
		mouseMoveParallaxGallery,
		barbaPageTransition,
		smoothScroller,
		mouseMoveParallaxLine,
		initProjectCaseAnimation,
		animateNumbering,
		expertiseHover,
		horizontalScrollPlayground,
		parallaxImg,
	].forEach((func) => func());
});

let bodyScrollBar;

// Smooth Scroll Setup
function smoothScroller() {
	const scroller = document.querySelector('.scrollbar-container');
	if (!scroller) return console.error('Scrollbar container not found.');
	bodyScrollBar = Scrollbar.init(scroller, {
		damping: 0.05,
		delegateTo: document,
		thumbMinSize: 20,
	});
	ScrollTrigger.scrollerProxy(scroller, {
		scrollTop(value) {
			return arguments.length
				? (bodyScrollBar.scrollTop = value)
				: bodyScrollBar.scrollTop;
		},
	});
	bodyScrollBar.addListener(ScrollTrigger.update);
	ScrollTrigger.defaults({ scroller });

	const updateProgressBar = () => {
		const progress = (bodyScrollBar.offset.y / bodyScrollBar.limit.y) * 100;
		gsap.to('.progressBar', {
			width: `${progress}%`,
			ease: 'none',
			duration: 0.3,
		});
	};
	bodyScrollBar.addListener(updateProgressBar);
	window.addEventListener('resize', updateProgressBar);
	updateProgressBar();
}

// BarbaJs page Setup
function barbaPageTransition() {
	const loader = {
		init() {
			gsap.set('.loader', {
				scaleX: 0,
				rotation: 10,
				xPercent: -5,
				yPercent: -50,
				transformOrigin: 'left center',
				autoAlpha: 1,
			});
		},
		in: () =>
			gsap.fromTo(
				'.loader',
				{ rotation: 10, scaleX: 0, xPercent: -5 },
				{
					duration: 1.5,
					xPercent: 0,
					scaleX: 1,
					rotation: 0,
					ease: 'power4.inOut',
					transformOrigin: 'left center',
				}
			),
		away: () =>
			gsap.to('.loader', {
				duration: 1.5,
				scaleX: 0,
				xPercent: 5,
				rotation: -10,
				transformOrigin: 'right center',
				ease: 'power4.inOut',
			}),
	};
	loader.init();

	barba.init({
		transitions: [
			{
				async leave(data) {
					const done = this.async();
					loader.in();
					await new Promise((r) => setTimeout(r, 1500));
					done();
				},
				enter(data) {
					loader.away();
					reinitializeFunctions();
				},
			},
		],
	});

	barba.hooks.before(() =>
		document.querySelector('html').classList.add('is-transitioning')
	);
	barba.hooks.after(() =>
		document.querySelector('html').classList.remove('is-transitioning')
	);

	function reinitializeFunctions() {
		// Call functions that need to be reinitialized after page change
		[
			recalculateLayout,
			scrollToTop,
			smoothScroller,
			ScrollTrigger.refresh,
			mouseMoveParallaxLine,
			initProjectCaseAnimation,
			animateNumbering,
			expertiseHover,
			horizontalScrollPlayground,
			mouseMoveParallaxGallery,
			parallaxImg,
		].forEach((func) => func());
	}

	const scrollToTop = () =>
		bodyScrollBar ? bodyScrollBar.scrollTo(0, 0, 0) : window.scrollTo(0, 0);
	const recalculateLayout = () =>
		gsap.to(window, {
			duration: 0.1,
			onComplete: () => window.dispatchEvent(new Event('resize')),
		});
}

//=================================== Home Page ===================================//
// Animate Numbering For About Section
function animateNumbering() {
	document.querySelectorAll('.numbering h2').forEach((h2) => {
		const endValue = parseInt(h2.textContent.replace(/[^\d]/g, ''));
		gsap
			.timeline({
				scrollTrigger: {
					trigger: h2,
					start: 'top bottom',
					toggleActions: 'play none none none',
				},
				defaults: { duration: 1.5, ease: 'power1.inOut' },
			})
			.fromTo(
				h2,
				{ innerText: 0 },
				{
					innerText: endValue,
					roundProps: 'innerText',
					ease: 'power3.inOut',
					onUpdate: () =>
						(h2.textContent =
							Math.ceil(gsap.getProperty(h2, 'innerText')) + '+'),
					onComplete: () => (h2.textContent = endValue + '+'),
				}
			);
	});
}

// Project Case Animations
function initProjectCaseAnimation() {
	document.querySelectorAll('.project_case').forEach((projectCase) => {
		ScrollTrigger.create({
			trigger: projectCase,
			start: 'top center',
			end: 'bottom top',
			scrub: true,
			onEnter: () => animateProjectCase(projectCase, true),
			onLeaveBack: () => animateProjectCase(projectCase, false),
			scroller: '.scrollbar-container',
		});
	});
}

function animateProjectCase(projectCase, entering) {
	gsap.to(projectCase, { scale: entering ? 1 : 0.7, duration: 0.5 });
	gsap.to(projectCase.querySelector('.main_img'), {
		scale: entering ? 1 : 1.5,
		duration: 0.5,
	});
}

// Playground Horizontal Animation
function horizontalScrollPlayground() {
	const horizontalScroll = document.querySelector('.horizontal_scroll');
	if (!horizontalScroll) return;
	const horizontalScrollLength = horizontalScroll.scrollWidth;
	gsap.to(horizontalScroll, {
		x: () => -(horizontalScrollLength - window.innerWidth),
		ease: 'none',
		scrollTrigger: {
			trigger: '.playground',
			pin: true,
			scrub: true,
			start: 'top top',
			end: () => `+=${horizontalScrollLength}`,
			invalidateOnRefresh: true,
		},
	});
}

//=================================== Playground Page ===================================//
function mouseMoveParallaxGallery() {
	const gallery = document.getElementById('gallery');
	if (!gallery) return;

	// Exit if there are no frames

	document.addEventListener('mousemove', function (e) {
		const { clientX: mouseX, clientY: mouseY, view } = e;
		const { innerWidth: width, innerHeight: height } = view;

		const xPercent = mouseX / width - 0.5;
		const yPercent = mouseY / height - 0.5;

		const movementStrength = 200;
		const xMove = xPercent * movementStrength;
		const yMove = yPercent * movementStrength;

		gsap.to(gallery, {
			x: xMove,
			y: yMove,
			ease: 'power1.out',
			duration: 0.5,
		});
	});

	document.addEventListener('mousemove', function (e) {
		const { clientX: mouseX, clientY: mouseY } = e;

		frames.forEach((frame) => {
			const frameRect = frame.getBoundingClientRect();
			const frameCenterX = frameRect.left + frameRect.width / 2;
			const frameCenterY = frameRect.top + frameRect.height / 2;

			const deltaX = mouseX - frameCenterX;
			const deltaY = mouseY - frameCenterY;

			const maxTiltAngle = 5;

			const tiltX = (deltaY / frameRect.height) * maxTiltAngle;
			const tiltY = -(deltaX / frameRect.width) * maxTiltAngle;

			gsap.to(frame, {
				rotationX: tiltX,
				rotationY: tiltY,
				ease: 'power1.out',
				duration: 0.5,
				transformPerspective: 1200,
			});
		});
	});

	const frames = gallery.querySelectorAll('.frame');
	if (frames.length === 0) return;
	frames.forEach((frame) => {
		frame.addEventListener('mouseenter', () => {
			gsap.to(frame, {
				scale: 1.5,
				duration: 0.5,
				zIndex: 2,
				ease: 'power1.out',
			});
		});
		frame.addEventListener('mouseleave', () => {
			gsap.to(frame, {
				scale: 1,
				duration: 0.5,
				zIndex: 1,
				ease: 'power1.out',
			});
		});
	});
}

//=================================== About Parrallax Image  ===================================//
function parallaxImg() {
	let parallaxImages = gsap.utils.toArray('.parallax_img');

	if (parallaxImages.length === 0) {
		return;
	}

	parallaxImages.forEach(function (parallaxCnt) {
		let pimage = parallaxCnt.querySelector('.parallax_img img');

		let tl8 = gsap.timeline({
			scrollTrigger: {
				trigger: parallaxCnt,
				scrub: true,
				pin: false,
			},
		});

		tl8.fromTo(pimage, { yPercent: -10 }, { yPercent: 10, ease: 'none' });
	});
}
const toggleBtn = document.querySelector('.nav-toggle');
const closeBtn = document.querySelector('.close-btn');
const sidebar = document.querySelector('.sidebar');

toggleBtn.addEventListener('click', function () {
	sidebar.classList.toggle('show-sidebar');
});

closeBtn.addEventListener('click', function () {
	sidebar.classList.remove('show-sidebar');
});
