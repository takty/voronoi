/**
 * Voronoi Partition
 * @author Takuto Yanagida
 * @version 2026-07-10
 */

import { Vertex, intDiv, sub } from './vertex';
import { Plane } from './plane';
import { Face } from './face';
import { Mesh } from './mesh';

/**
 * Represents a Voronoi partition in 3D space. This class provides methods to create and
 * manage Voronoi cells using a set of sites, adjacency tables, and weight tables.
 * Each cell is represented as a mesh structure.
 */
export class Voronoi {

	static readonly FACE_INDEXES: number[][] = [
		[0, 1, 2, 3], [1, 0, 4, 5], [0, 3, 7, 4],
		[2, 1, 5, 6], [5, 4, 7, 6], [3, 2, 6, 7]
	];

	#defaultVs: Vertex[];

	#sites: Vertex[] = [];
	#cells: Mesh[] = [];;

	/**
	 * Initializes the Voronoi partition with default vertices defining a bounding box.
	 *
	 * @param x0 - Minimum x-coordinate for the bounding box.
	 * @param x1 - Maximum x-coordinate for the bounding box.
	 * @param y0 - Minimum y-coordinate for the bounding box.
	 * @param y1 - Maximum y-coordinate for the bounding box.
	 * @param z0 - Minimum z-coordinate for the bounding box.
	 * @param z1 - Maximum z-coordinate for the bounding box.
	 */
	constructor(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
		this.#defaultVs = [
			[x1, y1, z1], [x0, y1, z1],
			[x0, y1, z0], [x1, y1, z0],
			[x1, y0, z1], [x0, y0, z1],
			[x0, y0, z0], [x1, y0, z0],
		];
	}

	/**
	 * Adds a site for the Voronoi partition.
	 *
	 * @param site - Coordinates of the site as a tuple [x, y, z].
	 */
	addSite(site: [number, number, number]): void {
		this.#sites.push([...site]);
	}

	/**
	 * Initializes and creates Voronoi cells based on optionally provided adjacency and weight tables.
	 *
	 * @param adjacencyTable - Optional adjacency table for defining relationships between sites.
	 * @param weightTable - Optional weight table that affects partitioning.
	 */
	createCells(adjacencyTable: number[][] | null = null, weightTable: number[][] | null = null): void {
		this.#cells.length = 0;

		if (!adjacencyTable && !weightTable) {
			this.#divide1();
		} else if (adjacencyTable && !weightTable) {
			this.#divide2(adjacencyTable);
		} else if (adjacencyTable && weightTable) {
			this.#divide3(adjacencyTable, weightTable);
		} else {
			throw new Error('weightTable cannot be specified without adjacencyTable');
		}
	}

	/**
	 * Creates the Voronoi cells by splitting initial cells.
	 */
	#divide1(): void {
		for (const s of this.#sites) {
			// Creates initial cells as regular hexahedrons.
			const m: Mesh = Mesh.buildMesh(this.#defaultVs, Voronoi.FACE_INDEXES);

			for (const t of this.#sites) {
				if (s === t) continue;
				const n: Vertex = sub(s, t);
				if (n[0] === 0 && n[1] === 0 && n[2] === 0) {
					throw new Error('duplicate sites are not allowed in Voronoi partition');
				}
				const p: Plane = new Plane(intDiv(s, t), n);
				m.splitMesh(p, s);
			}
			this.#cells.push(m);
		}
	}
	/**
	 * Creates the Voronoi cells by splitting initial cells based on adjacency
	 * tables.
	 *
	 * @param adjTab - Optional adjacency table for the sites.
	 */
	#divide2(adjTab: number[][]): void {
		for (const [i, s] of this.#sites.entries()) {
			// Creates initial cells as regular hexahedrons.
			const m: Mesh = Mesh.buildMesh(this.#defaultVs, Voronoi.FACE_INDEXES);

			for (let a of adjTab[i]) {
				const t: Vertex = this.#sites[a];
				const n: Vertex = sub(s, t);
				if (n[0] === 0 && n[1] === 0 && n[2] === 0) {
					throw new Error('duplicate sites are not allowed in Voronoi partition');
				}
				const p: Plane = new Plane(intDiv(s, t), n);
				m.splitMesh(p, s);
			}
			this.#cells.push(m);
		}
	}

	/**
	 * Creates the Voronoi cells by splitting initial cells based on adjacency
	 * and weight tables.
	 *
	 * @param adjTab - Optional adjacency table for the sites.
	 * @param weiTab - Optional weight table that influences partitioning.
	 */
	#divide3(adjTab: number[][], weiTab: number[][]): void {
		for (const [i, s] of this.#sites.entries()) {
			// Creates initial cells as regular hexahedrons.
			const m: Mesh = Mesh.buildMesh(this.#defaultVs, Voronoi.FACE_INDEXES);

			const as: number[] = adjTab[i];
			const ws: number[] = weiTab[i];

			for (let j: number = 0; j < as.length; ++j) {
				const t: Vertex = this.#sites[as[j]];
				const n: Vertex = sub(s, t);
				if (n[0] === 0 && n[1] === 0 && n[2] === 0) {
					throw new Error('duplicate sites are not allowed in Voronoi partition');
				}
				const p: Plane = new Plane(intDiv(s, t, ws[j]), n);
				m.splitMesh(p, s);
			}
			this.#cells.push(m);
		}
	}

	/**
	 * Counts a grid of points within a specified cell at a given resolution.
	 *
	 * @param index - The index of the cell for which to calculate grid points.
	 * @param resolution - The spacing between grid points.
	 * @returns Count of the points.
	 */
	countGrids(index: number, resolution: number): number {
		if (!Number.isFinite(resolution) || resolution <= 0) {
			throw new Error('resolution must be a positive finite number');
		}
		let ret : number = 0;

		const norm: Vertex = [0, 0, 1];
		const s   : Vertex = this.#sites[index];
		const c   : Mesh   = this.#cells[index];

		const range: [number, number] | null = Voronoi.#getZIndexRange(c, s[2], resolution);
		if (range === null) return ret;

		const [k0, k1] = range;
		const max: number = Math.max(Math.abs(k0), Math.abs(k1));

		const countSection = (z: number): void => {
			const f: Face | null = c.crossSection([0, 0, z], norm);
			if (f) ret += f.countGridPoints(s[0], s[1], resolution);
		};

		if (k0 <= 0 && 0 <= k1) {
			const f: Face | null = c.crossSection([0, 0, s[2]], norm);
			if (f) ret += f.countGridPoints(s[0], s[1], resolution);
		}
		for (let inc: number = 1; inc <= max; ++inc) {
			if (k0 <= inc && inc <= k1) {
				const z: number = s[2] + inc * resolution;
				const f: Face | null = c.crossSection([0, 0, z], norm);
				if (f) ret += f.countGridPoints(s[0], s[1], resolution);
			}
			if (k0 <= -inc && -inc <= k1) {
				const z: number = s[2] - inc * resolution;
				const f: Face | null = c.crossSection([0, 0, z], norm);
				if (f) ret += f.countGridPoints(s[0], s[1], resolution);
			}
		}
		return ret;
	}

	/**
	 * Calculates a grid of points within a specified cell at a given resolution.
	 *
	 * @param index - The index of the cell for which to calculate grid points.
	 * @param resolution - The spacing between grid points.
	 * @returns A list of 3D coordinates representing grid points within the cell.
	 */
	getGrids(index: number, resolution: number): Vertex[] {
		if (!Number.isFinite(resolution) || resolution <= 0) {
			throw new Error('resolution must be a positive finite number');
		}
		const ret : Vertex[] = [];

		const norm: Vertex = [0, 0, 1];
		const s   : Vertex = this.#sites[index];
		const c   : Mesh   = this.#cells[index];

		const range: [number, number] | null = Voronoi.#getZIndexRange(c, s[2], resolution);
		if (range === null) return ret;

		const [k0, k1] = range;
		const max: number = Math.max(Math.abs(k0), Math.abs(k1));

		if (k0 <= 0 && 0 <= k1) {
			const f: Face | null = c.crossSection([0, 0, s[2]], norm);
			if (f) ret.push(...f.getGridPoints(s[0], s[1], resolution));
		}
		for (let inc: number = 1; inc <= max; ++inc) {
			if (k0 <= inc && inc <= k1) {
				const z: number = s[2] + inc * resolution;
				const f: Face | null = c.crossSection([0, 0, z], norm);
				if (f) ret.push(...f.getGridPoints(s[0], s[1], resolution));
			}
			if (k0 <= -inc && -inc <= k1) {
				const z: number = s[2] - inc * resolution;
				const f: Face | null = c.crossSection([0, 0, z], norm);
				if (f) ret.push(...f.getGridPoints(s[0], s[1], resolution));
			}
		}
		return ret;
	}

	static #getZIndexRange(c: Mesh, cz: number, resolution: number): [number, number] | null {
		const range: [number, number] | null = c.getZRange();
		if (range === null) return null;

		const [z0, z1] = range;

		const k0: number = Math.floor((z0 - cz) / resolution) + 1;
		const k1: number = Math.ceil ((z1 - cz) / resolution) - 1;

		return k0 <= k1 ? [k0, k1] : null;
	}

}
