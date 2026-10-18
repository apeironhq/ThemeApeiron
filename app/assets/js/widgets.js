/**
 * Section "13 widget di panel Elementor": ikon beranimasi + tur otomatis.
 * Dipanggil setelah initLanding() (GSAP + plugin sudah terdaftar di window).
 */
export function initWidgetPanel() {
	const section = document.querySelector('[data-wlib]');
	const { gsap, ScrollTrigger } = window;
	if (!section || !gsap || !ScrollTrigger) return;

	const $$ = (sel, ctx = section) => Array.from(ctx.querySelectorAll(sel));
	const tiles = $$('[data-wlib-tile]');
	const infos = $$('[data-wlib-info]');
	const panel = section.querySelector('[data-wlib-panel]');
	const cursor = section.querySelector('[data-wlib-cursor]');
	const progress = section.querySelector('[data-wlib-progress]');
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const hasDraw = !!window.DrawSVGPlugin;
	const STEP = 2.8; // detik per widget saat tur otomatis

	/* Gerakan khas tiap ikon, mengikuti fungsi widgetnya. */
	const q = (svg, sel) => svg.querySelectorAll(sel);
	const motions = {
		countdown: (s) => gsap.timeline()
			.to(q(s, '.wi-crown'), { y: 1.2, duration: 0.12, yoyo: true, repeat: 1 })
			.fromTo(q(s, '.wi-hand'), { rotation: 0 }, { rotation: 360, svgOrigin: '12 14', duration: 1.1, ease: 'power2.inOut' }, 0.1),
		audio: (s) => gsap.timeline()
			.fromTo(q(s, '.wi-play'), { scale: 0.6, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(3)' })
			.fromTo(q(s, '.wi-ring'), { scale: 0.85, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.4)' }, 0),
		form: (s) => gsap.timeline()
			.fromTo(q(s, '.wi-clip'), { y: -2 }, { y: 0, duration: 0.5, ease: 'bounce.out' })
			.add(draw(q(s, '.wi-line'), 0.35, 0.15), 0.1),
		order: (s) => gsap.timeline()
			.fromTo(q(s, '.wi-win'), { y: -2, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.4 })
			.add(draw(q(s, '.wi-line'), 0.3, 0.12), 0.15)
			.fromTo(q(s, '.wi-btn'), { scale: 0.7, transformOrigin: '0% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, 0.45),
		copy: (s) => gsap.timeline()
			.to(q(s, '.wi-front'), { x: -4, y: -4, duration: 0.3, ease: 'power2.out' })
			.to(q(s, '.wi-front'), { x: 0, y: 0, duration: 0.5, ease: 'back.out(3)' }),
		comment: (s) => gsap.timeline()
			.fromTo(q(s, '.wi-bubble'), { rotation: -8, svgOrigin: '3 21' }, { rotation: 0, svgOrigin: '3 21', duration: 0.7, ease: 'elastic.out(1, 0.45)' })
			.add(draw(q(s, '.wi-line'), 0.3, 0.15), 0.1),
		manager: (s) => gsap.timeline()
			.fromTo(q(s, '.wi-p2'), { x: 4, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
			.fromTo(q(s, '.wi-p1'), { y: 0 }, { y: -1.5, duration: 0.18, yoyo: true, repeat: 1 }, 0.1),
		scroll: (s) => gsap.fromTo(q(s, '.wi-wheel'), { y: -1 }, { y: 4, opacity: 0, duration: 0.55, repeat: 2, ease: 'power1.in' }),
		activity: (s) => gsap.timeline()
			.fromTo(q(s, '.wi-bell'), { rotation: -16, svgOrigin: '12 3' }, { rotation: 0, svgOrigin: '12 3', duration: 0.9, ease: 'elastic.out(1.2, 0.3)' })
			.fromTo(q(s, '.wi-dot'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(4)' }, 0.15),
		loader: (s) => gsap.timeline()
			.fromTo(q(s, '.wi-arc'), { rotation: 0 }, { rotation: 360, svgOrigin: '12 12', duration: 0.9, ease: 'power2.inOut' })
			.add(draw(q(s, '.wi-check'), 0.4, 0), 0.6),
		cover: (s) => gsap.timeline()
			.fromTo(q(s, '.wi-seal'), { scale: 0.3, rotation: -90, svgOrigin: '12 12' }, { scale: 1, rotation: 0, svgOrigin: '12 12', duration: 0.7, ease: 'back.out(2.6)' })
			.add(draw(q(s, '.wi-cross'), 0.5, 0), 0),
		story: (s) => gsap.timeline()
			.add(draw(q(s, '.wi-branch'), 0.6, 0))
			.fromTo(q(s, '.wi-node'), { scale: 0.4, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(3)' }, 0.1),
		registry: (s) => gsap.fromTo(q(s, '.wi-box'), { scale: 0.5, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.09, ease: 'back.out(2.5)' }),
	};
	function draw(els, duration, stagger) {
		if (!els.length) return gsap.timeline();
		return hasDraw
			? gsap.fromTo(els, { drawSVG: '0%' }, { drawSVG: '100%', duration, stagger, ease: 'power2.out' })
			: gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration, stagger });
	}
	const playIcon = (wrap) => {
		const svg = wrap && wrap.querySelector('svg');
		const fn = svg && motions[wrap.dataset.key];
		if (fn && !reduceMotion) fn(svg);
	};

	/* Aktifkan satu widget: tile, kartu info, dan ikon. */
	let current = 0;
	const activate = (i, animate = true) => {
		const prev = current;
		current = i;
		tiles.forEach((t, k) => t.classList.toggle('is-active', k === i));
		if (prev !== i) {
			infos[prev].classList.remove('is-active');
			gsap.to(infos[prev], { autoAlpha: 0, y: -14, duration: 0.3, ease: 'power2.in', overwrite: true });
		}
		infos[i].classList.add('is-active');
		gsap.fromTo(infos[i], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: prev !== i ? 0.15 : 0, ease: 'expo.out', overwrite: true });
		if (!animate) return;
		gsap.fromTo(infos[i].querySelectorAll('h3, p, .ap-wlib__dest'), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, delay: 0.2, ease: 'power3.out' });
		gsap.fromTo(tiles[i], { scale: 0.94 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
		playIcon(tiles[i].querySelector('[data-wlib-icon]'));
		playIcon(infos[i].querySelector('[data-wlib-icon]'));
	};
	gsap.set(infos, { autoAlpha: 0 });
	gsap.set(infos[0], { autoAlpha: 1 });

	/* Kursor tur: bergerak ke tile lalu "klik". */
	const moveCursor = (i) => {
		if (!cursor || !panel) return;
		const pr = panel.getBoundingClientRect();
		const tr = tiles[i].getBoundingClientRect();
		gsap.to(cursor, { x: tr.left - pr.left + tr.width * 0.62, y: tr.top - pr.top + tr.height * 0.58, autoAlpha: 1, duration: 0.7, ease: 'power3.inOut' });
		gsap.to(cursor, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1, delay: 0.7 });
	};

	/* Tur otomatis, berhenti saat pengunjung mengambil alih. */
	let tour = null;
	let resumeTimer = null;
	let revealed = false;
	const next = () => {
		const i = (current + 1) % tiles.length;
		moveCursor(i);
		gsap.delayedCall(0.75, () => activate(i));
		runProgress();
	};
	const runProgress = () => {
		if (!progress) return;
		tour = gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: STEP, ease: 'none', onComplete: next });
	};
	const stopTour = () => {
		if (tour) tour.kill();
		tour = null;
		clearTimeout(resumeTimer);
		gsap.to(cursor, { autoAlpha: 0, duration: 0.3 });
		gsap.to(progress, { scaleX: 0, duration: 0.3 });
	};
	const startTour = () => {
		if (tour || reduceMotion || !revealed) return;
		moveCursor(current);
		runProgress();
	};

	tiles.forEach((t, i) => {
		const take = () => { stopTour(); if (i !== current) activate(i); };
		t.addEventListener('mouseenter', take);
		t.addEventListener('focus', take);
		t.addEventListener('click', () => { stopTour(); activate(i); });
	});
	panel.addEventListener('mouseleave', () => {
		clearTimeout(resumeTimer);
		resumeTimer = setTimeout(startTour, 3500);
	});

	/* Masuk layar: tile muncul berurutan, ikon tergambar, lalu tur dimulai. */
	if (reduceMotion) { activate(0, false); return; }
	gsap.set(tiles, { autoAlpha: 0, y: 18 });
	ScrollTrigger.create({
		trigger: panel,
		start: 'top 80%',
		once: true,
		onEnter: () => {
			gsap.to(tiles, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.045, ease: 'back.out(1.6)' });
			const strokes = tiles.flatMap((t) => Array.from(t.querySelectorAll('svg path, svg line, svg rect, svg circle, svg polygon')));
			if (hasDraw) gsap.fromTo(strokes, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, stagger: 0.008, ease: 'power2.out', delay: 0.15 });
			gsap.delayedCall(1.1, () => { revealed = true; activate(0); startTour(); });
		},
	});
	// Tur hanya berjalan saat section terlihat.
	ScrollTrigger.create({
		trigger: section,
		start: 'top bottom',
		end: 'bottom top',
		onToggle: (self) => { if (!self.isActive) stopTour(); else if (!tour) startTour(); },
	});
}
