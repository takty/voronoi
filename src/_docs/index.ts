/**
 * Script for Sample
 *
 * @author Takuto Yanagida
 * @version 2026-07-10
 */

// @ts-expect-error Vite handles CSS imports.
import 'klales/klales.min.css';
import { Voronoi } from '../../voronoi';

type Site = {
	x    : number;
	y    : number;
	color: string;
};

const WIDTH : number = 640;
const HEIGHT: number = 640;

document.addEventListener('DOMContentLoaded', (): void => {
	function getElement<T extends HTMLElement>(id: string): T {
		return (document.getElementById(id) as HTMLElement) as T;
	}
	const canvas    : HTMLCanvasElement = getElement('diagram');
	const resolution: HTMLInputElement  = getElement('resolution');
	const clear     : HTMLButtonElement = getElement('clear');
	const status    : HTMLOutputElement = getElement('status');

	const ctx  : CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
	const sites: Site[] = [];

	const redraw = (): void => {
		draw(ctx, sites, getResolution(resolution));
		status.value = `${sites.length} site${sites.length === 1 ? '' : 's'}`;
	};
	canvas.addEventListener('pointerdown', (ev: PointerEvent): void => {
		ev.preventDefault();

		const [x, y] = getCanvasPoint(canvas, ev);
		if (hasSameSite(sites, x, y)) return;

		sites.push({ x, y, color: randomColor() });
		redraw();
	});
	resolution.addEventListener('input', redraw);

	clear.addEventListener('click', (): void => {
		sites.length = 0;
		redraw();
	});
	redraw();
});

function getResolution(input: HTMLInputElement): number {
	const v: number = input.valueAsNumber;
	return Number.isFinite(v) && 0 < v ? v : 10;
}

function getCanvasPoint(canvas: HTMLCanvasElement, ev: PointerEvent): [number, number] {
	const r: DOMRect = canvas.getBoundingClientRect();
	const x: number  = (ev.clientX - r.left) * canvas.width  / r.width;
	const y: number  = (ev.clientY - r.top ) * canvas.height / r.height;
	return [
		Math.max(0, Math.min(canvas.width,  x)),
		Math.max(0, Math.min(canvas.height, y)),
	];
}

function hasSameSite(sites: Site[], x: number, y: number): boolean {
	return sites.some((s: Site): boolean => Math.abs(s.x - x) < 0.001 && Math.abs(s.y - y) < 0.001);
}

function randomColor(): string {
	const h: number = Math.floor(Math.random() * 360);
	return `hsl(${h}, 70%, 45%)`;
}

function draw(ctx: CanvasRenderingContext2D, sites: Site[], resolution: number): void {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	if (sites.length === 0) return;

	const vd: Voronoi = new Voronoi(0, WIDTH, 0, HEIGHT, -1, 1);
	for (const s of sites) {
		vd.addSite([s.x, s.y, 0]);
	}
	vd.createCells();

	for (let i: number = 0; i < sites.length; ++i) {
		ctx.fillStyle = sites[i].color;
		for (const [x, y] of vd.getGrids(i, resolution)) {
			if (x < 0 || WIDTH < x || y < 0 || HEIGHT < y) continue;
			ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
		}
	}
	for (const s of sites) {
		ctx.beginPath();
		ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
		ctx.fillStyle = s.color;
		ctx.fill();

		ctx.strokeStyle = 'black';
		ctx.stroke();
	}
}
