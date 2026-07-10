/**
 * Vertex
 *
 * @author Takuto Yanagida
 * @version 2026-07-10
 */

export type Vertex = [number, number, number];

/**
 * Adds two 3D vectors component-wise.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The resulting vector a + b.
 */
export function add(a: Vertex, b: Vertex): Vertex {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

/**
 * Subtracts one 3D vector from another component-wise.
 *
 * @param a - The minuend vector.
 * @param b - The subtrahend vector.
 * @returns The resulting vector a - b.
 */
export function sub(a: Vertex, b: Vertex): Vertex {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

/**
 * Computes an interpolated point between two vectors.
 *
 * @param a - The start vector.
 * @param b - The end vector.
 * @param m - The interpolation factor where 0 gives a and 1 gives b.
 * @returns The interpolated vector.
 */
export function intDiv(a: Vertex, b: Vertex, m: number = 0.5): Vertex {
	const n: number = 1 - m;
	return [
		a[0] * n + b[0] * m,
		a[1] * n + b[1] * m,
		a[2] * n + b[2] * m,
	];
}
