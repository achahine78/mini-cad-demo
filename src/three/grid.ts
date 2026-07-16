const GRID_SNAP = 0.5;

export const snapToGrid = (value: number, gridSnap: number = GRID_SNAP) =>
    Math.round(value / gridSnap) * gridSnap;
