// NOTE: currently unused — preserved during the structural refactor (Q8).
// Prune if it stays unreferenced.
export type AllOrNone<T> = T | { [K in keyof T]?: never };
