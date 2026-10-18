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
			// Ikon di dalamnya sedikit "bernapas" agar terasa hidup saat terlihat.
			gsap.to(ico.querySelector('svg'), { scale: 1.12, duration: 2.2 + (i % 3) * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
		});
	});
}
