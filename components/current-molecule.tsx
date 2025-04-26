"use client"

import type { ElementData, Molecule } from "../types/molecule"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface CurrentMoleculeProps {
  molecule: Molecule
  elements: ElementData[]
  onReset: () => void
}

export function CurrentMolecule({ molecule, elements, onReset }: CurrentMoleculeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Current Molecule</span>
          <Button variant="destructive" size="sm" onClick={onReset} disabled={molecule.atoms.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </CardTitle>
        <CardDescription>
          {molecule.atoms.length > 0
            ? `${molecule.atoms.length} atoms and ${molecule.bonds.length} bonds`
            : "No atoms added yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {molecule.atoms.map((atom, index) => {
            const elementData = elements.find((e) => e.symbol === atom.element)
            return (
              <Badge
                key={index}
                style={{
                  backgroundColor: elementData?.color || "#888",
                }}
              >
                {atom.element} (at position {atom.position.map((p) => p.toFixed(1)).join(", ")})
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
