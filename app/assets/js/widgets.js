/**
 * Section "13 widget" dalam tampilan editor Elementor:
 * kursor menyeret tile dari panel ke halaman, widget terpilih (garis seleksi + label Edit),
 * lalu memperagakan fungsinya (popup isi data, pesan WhatsApp, balasan mempelai, dst.).
 * Dipanggil setelah initLanding() (GSAP + plugin sudah terdaftar di window).
 */
export function initWidgetPanel() {
	const section = document.querySelector('[data-wlib]');
	const { gsap, ScrollTrigger } = window;
	if (!section || !gsap || !ScrollTrigger) return;

	const $ = (sel, ctx = section) => ctx.querySelector(sel);
	const $$ = (sel, ctx = section) => Array.from(ctx.querySelectorAll(sel));
	const inner = $('[data-wlib-inner]');
	const tiles = $$('[data-wlib-tile]');
	const infos = $$('[data-wlib-info]');
	const demoWraps = $$('[data-wlib-demo]');
	const panel = $('[data-wlib-panel]');
	const canvas = $('[data-wlib-canvas]');
	const slot = $('[data-wlib-slot]');
	const editTab = $('[data-wlib-edit]');
	const editName = $('[data-wlib-edit-name]');
	const tapRing = $('[data-wlib-tap]');
	const cursor = $('[data-wlib-cursor]');
	const ghost = $('[data-wlib-ghost]');
	const progress = $('[data-wlib-progress]');
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const wide = window.matchMedia('(min-width: 981px)');
	const hasDraw = !!window.DrawSVGPlugin;

	/* ------------------------------------------------------------------ */
	/* Gerakan khas tiap ikon (tile & keterangan)                          */
	/* ------------------------------------------------------------------ */
	const q = (svg, sel) => svg.querySelectorAll(sel);
	const draw = (els, duration, stagger) => (!els.length ? gsap.timeline() : hasDraw
		? gsap.fromTo(els, { drawSVG: '0%' }, { drawSVG: '100%', duration, stagger, ease: 'power2.out' })
		: gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration, stagger }));
	const iconMotions = {
		countdown: (s) => gsap.fromTo(q(s, '.wi-hand'), { rotation: 0 }, { rotation: 360, svgOrigin: '12 14', duration: 1.1, ease: 'power2.inOut' }),
		audio: (s) => gsap.fromTo(q(s, '.wi-play'), { scale: 0.6, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(3)' }),
		form: (s) => draw(q(s, '.wi-line'), 0.35, 0.15),
		order: (s) => gsap.fromTo(q(s, '.wi-btn'), { scale: 0.7, transformOrigin: '0% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }),
		copy: (s) => gsap.timeline().to(q(s, '.wi-front'), { x: -4, y: -4, duration: 0.3 }).to(q(s, '.wi-front'), { x: 0, y: 0, duration: 0.5, ease: 'back.out(3)' }),
		comment: (s) => gsap.fromTo(q(s, '.wi-bubble'), { rotation: -8, svgOrigin: '3 21' }, { rotation: 0, svgOrigin: '3 21', duration: 0.7, ease: 'elastic.out(1, 0.45)' }),
		manager: (s) => gsap.fromTo(q(s, '.wi-p2'), { x: 4, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }),
		scroll: (s) => gsap.fromTo(q(s, '.wi-wheel'), { y: -1 }, { y: 4, opacity: 0, duration: 0.55, repeat: 2, ease: 'power1.in' }),
		activity: (s) => gsap.fromTo(q(s, '.wi-bell'), { rotation: -16, svgOrigin: '12 3' }, { rotation: 0, svgOrigin: '12 3', duration: 0.9, ease: 'elastic.out(1.2, 0.3)' }),
		loader: (s) => gsap.fromTo(q(s, '.wi-arc'), { rotation: 0 }, { rotation: 360, svgOrigin: '12 12', duration: 0.9, ease: 'power2.inOut' }),
		cover: (s) => gsap.fromTo(q(s, '.wi-seal'), { scale: 0.3, rotation: -90, svgOrigin: '12 12' }, { scale: 1, rotation: 0, svgOrigin: '12 12', duration: 0.7, ease: 'back.out(2.6)' }),
		story: (s) => draw(q(s, '.wi-branch'), 0.6, 0),
		registry: (s) => gsap.fromTo(q(s, '.wi-box'), { scale: 0.5, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.09, ease: 'back.out(2.5)' }),
	};
	const playIcon = (wrap) => {
		const svg = wrap && wrap.querySelector('svg');
		const fn = svg && iconMotions[wrap.dataset.key];
		if (fn && !reduceMotion) fn(svg);
	};

	/* ------------------------------------------------------------------ */
	/* Alat bantu peragaan                                                 */
	/* ------------------------------------------------------------------ */
	// "Ketukan jari" di atas elemen yang ditekan.
	const tap = (el) => {
		const sr = slot.getBoundingClientRect();
		const r = el.getBoundingClientRect();
		return gsap.timeline()
			.set(tapRing, { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 })
			.fromTo(tapRing, { scale: 0.3, autoAlpha: 0.75 }, { scale: 1.6, autoAlpha: 0, duration: 0.55, ease: 'power2.out' })
			.to(el, { scale: 0.93, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.out' }, 0);
	};
	// Mengetik isi data-text ke elemen; kolomnya menampilkan kursor ketik.
	const typeIn = (el, speed = 0.055) => {
		const text = el.dataset.text || '';
		const field = el.closest('.wd-input');
		const p = { n: 0 };
		el.textContent = '';
		return gsap.to(p, {
			n: text.length,
			duration: text.length * speed,
			ease: 'none',
			onStart: () => field && field.classList.add('is-typing'),
			onUpdate: () => { el.textContent = text.slice(0, Math.round(p.n)); },
			onComplete: () => field && field.classList.remove('is-typing'),
		});
	};
	const toastIn = (el) => gsap.fromTo(el, { xPercent: -50, x: 0, y: 18, autoAlpha: 0 }, { xPercent: -50, y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' });
	const hold = (d) => gsap.to({}, { duration: d });
	const clearTyped = (r) => $$('[data-text]', r).forEach((el) => { el.textContent = ''; });

	/* ------------------------------------------------------------------ */
	/* Peragaan tiap widget                                                */
	/* ------------------------------------------------------------------ */
	const demos = {
		countdown(r) {
			const s = $('[data-cd="s"]', r);
			let v = 16;
			const tl = gsap.timeline().from($$('.wd-cd > div', r), { y: 22, autoAlpha: 0, stagger: 0.08, duration: 0.5, ease: 'back.out(2)' });
			for (let i = 0; i < 6; i++) {
				tl.call(() => {
					v -= 1;
					s.textContent = String(v).padStart(2, '0');
					gsap.fromTo(s, { yPercent: -60, rotationX: -80, autoAlpha: 0 }, { yPercent: 0, rotationX: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(2)' });
				}, null, `+=${i ? 0.75 : 0.4}`);
			}
			return tl.add(hold(0.4));
		},

		audio(r) {
			const player = $('[data-player]', r);
			const bars = $$('.wd-wave i', r);
			return gsap.timeline()
				.from(player, { y: 24, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.6)' })
				.add(tap($('[data-play]', r)), '+=0.3')
				.call(() => player.classList.add('is-playing'))
				.to($('[data-disc]', r), { rotation: 720, duration: 3.6, ease: 'none' })
				.to(bars, { scaleY: () => gsap.utils.random(0.25, 1), duration: 0.22, repeat: 15, yoyo: true, repeatRefresh: true, stagger: { each: 0.02 }, transformOrigin: '50% 100%', ease: 'sine.inOut' }, '<');
		},

		// Isi form, kirim, lalu layar berpindah ke chat WhatsApp mempelai.
		form(r) {
			clearTyped(r);
			const qty = $('[data-qty]', r);
			const chat = $('[data-chat]', r);
			const ticks = $('[data-ticks]', r);
			return gsap.timeline()
				.add(typeIn($('[data-type-name]', r), 0.07), 0.3)
				.add(tap($('[data-qtybtn]', r)), '+=0.25')
				.call(() => { qty.textContent = '2'; gsap.fromTo(qty, { y: -10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)' }); })
				.add(typeIn($('[data-type-msg]', r), 0.04), '+=0.2')
				.add(tap($('[data-send]', r)), '+=0.35')
				.fromTo(chat, { xPercent: 100, autoAlpha: 1 }, { xPercent: 0, duration: 0.6, ease: 'expo.inOut' }, '+=0.15')
				.from($('[data-bubble]', r), { y: 30, scale: 0.8, autoAlpha: 0, transformOrigin: '100% 100%', duration: 0.5, ease: 'back.out(2)' }, '-=0.1')
				.call(() => ticks.classList.add('is-read'), null, '+=0.7')
				.add(hold(1.2));
		},

		// Isi tiap langkah, pilih paket, kirim pesanan ke MDUNDIG.
		order(r) {
			clearTyped(r);
			const steps = $$('[data-st]', r);
			const bars = $$('[data-bar]', r);
			const panes = $$('[data-pane]', r);
			const btn = $('[data-next]', r);
			const go = (k) => gsap.timeline()
				.add(tap(btn))
				.to(bars[k - 1], { scaleX: 1, duration: 0.5, ease: 'expo.inOut' }, '+=0.05')
				.call(() => {
					steps[k].classList.add('is-on');
					panes[k - 1].classList.remove('is-on');
					gsap.set(panes[k - 1], { autoAlpha: 0 });
					panes[k].classList.add('is-on');
					if (k === 2) btn.textContent = 'Kirim pesanan';
				})
				.fromTo(panes[k], { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out' });
			return gsap.timeline()
				.add(typeIn($('[data-type-a]', r)), 0.3)
				.add(typeIn($('[data-type-b]', r)), '+=0.1')
				.add(go(1), '+=0.3')
				.add(typeIn($('[data-type-c]', r), 0.045))
				.add(typeIn($('[data-type-d]', r), 0.04), '+=0.1')
				.add(go(2), '+=0.3')
				.add(tap($('[data-plan]', r)), '+=0.2')
				.call(() => $('[data-plan]', r).classList.add('is-on'))
				.add(tap(btn), '+=0.4')
				.call(() => { btn.classList.add('is-loading'); btn.innerHTML = '<span class="wd-dots"><i></i><i></i><i></i></span>'; })
				.call(() => { btn.classList.remove('is-loading'); btn.textContent = 'Terkirim'; }, null, '+=1')
				.add(toastIn($('[data-toast]', r)))
				.add(hold(1.2));
		},

		copy(r) {
			const btn = $('[data-copy]', r);
			return gsap.timeline()
				.from($('.wd-bank', r), { y: 20, rotation: -3, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.8)' })
				.add(tap(btn), '+=0.5')
				.call(() => btn.classList.add('is-done'))
				.to($('.wd-copy__a', r), { yPercent: -130, duration: 0.4, ease: 'expo.out' })
				.fromTo($('.wd-copy__b', r), { y: 0, yPercent: 130 }, { y: 0, yPercent: 0, duration: 0.4, ease: 'expo.out' }, '<')
				.fromTo($('[data-num]', r), { letterSpacing: '.3em', opacity: 0.4 }, { letterSpacing: '.08em', opacity: 1, duration: 0.6, ease: 'expo.out' }, '<')
				.add(toastIn($('[data-toast]', r)), '-=0.2')
				.add(hold(1.4));
		},

		// Tamu mengisi form & stiker, ucapan masuk ke daftar, lalu mempelai membalas.
		comment(r) {
			clearTyped(r);
			const form = $('[data-wishform]', r);
			const c1 = $('[data-c1]', r);
			const c2 = $('[data-c2]', r);
			const count = $('[data-count]', r);
			gsap.set([c1, c2], { autoAlpha: 0 });
			return gsap.timeline()
				.add(typeIn($('[data-type-n]', r), 0.08), 0.3)
				.add(typeIn($('[data-type-m]', r), 0.03), '+=0.1')
				.add(tap($('[data-stk]', r)), '+=0.2')
				.call(() => $('[data-stk]', r).classList.add('is-on'))
				.add(tap($('[data-post]', r)), '+=0.3')
				.to(form, { height: 0, paddingTop: 0, paddingBottom: 0, borderWidth: 0, autoAlpha: 0, duration: 0.45, ease: 'power3.inOut' }, '+=0.1')
				.fromTo(c1, { y: -16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.6)' }, '-=0.15')
				.call(() => { count.textContent = '248'; gsap.fromTo(count, { scale: 1.5 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' }); })
				.from($('[data-sticker]', r), { scale: 0, rotation: -30, duration: 0.6, ease: 'back.out(3)' }, '-=0.3')
				.add(tap($('[data-replybtn]', r)), '+=0.5')
				.fromTo(c2, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.6)' }, '+=0.1')
				.add(typeIn($('[data-type-r]', r), 0.05))
				.add(hold(1.2));
		},

		manager(r) {
			clearTyped(r);
			const name = $('[data-name]', r);
			const tag = $('[data-tag]', r);
			return gsap.timeline()
				.from($$('[data-guests] > *', r), { x: -20, autoAlpha: 0, stagger: 0.1, duration: 0.45, ease: 'power3.out' })
				.add(tap($('[data-mklink]', r)), '+=0.3')
				.add(typeIn($('[data-type-u]', r), 0.08), '+=0.15')
				.to(tag, { rotationY: 90, duration: 0.25, ease: 'power2.in' }, '+=0.2')
				.call(() => { name.textContent = 'Bapak Andi Pratama'; })
				.fromTo(tag, { rotationY: -90 }, { rotationY: 0, duration: 0.6, ease: 'back.out(2)' })
				.to(tag, { rotation: 3, duration: 0.6, yoyo: true, repeat: 3, ease: 'sine.inOut' })
				.add(hold(0.4));
		},

		scroll(r) {
			const track = $('[data-track]', r);
			const speed = $('[data-speed]', r);
			const v = $('[data-speed-v]', r);
			return gsap.timeline()
				.to(track, { y: -150, duration: 2, ease: 'none' }, 0.3)
				.add(tap(speed))
				.call(() => { v.textContent = '2×'; })
				.to(track, { y: -560, duration: 2, ease: 'none' })
				.add(hold(0.4));
		},

		activity(r) {
			const pop = $('[data-pop]', r);
			const set = (a, n, t) => { $('[data-pop-ava]', r).textContent = a; $('[data-pop-name]', r).textContent = n; $('[data-pop-text]', r).textContent = t; };
			const show = () => gsap.fromTo(pop, { x: -50, y: 0, autoAlpha: 0, scale: 0.92 }, { x: 0, autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });
			const hide = () => gsap.to(pop, { y: 20, autoAlpha: 0, duration: 0.35, ease: 'power2.in' });
			return gsap.timeline()
				.add(show(), 0.4)
				.add(hide(), '+=1.5')
				.call(() => set('S', 'Sari dari Surabaya', 'mengirim konfirmasi kehadiran'))
				.add(show(), '+=0.3')
				.add(hide(), '+=1.5')
				.call(() => set('R', 'Rizky dari Jakarta', 'memilih hadiah Rice Cooker'))
				.add(show(), '+=0.3')
				.add(hold(1.2));
		},

		loader(r) {
			const pct = $('[data-pct]', r);
			const p = { v: 0 };
			return gsap.timeline()
				.set($('[data-ring]', r), { strokeDashoffset: 314.16 })
				.to($('[data-ring]', r), { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0.2)
				.to(p, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => { pct.textContent = String(Math.round(p.v)); } }, 0.2)
				.to($('[data-loader]', r), { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, '+=0.2')
				.from($$('[data-page] > *', r), { y: 20, autoAlpha: 0, stagger: 0.1, duration: 0.7, ease: 'expo.out' }, '-=0.35')
				.add(hold(1));
		},

		cover(r) {
			const doors = $$('[data-door]', r);
			return gsap.timeline()
				.set($('[data-ctag]', r), { animation: 'none' })
				.add(tap($('[data-seal]', r)), 0.6)
				.to($('[data-seal]', r), { y: 170, rotation: 40, autoAlpha: 0, scale: 0.7, duration: 0.6, ease: 'power3.in' })
				.to($('[data-ctag]', r), { y: 230, rotation: -30, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, '<0.05')
				.to(doors[0], { xPercent: -102, duration: 1, ease: 'expo.inOut' }, '-=0.25')
				.to(doors[1], { xPercent: 102, duration: 1, ease: 'expo.inOut' }, '<')
				.from($('[data-inside]', r), { scale: 0.85, autoAlpha: 0, duration: 0.8, ease: 'expo.out' }, '-=0.5')
				.add(hold(1));
		},

		story(r) {
			const items = $$('[data-item]', r);
			return gsap.timeline()
				.fromTo($('[data-line]', r), { scaleY: 0 }, { scaleY: 1, duration: 2, ease: 'power1.inOut' }, 0.2)
				.from(items, { x: 24, autoAlpha: 0, duration: 0.6, stagger: 0.6, ease: 'expo.out' }, 0.3)
				.from($$('.wd-tl__dot', r), { scale: 0, duration: 0.5, stagger: 0.6, ease: 'back.out(3)' }, 0.35)
				.add(hold(1));
		},

		// Pilih hadiah -> popup isi data -> konfirmasi -> berhasil -> tercatat di MDUNDIG.
		registry(r) {
			clearTyped(r);
			const gift = $('[data-gift]', r);
			const btn = $('[data-pick]', r);
			const modal = $('[data-modal]', r);
			const sheet = $('[data-sheet]', r);
			const done = $('[data-done]', r);
			return gsap.timeline()
				.from($$('.wd-gift', r), { y: 22, autoAlpha: 0, stagger: 0.1, duration: 0.5, ease: 'back.out(1.6)' }, 0.2)
				.add(tap(btn), '+=0.4')
				.fromTo(modal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, '+=0.1')
				.fromTo(sheet, { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: 'expo.out' }, '<')
				.add(typeIn($('[data-type-g1]', r), 0.06), '+=0.2')
				.add(typeIn($('[data-type-g2]', r), 0.05), '+=0.15')
				.add(tap($('[data-confirm]', r)), '+=0.3')
				.fromTo(done, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, '+=0.1')
				.from($('.wd-check', done), { scale: 0, rotation: -90, duration: 0.6, ease: 'back.out(2.6)' }, '<')
				.to(sheet, { yPercent: 100, duration: 0.45, ease: 'power3.in' }, '+=1')
				.to(modal, { autoAlpha: 0, duration: 0.3 }, '-=0.2')
				.call(() => { gift.classList.add('is-taken'); btn.textContent = 'Dipesan'; $('[data-stock]', r).textContent = '0 dari 1'; })
				.fromTo($('.wd-gift__img', gift), { scale: 0.85, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
				.add(toastIn($('[data-toast]', r)), '-=0.5')
				.add(hold(1.4));
		},
	};

	// Simpan markup awal tiap peragaan agar bisa diulang dari awal.
	const original = demoWraps.map((w) => w.innerHTML);
	let demoTl = null;
	const playDemo = (i) => {
		if (demoTl) demoTl.kill();
		demoWraps[i].innerHTML = original[i];
		const fn = demos[demoWraps[i].dataset.key];
		demoTl = fn && !reduceMotion ? fn(demoWraps[i].firstElementChild) : null;
		return demoTl;
	};

	/* ------------------------------------------------------------------ */
	/* Mengaktifkan satu widget: seleksi ala Elementor + peragaan          */
	/* ------------------------------------------------------------------ */
	let current = 0;
	let selectCall = null;
	const select = (i) => {
		editName.textContent = 'Edit ' + infos[i].querySelector('h3').firstChild.textContent.trim();
		slot.classList.add('is-selected');
		gsap.fromTo(editTab, { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out', overwrite: true });
		if (selectCall) selectCall.kill();
		selectCall = gsap.delayedCall(1.6, () => {
			slot.classList.remove('is-selected');
			gsap.to(editTab, { autoAlpha: 0, duration: 0.4, overwrite: true });
		});
	};
	const activate = (i) => {
		const prev = current;
		current = i;
		tiles.forEach((t, k) => t.classList.toggle('is-active', k === i));
		if (prev !== i) {
			[infos[prev], demoWraps[prev]].forEach((el) => {
				el.classList.remove('is-active');
				gsap.to(el, { autoAlpha: 0, duration: 0.25, overwrite: true });
			});
		}
		infos[i].classList.add('is-active');
		demoWraps[i].classList.add('is-active');
		gsap.fromTo(infos[i], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out', overwrite: true });
		gsap.fromTo(demoWraps[i], { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)', overwrite: true });
		gsap.fromTo(tiles[i], { scale: 0.94 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
		playIcon(tiles[i].querySelector('[data-wlib-icon]'));
		playIcon(infos[i].querySelector('[data-wlib-icon]'));
		if (!reduceMotion) select(i);
		return playDemo(i);
	};
	gsap.set([...infos, ...demoWraps], { autoAlpha: 0 });
	gsap.set([infos[0], demoWraps[0]], { autoAlpha: 1 });

	/* ------------------------------------------------------------------ */
	/* Tur otomatis: kursor ambil tile, seret ke halaman, lepas, peragakan */
	/* ------------------------------------------------------------------ */
	const rel = (el) => {
		const ir = inner.getBoundingClientRect();
		const r = el.getBoundingClientRect();
		return { x: r.left - ir.left, y: r.top - ir.top, w: r.width, h: r.height };
	};
	let stepTl = null;
	let waitCall = null;
	let running = false;
	let revealed = false;
	let resumeTimer = null;
	let touched = false; // pengunjung sudah memilih widget sendiri

	const afterDemo = (tl) => {
		const d = (tl ? tl.duration() : 2) + 1.2;
		gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: d, ease: 'none', overwrite: true });
		waitCall = gsap.delayedCall(d, () => runStep((current + 1) % tiles.length));
	};
	const runStep = (i) => {
		if (!running) return;
		const t = rel(tiles[i]);
		const tl = gsap.timeline();
		stepTl = tl;
		tl.to(cursor, { x: t.x + t.w * 0.6, y: t.y + t.h * 0.55, autoAlpha: 1, duration: 0.75, ease: 'power3.inOut' })
			.to(cursor, { scale: 0.8, duration: 0.12 })
			.call(() => tiles[i].classList.add('is-grab'));
		if (wide.matches) {
			const s = rel(slot);
			const dx = s.x + s.w / 2 - t.w / 2;
			const dy = s.y + s.h * 0.42 - t.h / 2;
			tl.call(() => { ghost.innerHTML = tiles[i].innerHTML; canvas.classList.add('is-drop'); })
				.set(ghost, { x: t.x, y: t.y, width: t.w, height: t.h, autoAlpha: 1, scale: 1, rotation: 0 })
				.to(ghost, { x: dx, y: dy, rotation: -5, scale: 1.08, duration: 1, ease: 'power2.inOut' })
				.to(cursor, { x: dx + t.w * 0.6, y: dy + t.h * 0.55, duration: 1, ease: 'power2.inOut' }, '<')
				.to(ghost, { scale: 0.3, autoAlpha: 0, rotation: 0, duration: 0.3, ease: 'power2.in' })
				.to(cursor, { scale: 1, autoAlpha: 0, duration: 0.25 }, '<')
				.call(() => canvas.classList.remove('is-drop'));
		} else {
			tl.to(cursor, { scale: 1, duration: 0.15 });
		}
		tl.call(() => {
			tiles[i].classList.remove('is-grab');
			afterDemo(activate(i));
		});
	};
	const stopTour = () => {
		running = false;
		if (stepTl) stepTl.kill();
		if (waitCall) waitCall.kill();
		clearTimeout(resumeTimer);
		tiles.forEach((t) => t.classList.remove('is-grab'));
		canvas.classList.remove('is-drop');
		gsap.to([cursor, ghost], { autoAlpha: 0, duration: 0.25 });
		gsap.to(progress, { scaleX: 0, duration: 0.3, overwrite: true });
	};
	const startTour = (from) => {
		if (running || reduceMotion || !revealed) return;
		running = true;
		runStep(from ?? (current + 1) % tiles.length);
	};

	tiles.forEach((t, i) => {
		const take = () => { touched = true; stopTour(); if (i !== current) activate(i); };
		t.addEventListener('mouseenter', take);
		t.addEventListener('focus', take);
		t.addEventListener('click', () => { touched = true; stopTour(); activate(i); });
	});
	panel.addEventListener('mouseleave', () => {
		clearTimeout(resumeTimer);
		resumeTimer = setTimeout(() => startTour(), 4000);
	});

	/* Masuk layar: tile muncul berurutan, ikon tergambar, lalu tur dimulai. */
	if (reduceMotion) return;
	gsap.set(tiles, { autoAlpha: 0, y: 18 });
	ScrollTrigger.create({
		trigger: panel,
		start: 'top 80%',
		once: true,
		onEnter: () => {
			gsap.to(tiles, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.045, ease: 'back.out(1.6)' });
			const strokes = tiles.flatMap((t) => Array.from(t.querySelectorAll('svg path, svg line, svg rect, svg circle, svg polygon')));
			if (hasDraw) gsap.fromTo(strokes, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, stagger: 0.008, ease: 'power2.out', delay: 0.15 });
			gsap.delayedCall(1.1, () => {
				revealed = true;
				if (touched) return; // jangan timpa widget yang sudah dipilih pengunjung
				running = true;
				afterDemo(activate(0));
			});
		},
	});
	// Tur hanya berjalan saat section terlihat.
	ScrollTrigger.create({
		trigger: section,
		start: 'top bottom',
		end: 'bottom top',
		onToggle: (self) => { if (!self.isActive) stopTour(); else startTour(current); },
	});
}
