/**
 * Script for Sample
 *
 * @author Takuto Yanagida
 * @version 2024-11-22
 */

import { Voronoi } from '../../voronoi';

document.addEventListener('DOMContentLoaded', (): void => {
	checkOrientationIndependence();
	// checkRandomPartition();
});

function checkOrientationIndependence(): void {
	const pairs: [number, number, number][][] = [
		[[0, 3, 1], [2, 0, 2]],
		[[0, 0, 1], [3, 2, 2]],
		[[0, 1, 0], [2, 2, 3]],
		[[2, 3, 0], [1, 0, 2]],
	];
	for (const sites of pairs) {
		const vd: Voronoi = new Voronoi(0, 3, 0, 3, 0, 3);
		for (const site of sites) {
			vd.addSite(site);
		}
		vd.createCells();

		let s: number = 0;
		for (let i: number = 0; i < sites.length; ++i) {
			const c: number = vd.countGrids(i, 0.1);
			console.log(sites[i].toString(), c);
			s += c;
		}
		console.log(s);
	}
}

function checkRandomPartition(): void {
	const sites: [number, number, number][] = [
		[Math.round(Math.random() * 3), Math.round(Math.random() * 3), 0],
		[Math.round(Math.random() * 3), Math.round(Math.random() * 3), 0],
	]
	const vd: Voronoi = new Voronoi(0, 3, 0, 3, 0, 3);
	for (const site of sites) {
		vd.addSite(site);
	}
	vd.createCells();

	for (let i: number = 0; i < sites.length; ++i) {
		console.log(sites[i].toString(), vd.countGrids(i, 0.1));
	}
}
