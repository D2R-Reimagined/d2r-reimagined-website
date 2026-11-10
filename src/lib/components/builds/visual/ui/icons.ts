// Stroke icons on a 24×24 grid, drawn with currentColor. Add a name here, then use <Icon name="…" />.
export const icons = {
  text: ['M4 6h16', 'M4 12h16', 'M4 18h10'],
  callout: ['M4 5h16v11H9l-5 4z', 'M12 8v3', 'M12 13.5v.01'],
  items: ['M6 4h12l3 5-9 11L3 9z', 'M3 9h18', 'M9.5 4 12 9l2.5-5'],
  skills: ['M14 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0', 'M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0', 'M20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0', 'M11 7l-4 9', 'M13 7l4 9'],
  equipment: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z'],
  image: ['M4 5h16v14H4z', 'M4 16l5-5 4 4 3-3 4 4', 'M17 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0'],
  video: ['M3 6h13v12H3z', 'M16 10l5-3v10l-5-3'],
  plus: ['M12 5v14', 'M5 12h14'],
  undo: ['M9 14 4 9l5-5', 'M4 9h10.5a5.5 5.5 0 0 1 0 11H11'],
  redo: ['M15 14l5-5-5-5', 'M20 9H9.5a5.5 5.5 0 0 0 0 11H13'],
  more: ['M7.2 12a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0', 'M13.2 12a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0', 'M19.2 12a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  up: ['M12 19V5', 'M6 11l6-6 6 6'],
  down: ['M12 5v14', 'M6 13l6 6 6-6'],
  copy: ['M8 8h12v12H8z', 'M4 16V4h12'],
  trash: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 13h10l1-13'],
  pencil: ['M4 20h4L19 9l-4-4L4 16z'],
  note: ['M5 4h14v16H5z', 'M8 9h8', 'M8 13h8', 'M8 17h5']
} as const satisfies Record<string, readonly string[]>;

export type IconName = keyof typeof icons;
