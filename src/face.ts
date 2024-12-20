/**
 * Face
 *
 * @author Takuto Yanagida
 * @version 2024-11-22
 */

import { Vertex } from './vertex';
import { Edge } from './edge';

/**
 * Represents a face in a geometric structure, composed of edges that form a closed loop.
 * Each face has a reference to its first edge and provides methods to calculate points
 * within or along its edges in a plane.
 */
export class Face {

	static readonly E: number = 0.001;

	#firstEdge: Edge;

	/**
	 * Creates an instance of Face, setting up the circular linkage of edges
	 * to define a closed face.
	 *
	 * @param es - An array of edges that form the face.
	 */
	constructor(es: Edge[]) {
		const n: number = es.length;

		for (let i: number = 0; i < n - 1; ++i) {
			es[i].setNext(es[i + 1]);
		}
		es[n - 1].setNext(es[0]);

		this.#firstEdge = es[0];
	}

	/**
	 * Calculates the number of edges that compose this face.
	 *
	 * @returns The total number of edges in the face.
	 */
	length(): number {
		let ret: number = 0;
		let e: Edge = this.#firstEdge;
		do {
			ret += 1;
			e = e.next as Edge;
		} while (e !== this.#firstEdge);
		return ret;
	}

	/**
	 * Returns the vertices on the specified side of the face based on a provided side reference.
	 *
	 * @param refSide - The reference side of the face.
	 * @param vertToSide - A map associating each vertex with a specific side.
	 * @param edgeToInter - A map providing intersection points for edges that intersect a plane.
	 * @returns An array of vertices on the specified side of the face.
	 */
	verticesOf(refSide: number, vertToSide: Map<Vertex, number>, edgeToInter: Map<Edge, Vertex>): Vertex[] {
		const ret: Vertex[] = [];  // Array to store vertices on the specified side.

		let e: Edge = this.#firstEdge;
		do {
			const v: Vertex = e.getBegin();
			if (vertToSide.get(v) as number * refSide >= 0) {
				ret.push(v);  // Adds vertex on the specified side.
			}
			if (edgeToInter.has(e)) {
				ret.push(edgeToInter.get(e) as Vertex);  // Adds intersection point of edge with plane.
			}
			e = e.next as Edge;
		} while (e !== this.#firstEdge);

		return ret;
	}

	/**
	 * Counts grid points within the face restricted to a specific plane (common z-coordinate).
	 *
	 * @param cx - The center x-coordinate.
	 * @param cy - The center y-coordinate.
	 * @param resolution - The resolution of the grid.
	 * @returns The count of grid points within the face.
	 */
	countGridPoints(cx: number, cy: number, resolution: number): number {
		let ret: number = 0;

		const pc: number = this.#countInternalPoints(cx, cy, resolution);
		ret += pc;

		for (let inc: number = 1; ; ++inc) {
			const pc: number = this.#countInternalPoints(cx, cy + inc * resolution, resolution);
			if (0 === pc) break;
			ret += pc;
		}
		for (let inc: number = 1; ; ++inc) {
			const pc: number = this.#countInternalPoints(cx, cy - inc * resolution, resolution);
			if (0 === pc) break;
			ret += pc;
		}
		return ret;
	}

	/**
	 * Returns internal grid points along the x-axis within the boundaries of the face on a given plane.
	 *
	 * @param cx - The center x-coordinate.
	 * @param cy - The y-coordinate.
	 * @param resolution - The resolution of the grid.
	 * @returns The number of internal grid points at the specified y-coordinate.
	 */
	#countInternalPoints(cx: number, cy: number, resolution: number): number {
		const ips: number[] = this.#getIntersectionPoints(cy);

		let [x0, x1] = ips;
		if (x0 > x1) {
			[x0, x1] = [x1, x0];
		}
		let pc: number = 0;
		if (x0 < cx && cx < x1) {
			pc += 1;
		}
		for (let inc: number = 1; ; ++inc) {
			const s: number = pc;
			const x: number = cx + inc * resolution;
			if (x0 < x && x < x1) {
				pc += 1;
			}
			if (pc === s) break;
		}
		for (let inc: number = 1; ; ++inc) {
			const s: number = pc;
			const x: number = cx - inc * resolution;
			if (x0 < x && x < x1) {
				pc += 1;
			}
			if (pc === s) break;
		}
		return pc;
	}

	/**
	 * Calculates grid points within the face restricted to a specific plane (common z-coordinate).
	 *
	 * @param cx - The center x-coordinate.
	 * @param cy - The center y-coordinate.
	 * @param resolution - The resolution of the grid.
	 * @returns An array of 3D points within the face on the specified plane.
	 */
	getGridPoints(cx: number, cy: number, resolution: number): [number, number, number][] {
		const ret: [number, number, number][] = [];
		const z: number = this.#firstEdge.getBegin()[2];

		const ps: number[] = this.#getInternalPoints(cx, cy, resolution);
		for (const x of ps) {
			ret.push([x, cy, z]);
		}
		for (let inc: number = 1; ; ++inc) {
			const y: number = cy + inc * resolution;
			const ps: number[] = this.#getInternalPoints(cx, y, resolution);
			if (0 === ps.length) break;
			for (const x of ps) {
				ret.push([x, y, z]);
			}
		}
		for (let inc: number = 1; ; ++inc) {
			const y: number = cy - inc * resolution;
			const ps: number[] = this.#getInternalPoints(cx, y, resolution);
			if (0 === ps.length) break;
			for (const x of ps) {
				ret.push([x, y, z]);
			}
		}
		return ret;
	}

	/**
	 * Computes the x-coordinates of grid points within the face boundaries at a specific y-coordinate.
	 *
	 * @param cx - The center x-coordinate.
	 * @param cy - The y-coordinate at which to compute points.
	 * @param resolution - The resolution of the grid.
	 * @returns An array of x-coordinates of internal grid points at the specified y-coordinate.
	 */
	#getInternalPoints(cx: number, cy: number, resolution: number): number[] {
		const ips: number[] = this.#getIntersectionPoints(cy);

		let [x0, x1] = ips;
		if (x0 > x1) {
			[x0, x1] = [x1, x0];
		}
		const pts: number[] = [];
		if (x0 < cx && cx < x1) {
			pts.push(cx);
		}
		for (let inc: number = 1; ; ++inc) {
			const s: number = pts.length;
			const x: number = cx + inc * resolution;
			if (x0 < x && x < x1) {
				pts.push(x);
			}
			if (pts.length === s) break;
		}
		for (let inc: number = 1; ; ++inc) {
			const s: number = pts.length;
			const x: number = cx - inc * resolution;
			if (x0 < x && x < x1) {
				pts.push(x);
			}
			if (pts.length === s) break;
		}
		return pts;
	}

