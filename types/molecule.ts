// Shared types for the molecular visualization system
export interface ElementData {
  symbol: string
  name: string
  atomicNumber: number
  category: ElementCategory
  color: string
  atomicRadius: number // in picometers
  group: number
  period: number
  // Special positioning for lanthanides and actinides
  specialRow?: number
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
  | "unknown"

export interface MoleculeAtom {
  element: string
  position: [number, number, number]
}

export interface MoleculeBond {
  start: number
  end: number
}

export interface Molecule {
  name?: string
  atoms: MoleculeAtom[]
  bonds: MoleculeBond[]
}

export interface PresetMolecule extends Molecule {
  name: string
}
