/**
 * Mesh
 *
 * @author Takuto Yanagida
 * @version 2024-11-13
 */

import { Vertex } from './vertex';
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
	#es: Edge[] = [];
	#fs: Face[] = [];

	constructor() {
	}

	/**
	 * Builds the mesh using a set of vertices and face indices.
	 * Each face is formed by a series of edges created from the vertices.
	 *
	 * @param vs - The vertices of the mesh.
	 * @param faceIndex - Array of vertex indices, where each sub-array defines the vertices of a face.
	 */
	buildMesh(vs: Vertex[], faceIndex: number[][]): void {
		for (const v of vs) {
			this.#vs.push(v);
		}
		for (const fi of faceIndex) {
			const faceEs: Edge[] = [];
			for (const vi of fi) {
				const e = new Edge(this.#vs[vi]);
				faceEs.push(e);
				this.#es.push(e);
			}
			this.#fs.push(new Face(faceEs));
		}
		this.#pairEdges(this.#es);
	}

	/**
	 * Pairs edges that are at the same position but in opposite directions.
	 * This method ensures that half-edges have corresponding paired edges.
	 *
	 * @param es - Array of edges in the mesh.
	 */
	#pairEdges(es: Edge[]): void {
		for (const e0 of es) {
			if (e0.pair !== null) {
				continue;
			}
			for (const e1 of es) {
				if (e0 === e1 || e1.pair !== null) {
					continue;
				}
				 // Matching edge in opposite direction
				if ((e0.getBegin() === e1.getEnd()) && (e1.getBegin() === e0.getEnd())) {
					e0.pair = e1;
					e1.pair = e0;
					break;
				}
			}
		}
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
		const newVs: Vertex[] = [];
		const newFs: Face[] = [];
		const newEs: Edge[] = [];

		const sides: Map<Vertex, number> = p.sides(this.#vs);  // Check if each vertex is on front or back side of the plane
		const edgeToInter: Map<Edge, Vertex> = p.intersections(this.#es);

		for (const f of this.#fs) {
			const newFaceVs: Vertex[] = f.verticesOf(siteSide, sides, edgeToInter);

			// If there are three or more vertices on the reference side, create a new face
			if (newFaceVs.length > 2) {
				const faceEs: Edge[] = [];
				for (const v of newFaceVs) {
					if (!newVs.includes(v)) {
						newVs.push(v);
					}
					const e = new Edge(v);
					faceEs.push(e);
					newEs.push(e);
				}
				newFs.push(new Face(faceEs));
			}
		}
		this.#pairEdges(newEs);

		const firstUnpairedEdge: Edge | undefined = newEs.find(e => e.pair === null);

		// Handle unpaired edges to form a closed loop, creating a new face
		if (firstUnpairedEdge) {
			const faceEs: Edge[] = [];
			let he: Edge = firstUnpairedEdge;
			do {
				let next: Edge = (he.next.pair as Edge).next;
				while (next.pair !== null) {
					next = next.pair.next;
				}
				const nhe: Edge = new Edge(next.getBegin());
				faceEs.push(nhe);
			} while (he !== firstUnpairedEdge);

			faceEs.reverse();
			newFs.push(new Face(faceEs));
			newEs.push(...faceEs);
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
		const ret: Mesh = new Mesh();

		const p: Plane = new Plane(org, norm);
		const siteSide: number = p.side(new Vertex(org.x + norm.x, org.y + norm.y, org.z + norm.z));
		if (siteSide === 0) {
			return null;
		}
		// Determine front or back side for each vertex
		const sides: Map<Vertex, number> = p.sides(this.#vs);
		const edgeToInter: Map<Edge, Vertex> = p.intersections(this.#es);
		if (edgeToInter.size === 0) {
			return null;
		}
		for (const f of this.#fs) {
			const newFaceVs: Vertex[] = f.verticesOf(siteSide, sides, edgeToInter);

			// Create a new face if there are three or more vertices on the reference side
			if (newFaceVs.length > 2) {
				const faceEs: Edge[] = [];
				for (const v of newFaceVs) {
					if (!ret.#vs.includes(v)) {
						ret.#vs.push(v);
					}
					const e = new Edge(v);
					faceEs.push(e);
					ret.#es.push(e);
				}
				ret.#fs.push(new Face(faceEs));
			}
		}
		this.#pairEdges(ret.#es);

		const firstUnpairedEdge: Edge | undefined = ret.#es.find(e => e.pair === null);

		// Form a closed loop with unpaired edges to create a new face if possible
		if (firstUnpairedEdge) {
			const faceEdges: Edge[] = [];
			let he: Edge = firstUnpairedEdge;
			do {
				if (he.next === null || he.next.pair === null || he.next.pair.next === null) {
					break;
				}
				let next: Edge = he.next.pair.next;
				while (next !== null && next.pair) {
					next = (next.pair as Edge).next;
				}
				const nhe: Edge = new Edge(next.getBegin());
				faceEdges.push(nhe);
				nhe.pair = he;
				he.pair  = nhe;
				he       = next;
			} while (he !== firstUnpairedEdge);

			if (faceEdges.length > 2) {
				return new Face(faceEdges.reverse());
			}
		}
		return null;
	}

}