	/**
	 * Calculates the x-coordinates where the face's edges intersect a horizontal line at a specified y-coordinate.
	 *
	 * @param y - The y-coordinate at which to find intersections.
	 * @returns An array of x-coordinates where the edges intersect the horizontal line.
	 */
	#getIntersectionPoints(y: number): number[] {
		const pts: number[] = [];

		for (let e: Edge = this.#firstEdge; ; e = e.next as Edge) {
			const xs: number[] = Face.#getIntersection(e, y);
			pts.push(...xs);
			if (e.next === this.#firstEdge) {
				break;
			}
		}
		return Face.#removeDuplicates(pts);
	}

	/**
	 * Calculates the x-coordinate(s) where a given edge intersects a horizontal line at a specified y-coordinate.
	 *
	 * @param e - The edge to check for intersection.
	 * @param y - The y-coordinate of the horizontal line.
	 * @returns An array of x-coordinates where the edge intersects the line; empty if no intersection.
	 */
	static #getIntersection(e: Edge, y: number): number[] {
		const [x0, y0] = e.getBegin();
		const [x1, y1] = e.getEnd();

		if (y < Math.min(y0, y1) || Math.max(y0, y1) < y) {
			return [];
		}
		if (Math.abs(y0 - y1) < Face.E) {
			return [x0, x1];
		}
		const A: number = y1 - y0;
		const B: number = -(x1 - x0);
		const C: number = - A * x0 - B * y0;

		if (Math.abs(A) < Face.E) {
			return [];
		}
		return [-(B * y + C) / A];
	}

	/**
	 * Removes near-duplicate numbers from an array, considering values within a small epsilon (Face.E) as duplicates.
	 *
	 * @param vs - An array of numbers.
	 * @returns A new sorted array with near-duplicates removed.
	 */
	static #removeDuplicates(vs: number[]): number[] {
		if (vs.length === 0) return [];

		vs.sort((a: number, b: number): number => a - b);
		const res: number[] = [];
		let cur: number = vs[0];

		for (let i: number = 1; i < vs.length; i++) {
			if (Face.E < vs[i] - vs[i - 1]) {
				res.push(cur);
				cur = vs[i];
			}
		}
		res.push(cur);
		return res;
	}

}
