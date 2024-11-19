/**
 * Plane
 *
 * @author Takuto Yanagida
 * @version 2024-11-19
 */

import { Vertex } from './vertex';
import { Edge } from './edge';

/**
 * Represents a plane in 3D space defined by the equation AX + BY + CZ + D = 0.
 * This class provides methods to calculate the side of a point relative to the plane,
 * and to find intersections of edges or vertices with the plane.
 */
export class Plane {

	#A: number;
	#B: number;
	#C: number;
	#D: number;

	/**
	 * Creates a plane from a specified center point and a direction vector.
	 * The direction vector (from p0 to p1) defines the plane's orientation.
	 *
	 * @param p0 - The center point on the plane.
	 * @param p1 - A point determining the direction vector of the plane.
	 */
	constructor(p0: Vertex, p1: Vertex) {
		const len: number = Math.sqrt(p1[0] * p1[0] + p1[1] * p1[1] + p1[2] * p1[2]);
		this.#A = p1[0] / len;
		this.#B = p1[1] / len;
		this.#C = p1[2] / len;
		this.#D = - this.#A * p0[0] - this.#B * p0[1] - this.#C * p0[2];
	}

	/**
	 * Determines the relative position of a given vertex to the plane.
	 * Returns -1 if the point is below the plane, 1 if above, and 0 if on the plane.
	 *
	 * @param p - The vertex to evaluate.
	 * @returns -1, 0, or 1 indicating the side of the plane the vertex is on.
	 */
	side(p: Vertex): -1 | 0 | 1 {
		const t: number = this.#A * p[0] + this.#B * p[1] + this.#C * p[2] + this.#D;
		if (t < -0.001) return -1;
		if (t > 0.001) return 1;
		return 0;
	}

	/**
	 * Calculates the side of each vertex in a list relative to the plane.
	 *
	 * @param vs - An array of vertices to evaluate.
	 * @returns A map of each vertex to its side relative to the plane.
	 */
	sides(vs: Vertex[]): Map<Vertex, number> {
		const sides: Map<Vertex, number> = new Map();

		for (const v of vs) {
			sides.set(v, this.side(v));
		}
		return sides;
	}

	/**
	 * Calculates the intersection point of a line segment with the plane, if any.
	 * The line segment is defined by two vertices, and the intersection point
	 * is returned if it lies within the segment bounds.
	 *
	 * @param v0 - The starting vertex of the line segment.
	 * @param v1 - The ending vertex of the line segment.
	 * @returns The intersection vertex if it exists within the segment, otherwise null.
	 */
	#intersection(v0: Vertex, v1: Vertex): Vertex | null {
		const d: number = this.#A * (v0[0] - v1[0]) + this.#B * (v0[1] - v1[1]) + this.#C * (v0[2] - v1[2]);
		if (Math.abs(d) < 0.001) {
			return null;
		}
		const u: number = (this.#A * v0[0] + this.#B * v0[1] + this.#C * v0[2] + this.#D) / d;
		if (u < 0 || 1 < u) {
			return null;
		}
		return [v0[0] + u * (v1[0] - v0[0]), v0[1] + u * (v1[1] - v0[1]), v0[2] + u * (v1[2] - v0[2])];
	}

	/**
	 * Calculates intersection points of a list of edges with the plane.
	 * Each intersection is stored for both the edge and its paired edge if applicable.
	 *
	 * @param es - An array of edges to check for intersections with the plane.
	 * @returns A map of each edge to its intersection vertex, if any.
	 */
	intersections(es: Edge[]): Map<Edge, Vertex> {
		const ret: Map<Edge, Vertex> = new Map();

		for (const e of es) {
			if (ret.has(e)) {
				continue;
			}
			const v: Vertex | null = this.#intersection(e.getBegin(), e.getEnd() as Vertex);
			if (v) {
				ret.set(e, v);
				if (e.pair) {
					ret.set(e.pair, v);
				}
			}
		}
		return ret;
	}

}
