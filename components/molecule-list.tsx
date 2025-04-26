"use client"

import type { PresetMolecule } from "../types/molecule"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface MoleculeListProps {
  molecules: PresetMolecule[]
  onSelectMolecule: (molecule: PresetMolecule) => void
}

export function MoleculeList({ molecules, onSelectMolecule }: MoleculeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {molecules.map((molecule, index) => (
        <Card
          key={index}
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => onSelectMolecule(molecule)}
        >
          <CardHeader className="p-4">
            <CardTitle className="text-lg">{molecule.name}</CardTitle>
            <CardDescription>
              {molecule.atoms.length} atoms, {molecule.bonds.length} bonds
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
