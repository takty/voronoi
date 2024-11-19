/**
 * Face
 *
 * @author Takuto Yanagida
 * @version 2024-11-19
 */

import { Vertex } from './vertex';
import { Edge } from './edge';

/**
 * Represents a face in a geometric structure, composed of edges that form a closed loop.
 * Each face has a reference to its first edge and provides methods to calculate points
 * within or along its edges in a plane.
 */
export class Face {

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
	 * @param siteSide - The reference side of the face.
	 * @param vertToSide - A map associating each vertex with a specific side.
	 * @param edgeToInter - A map providing intersection points for edges that intersect a plane.
	 * @returns An array of vertices on the specified side of the face.
	 */
	verticesOf(siteSide: number, vertToSide: Map<Vertex, number>, edgeToInter: Map<Edge, Vertex>): Vertex[] {
		const ret: Vertex[] = [];  // Array to store vertices on the specified side.

		let e: Edge = this.#firstEdge;
		do {
			const v: Vertex = e.getBegin();
			if (vertToSide.get(v) as number * siteSide >= 0) {
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
	 * @returns Count of the points.
	 */
	countGridPoints(cx: number, cy: number, resolution: number): number {
		let ret: number = 0;

		const ps: number[] = this.#getInternalPoints(cx, cy, resolution);
		for (const _ of ps) {
			ret += 1;
		}
		for (let inc: number = 1; ; ++inc) {
			const size: number = ret;

			const ps0: number[] = this.#getInternalPoints(cx, cy + inc * resolution, resolution);
			for (const _ of ps0) {
				ret += 1;
			}
			const ps1: number[] = this.#getInternalPoints(cx, cy - inc * resolution, resolution);
			for (const _ of ps1) {
				ret += 1;
			}
			if (ret === size) {
				break;
			}
		}
		return ret;
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
			const size: number = ret.length;

			const ty0: number = cy + inc * resolution;
			const ps0: number[] = this.#getInternalPoints(cx, ty0, resolution);
			for (const x of ps0) {
				ret.push([x, ty0, z]);
			}
			const ty1: number = cy + -inc * resolution;
			const ps1: number[] = this.#getInternalPoints(cx, ty1, resolution);
			for (const x of ps1) {
				ret.push([x, ty1, z]);
			}
			if (ret.length === size) {
				break;
			}
		}
		return ret;
	}

	/**
	 * Returns internal grid points along the x-axis within the boundaries of the face on a given plane.
	 *
	 * @param cx - The center x-coordinate.
	 * @param cy - The y-coordinate.
	 * @param resolution - The resolution of the grid.
	 * @returns An array of x-coordinates within the face boundaries.
	 */
	#getInternalPoints(cx: number, cy: number, resolution: number): number[] {
		const interPts: number[] = [];
		const vs: number[] = this.#getIntersectionPoints(cy);

		if (vs.length !== 2) {
			return interPts;
		}
		let x0: number = vs[0];
		let x1: number = vs[1];
		if (x0 > x1) {
			[x0, x1] = [x1, x0];
		}
		if (x0 < cx && cx < x1) {
			interPts.push(cx);
		}
		for (let inc: number = 1; ; ++inc) {
			const size: number = interPts.length;

			const tx0: number = cx + inc * resolution;
			if (x0 < tx0 && tx0 < x1) {
				interPts.push(tx0);
			}
			const tx1: number = cx + -inc * resolution;
			if (x0 < tx1 && tx1 < x1) {
				interPts.push(tx1);
			}
			if (interPts.length === size) {
				break;
			}
		}
		return interPts;
	}

	/**
	 * Calculates the x-coordinates of intersection points along edges of the face at a specific y-coordinate.
	 * Restricted to the same plane (common z-coordinate).
	 *
	 * @param y - The y-coordinate at which to find intersection points.
	 * @returns An array of x-coordinates where edges intersect the y-coordinate.
	 */
	#getIntersectionPoints(y: number): number[] {
		const interPts: number[] = [];

		for (let e: Edge = this.#firstEdge; ; e = e.next as Edge) {
			const x: number = this.#getIntersection(e, y);
			if (!Number.isNaN(x)) {
				interPts.push(x);
			}
			if (e.next === this.#firstEdge) {
				break;
			}
		}
		return interPts;
	}

	/**
	 * Calculates the x-coordinate of the intersection between an edge and a horizontal line at y.
	 * Restricted to the same plane (common z-coordinate).
	 *
	 * @param e - The edge for which to calculate the intersection.
	 * @param y - The y-coordinate of the horizontal line.
	 * @returns The x-coordinate of the intersection or NaN if no intersection occurs.
	 */
	#getIntersection(e: Edge, y: number): number {
		const v0: Vertex = e.getBegin();
		const v1: Vertex = e.getEnd();
		if (y < Math.min(v0[1], v1[1]) || Math.max(v0[1], v1[1]) < y) {
			return Number.NaN;
		}
		const A: number = v1[1] - v0[1];
		const B: number = -(v1[0] - v0[0]);
		const C: number = - A * v0[0] - B * v0[1];

		if (Math.abs(A) < 0.0001) {
			return Number.NaN;
		}
		return -(B * y + C) / A;
	}

}
