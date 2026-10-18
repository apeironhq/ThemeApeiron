/**
 * Latar partikel halus di belakang section terang: titik navy & emas yang melayang pelan,
 * tersambung garis tipis saat berdekatan, ikut bergerak saat digulir, dan menyambung ke kursor.
 */
export function initParticles(canvas) {
	if (!canvas || !canvas.getContext) return;
	const ctx = canvas.getContext('2d');
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	const colors = ['8,60,87', '8,60,87', '8,60,87', '14,85,120', '201,164,107'];
	const LINK = 120;
	const mouse = { x: -9999, y: -9999 };
	let w = 0;
	let h = 0;
	let parts = [];
	let raf = 0;
	let lastY = window.scrollY;

	const make = () => ({
		x: Math.random() * w,
		y: Math.random() * h,
		vx: (Math.random() - 0.5) * 0.2,
		vy: (Math.random() - 0.5) * 0.2,
		r: Math.random() * 1.7 + 0.7,
		a: Math.random() * 0.3 + 0.18,
		c: colors[Math.floor(Math.random() * colors.length)],
		z: Math.random() * 0.8 + 0.2, // kedalaman: makin besar makin cepat ikut gulir
	});

	const resize = () => {
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		w = window.innerWidth;
		h = window.innerHeight;
		canvas.width = w * dpr;
		canvas.height = h * dpr;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const n = Math.round(Math.min(fine ? 90 : 40, (w * h) / 15000));
		parts = Array.from({ length: n }, make);
	};

	const draw = () => {
		ctx.clearRect(0, 0, w, h);
		for (let i = 0; i < parts.length; i++) {
			const p = parts[i];
			for (let j = i + 1; j < parts.length; j++) {
				const q = parts[j];
				const dx = p.x - q.x;
				const dy = p.y - q.y;
				const d = Math.sqrt(dx * dx + dy * dy);
				if (d < LINK) {
					ctx.strokeStyle = `rgba(8,60,87,${(1 - d / LINK) * 0.11})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(p.x, p.y);
					ctx.lineTo(q.x, q.y);
					ctx.stroke();
				}
			}
			const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
			if (md < 160) {
				ctx.strokeStyle = `rgba(8,60,87,${(1 - md / 160) * 0.22})`;
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(mouse.x, mouse.y);
				ctx.stroke();
			}
		}
		for (const p of parts) {
			ctx.fillStyle = `rgba(${p.c},${p.a})`;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
			ctx.fill();
		}
	};

	const step = () => {
		const scrollDelta = window.scrollY - lastY;
		lastY = window.scrollY;
		for (const p of parts) {
			p.x += p.vx;
			p.y += p.vy - scrollDelta * 0.12 * p.z;
			// Sedikit menjauh dari kursor.
			const dx = p.x - mouse.x;
			const dy = p.y - mouse.y;
			const d2 = dx * dx + dy * dy;
			if (d2 < 6400 && d2 > 0.01) {
				const f = (6400 - d2) / 6400 * 0.6;
				const d = Math.sqrt(d2);
				p.x += (dx / d) * f;
				p.y += (dy / d) * f;
			}
			if (p.x < -20) p.x = w + 20;
			if (p.x > w + 20) p.x = -20;
			if (p.y < -20) p.y = h + 20;
			if (p.y > h + 20) p.y = -20;
		}
		draw();
		raf = requestAnimationFrame(step);
	};

	resize();
	window.addEventListener('resize', () => { resize(); if (reduce) draw(); });
	if (fine) {
		window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
		document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
	}
	if (reduce) { draw(); return; }
	document.addEventListener('visibilitychange', () => {
		cancelAnimationFrame(raf);
		if (!document.hidden) { lastY = window.scrollY; raf = requestAnimationFrame(step); }
	});
	raf = requestAnimationFrame(step);
}
