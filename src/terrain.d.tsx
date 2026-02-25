import { FootprintColor } from './constants.d';

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

export const Noop = {
  name: 'X',
  buildable: false,
  farmable: false,
  color: '#114611',
}
// 22, 92, 22
