/**
 * Edge
 *
 * @author Takuto Yanagida
 * @version 2024-10-28
 */

import { Vertex } from './vertex';

/**
 * Represents an edge in a geometric structure, connecting two vertices.
 * Each edge may have a paired edge in the opposite direction and a next edge within the same face.
 */
export class Edge {

	#vert: Vertex;
	/** The paired edge in the opposite direction */
	public pair: Edge | null = null;
	/** The next edge in the same face */
	public next: Edge | null = null;

	/**
	 * Creates an instance of Edge with the specified beginning vertex.
	 *
	 * @param v - The starting vertex of this edge.
	 */
	constructor(v: Vertex) {
		this.#vert = v;
	}

	/**
	 * Returns the starting vertex of this edge.
	 *
	 * @returns The starting vertex of the edge.
	 */
	getBegin(): Vertex {
		return this.#vert;
	}

	/**
	 * Returns the ending vertex of this edge.
	 *
	 * @returns The ending vertex of the edge, defined as the starting vertex of the next edge.
	 */
	getEnd(): Vertex | null {
		return this.next ? this.next.#vert : null;
	}

}
