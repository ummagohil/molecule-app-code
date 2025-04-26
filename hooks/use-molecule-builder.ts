"use client"

import { useState } from "react"
import type { ElementData, Molecule, PresetMolecule } from "../types/molecule"

export function useMoleculeBuilder() {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null)
  const [molecule, setMolecule] = useState<Molecule>({
    atoms: [],
    bonds: [],
  })

  // Add an atom to the molecule
  const addAtom = () => {
    if (!selectedElement) return

    // Generate a position that's slightly offset from existing atoms
    // or centered if it's the first atom
    const position: [number, number, number] =
      molecule.atoms.length === 0 ? [0, 0, 0] : [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]

    const newAtom = {
      element: selectedElement.symbol,
      position,
    }

    // If there are existing atoms, create a bond to the last atom
    const newBonds = []
    if (molecule.atoms.length > 0) {
      newBonds.push({
        start: molecule.atoms.length - 1,
        end: molecule.atoms.length,
      })
    }

    setMolecule({
      atoms: [...molecule.atoms, newAtom],
      bonds: [...molecule.bonds, ...newBonds],
    })
  }

  // Reset the molecule
  const resetMolecule = () => {
    setMolecule({ atoms: [], bonds: [] })
  }

  // Load a preset molecule
  const loadPreset = (preset: PresetMolecule) => {
    setMolecule({
      atoms: preset.atoms,
      bonds: preset.bonds,
      name: preset.name,
    })
  }

  return {
    molecule,
    selectedElement,
    setSelectedElement,
    addAtom,
    resetMolecule,
    loadPreset,
  }
}
