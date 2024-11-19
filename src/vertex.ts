/**
 * Vertex
 *
 * @author Takuto Yanagida
 * @version 2024-11-19
 */

export type Vertex = [number, number, number];

export function add(a: Vertex, b: Vertex): Vertex {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function sub(a: Vertex, b: Vertex): Vertex {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function intDiv(a: Vertex, b: Vertex, m: number = 0.5): Vertex {
	const n: number = 1 - m;
	return [
		a[0] * n + b[0] * m,
		a[1] * n + b[1] * m,
		a[2] * n + b[2] * m,
	];
}
