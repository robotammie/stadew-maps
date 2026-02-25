// COLORS
export const FieldColor = '#8c5703'
export const FootprintColor = '#6E6E6E'
export const HaloColor ='rgba(207, 160, 4, 0.6)';
export const FootprintBuildable = 'rgba(0, 180, 0, 0.5)';
export const FootprintUnbuildable = 'rgba(200, 0, 0, 0.6)';


// Terrain Types
export const Dirt = {
  name: 'Dirt',
  buildable: true,
  farmable: true,
  color: '#cf8004',
}

export const Marsh = {
  name: 'Marsh',
  buildable: true,
  farmable: true,
  color: '#B47005',
}

export const Grass = {
  name: 'Grass',
  buildable: true,
  farmable: false,
  color: '#6AA84F',
}

export const Brush = {
  name: 'Brush',
  buildable: false,
  farmable: false,
  color: '#228B22',
}

export const Water = {
  name: 'Water',
  buildable: false,
  farmable: false,
  color: '#1E90FF',
}

export const Buildings = {
  name: 'Buildings',
  buildable: false,
  farmable: false,
  color: FootprintColor,
}

export const Paths = {
  name: 'Paths',
  buildable: false,
  farmable: false,
  color: '#af6004',
}
