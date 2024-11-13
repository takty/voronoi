/**
 * Voronoi Partition
 * @author Takuto Yanagida
 * @version 2024-10-28
 */

import { Vertex } from './vertex';
import { Plane } from './plane';
import { Face } from './face';
import { Mesh } from './mesh';

/**
 * Represents a Voronoi partition in 3D space. This class provides methods to create and
 * manage Voronoi cells using a set of sites, adjacency tables, and weight tables.
 * Each cell is represented as a mesh structure.
 */
export class Voronoi {

	#defaultVs: Vertex[];

	#sites: Vertex[] = [];
	#cells: Mesh[] = [];;

	/**
	 * Initializes the Voronoi partition with default vertices defining a bounding box.
	 *
	 * @param w0 - Minimum x-coordinate for the bounding box.
	 * @param w1 - Maximum x-coordinate for the bounding box.
	 * @param h0 - Minimum y-coordinate for the bounding box.
	 * @param h1 - Maximum y-coordinate for the bounding box.
	 * @param d0 - Minimum z-coordinate for the bounding box.
	 * @param d1 - Maximum z-coordinate for the bounding box.
	 */
	constructor(w0: number, w1: number, h0: number, h1: number, d0: number, d1: number) {
		this.#defaultVs = [
			new Vertex(w1, h1, d1), new Vertex(w0, h1, d1),
			new Vertex(w0, h1, d0), new Vertex(w1, h1, d0),
			new Vertex(w1, h0, d1), new Vertex(w0, h0, d1),
			new Vertex(w0, h0, d0), new Vertex(w1, h0, d0)
		];
	}

	/**
	 * Creates initial cells as regular hexahedrons.
	 */
	#createDefaultCells(): void {
		const faceIndex: number[][] = [
			[0, 1, 2, 3], [1, 0, 4, 5], [0, 3, 7, 4],
			[2, 1, 5, 6], [5, 4, 7, 6], [3, 2, 6, 7]
		];
		for (const _ of this.#sites) {
			const box: Mesh = new Mesh();
			box.buildMesh(this.#defaultVs, faceIndex);
			this.#cells.push(box);
		}
	}

	/**
	 * Creates the Voronoi cells by splitting initial cells based on adjacency
	 * and weight tables, if provided.
	 *
	 * @param adjacencyTable - Optional adjacency table for the sites.
	 * @param weightTable - Optional weight table that influences partitioning.
	 */
	#createVoronoi(adjacencyTable: number[][] | null = null, weightTable: number[][] | null = null): void {
		if (!adjacencyTable && !weightTable) {
			for (const [i, s0] of this.#sites.entries()) {
				for (const s1 of this.#sites) {
					if (s0 === s1) continue;
					const org: Vertex = new Vertex((s0.x + s1.x) * 0.5, (s0.y + s1.y) * 0.5, (s0.z + s1.z) * 0.5);
					const p: Plane = new Plane(org, new Vertex(s0.x - s1.x, s0.y - s1.y, s0.z - s1.z));
					this.#cells[i].splitMesh(p, s0);
				}
			}
		} else if (adjacencyTable && !weightTable) {
			for (const [i, s0] of this.#sites.entries()) {
				for (let a of adjacencyTable[i]) {
					const s1: Vertex = this.#sites[a];
					const org: Vertex = new Vertex((s0.x + s1.x) * 0.5, (s0.y + s1.y) * 0.5, (s0.z + s1.z) * 0.5);
					const p: Plane = new Plane(org, new Vertex(s0.x - s1.x, s0.y - s1.y, s0.z - s1.z));
					this.#cells[i].splitMesh(p, s0);
				}
			}
		} else if (adjacencyTable && weightTable) {
			for (const [i, s0] of this.#sites.entries()) {
				const as: number[] = adjacencyTable[i];
				const ws: number[] = weightTable[i];

				for (let j: number = 0; j < as.length; ++j) {
					const s1: Vertex = this.#sites[as[j]];
					const r0: number = ws[j];
					const r1: number = 1.0 - r0;  // r0 is the proportion of the site side
					const org: Vertex = new Vertex(s0.x * r1 + s1.x * r0, s0.y * r1 + s1.y * r0, s0.z * r1 + s1.z * r0);
					const p: Plane = new Plane(org, new Vertex(s0.x - s1.x, s0.y - s1.y, s0.z - s1.z));
					this.#cells[i].splitMesh(p, s0);
				}
			}
		}
	}

	/**
	 * Adds a site for the Voronoi partition.
	 *
	 * @param site - Coordinates of the site as a tuple [x, y, z].
	 */
	addSite(site: [number, number, number]): void {
		this.#sites.push(new Vertex(...site));
	}

	/**
	 * Initializes and creates Voronoi cells based on optionally provided adjacency and weight tables.
	 *
	 * @param adjacencyTable - Optional adjacency table for defining relationships between sites.
	 * @param weightTable - Optional weight table that affects partitioning.
	 */
	createCells(adjacencyTable: number[][] | null = null, weightTable: number[][] | null = null): void {
		this.#createDefaultCells();
		this.#createVoronoi(adjacencyTable, weightTable);
	}

	/**
	 * Calculates a grid of points within a specified cell at a given resolution.
	 *
	 * @param index - The index of the cell for which to calculate grid points.
	 * @param resolution - The spacing between grid points.
	 * @returns A list of 3D coordinates representing grid points within the cell.
	 */
	calcGrids(index: number, resolution: number): [number, number, number][] {
		const ret: [number, number, number][] = [];
		const c: Mesh = this.#cells[index];
		const s: Vertex = this.#sites[index];
		const norm = new Vertex(0.0, 0.0, 1.0);

		const f: Face | null = c.crossSection(new Vertex(0.0, 0.0, s.z), norm);
		if (f != null) {
			ret.push(...f.getGridPoints(s.x, s.y, resolution));
		}
		for (let inc: number = 1; ; ++inc) {
			const size: number = ret.length;

			const f0: Face | null = c.crossSection(new Vertex(0.0, 0.0, s.z + inc * resolution), norm);
			if (f0 != null) {
				ret.push(...f0.getGridPoints(s.x, s.y, resolution));
			}
			const f1: Face | null = c.crossSection(new Vertex(0.0, 0.0, s.z + -inc * resolution), norm);
			if (f1 != null) {
				ret.push(...f1.getGridPoints(s.x, s.y, resolution));
			}
			if (ret.length === size) {
				break;
			}
		}
		return ret;
	}

}
