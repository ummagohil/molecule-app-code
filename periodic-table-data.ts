// Data structure for periodic table elements
export interface Element {
  symbol: string
  name: string
  atomicNumber: number
  category: ElementCategory
  color: string
  atomicRadius: number // in picometers
  group: number
  period: number
}

export type ElementCategory =
  | "noble-gas"
  | "alkali-metal"
  | "alkaline-earth"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "lanthanide"
  | "actinide"

// Color scheme for element categories
export const categoryColors: Record<ElementCategory, string> = {
  "noble-gas": "#FFBC42",
  "alkali-metal": "#EC674E",
  "alkaline-earth": "#D81159",
  "transition-metal": "#8F2D56",
  "post-transition-metal": "#58586B",
  metalloid: "#218380",
  nonmetal: "#4AABAF",
  halogen: "#73D2DE",
  lanthanide: "#9370DB",
  actinide: "#BA55D3",
}

// Common elements for our simplified periodic table
export const elements: Element[] = [
  {
    symbol: "H",
    name: "Hydrogen",
    atomicNumber: 1,
    category: "nonmetal",
    color: "#FFFFFF",
    atomicRadius: 25,
    group: 1,
    period: 1,
  },
  {
    symbol: "He",
    name: "Helium",
    atomicNumber: 2,
    category: "noble-gas",
    color: "#D9FFFF",
    atomicRadius: 31,
    group: 18,
    period: 1,
  },
  {
    symbol: "Li",
    name: "Lithium",
    atomicNumber: 3,
    category: "alkali-metal",
    color: "#CC80FF",
    atomicRadius: 145,
    group: 1,
    period: 2,
  },
  {
    symbol: "C",
    name: "Carbon",
    atomicNumber: 6,
    category: "nonmetal",
    color: "#909090",
    atomicRadius: 70,
    group: 14,
    period: 2,
  },
  {
    symbol: "N",
    name: "Nitrogen",
    atomicNumber: 7,
    category: "nonmetal",
    color: "#3050F8",
    atomicRadius: 65,
    group: 15,
    period: 2,
  },
  {
    symbol: "O",
    name: "Oxygen",
    atomicNumber: 8,
    category: "nonmetal",
    color: "#FF0D0D",
    atomicRadius: 60,
    group: 16,
    period: 2,
  },
  {
    symbol: "F",
    name: "Fluorine",
    atomicNumber: 9,
    category: "halogen",
    color: "#90E050",
    atomicRadius: 50,
    group: 17,
    period: 2,
  },
  {
    symbol: "Na",
    name: "Sodium",
    atomicNumber: 11,
    category: "alkali-metal",
    color: "#AB5CF2",
    atomicRadius: 180,
    group: 1,
    period: 3,
  },
  {
    symbol: "Cl",
    name: "Chlorine",
    atomicNumber: 17,
    category: "halogen",
    color: "#1FF01F",
    atomicRadius: 100,
    group: 17,
    period: 3,
  },
  {
    symbol: "Fe",
    name: "Iron",
    atomicNumber: 26,
    category: "transition-metal",
    color: "#E06633",
    atomicRadius: 140,
    group: 8,
    period: 4,
  },
  {
    symbol: "Cu",
    name: "Copper",
    atomicNumber: 29,
    category: "transition-metal",
    color: "#C88033",
    atomicRadius: 135,
    group: 11,
    period: 4,
  },
  {
    symbol: "Au",
    name: "Gold",
    atomicNumber: 79,
    category: "transition-metal",
    color: "#FFD123",
    atomicRadius: 135,
    group: 11,
    period: 6,
  },
]

// Preset molecules for quick selection
export const presetMolecules = [
  {
    name: "Water (H₂O)",
    atoms: [
      { element: "O", position: [0, 0, 0] },
      { element: "H", position: [-0.8, 0.6, 0] },
      { element: "H", position: [0.8, 0.6, 0] },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
    ],
  },
  {
    name: "Carbon Dioxide (CO₂)",
    atoms: [
      { element: "C", position: [0, 0, 0] },
      { element: "O", position: [-1.2, 0, 0] },
      { element: "O", position: [1.2, 0, 0] },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
    ],
  },
  {
    name: "Methane (CH₄)",
    atoms: [
      { element: "C", position: [0, 0, 0] },
      { element: "H", position: [0.6, 0.6, 0.6] },
      { element: "H", position: [-0.6, -0.6, 0.6] },
      { element: "H", position: [0.6, -0.6, -0.6] },
      { element: "H", position: [-0.6, 0.6, -0.6] },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
      { start: 0, end: 3 },
      { start: 0, end: 4 },
    ],
  },
]
