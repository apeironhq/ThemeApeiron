/**
 * Efek gulir global:
 * - [data-approach]: blok visual mendekat ke pembaca (dari kecil & miring jauh, menjadi tegak penuh).
 * - [data-deco]: ikon dekoratif bergerak parallax + berputar pelan mengikuti gulir.
 * Dipanggil setelah initLanding().
 */
export function initScrollFx() {
	const { gsap, ScrollTrigger } = window;
	if (!gsap || !ScrollTrigger) return;

	const mm = gsap.matchMedia();
	// "any" selalu cocok, agar efek juga terpasang di layar kecil (matchMedia hanya jalan bila ada kondisi yang cocok).
	mm.add({
		any: 'all',
		wide: '(min-width: 900px)',
		reduce: '(prefers-reduced-motion: reduce)',
	}, (ctx) => {
		const { wide, reduce } = ctx.conditions;
		if (reduce) return;

		document.querySelectorAll('[data-approach]').forEach((el) => {
			gsap.fromTo(el,
				{ scale: wide ? 0.84 : 0.92, rotationX: wide ? 16 : 6, y: wide ? 90 : 40, autoAlpha: 0.3, transformPerspective: 1400, transformOrigin: '50% 0%' },
				{
					scale: 1,
					rotationX: 0,
					y: 0,
					autoAlpha: 1,
					ease: 'none',
					scrollTrigger: { trigger: el, start: 'top bottom', end: el.dataset.approachEnd || 'top 38%', scrub: 0.8 },
				});
		});

		if (!wide) return;
		document.querySelectorAll('[data-deco]').forEach((ico, i) => {
			const speed = parseFloat(ico.dataset.decoSpeed) || 1;
			const rot = parseFloat(ico.dataset.decoRot) || 10;
			const section = ico.closest('section');
			gsap.fromTo(ico,
				{ y: 150 * speed, rotation: -rot, scale: 0.85 },
				{ y: -150 * speed, rotation: rot, scale: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 } });
			// Ikon di dalamnya sedikit "bernapas", hanya saat section-nya terlihat.
			const breathe = gsap.to(ico.querySelector('svg'), { scale: 1.12, duration: 2.2 + (i % 3) * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true });
			ScrollTrigger.create({ trigger: section, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? breathe.resume() : breathe.pause()) });
		});
	});

	/* Ornamen CTA: garis tumbuh dari tengah, cincin tergambar, berlian & kilau muncul. */
	const rings = document.querySelector('[data-cta-rings]');
	if (rings && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		const q = (sel) => rings.querySelectorAll(sel);
		const hasDraw = !!window.DrawSVGPlugin;
		const tl = gsap.timeline({ paused: true });
		if (hasDraw) {
			tl.fromTo(q('[data-orn-line]'), { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.1, ease: 'power2.out' })
				.fromTo(q('[data-orn-ring]'), { drawSVG: '0% 0%', rotation: -90, svgOrigin: '120 31' }, { drawSVG: '0% 100%', rotation: 0, svgOrigin: '120 31', duration: 1.2, stagger: 0.18, ease: 'power3.inOut' }, 0.15);
		} else {
			tl.from(q('[data-orn-line], [data-orn-ring]'), { autoAlpha: 0, duration: 0.8, stagger: 0.1 });
		}
		tl.from(q('[data-orn-gem]'), { scale: 0, rotation: 45, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.1, ease: 'back.out(3)' }, 0.7)
			.from(q('[data-orn-stone]'), { scale: 0, y: 6, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(3)' }, 1.1)
			.from(q('[data-orn-spark]'), { scale: 0, rotation: -90, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(3)' }, 1.3);
		ScrollTrigger.create({ trigger: rings, start: 'top 85%', once: true, onEnter: () => tl.play() });
		// Kilau berkedip pelan setelah ornamen tergambar.
		const twinkle = gsap.to(q('[data-orn-spark]'), { scale: 0.55, opacity: 0.4, transformOrigin: '50% 50%', duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.4, paused: true });
		ScrollTrigger.create({ trigger: rings, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? twinkle.resume() : twinkle.pause()) });
	}
}
