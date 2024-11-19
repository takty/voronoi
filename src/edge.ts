/**
 * Edge
 *
 * @author Takuto Yanagida
 * @version 2024-11-19
 */

import { Vertex } from './vertex';

/**
 * Represents an edge in a geometric structure, connecting two vertices.
 * Each edge may have a paired edge in the opposite direction and a next edge within the same face.
 */
export class Edge {

	#bgn: Vertex;
	#end!: Vertex;

	/**
	 * The next edge in the same face
	 */
	public next: Edge | null = null;

	/**
	 * The paired edge in the opposite direction
	 */
	public pair: Edge | null = null;

	/**
	 * Creates an instance of Edge with the specified beginning vertex.
	 *
	 * @param v - The starting vertex of this edge.
	 */
	constructor(v: Vertex) {
		this.#bgn = v;
	}

	setNext(e: Edge): void {
		this.next = e;
		this.#end = e.#bgn;
	}

	/**
	 * Returns the starting vertex of this edge.
	 *
	 * @returns The starting vertex of the edge.
	 */
	getBegin(): Vertex {
		return this.#bgn;
	}

	/**
	 * Returns the ending vertex of this edge.
	 *
	 * @returns The ending vertex of the edge, defined as the starting vertex of the next edge.
	 */
	getEnd(): Vertex {
		return this.#end;
	}

}
