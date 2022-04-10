export function clone<T>(board: T[][]): T[][];
export function clone<T>(board: T[]): T[];

export function clone<T>(board: T[] | T[][]) {
  return [...board.map((row) => (Array.isArray(row) ? row.slice() : row))];
}
