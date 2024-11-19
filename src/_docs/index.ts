/**
 * Script for Sample
 *
 * @author Takuto Yanagida
 * @version 2024-11-14
 */

import { Voronoi } from '../../voronoi';

document.addEventListener('DOMContentLoaded', (): void => {
	const sites: [number, number, number][] = [
		[0, 6, 5], [0, 4, 4],
		// [6, 0, 5], [4, 0, 4],
		// [6, 5, 0], [4, 4, 0],
		// [Math.round(Math.random() * 10), 0, Math.round(Math.random() * 10)],
		// [Math.round(Math.random() * 10), 0, Math.round(Math.random() * 10)],
	]
	const vd: Voronoi = new Voronoi(0, 10, 0, 10, 0, 10);
	for (const site of sites) {
		vd.addSite(site);
	}
	vd.createCells();

	for (let i: number = 0; i < sites.length; ++i) {
		console.log(sites[i].toString(), vd.countGrids(i, 1));
	}
});
