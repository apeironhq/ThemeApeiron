/**
 * ApeironKit — Landing Page interactions (GSAP 3.13).
 * Disalin apa adanya dari tema WordPress ApeironTheme; dipanggil sekali setelah halaman ter-mount.
 * Plugin: ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin.
 */
export function initLanding() {
	'use strict';

	const root = document.documentElement;
	const $ = (sel, ctx = document) => ctx.querySelector(sel);
	const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

	initCountdown();
	initMobileNav();

	if (!window.gsap || !window.ScrollTrigger) {
		root.classList.remove('ap-js');
		return;
	}

	const { gsap, ScrollTrigger } = window;
	const plugins = [ScrollTrigger, window.ScrollSmoother, window.SplitText, window.DrawSVGPlugin].filter(Boolean);
	gsap.registerPlugin(...plugins);
	window.__apReady = true;

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	const hasSplit = !!window.SplitText;
	const hasDraw = !!window.DrawSVGPlugin;

	gsap.defaults({ ease: 'power3.out', duration: 0.9 });
	ScrollTrigger.config({ ignoreMobileResize: true });

	if (reduceMotion) {
		gsap.set('[data-hero-fade], [data-reveal], [data-card], [data-step], [data-chip], [data-split-hero], [data-gate]', { autoAlpha: 1 });
		initFit();
		initNav(null);
		initGate();
		initFaq(null);
		return;
	}

	// ScrollSmoother harus dibuat sebelum ScrollTrigger lain. Hanya untuk mouse/trackpad.
	let smoother = null;
	if (finePointer && window.ScrollSmoother) {
		smoother = window.ScrollSmoother.create({
			wrapper: '#smooth-wrapper',
			content: '#smooth-content',
			smooth: 1.25,
			ease: 'expo',
			effects: true,
			normalizeScroll: false,
		});
	}

	initFit();
	initNav(smoother);
	initHero();
	initGate();
	initMarquee();
	initStory();
	initJourney();
	initDashboard3D();
	initSplitTitles();
	initReveals();
	initBento();
	initCounters();
	initSteps();
	initTestimonials();
	initTimelineLoop();
	initFaq(smoother);
	initCtaOrnament();

	if (finePointer) {
		initCursor();
		initMagnetic();
		initTilt();
		initSpotlight();
	}

	// Posisi pin dihitung ulang setelah font selesai dimuat.
	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(() => ScrollTrigger.refresh());
	}


	/* ------------------------------------------------------------------ */
	/* Fit: skalakan mockup agar muat di layar mana pun (laptop/tab/HP)   */
	/* ------------------------------------------------------------------ */
	function initFit() {
		const clamp = (min, max, v) => Math.min(max, Math.max(min, v));

		const fitJourney = () => {
			const stage = $('[data-journey-stage]');
			const box = $('[data-journey-fit]');
			const pin = $('.ap-journey__pin');
			if (!stage || !box || !pin) return;
			// Tinggi area caption = caption tertinggi, supaya teks panjang tidak menimpa tombol langkah.
			const caps = $('.ap-journey__captions', pin);
			if (caps) {
				caps.style.minHeight = '0px';
				const tallest = Math.max(...$$('[data-journey-caption]', caps).map((el) => el.offsetHeight));
				caps.style.minHeight = tallest + 'px';
			}
			gsap.set(box, { scale: 1 });
			const natW = box.offsetWidth;
			const natH = box.offsetHeight;
			const ps = getComputedStyle(pin);
			const padTop = parseFloat(ps.paddingTop) || 0;
			const padBottom = parseFloat(ps.paddingBottom) || 0;
			const twoColumn = window.matchMedia('(min-width: 900px)').matches;
			let availH;
			if (twoColumn) {
				availH = window.innerHeight - padTop - padBottom;
			} else {
				// Satu kolom: HP ada di bawah teks. Konten pin dipusatkan vertikal, jadi hitung dari tinggi teks.
				const copy = $('.ap-journey__copy', pin);
				const inner = $('.ap-journey__inner', pin);
				const gap = parseFloat(getComputedStyle(inner).rowGap) || 0;
				availH = window.innerHeight - padTop - padBottom - (copy ? copy.offsetHeight : 0) - gap;
			}
			const s = clamp(0.42, 1, Math.min(stage.clientWidth / natW, availH / natH));
			gsap.set(box, { scale: s, transformOrigin: '50% 0' });
			stage.style.height = Math.round(natH * s) + 'px';
		};

		const fitHero = () => {
			const wrap = $('[data-tilt-target]');
			const stage = $('[data-tilt-stage]');
			if (!wrap || !stage) return;
			// Ukuran layout (offset*) tidak terpengaruh animasi transform, jadi aman diukur kapan saja.
			const els = [$('[data-gate]', wrap), ...$$('[data-chip]', wrap)].filter(Boolean);
			let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
			els.forEach((el) => {
				l = Math.min(l, el.offsetLeft); t = Math.min(t, el.offsetTop);
				r = Math.max(r, el.offsetLeft + el.offsetWidth); b = Math.max(b, el.offsetTop + el.offsetHeight);
			});
			// Chip boleh menjorok ke celah antar kolom & sisi kanan halaman (simetris), asal tidak menabrak teks.
			let allow = 0;
			const inner = stage.parentElement;
			if (window.matchMedia('(min-width: 900px)').matches && inner) {
				const colGap = parseFloat(getComputedStyle(inner).columnGap) || 0;
				const rightFree = document.documentElement.clientWidth - stage.getBoundingClientRect().right - 16;
				allow = Math.max(0, Math.min(colGap * 0.8, rightFree, 120));
			}
			const s = clamp(0.5, 1, Math.min((stage.clientWidth + allow * 2 - 8) / (r - l), (stage.clientHeight * 0.94) / (b - t)));
			gsap.set(wrap, { scale: s });
		};

		const fitAll = () => { fitHero(); fitJourney(); };
		fitAll();
		ScrollTrigger.addEventListener('refreshInit', fitAll);
	}

	/* ------------------------------------------------------------------ */
	/* Navigasi                                                           */
	/* ------------------------------------------------------------------ */
	function initNav(smootherInstance) {
		const nav = $('[data-nav]');
		if (!nav) return;

		// Saat login, admin bar WP di HP ikut tergulir: navbar menempel tepat di bawahnya, lalu naik ke atas.
		const adminBar = document.getElementById('wpadminbar');
		if (adminBar) {
			const syncTop = () => { nav.style.top = Math.max(0, Math.round(adminBar.getBoundingClientRect().bottom)) + 'px'; };
			syncTop();
			window.addEventListener('scroll', syncTop, { passive: true });
			window.addEventListener('resize', syncTop);
		}

		ScrollTrigger.create({
			trigger: '.ap-hero',
			start: 'bottom 90px',
			onEnter: () => nav.classList.add('is-solid'),
			onLeaveBack: () => nav.classList.remove('is-solid'),
		});

		ScrollTrigger.create({
			start: 0,
			end: 'max',
			onUpdate: (self) => {
				const hide = self.direction === 1 && self.scroll() > window.innerHeight * 0.9;
				nav.classList.toggle('is-hidden', hide && !nav.classList.contains('is-open'));
			},
		});

		// Link jangkar (#harga, dst.) bekerja juga saat ScrollSmoother aktif.
		$$('a[href^="#"]').forEach((link) => {
			link.addEventListener('click', (e) => {
				const id = link.getAttribute('href');
				if (id.length < 2) return;
				const target = $(id);
				if (!target) return;
				e.preventDefault();
				closeMobileNav();
				if (smootherInstance) {
					smootherInstance.scrollTo(target, true, 'top 80px');
				} else {
					const y = target.getBoundingClientRect().top + window.scrollY - 80;
					window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
				}
			});
		});
	}

	function initMobileNav() {
		const toggle = $('[data-nav-toggle]');
		const sheet = $('[data-nav-sheet]');
		if (!toggle || !sheet) return;
		toggle.addEventListener('click', () => {
			const open = toggle.getAttribute('aria-expanded') !== 'true';
			toggle.setAttribute('aria-expanded', String(open));
			sheet.hidden = !open;
			$('[data-nav]').classList.toggle('is-open', open);
			$('[data-nav]').classList.toggle('is-solid', open || window.scrollY > window.innerHeight * 0.8);
		});
	}

	function closeMobileNav() {
		const toggle = $('[data-nav-toggle]');
		const sheet = $('[data-nav-sheet]');
		if (!toggle || !sheet || sheet.hidden) return;
		toggle.setAttribute('aria-expanded', 'false');
		sheet.hidden = true;
		$('[data-nav]').classList.remove('is-open');
	}

	/* ------------------------------------------------------------------ */
	/* Hero                                                               */
	/* ------------------------------------------------------------------ */
	function initHero() {
		const title = $('[data-split-hero]');
		const tl = gsap.timeline({ delay: 0.15 });

		if (title && hasSplit) {
			window.SplitText.create(title, {
				type: 'lines,words',
				mask: 'lines',
				autoSplit: true,
				onSplit(self) {
					gsap.set(title, { autoAlpha: 1 });
					return gsap.from(self.words, { yPercent: 110, duration: 1.2, stagger: 0.05, ease: 'expo.out', delay: 0.2 });
				},
			});
		} else if (title) {
			tl.fromTo(title, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0 }, 0);
		}

		tl.fromTo('[data-hero-fade]', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, stagger: 0.1 }, 0.55)
			.fromTo('[data-gate]',
				{ autoAlpha: 0, y: 140, rotationX: 40, rotationZ: -8, scale: 0.86 },
				{ autoAlpha: 1, y: 0, rotationX: 0, rotationZ: 0, scale: 1, duration: 1.8, ease: 'expo.out' }, 0.3)
			.from('.ap-gate__seal', { scale: 0, rotation: -120, duration: 1.1, ease: 'back.out(1.6)' }, 1.0)
			.from('[data-gate-tag]', { rotation: 35, autoAlpha: 0, duration: 1.4, ease: 'elastic.out(1, 0.45)' }, 1.25)
			.fromTo('[data-chip]',
				{ autoAlpha: 0, scale: 0.6, y: 20 },
				{ autoAlpha: 1, scale: 1, y: 0, stagger: 0.12, ease: 'back.out(1.8)', duration: 0.8 }, 1.3);

		// Chip melayang pelan.
		$$('[data-chip]').forEach((chip, i) => {
			gsap.to(chip, { y: i % 2 ? 10 : -10, duration: 2.6 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });
		});

		// Saat hero digulir keluar, kartu sampul mendekat ke arah pembaca lalu memudar.
		gsap.to('.ap-hero__stage', {
			yPercent: 8,
			scale: 1.16,
			autoAlpha: 0.15,
			ease: 'none',
			scrollTrigger: { trigger: '.ap-hero', start: 'top top', end: 'bottom top', scrub: true },
		});
	}

	/**
	 * Cover Classic 3D: segel terangkat, label jatuh, pintu kiri-kanan terbuka,
	 * lalu isi undangan muncul. Tombol "Tutup sampul" memutar balik timeline.
	 */
	function initGate() {
		const gate = $('[data-gate]');
		if (!gate) return;
		const seal = $('.ap-gate__seal', gate);
		const tag = $('[data-gate-tag]', gate);
		const inside = $('[data-gate-inside]', gate);
		const names = $('[data-gate-names]', gate);
		const doorL = $('[data-gate-door="l"]', gate);
		const doorR = $('[data-gate-door="r"]', gate);
		const insideItems = $$('.ap-gate__kicker, .ap-gate__date, .ap-countdown > div, .ap-gate__close', inside);

		gsap.set(insideItems, { autoAlpha: 0, y: 14 });
		gsap.set(names, { autoAlpha: 0, scale: 0.9 });

		// Label tamu berayun pelan seperti tergantung (dijeda saat sampul dibuka).
		const swing = reduceMotion ? null : gsap.to(tag, { rotation: 4, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.6, overwrite: false });

		const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
		// Segel ditekan, lalu segel + label jatuh ke bawah, baru pintu terbuka.
		tl.to('.ap-hero__hint', { autoAlpha: 0, duration: 0.3 }, 0)
			.to('[data-chip]', { autoAlpha: 0, scale: 0.9, duration: 0.35, stagger: 0.04, overwrite: false }, 0)
			.to(seal, { scale: 0.9, duration: 0.18, ease: 'power2.out' }, 0)
			.to(seal, { y: 420, rotation: 18, duration: 0.9, ease: 'power2.in' })
			.to(tag, { y: 420, rotation: -10, duration: 0.9, ease: 'power2.in', overwrite: false }, '<0.03')
			.to([seal, tag], { autoAlpha: 0, duration: 0.25 }, '-=0.3')
			.to(doorL, { xPercent: -101, duration: 1.4, ease: 'power3.inOut' }, '-=0.45')
			.to(doorR, { xPercent: 101, duration: 1.4, ease: 'power3.inOut' }, '<')
			.to(names, { autoAlpha: 1, scale: 1, duration: 1, ease: 'expo.out' }, '-=0.9')
			.to(insideItems, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.6, ease: 'power2.out' }, '-=0.8');

		tl.eventCallback('onReverseComplete', () => swing && swing.play());

		$('[data-gate-open]')?.addEventListener('click', () => {
			if (swing) { swing.pause(); gsap.set(tag, { rotation: 0 }); }
			tl.timeScale(1).play();
		});
		$('[data-gate-close]')?.addEventListener('click', () => tl.timeScale(1.6).reverse());
	}

	function initCountdown() {
		const el = document.querySelector('[data-countdown]');
		if (!el) return;
		const target = new Date(el.dataset.countdown).getTime();
		const parts = {
			d: el.querySelector('[data-cd="d"]'),
			h: el.querySelector('[data-cd="h"]'),
			m: el.querySelector('[data-cd="m"]'),
			s: el.querySelector('[data-cd="s"]'),
		};
		const pad = (n) => String(n).padStart(2, '0');
		const tick = () => {
			const diff = Math.max(0, target - Date.now());
			parts.d.textContent = pad(Math.floor(diff / 864e5));
			parts.h.textContent = pad(Math.floor((diff / 36e5) % 24));
			parts.m.textContent = pad(Math.floor((diff / 6e4) % 60));
			parts.s.textContent = pad(Math.floor((diff / 1e3) % 60));
		};
		tick();
		setInterval(tick, 1000);
	}

	/* ------------------------------------------------------------------ */
	/* Marquee (kecepatan ikut kecepatan scroll)                          */
	/* ------------------------------------------------------------------ */
	function initMarquee() {
		const track = $('[data-marquee]');
		if (!track) return;
		const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
		boostWithScroll([loop]);
	}

	function boostWithScroll(tweens) {
		ScrollTrigger.create({
			start: 0,
			end: 'max',
			onUpdate(self) {
				const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 400);
				tweens.forEach((t) => {
					gsap.to(t, { timeScale: boost * Math.sign(t.timeScale() || 1), duration: 0.2, overwrite: true });
					gsap.to(t, { timeScale: Math.sign(t.timeScale() || 1), duration: 1.2, delay: 0.25, ease: 'power2.out' });
				});
			},
		});
	}

	/* ------------------------------------------------------------------ */
	/* Story — teks menyala kata demi kata saat di-scroll                 */
	/* ------------------------------------------------------------------ */
	function initStory() {
		const section = $('[data-story]');
		if (!section) return;
		const lines = $$('[data-story-line]', section);
		let words = [];

		if (hasSplit) {
			lines.forEach((line) => {
				const split = window.SplitText.create(line, { type: 'words', wordsClass: 'ap-word' });
				words = words.concat(split.words);
			});
		} else {
			words = lines;
			gsap.set(lines, { opacity: 0.12 });
		}

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				pin: '.ap-story__pin',
				start: 'top top',
				end: () => '+=' + window.innerHeight * 2,
				scrub: 1,
				anticipatePin: 1,
			},
		});
		tl.to(words, { opacity: 1, stagger: 0.12, ease: 'none', duration: 0.4 }, 0)
			.fromTo('[data-story-progress]', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: tl.duration() || 1 }, 0)
			.from('.ap-story__line.is-answer', { x: 30, ease: 'power2.out', duration: 0.6 }, '>-0.8');
	}

	/* ------------------------------------------------------------------ */
	/* Journey — HP di-pin, adegan berganti per langkah                   */
	/* ------------------------------------------------------------------ */
	function initJourney() {
		const section = $('[data-journey]');
		if (!section) return;

		const captions = $$('[data-journey-caption]', section);
		const screens = $$('[data-journey-screen]', section);
		const dots = $$('[data-journey-dot]', section);
		const controls = $$('[data-journey-control]', section);
		const n = screens.length;
		let current = 0;

		gsap.set(captions, { autoAlpha: 0, y: 30 });
		gsap.set(screens, { autoAlpha: 0 });
		gsap.set([captions[0], screens[0]], { autoAlpha: 1, y: 0 });
		captions.forEach((c) => c.classList.remove('is-active'));
		screens.forEach((s) => s.classList.remove('is-active'));

		const typeField = (row) => {
			const field = row && row.querySelector('.ap-editor__field');
			if (!field) return;
			const node = field.firstChild;
			const full = field.dataset.full || node.textContent;
			field.dataset.full = full;
			const proxy = { n: 0 };
			gsap.to(proxy, {
				n: full.length,
				duration: Math.min(1, full.length * 0.04),
				ease: 'none',
				onUpdate: () => { node.textContent = full.slice(0, Math.round(proxy.n)); },
			});
		};

		const sceneExtras = (screen) => {
			const has = (cls) => screen.classList.contains(cls);
			if (has('ap-screen--cover')) {
				gsap.fromTo($('.ap-mini-gate__seal', screen), { scale: 0.4, rotation: -90 }, { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.2 });
				gsap.fromTo($('.ap-mini-gate__ribbon', screen), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out' });
			}
			if (has('ap-screen--countdown')) {
				gsap.fromTo($$('.ap-screen__cd b', screen), { rotationX: -90, autoAlpha: 0 }, { rotationX: 0, autoAlpha: 1, stagger: 0.08, ease: 'back.out(1.6)', delay: 0.2 });
			}
			if (has('ap-screen--music')) {
				gsap.fromTo($('.ap-screen__disc', screen), { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.2, ease: 'expo.out' });
			}
			if (has('ap-screen--rsvp')) {
				const btn = $('.ap-screen__btn--wa', screen);
				const toast = $('.ap-screen__toast--wa', screen);
				gsap.timeline({ delay: 0.5 })
					.fromTo($$('.ap-screen__input, .ap-screen__stepper', screen), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.5 })
					.to(btn, { scale: 0.94, duration: 0.15, ease: 'power2.in' }, '+=0.2')
					.to(btn, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
					.fromTo(toast, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, ease: 'back.out(2)' }, '-=0.3');
			}
			if (has('ap-screen--comment')) {
				gsap.fromTo($$('[data-dock-item]', screen), { autoAlpha: 0, y: 24, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.18, duration: 0.7, delay: 0.25 });
				gsap.fromTo($$('.ap-dock__body img', screen), { scale: 0, rotation: -25 }, { scale: 1, rotation: 0, stagger: 0.18, duration: 0.8, ease: 'back.out(2.4)', delay: 0.55 });
			}
			if (has('ap-screen--registry')) {
				const gift = $('[data-gift]', screen);
				const stock = $('[data-gift-stock]', screen);
				const btn = $('[data-gift-btn]', screen);
				const toast = $('.ap-screen__toast', screen);
				gift.classList.remove('is-taken');
				stock.textContent = '1 dari 1';
				btn.textContent = 'Pilih Hadiah';
				gsap.timeline({ delay: 0.3 })
					.fromTo($$('.ap-gift', screen), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 })
					.fromTo(toast, { autoAlpha: 0 }, { autoAlpha: 0, duration: 0.01 }, 0)
					.to(btn, { scale: 0.93, duration: 0.15 }, '+=0.35')
					.add(() => { gift.classList.add('is-taken'); stock.textContent = '0 dari 1'; btn.textContent = 'Dipilih'; })
					.to(btn, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
					.fromTo(toast, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, ease: 'back.out(2)' }, '-=0.35');
			}
		};

		const go = (i) => {
			if (i === current) return;
			const dir = i > current ? 1 : -1;
			const prev = current;
			current = i;

			gsap.to(captions[prev], { autoAlpha: 0, y: -24 * dir, duration: 0.5, ease: 'power2.in', overwrite: true });
			gsap.fromTo(captions[i], { autoAlpha: 0, y: 32 * dir }, { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.3, ease: 'expo.out', overwrite: true });

			gsap.to(screens[prev], { autoAlpha: 0, scale: 0.94, filter: 'blur(4px)', duration: 0.5, ease: 'power2.in', overwrite: true });
			gsap.fromTo(screens[i], { autoAlpha: 0, scale: 1.05, filter: 'blur(4px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, delay: 0.2, ease: 'expo.out', overwrite: true });

			dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
			controls.forEach((c, k) => c.classList.toggle('is-active', k === i));
			typeField(controls[i]);
			sceneExtras(screens[i]);

			gsap.fromTo('.ap-phone', { rotationY: -10 * dir }, { rotationY: 0, duration: 1.4, ease: 'elastic.out(1, 0.55)' });
		};

		// Tanpa snap: perpindahan adegan dipicu progres scroll, jadi gerak tetap mengalir.
		ScrollTrigger.create({
			trigger: section,
			pin: '.ap-journey__pin',
			start: 'top top',
			end: () => '+=' + window.innerHeight * 0.75 * n,
			anticipatePin: 1,
			onUpdate: (self) => go(Math.min(n - 1, Math.floor(self.progress * n * 0.999))),
		});
		gsap.fromTo('[data-journey-bar]', { scaleX: 0 }, {
			scaleX: 1,
			ease: 'none',
			scrollTrigger: { trigger: section, start: 'top top', end: () => '+=' + window.innerHeight * 0.75 * n, scrub: 0.5 },
		});

		// Panel editor dan HP masuk dengan kedalaman 3D.
		gsap.from('.ap-editor', { x: -80, rotationY: 25, autoAlpha: 0, transformPerspective: 1200, scrollTrigger: { trigger: section, start: 'top 75%', end: 'top top', scrub: 1 } });
		gsap.from('.ap-phone', { y: 140, rotationX: 22, scrollTrigger: { trigger: section, start: 'top 95%', end: 'top top', scrub: 1 } });

		// Panggung miring halus mengikuti kursor.
		const stage = $('[data-journey-stage]', section);
		if (stage && finePointer) {
			gsap.set(stage, { transformPerspective: 1600 });
			const rx = gsap.quickTo(stage, 'rotationX', { duration: 1, ease: 'power3' });
			const ry = gsap.quickTo(stage, 'rotationY', { duration: 1, ease: 'power3' });
			section.addEventListener('mousemove', (e) => {
				ry((e.clientX / window.innerWidth - 0.5) * 10);
				rx(-(e.clientY / window.innerHeight - 0.5) * 6);
			});
			section.addEventListener('mouseleave', () => { rx(0); ry(0); });
		}
	}

	/* ------------------------------------------------------------------ */
	/* Dashboard 3D — layar miring menjadi datar saat di-scroll           */
	/* ------------------------------------------------------------------ */
	function initDashboard3D() {
		const section = $('[data-dash3d]');
		if (!section) return;
		const screen = $('[data-dash3d-screen]', section);
		const floats = $$('[data-dash-float]', section);

		gsap.fromTo(screen,
			{ rotationX: window.matchMedia('(max-width: 720px)').matches ? 12 : 32, scale: 0.86, y: 60, transformPerspective: 1800 },
			{ rotationX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: section, start: 'top 85%', end: 'center 60%', scrub: 1 } });

		// Di HP kartu notifikasi tersusun di bawah dashboard: cukup muncul perlahan, tanpa gerak paralaks.
		const stacked = window.matchMedia('(max-width: 720px)').matches;
		if (stacked) {
			gsap.from(floats, { autoAlpha: 0, y: 16, stagger: 0.12, duration: 0.6, scrollTrigger: { trigger: floats[0], start: 'top 92%', once: true } });
		}
		(stacked ? [] : floats).forEach((f) => {
			const depth = parseFloat(f.dataset.depth) || 1;
			gsap.fromTo(f, { y: 120 * depth, autoAlpha: 0, rotationX: 30 }, {
				y: -30 * depth,
				autoAlpha: 1,
				rotationX: 0,
				ease: 'none',
				scrollTrigger: { trigger: section, start: 'top 75%', end: 'bottom 40%', scrub: 1.2 },
			});
		});

		// Tab berganti otomatis: Ringkasan → Daftar Hadiah → Order (crossfade murni, tanpa celah kedip).
		const panels = $$('[data-app-panel]', section);
		const tabs = $$('[data-app-tab]', section);
		const navs = $$('[data-app-nav]', section);
		const title = $('[data-app-title]', section);
		const sub = $('[data-app-sub]', section);
		gsap.set(panels, { autoAlpha: 0 });
		gsap.set(panels[0], { autoAlpha: 1 });
		let active = 0;
		let timer = null;
		const drawn = new Set();

		// Sparkline tergambar dan donut terisi sekali saat panel pertama kali tampil.
		const drawPanel = (panel) => {
			if (drawn.has(panel)) return;
			drawn.add(panel);
			if (hasDraw) {
				gsap.fromTo($$('.ap-md__spark-line', panel), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, stagger: 0.12, ease: 'power2.inOut' });
			}
			const donut = $('.ap-md__donut', panel);
			if (donut) {
				const proxy = { p: 0 };
				gsap.to(proxy, { p: 92, duration: 1.6, ease: 'expo.out', onUpdate: () => donut.style.setProperty('--p', proxy.p.toFixed(1)) });
			}
		};
		ScrollTrigger.create({ trigger: section, start: 'top 55%', once: true, onEnter: () => drawPanel(panels[0]) });

		const show = (i) => {
			if (i === active) return;
			const prev = active;
			active = i;
			gsap.to(panels[prev], { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut', overwrite: true });
			gsap.to(panels[i], { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut', overwrite: true });
			drawPanel(panels[i]);
			if (title) title.textContent = panels[i].dataset.title || '';
			if (sub) sub.textContent = panels[i].dataset.sub || '';
			tabs.forEach((t, k) => t.classList.toggle('is-on', k === i));
			navs.forEach((t, k) => t.classList.toggle('is-on', k === i));
		};
		const stop = () => { if (timer) clearInterval(timer); timer = null; };
		const start = () => { stop(); timer = setInterval(() => show((active + 1) % panels.length), 4500); };

		[...tabs, ...navs].forEach((t) => {
			t.style.cursor = 'pointer';
			t.addEventListener('click', () => { show(parseInt(t.dataset.appTab ?? t.dataset.appNav, 10)); start(); });
		});
		ScrollTrigger.create({ trigger: section, start: 'top 60%', end: 'bottom top', onToggle: (self) => (self.isActive ? start() : stop()) });
	}

	/* ------------------------------------------------------------------ */
	/* Judul section — reveal per baris                                   */
	/* ------------------------------------------------------------------ */
	function initSplitTitles() {
		$$('[data-split]').forEach((el) => {
			if (!hasSplit) {
				gsap.from(el, { autoAlpha: 0, y: 40, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
				return;
			}
			window.SplitText.create(el, {
				type: 'lines',
				mask: 'lines',
				linesClass: 'ap-split-line',
				autoSplit: true,
				onSplit: (self) => gsap.from(self.lines, {
					yPercent: 105,
					duration: 1.1,
					stagger: 0.1,
					ease: 'expo.out',
					scrollTrigger: { trigger: el, start: 'top 85%', once: true },
				}),
			});
		});
	}

	function initReveals() {
		gsap.set('[data-reveal]', { autoAlpha: 0, y: 34 });
		ScrollTrigger.batch('[data-reveal]', {
			start: 'top 88%',
			once: true,
			onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.1, overwrite: true }),
		});
	}

	/* ------------------------------------------------------------------ */
	/* Bento                                                              */
	/* ------------------------------------------------------------------ */
	function initBento() {
		gsap.set('[data-card]', { autoAlpha: 0, y: 60 });
		ScrollTrigger.batch('[data-card]', {
			start: 'top 85%',
			once: true,
			onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', overwrite: true }),
		});

		const onView = (el, fn) => ScrollTrigger.create({ trigger: el, start: 'top 75%', once: true, onEnter: fn });
		const draw = (targets, vars = {}) => hasDraw
			? gsap.fromTo(targets, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, ease: 'power2.inOut', stagger: 0.12, ...vars })
			: gsap.from(targets, { autoAlpha: 0, duration: 1 });

		// A: chip -> garis -> node -> teks diketik
		const connect = $('[data-art-connect]');
		if (connect) {
			const pills = $('.ap-pill', connect);
			// Rail widget berjalan terus (loop mulus karena isi diduplikasi 2x).
			const track = $('[data-connect-track]', connect);
			if (track) gsap.to(track, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
			const status = $('[data-typing]', connect);
			const full = status ? status.dataset.typing.replace('&amp;', '&') : '';
			gsap.set(pills, { autoAlpha: 0, y: -12 });
			gsap.set('.ap-node', { scale: 0.6, autoAlpha: 0 });
			onView(connect, () => {
				const tl = gsap.timeline();
				tl.to(pills, { autoAlpha: 1, y: 0, stagger: 0.08, ease: 'back.out(2)' })
					.add(draw($$('path', connect), { duration: 1 }), '-=0.3')
					.to('.ap-node', { scale: 1, autoAlpha: 1, ease: 'back.out(2.2)', duration: 0.7 }, '-=0.3')
					.to({ n: 0 }, {
						n: full.length,
						duration: full.length * 0.035,
						ease: 'none',
						onUpdate() { status.textContent = full.slice(0, Math.round(this.targets()[0].n)); },
					})
					.to('.ap-node', { boxShadow: '0 0 0 16px rgba(8,60,87,0.04), 0 12px 24px -10px rgba(8,60,87,.7)', duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
			});
		}

		// B: dashboard — garis grafik, angka, bar
		const dash = $('.ap-art-dash');
		if (dash) {
			gsap.set($$('[data-bar]', dash), { scaleX: 0 });
			gsap.set($('.ap-dash__area', dash), { autoAlpha: 0 });
			onView(dash, () => {
				draw($$('.ap-dash__line', dash), { duration: 1.8, stagger: 0.25 });
				gsap.to($('.ap-dash__area', dash), { autoAlpha: 1, duration: 1.2, delay: 0.9 });
				gsap.to($$('[data-bar]', dash), { scaleX: 1, duration: 1.2, stagger: 0.15, delay: 0.4, ease: 'expo.out' });
			});
		}

		// C: orbit tamu berputar terus, inisial tetap tegak
		const orbit = $('[data-orbit]');
		if (orbit) {
			const guests = $$('.ap-orbit__guest b', orbit);
			gsap.set(guests, { scale: 0 });
			onView(orbit, () => gsap.to(guests, { scale: 1, stagger: 0.08, ease: 'back.out(2.4)', duration: 0.6 }));
			gsap.to(orbit, { rotation: 360, duration: 48, ease: 'none', repeat: -1 });
			gsap.to(guests, { rotation: -360, duration: 48, ease: 'none', repeat: -1 });
		}

		// D: titik berjalan mengikuti alur RSVP
		const flow = $('.ap-art-flow');
		if (flow) {
			const path = $('#apFlowPath', flow);
			const dot = $('[data-flow-dot]', flow);
			const pills = $$('.ap-pill', flow);
			const len = path.getTotalLength();
			const place = (t) => {
				const p = path.getPointAtLength(t * len);
				dot.setAttribute('cx', p.x);
				dot.setAttribute('cy', p.y);
			};
			place(0);
			gsap.set(pills, { autoAlpha: 0, scale: 0.85 });
			onView(flow, () => {
				gsap.to(pills, { autoAlpha: 1, scale: 1, stagger: 0.15, ease: 'back.out(2)' });
				const proxy = { t: 0 };
				gsap.to(proxy, { t: 1, duration: 4, ease: 'power1.inOut', repeat: -1, repeatDelay: 0.6, onUpdate: () => place(proxy.t) });
			});
		}

		// E: sirkuit tergambar, perisai berdenyut
		const shield = $('.ap-art-shield');
		if (shield) {
			onView(shield, () => {
				draw($$('path', shield), { duration: 1.2 });
				gsap.fromTo('[data-shield]', { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1, ease: 'back.out(1.8)', delay: 0.4 });
				gsap.to('[data-shield]', { y: -8, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.4 });
			});
		}
	}

	function initCounters() {
		$$('[data-count]').forEach((el) => {
			const end = parseFloat(el.dataset.count) || 0;
			const proxy = { v: 0 };
			ScrollTrigger.create({
				trigger: el,
				start: 'top 85%',
				once: true,
				onEnter: () => gsap.to(proxy, {
					v: end,
					duration: 1.8,
					ease: 'power2.out',
					onUpdate: () => { el.textContent = Math.round(proxy.v).toLocaleString('id-ID'); },
				}),
			});
		});
	}

	/* ------------------------------------------------------------------ */
	/* Cara kerja                                                         */
	/* ------------------------------------------------------------------ */
	function initSteps() {
		const section = $('[data-steps]');
		if (!section) return;
		const line = $('[data-steps-line]', section);
		if (line && hasDraw) {
			gsap.fromTo(line, { drawSVG: '0%' }, {
				drawSVG: '100%',
				ease: 'none',
				scrollTrigger: { trigger: section, start: 'top 70%', end: 'center 45%', scrub: 1 },
			});
		}
		// HP: garis penghubung vertikal tergambar mengikuti scroll, lalu titik emas muncul di ujungnya.
		if (hasDraw) {
			$$('.ap-step__link', section).forEach((link) => {
				if (getComputedStyle(link).display === 'none') return;
				const path = $('[data-step-link]', link);
				const dot = $('[data-step-link-dot]', link);
				const tl = gsap.timeline({ scrollTrigger: { trigger: link, start: 'top 88%', end: 'bottom 60%', scrub: 0.6 } });
				tl.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', duration: 1 })
					.fromTo(dot, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, ease: 'back.out(3)', duration: 0.3 });
			});
		}
		gsap.set('[data-step]', { autoAlpha: 0, y: 50 });
		ScrollTrigger.batch('[data-step]', {
			start: 'top 85%',
			once: true,
			onEnter: (batch) => {
				gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.18, overwrite: true });
				gsap.from(batch.map((s) => s.querySelector('.ap-step__art')), { scale: 0.85, rotationX: 25, transformPerspective: 800, stagger: 0.18, ease: 'back.out(1.6)', duration: 0.9 });
			},
		});
		initStepLoops(section);
	}

	/**
	 * Ikon Cara Kerja beranimasi berulang saat terlihat:
	 * steker masuk + tombol menyala, kursor menyeret blok, pesawat kertas terkirim.
	 */
	function initStepLoops(section) {
		const loops = [];
		const plug = $('[data-step-art="0"]', section);
		if (plug) {
			const body = $('[data-plug]', plug);
			const spark = $('[data-spark]', plug);
			const toggle = $('[data-toggle]', plug);
			const knob = $('i', toggle);
			const status = $('[data-status]', plug);
			const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, paused: true });
			tl.set(body, { y: 22 }).set(spark, { autoAlpha: 0 }).set(knob, { x: 0 }).set(status, { autoAlpha: 0, scale: 0.6 })
				.add(() => toggle.classList.remove('is-on'))
				.to(body, { y: 0, duration: 0.8, ease: 'power3.inOut' }, 0.3)
				.fromTo(spark, { autoAlpha: 1, scale: 0.6, transformOrigin: '50% 50%' }, { scale: 1.15, autoAlpha: 0, duration: 0.6, ease: 'power2.out' })
				.to(knob, { x: 13, duration: 0.35, ease: 'back.out(2)' }, '-=0.4')
				.add(() => toggle.classList.add('is-on'), '<')
				.to(status, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, '<0.1')
				.to({}, { duration: 1.6 })
				.to(body, { y: 22, duration: 0.6, ease: 'power2.in' })
				.to(status, { autoAlpha: 0, duration: 0.3 }, '<');
			loops.push([plug, tl]);
		}

		const design = $('[data-step-art="1"]', section);
		if (design) {
			const block = $('[data-block]', design);
			const cursor = $('[data-cursor-art]', design);
			const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true });
			tl.set([block, cursor], { x: 0, y: 0 }).set(block, { backgroundColor: '#083c57', scale: 1 })
				.to(cursor, { x: -14, y: -8, duration: 0.5, ease: 'power2.out' }, 0.2)
				.to(block, { scale: 1.06, duration: 0.15 })
				.to(block, { x: -54, y: -22, duration: 0.9, ease: 'power3.inOut' })
				.to(cursor, { x: -68, y: -30, duration: 0.9, ease: 'power3.inOut' }, '<')
				.to(block, { scale: 1, duration: 0.2 })
				.to(cursor, { x: -4, y: -36, duration: 0.6, ease: 'power2.inOut' })
				.to(block, { backgroundColor: '#c9a46b', duration: 0.4 })
				.to({}, { duration: 1.2 })
				.to([block, cursor], { autoAlpha: 0, duration: 0.25 })
				.set([block, cursor], { x: 0, y: 0 })
				.set(block, { backgroundColor: '#083c57' })
				.to([block, cursor], { autoAlpha: 1, duration: 0.25 });
			loops.push([design, tl]);
		}

		const send = $('[data-step-art="2"]', section);
		if (send) {
			const plane = $('[data-plane]', send);
			const trail = $('[data-trail]', send);
			const sent = $('[data-sent]', send);
			const guests = $$('.ap-send__guests i', send);
			const len = trail.getTotalLength();
			const place = (t) => {
				const p = trail.getPointAtLength(t * len);
				const q = trail.getPointAtLength(Math.min(len, t * len + 1));
				const ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
				plane.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ') rotate(' + ang + ')');
			};
			const proxy = { t: 0 };
			place(0);
			const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true });
			tl.set(proxy, { t: 0 }).set(plane, { autoAlpha: 1 }).set(sent, { autoAlpha: 0, y: 6 })
				.to(proxy, { t: 1, duration: 1.4, ease: 'power2.inOut', onUpdate: () => place(proxy.t) })
				.to(plane, { autoAlpha: 0, duration: 0.2 })
				.to(guests, { scale: 1.25, duration: 0.18, stagger: 0.08, yoyo: true, repeat: 1, ease: 'power2.out' }, '<')
				.to(sent, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }, '<0.1')
				.to({}, { duration: 1.2 })
				.to(sent, { autoAlpha: 0, duration: 0.3 });
			loops.push([send, tl]);
		}

		// Hanya berjalan saat terlihat agar hemat.
		loops.forEach(([el, tl]) => ScrollTrigger.create({ trigger: el, start: 'top 90%', end: 'bottom 10%', onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) }));
	}

	/* ------------------------------------------------------------------ */
	/* Testimoni — dua baris berlawanan arah, melambat saat di-hover      */
	/* ------------------------------------------------------------------ */
	function initTestimonials() {
		const loops = [];
		$$('[data-testi-row]').forEach((row) => {
			const track = $('.ap-testi__track', row);
			const dir = row.dataset.direction === '1' ? 1 : -1;
			const loop = dir < 0
				? gsap.fromTo(track, { xPercent: 0 }, { xPercent: -100 / 3, duration: 55, ease: 'none', repeat: -1 })
				: gsap.fromTo(track, { xPercent: -100 / 3 }, { xPercent: 0, duration: 55, ease: 'none', repeat: -1 });
			loops.push(loop);
			row.addEventListener('mouseenter', () => gsap.to(loop, { timeScale: 0.15, duration: 0.6, overwrite: true }));
			row.addEventListener('mouseleave', () => gsap.to(loop, { timeScale: 1, duration: 0.8, overwrite: true }));
		});
		if (loops.length) boostWithScroll(loops);
	}


	/* ------------------------------------------------------------------ */
	/* Kartu versi plugin berjalan vertikal tanpa henti                   */
	/* ------------------------------------------------------------------ */
	function initTimelineLoop() {
		const view = $('[data-timeline-loop]');
		const track = view && $('[data-timeline-track]', view);
		if (!track) return;
		const loop = gsap.to(track, { yPercent: -50, duration: 28, ease: 'none', repeat: -1, paused: true });
		ScrollTrigger.create({ trigger: view, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? loop.play() : loop.pause()) });
		view.addEventListener('mouseenter', () => gsap.to(loop, { timeScale: 0.15, duration: 0.6, overwrite: true }));
		view.addEventListener('mouseleave', () => gsap.to(loop, { timeScale: 1, duration: 0.8, overwrite: true }));
	}

	/* ------------------------------------------------------------------ */
	/* FAQ — buka/tutup halus                                             */
	/* ------------------------------------------------------------------ */
	function initFaq() {
		$$('.ap-faq__item').forEach((item) => {
			const summary = $('summary', item);
			const body = $('.ap-faq__body', item);
			summary.addEventListener('click', (e) => {
				e.preventDefault();
				if (item.open) {
					gsap.to(body, {
						height: 0,
						duration: reduceMotion ? 0 : 0.45,
						ease: 'power2.inOut',
						onComplete: () => { item.open = false; gsap.set(body, { clearProps: 'height' }); ScrollTrigger.refresh(); },
					});
				} else {
					item.open = true;
					gsap.fromTo(body, { height: 0 }, {
						height: 'auto',
						duration: reduceMotion ? 0 : 0.55,
						ease: 'power2.out',
						onComplete: () => ScrollTrigger.refresh(),
					});
				}
			});
		});
	}

	function initCtaOrnament() {
		const path = $('.ap-cta__ornament path');
		if (!path || !hasDraw) return;
		gsap.fromTo(path, { drawSVG: '50% 50%' }, {
			drawSVG: '0% 100%',
			duration: 1.8,
			ease: 'power2.inOut',
			scrollTrigger: { trigger: '.ap-cta', start: 'top 70%', once: true },
		});
	}

	/* ------------------------------------------------------------------ */
	/* Kursor, magnet, tilt, spotlight (hanya perangkat dengan mouse)     */
	/* ------------------------------------------------------------------ */
	function initCursor() {
		const cursor = $('.ap-cursor');
		const dot = $('.ap-cursor__dot');
		const ring = $('.ap-cursor__ring');
		const label = $('.ap-cursor__label');
		if (!cursor) return;
		root.classList.add('has-cursor');

		const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
		const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
		const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
		const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });

		gsap.set([dot, ring], { autoAlpha: 0 });
		let shown = false;

		window.addEventListener('mousemove', (e) => {
			if (!shown) { gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 }); shown = true; }
			dotX(e.clientX); dotY(e.clientY);
			ringX(e.clientX); ringY(e.clientY);

			const t = e.target instanceof Element ? e.target : null;
			if (!t) return;
			const labelled = t.closest('[data-cursor]');
			const interactive = t.closest('a, button, summary, [data-tilt]');
			cursor.classList.toggle('on-dark', !!t.closest('.ap-hero, .ap-cta, .ap-footer, .is-dark, .is-featured, .ap-screen--music'));
			cursor.classList.toggle('is-label', !!labelled);
			cursor.classList.toggle('is-hover', !labelled && !!interactive);
			if (labelled) label.textContent = labelled.dataset.cursor;
		}, { passive: true });

		document.addEventListener('mouseleave', () => { gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 }); shown = false; });
		window.addEventListener('mousedown', () => cursor.classList.add('is-down'));
		window.addEventListener('mouseup', () => cursor.classList.remove('is-down'));
	}

	function initMagnetic() {
		$$('[data-magnetic]').forEach((el) => {
			const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
			const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
			el.addEventListener('mousemove', (e) => {
				const r = el.getBoundingClientRect();
				xTo((e.clientX - r.left - r.width / 2) * 0.3);
				yTo((e.clientY - r.top - r.height / 2) * 0.4);
			});
			el.addEventListener('mouseleave', () => {
				gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
			});
		});
	}

	function initTilt() {
		// Kartu undangan di hero + chip paralaks.
		const stage = $('[data-tilt-stage]');
		const target = $('[data-tilt-target]');
		const glares = $$('[data-glare]');
		if (stage && target) {
			const rx = gsap.quickTo(target, 'rotationX', { duration: 0.8, ease: 'power3' });
			const ry = gsap.quickTo(target, 'rotationY', { duration: 0.8, ease: 'power3' });
			const chips = $$('[data-chip]', stage).map((chip) => ({
				depth: parseFloat(chip.dataset.depth) || 30,
				x: gsap.quickTo(chip, 'x', { duration: 1, ease: 'power3' }),
			}));
			const hero = $('.ap-hero');
			hero.addEventListener('mousemove', (e) => {
				const r = stage.getBoundingClientRect();
				const px = (e.clientX - r.left) / r.width - 0.5;
				const py = (e.clientY - r.top) / r.height - 0.5;
				ry(px * 10);
				rx(-py * 7);
				glares.forEach((g) => {
					g.style.setProperty('--gx', (px + 0.5) * 100 + '%');
					g.style.setProperty('--gy', (py + 0.5) * 100 + '%');
				});
				chips.forEach((c) => c.x(-px * c.depth));
			});
			hero.addEventListener('mouseleave', () => { rx(0); ry(0); chips.forEach((c) => c.x(0)); });
		}

		// Kartu audiens (lebih kuat), kartu bento & harga (halus).
		$$('[data-tilt], [data-card], [data-spotlight]').forEach((card) => {
			const amount = card.hasAttribute('data-tilt') ? 8 : 4;
			gsap.set(card, { transformPerspective: 1200 });
			const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
			const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
			card.addEventListener('mousemove', (e) => {
				const r = card.getBoundingClientRect();
				ry(((e.clientX - r.left) / r.width - 0.5) * amount);
				rx(-((e.clientY - r.top) / r.height - 0.5) * amount);
			});
			card.addEventListener('mouseleave', () => { rx(0); ry(0); });
		});
	}

	function initSpotlight() {
		$$('[data-card], [data-spotlight]').forEach((el) => {
			el.addEventListener('mousemove', (e) => {
				const r = el.getBoundingClientRect();
				el.style.setProperty('--mx', e.clientX - r.left + 'px');
				el.style.setProperty('--my', e.clientY - r.top + 'px');
			});
		});
	}
}
