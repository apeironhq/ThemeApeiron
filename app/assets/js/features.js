/**
 * Fitur unggulan: garis jalur terisi mengikuti gulir, tiap ilustrasi punya animasi sendiri.
 * Loop hanya berjalan saat ilustrasinya terlihat. Dipanggil setelah initLanding().
 */
export function initFeatures() {
	const section = document.querySelector('[data-feat]');
	const { gsap, ScrollTrigger } = window;
	if (!section || !gsap || !ScrollTrigger) return;

	const $ = (sel, ctx = section) => ctx.querySelector(sel);
	const $$ = (sel, ctx = section) => Array.from(ctx.querySelectorAll(sel));
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const rand = (a, b) => a + Math.random() * (b - a);

	/* Panggung 400×320 diskalakan agar muat di kolomnya. */
	const fits = $$('[data-feat-fit]');
	const fit = () => fits.forEach((f) => f.style.setProperty('--s', String(Math.min(1, f.clientWidth / 400))));
	fit();
	ScrollTrigger.addEventListener('refreshInit', fit);

	/* Pengulang sederhana yang bisa dijeda (untuk animasi berbasis langkah). */
	const every = (fn, sec) => {
		let call = null;
		let running = false;
		const tick = () => { if (!running) return; fn(); call = gsap.delayedCall(sec, tick); };
		return {
			play() { if (running) return; running = true; call = gsap.delayedCall(0.4, tick); },
			pause() { running = false; if (call) call.kill(); },
		};
	};

	/* Garis jalur & nomor tiap fitur. */
	const rail = $('[data-feat-rail]');
	const rows = $$('[data-feat-row]');
	if (reduceMotion) {
		gsap.set(rail, { scaleY: 1 });
		rows.forEach((r) => r.classList.add('is-on'));
	} else {
		gsap.to(rail, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-feat-track]', start: 'top 62%', end: 'bottom 62%', scrub: 0.6 } });
	}

	const arts = {
		/* 1. Ikon widget berhamburan lalu menyatu ke orbit, kemudian berputar. */
		all(stage, row) {
			const icos = $$('[data-orb-ico]', stage);
			const spin = $('[data-orb-spin]', stage);
			const uprights = $$('[data-orb-upright]', stage);
			const label = $('[data-orb-label]', stage);
			if (!reduceMotion) {
				icos.forEach((ico) => {
					gsap.fromTo(ico,
						{ x: rand(-230, 230), y: rand(-170, 170), rotation: rand(-120, 120), scale: 0.4, autoAlpha: 0 },
						{ x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 92%', end: 'center 62%', scrub: 1 } });
				});
				gsap.fromTo($('[data-orb-core]', stage), { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: 'back.out(2)', scrollTrigger: { trigger: row, start: 'top 80%', end: 'center 65%', scrub: 1 } });
			}
			const spinTl = gsap.timeline({ paused: true, repeat: -1 })
				.to(spin, { rotation: 360, duration: 70, ease: 'none' }, 0)
				.to(uprights, { rotation: -360, duration: 70, ease: 'none' }, 0);
			let hot = -1;
			const cycle = every(() => {
				if (hot >= 0) icos[hot].classList.remove('is-hot');
				hot = (hot + 1) % icos.length;
				icos[hot].classList.add('is-hot');
				gsap.fromTo(uprights[hot], { scale: 1.25 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
				label.textContent = icos[hot].dataset.title;
				gsap.fromTo(label, { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' });
			}, 1.5);
			return { play() { spinTl.play(); cycle.play(); }, pause() { spinTl.pause(); cycle.pause(); } };
		},

		/* 2. Ucapan terus mengalir naik; cincin kehadiran terisi sampai 82%. */
		wish(stage, row) {
			const list = $('[data-wish-list]', stage);
			const ring = $('[data-wish-ring]', stage);
			const pct = $('[data-wish-pct]', stage);
			const full = 314.16;
			const target = 0.82;
			const counter = { v: 0 };
			const fill = () => {
				gsap.to(ring, { strokeDashoffset: full * (1 - target), duration: reduceMotion ? 0 : 1.8, ease: 'power3.out' });
				gsap.to(counter, { v: target * 100, duration: reduceMotion ? 0 : 1.8, ease: 'power3.out', onUpdate: () => { pct.textContent = String(Math.round(counter.v)); } });
			};
			ScrollTrigger.create({ trigger: row, start: 'top 70%', once: true, onEnter: fill });
			const flow = every(() => {
				const first = list.firstElementChild;
				const h = first.offsetHeight + 10;
				gsap.to(list, {
					y: -h,
					duration: 0.9,
					ease: 'power2.inOut',
					onComplete: () => {
						list.appendChild(first);
						gsap.set(list, { y: 0 });
						gsap.fromTo(first, { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out' });
						const img = first.querySelector('img');
						if (img) gsap.fromTo(img, { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.6, delay: 0.1, ease: 'back.out(3)' });
					},
				});
			}, 2.2);
			return flow;
		},

		/* 3. Parameter ?to= diketik ulang, label nama berbalik ke tamu berikutnya. */
		guest(stage) {
			const param = $('[data-gtag-param]', stage);
			const card = $('[data-gtag-card]', stage);
			const name = $('[data-gtag-name]', stage);
			const guests = [['Bapak+Andi', 'Bapak Andi Pratama'], ['Ibu+Sari', 'Ibu Sari Wulandari'], ['Sdr.+Dimas', 'Sdr. Dimas Ardian']];
			let k = 0;
			param.textContent = guests[0][0];
			const swing = gsap.fromTo(card, { rotation: -3 }, { rotation: 3, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true });
			const type = (from, to) => {
				const p = { n: from.length };
				return gsap.timeline()
					.to(p, { n: 0, duration: from.length * 0.04, ease: 'none', onUpdate: () => { param.textContent = from.slice(0, Math.round(p.n)); } })
					.to(p, { n: to.length, duration: to.length * 0.07, ease: 'none', onUpdate: () => { param.textContent = to.slice(0, Math.round(p.n)); } }, '+=0.2');
			};
			const next = every(() => {
				const cur = guests[k];
				k = (k + 1) % guests.length;
				const nx = guests[k];
				type(cur[0], nx[0]).then(() => {
					gsap.timeline()
						.to(card, { rotationY: 90, duration: 0.25, ease: 'power2.in' })
						.call(() => { name.textContent = nx[1]; })
						.fromTo(card, { rotationY: -90 }, { rotationY: 0, duration: 0.6, ease: 'back.out(2)' });
				});
			}, 3.6);
			return { play() { swing.play(); next.play(); }, pause() { swing.pause(); next.pause(); } };
		},

		/* 4. Pesawat kertas terbang mengikuti jalur, pesan masuk ke WhatsApp. */
		rsvp(stage) {
			const path = $('[data-rsvp-path]', stage);
			const plane = $('[data-rsvp-plane]', stage);
			const form = $('[data-rsvp-form]', stage);
			const wa = $('[data-rsvp-wa]', stage);
			const ticks = $('[data-rsvp-ticks]', stage);
			const len = path.getTotalLength();
			const place = (t) => {
				const p = path.getPointAtLength(t * len);
				const q = path.getPointAtLength(Math.min(len, t * len + 2));
				const angle = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
				gsap.set(plane, { x: p.x, y: p.y, rotation: angle + 45 });
			};
			place(0);
			const proxy = { t: 0 };
			const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.6 })
				.call(() => { ticks.classList.remove('is-read'); })
				.set(wa, { autoAlpha: 0.25, scale: 0.92, transformOrigin: '100% 100%' })
				.set(proxy, { t: 0 })
				.fromTo(form, { scale: 1 }, { scale: 1.06, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' })
				.fromTo(plane, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, '-=0.1')
				.to(proxy, { t: 1, duration: 1.8, ease: 'power1.inOut', onUpdate: () => place(proxy.t) })
				.to(plane, { autoAlpha: 0, scale: 0.4, duration: 0.25 }, '-=0.15')
				.to(wa, { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'back.out(2)' }, '-=0.1')
				.call(() => { ticks.classList.add('is-read'); }, null, '+=0.5')
				.to({}, { duration: 1.6 });
			if (reduceMotion) { gsap.set(wa, { autoAlpha: 1 }); ticks.classList.add('is-read'); gsap.set(plane, { autoAlpha: 0 }); }
			return tl;
		},

		/* 5. Cincin perisai berputar, nomor versi naik sampai versi terbaru. */
		license(stage) {
			const ring = $('[data-lic-ring]', stage);
			const shield = $('[data-lic-shield]', stage);
			const track = $('[data-lic-track]', stage);
			const badge = $('[data-lic-badge]', stage);
			const ok = $('[data-lic-ok]', stage);
			const steps = track.children.length - 1;
			const spin = gsap.to(ring, { rotation: 360, duration: 26, ease: 'none', repeat: -1, paused: true });
			const float = gsap.to(shield, { y: -8, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true });
			const vers = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.8 })
				.set(track.children, { y: 0 })
				.set(badge, { autoAlpha: 0, scale: 0.6 })
				.fromTo(ok, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
			for (let i = 1; i <= steps; i++) vers.to(track.children, { y: -20 * i, duration: 0.45, ease: 'back.out(1.8)' }, `+=${i === 1 ? 0.3 : 0.55}`);
			vers.to(badge, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(3)' });
			if (reduceMotion) { gsap.set(track.children, { y: -20 * steps }); gsap.set(badge, { autoAlpha: 1, scale: 1 }); }
			return { play() { spin.play(); float.play(); vers.play(); }, pause() { spin.pause(); float.pause(); vers.pause(); } };
		},
	};

	rows.forEach((row, i) => {
		const stage = $('[data-feat-art]', row);
		const art = $('[data-feat-fit]', row);
		const text = $('[data-feat-text]', row);
		const flip = row.classList.contains('is-flip');

		if (!reduceMotion) {
			// Nomor menyala saat garis jalur melewatinya.
			ScrollTrigger.create({ trigger: row, start: 'top 62%', onEnter: () => row.classList.add('is-on'), onLeaveBack: () => row.classList.remove('is-on') });
			gsap.from(text, { x: flip ? -50 : 50, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 78%', once: true } });
			gsap.from($('[data-feat-node]', row), { scale: 0.4, autoAlpha: 0, duration: 0.7, ease: 'back.out(2.5)', scrollTrigger: { trigger: row, start: 'top 78%', once: true } });
			if (stage.dataset.featArt !== 'all') {
				gsap.from(art, { y: 50, scale: 0.92, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 85%', once: true } });
			}
		}

		const loop = arts[stage.dataset.featArt] && arts[stage.dataset.featArt](stage, row);
		if (!loop || reduceMotion) return;
		ScrollTrigger.create({
			trigger: row,
			start: 'top bottom',
			end: 'bottom top',
			onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
		});
	});

	ScrollTrigger.refresh();
}
