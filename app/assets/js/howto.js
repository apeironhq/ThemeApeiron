/**
 * Cara kerja: tiga langkah diputar berurutan. Garis progres terisi ke langkah aktif,
 * kartu aktif memperagakan langkahnya, langkah selesai berubah jadi tanda centang.
 * Berjalan hanya saat section terlihat. Dipanggil setelah initLanding().
 */
export function initHowTo() {
	const section = document.querySelector('[data-howto]');
	const { gsap, ScrollTrigger } = window;
	if (!section || !gsap || !ScrollTrigger) return;

	const $ = (sel, ctx = section) => ctx.querySelector(sel);
	const $$ = (sel, ctx = section) => Array.from(ctx.querySelectorAll(sel));
	const steps = $$('[data-how-step]');
	const arts = $$('[data-how-art]');
	const line = $('[data-how-line]');
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const vertical = window.matchMedia('(max-width: 900px)');

	const setLine = (k, duration) => {
		const p = k / (steps.length - 1);
		gsap.to(line, vertical.matches ? { scaleY: p, scaleX: 1, duration, ease: 'power2.inOut', overwrite: true } : { scaleX: p, scaleY: 1, duration, ease: 'power2.inOut', overwrite: true });
	};
	vertical.addEventListener('change', () => { gsap.set(line, { clearProps: 'transform' }); setLine(current, 0); });

	const press = (el) => gsap.to(el, { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.out' });
	const typeIn = (el, speed) => {
		const text = el.dataset.text || '';
		const p = { n: 0 };
		el.textContent = '';
		return gsap.to(p, { n: text.length, duration: text.length * speed, ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(p.n)); } });
	};
	const morph = (btn) => gsap.timeline()
		.call(() => btn.classList.add('is-done'))
		.to(btn.children[0], { yPercent: -130, duration: 0.35, ease: 'expo.out' })
		.fromTo(btn.children[1], { y: 0, yPercent: 130 }, { y: 0, yPercent: 0, duration: 0.35, ease: 'expo.out' }, '<');

	const builders = {
		// Aktifkan plugin -> isi lisensi -> widget siap.
		install(art) {
			const btn = $('[data-activate]', art);
			const lic = $('[data-lic]', art);
			const ok = $('[data-ok]', art);
			const ready = $('[data-ready]', art);
			gsap.set([lic, ready], { autoAlpha: 0, y: 10 });
			gsap.set(ok, { scale: 0 });
			gsap.set(btn.children[1], { y: 0, yPercent: 130 });
			return gsap.timeline()
				.from($('.hw-wp__row', art), { y: 14, autoAlpha: 0, duration: 0.45, ease: 'power3.out' })
				.add(press(btn), '+=0.4')
				.add(morph(btn))
				.to(lic, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '+=0.2')
				.add(typeIn($('[data-key]', art), 0.06))
				.to(ok, { scale: 1, duration: 0.45, ease: 'back.out(3)' })
				.to(ready, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, '+=0.2')
				.to({}, { duration: 1.2 });
		},

		// Seret widget Hitung Mundur ke halaman, lalu ganti warna lewat palet.
		design(art) {
			const tile = $('[data-tile="countdown"]', art);
			const slot = $('[data-slot]', art);
			const placed = $('[data-placed]', art);
			const head = $('[data-head]', art);
			const ghost = $('[data-ghost]', art);
			const cursor = $('[data-cursor]', art);
			const sws = $$('[data-sw]', art);
			const rel = (el) => {
				const a = art.getBoundingClientRect();
				const r = el.getBoundingClientRect();
				return { x: r.left - a.left, y: r.top - a.top, w: r.width, h: r.height };
			};
			const t = rel(tile);
			const s = rel(slot);
			const colorTo = (sw) => gsap.timeline()
				.to(cursor, { x: rel(sw).x + 6, y: rel(sw).y + 6, duration: 0.55, ease: 'power3.inOut' })
				.add(press(cursor))
				.call(() => {
					sws.forEach((x) => x.classList.toggle('is-on', x === sw));
					head.style.color = sw.dataset.sw;
					$$('b', placed).forEach((b) => { b.style.color = sw.dataset.sw; });
				});
			ghost.innerHTML = tile.innerHTML;
			gsap.set(placed, { autoAlpha: 0, scale: 0.85 });
			gsap.set(cursor, { x: s.x + s.w, y: s.y + s.h + 40, autoAlpha: 0 });
			return gsap.timeline()
				.to(cursor, { x: t.x + t.w * 0.6, y: t.y + t.h * 0.6, autoAlpha: 1, duration: 0.7, ease: 'power3.inOut' }, 0.3)
				.add(press(cursor))
				.call(() => { tile.classList.add('is-grab'); slot.classList.add('is-drop'); })
				.set(ghost, { x: t.x, y: t.y, autoAlpha: 1, scale: 1 })
				.to(ghost, { x: s.x + s.w / 2 - 17, y: s.y + s.h / 2 - 13, rotation: -6, duration: 0.8, ease: 'power2.inOut' })
				.to(cursor, { x: s.x + s.w / 2 + 4, y: s.y + s.h / 2 + 2, duration: 0.8, ease: 'power2.inOut' }, '<')
				.to(ghost, { scale: 0.4, autoAlpha: 0, rotation: 0, duration: 0.25 })
				.call(() => { tile.classList.remove('is-grab'); slot.classList.remove('is-drop'); })
				.to(placed, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' })
				.from($$('b', placed), { y: 10, autoAlpha: 0, stagger: 0.07, duration: 0.35, ease: 'back.out(2)' }, '<0.1')
				.add(colorTo(sws[1]), '+=0.3')
				.add(colorTo(sws[2]), '+=0.5')
				.to(cursor, { autoAlpha: 0, duration: 0.3 }, '+=0.6')
				.to({}, { duration: 0.6 });
		},

		// Kirim link personal ke tiap tamu lewat WhatsApp, RSVP mulai masuk.
		share(art) {
			const rows = $$('[data-guest]', art);
			const rsvp = $('[data-rsvp]', art);
			const tl = gsap.timeline()
				.from(rows, { x: -16, autoAlpha: 0, stagger: 0.1, duration: 0.4, ease: 'power3.out' });
			rows.forEach((row, i) => {
				const btn = $('[data-send]', row);
				gsap.set(btn.children[1], { y: 0, yPercent: 130 });
				tl.add(press(btn), i ? '+=0.25' : '+=0.4')
					.add(morph(btn))
					.call(() => {
						const a = art.getBoundingClientRect();
						const r = btn.getBoundingClientRect();
						const plane = document.createElement('span');
						plane.className = 'hw-plane';
						plane.innerHTML = btn.querySelector('svg').outerHTML;
						art.appendChild(plane);
						gsap.fromTo(plane,
							{ x: r.left - a.left + r.width / 2 - 11, y: r.top - a.top, scale: 0.6, autoAlpha: 1 },
							{ x: a.width - 10, y: r.top - a.top - 40, scale: 1, autoAlpha: 0, duration: 0.8, ease: 'power2.in', onComplete: () => plane.remove() });
						rsvp.textContent = String(i + 1);
						gsap.fromTo(rsvp, { scale: 1.6 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' });
					}, null, '<0.1');
			});
			return tl.to({}, { duration: 1.4 });
		},
	};

	/* ------------------------------------------------------------------ */
	/* Urutan langkah 1 -> 2 -> 3, lalu ulang                              */
	/* ------------------------------------------------------------------ */
	const original = arts.map((a) => a.innerHTML);
	let current = 0;
	let tl = null;
	let wait = null;
	let started = false;

	const play = (i) => {
		current = i;
		steps.forEach((s, j) => { s.classList.toggle('is-on', j === i); s.classList.toggle('is-done', j < i); });
		setLine(i, 0.8);
		arts[i].innerHTML = original[i];
		tl = builders[arts[i].dataset.howArt](arts[i]);
		tl.eventCallback('onComplete', () => {
			if (i < steps.length - 1) { wait = gsap.delayedCall(0.4, () => play(i + 1)); return; }
			// Semua langkah selesai: tandai, jeda sebentar, lalu mulai lagi dari awal.
			steps[i].classList.remove('is-on');
			steps[i].classList.add('is-done');
			wait = gsap.delayedCall(1.6, () => { setLine(0, 0.6); play(0); });
		});
	};

	if (reduce) {
		steps.forEach((s) => s.classList.add('is-done'));
		gsap.set(line, vertical.matches ? { scaleY: 1 } : { scaleX: 1 });
		return;
	}

	gsap.set(steps, { autoAlpha: 0, y: 50 });
	ScrollTrigger.create({
		trigger: '.ap-how__track',
		start: 'top 80%',
		once: true,
		onEnter: () => {
			gsap.to(steps, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'expo.out' });
			gsap.from($$('[data-how-node]'), { scale: 0.3, duration: 0.6, stagger: 0.15, delay: 0.2, ease: 'back.out(2.5)' });
			gsap.delayedCall(0.9, () => { started = true; play(0); });
		},
	});
	ScrollTrigger.create({
		trigger: section,
		start: 'top bottom',
		end: 'bottom top',
		onToggle: (self) => {
			if (!started) return;
			if (self.isActive) { tl && tl.resume(); wait && wait.resume(); } else { tl && tl.pause(); wait && wait.pause(); }
		},
	});
}
