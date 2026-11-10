// Pure geometry for drag-to-reorder lists (sections and the outline rail).

/** The gap a pointer at `y` is over: 0 = before the first item, n = after the last. */
export function dropIndex(midpoints: readonly number[], y: number): number {
  let index = 0;
  while (index < midpoints.length && y > midpoints[index]) index++;
  return index;
}

/** The final index for the dragged item when it is dropped into gap `drop`. */
export function reorderTarget(from: number, drop: number): number {
  return drop > from ? drop - 1 : drop;
}

/** Whether dropping into `drop` would change the order. */
export function isMove(from: number, drop: number): boolean {
  return drop !== from && drop !== from + 1;
}
