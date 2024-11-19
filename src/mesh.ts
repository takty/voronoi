/**
 * Mesh
 *
 * @author Takuto Yanagida
 * @version 2024-11-19
 */

import { Vertex, add } from './vertex';
import { Edge } from './edge';
import { Face } from './face';
import { Plane } from './plane';

/**
 * Represents a mesh structure composed of vertices, edges, and faces in 3D space.
 * The Mesh class provides methods to build the mesh, split it along a plane, and
 * compute cross-sections.
 */
export class Mesh {

	#vs: Vertex[] = [];
	#es: Edge[]   = [];
	#fs: Face[]   = [];

	/**
	 * Builds the mesh using a set of vertices and face indices.
	 * Each face is formed by a series of edges created from the vertices.
	 *
	 * @param vs - The vertices of the mesh.
	 * @param faceIndex - Array of vertex indices, where each sub-array defines the vertices of a face.
	 */
	static buildMesh(vs: Vertex[], faceIndex: number[][]): Mesh {
		const m = new Mesh();
		for (const v of vs) {
			m.#vs.push([...v]);
		}
		for (const vis of faceIndex) {
			const faceEs: Edge[] = [];

			for (const vi of vis) {
				faceEs.push(new Edge(m.#vs[vi]));
			}
			m.#es.push(...faceEs);
			m.#fs.push(new Face(faceEs));
		}
		Mesh.#pairEdges(m.#es);
		return m;
	}

	/**
	 * Pairs edges that are at the same position but in opposite directions.
	 * This method ensures that half-edges have corresponding paired edges.
	 *
	 * @param es - Array of edges in the mesh.
	 */
	static #pairEdges(es: Edge[]): void {
		for (const e0 of es) {
			if (e0.pair !== null) {
				continue;
			}
			for (const e1 of es) {
				if (e0 === e1 || e1.pair !== null) {
					continue;
				}
				// Matching edge in opposite direction
				if (e0.getBegin() === e1.getEnd() && e1.getBegin() === e0.getEnd()) {
					e0.pair = e1;
					e1.pair = e0;
					break;
				}
			}
		}
	}

	constructor() {
	}

	/**
	 * Splits the mesh along a specified plane and generates new faces and vertices on one side of the plane.
	 *
	 * @param p - The plane to split the mesh along.
	 * @param site - The reference vertex to determine which side of the plane to retain.
	 */
	splitMesh(p: Plane, site: Vertex): void {
		const siteSide: number = p.side(site);
		if (siteSide === 0) {
			return;
		}
		const edgeToInter: Map<Edge, Vertex> = p.intersections(this.#es);
		if (edgeToInter.size === 0) {
			return;
		}
		const sides: Map<Vertex, number> = p.sides(this.#vs);  // Check if each vertex is on front or back side of the plane
		const newVs: Vertex[] = [];
		const newEs: Edge[]   = [];
		const newFs: Face[]   = [];

		for (const f of this.#fs) {
			const newFaceVs: Vertex[] = f.verticesOf(siteSide, sides, edgeToInter);

			if (newFaceVs.length <= 2) {
				continue;
			}
			// If there are three or more vertices on the reference side, create a new face
			const faceEs: Edge[] = [];

			for (const v of newFaceVs) {
				if (!newVs.includes(v)) {
					newVs.push(v);
				}
				faceEs.push(new Edge(v));
			}
			newEs.push(...faceEs);
			newFs.push(new Face(faceEs));
		}
		Mesh.#pairEdges(newEs);

		const unpairedEs: Edge[] = newEs.filter((e: Edge): boolean => e.pair === null);

		// Handle unpaired edges to form a closed loop, creating a new face
		if (unpairedEs.length > 0) {
			const faceEs: Edge[] = [];
			let e: Edge = unpairedEs[0];
			do {
				if (e.next === null) {
					break;
				}
				let next: Edge = e.next;
				while (next && !unpairedEs.includes(next)) {
					next = (next.pair as Edge).next as Edge;
				}
				const ne: Edge = new Edge(next.getBegin());
				faceEs.push(ne);
				ne.pair = e;
				e.pair  = ne;
				e       = next;
			} while (e !== unpairedEs[0]);

			faceEs.reverse();
			newEs.push(...faceEs);
			newFs.push(new Face(faceEs));
		}
		this.#vs = newVs;
		this.#fs = newFs;
		this.#es = newEs;
	}

	/**
	 * Computes the cross-section of the mesh along a specified plane.
	 * Returns a face that represents the cross-section if it exists.
	 *
	 * @param org - The origin vertex for the plane.
	 * @param norm - The normal vector for the plane.
	 * @returns A Face representing the cross-section or null if no intersection exists.
	 */
	crossSection(org: Vertex, norm: Vertex): Face | null {
		const p       : Plane = new Plane(org, norm);
		const siteSide: number = p.side(add(org, norm));
		if (siteSide === 0) {
			return null;
		}
		// Determine front or back side for each vertex
		const edgeToInter: Map<Edge, Vertex> = p.intersections(this.#es);
		if (edgeToInter.size === 0) {
			return null;
		}
		const sides: Map<Vertex, number> = p.sides(this.#vs);
		const newEs: Edge[]   = [];
		const newFs: Face[]   = [];

		for (const f of this.#fs) {
			const newFaceVs: Vertex[] = f.verticesOf(siteSide, sides, edgeToInter);

			if (newFaceVs.length <= 2) {
				continue;
			}
			// Create a new face if there are three or more vertices on the reference side
			const faceEs: Edge[] = [];

			for (const v of newFaceVs) {
				faceEs.push(new Edge(v));
			}
			newEs.push(...faceEs);
			newFs.push(new Face(faceEs));
		}
		Mesh.#pairEdges(newEs);

		const unpairedEs: Edge[] = newEs.filter((e: Edge): boolean => e.pair === null);

		// Form a closed loop with unpaired edges to create a new face if possible
		if (unpairedEs.length > 0) {
			const faceEs: Edge[] = [];
			let e: Edge = unpairedEs[0];
			do {
				if (e.next === null) {
					break;
				}
				let next: Edge = e.next;
				while (next && !unpairedEs.includes(next)) {
					next = (next.pair as Edge).next as Edge;
				}
				const ne: Edge = new Edge(next.getBegin());
				faceEs.push(ne);
				ne.pair = e;
				e.pair  = ne;
				e       = next;
			} while (e !== unpairedEs[0]);

			faceEs.reverse();

			if (faceEs.length > 2) {
				return new Face(faceEs);
			}
		}
		return null;
	}

}
