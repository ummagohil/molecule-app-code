"use client"

import { useState } from "react"
import type { ElementData } from "../types/molecule"
import { ElementCard } from "./element-card"
import { categoryColors } from "../data/periodic-table-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

interface PeriodicTableProps {
  elements: ElementData[]
  selectedElement: ElementData | null
  onSelectElement: (element: ElementData) => void
}

export function PeriodicTable({ elements, selectedElement, onSelectElement }: PeriodicTableProps) {
  const [showInfo, setShowInfo] = useState(false)

  // Group elements by their special rows (lanthanides and actinides)
  const mainElements = elements.filter((e) => !e.specialRow)
  const lanthanides = elements.filter((e) => e.specialRow === 1)
  const actinides = elements.filter((e) => e.specialRow === 2)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Periodic Table</h3>
        <Button variant="outline" size="sm" onClick={() => setShowInfo(!showInfo)}>
          <Info className="h-4 w-4 mr-2" />
          {showInfo ? "Hide" : "Show"} Legend
        </Button>
      </div>

      {showInfo && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {Object.entries(categoryColors).map(([category, color]) => (
            <Badge key={category} style={{ backgroundColor: color }} className="justify-start">
              {category
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Badge>
          ))}
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        {/* Main periodic table */}
        <div
          className="grid grid-cols-18 gap-1 min-w-[900px]"
          style={{ gridTemplateColumns: "repeat(18, minmax(40px, 1fr))" }}
        >
          {mainElements.map((element) => (
            <ElementCard
              key={element.symbol}
              element={element}
              isSelected={selectedElement?.symbol === element.symbol}
              onClick={() => onSelectElement(element)}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="h-4"></div>

        {/* Lanthanides */}
        <div
          className="grid grid-cols-15 gap-1 ml-[80px] min-w-[900px]"
          style={{ gridTemplateColumns: "repeat(15, minmax(40px, 1fr))" }}
        >
          {lanthanides.map((element) => (
            <ElementCard
              key={element.symbol}
              element={element}
              isSelected={selectedElement?.symbol === element.symbol}
              onClick={() => onSelectElement(element)}
            />
          ))}
        </div>

        {/* Actinides */}
        <div
          className="grid grid-cols-15 gap-1 ml-[80px] min-w-[900px]"
          style={{ gridTemplateColumns: "repeat(15, minmax(40px, 1fr))" }}
        >
          {actinides.map((element) => (
            <ElementCard
              key={element.symbol}
              element={element}
              isSelected={selectedElement?.symbol === element.symbol}
              onClick={() => onSelectElement(element)}
            />
          ))}
        </div>
      </div>

      {selectedElement && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <h4 className="font-medium">
            {selectedElement.name} ({selectedElement.symbol})
          </h4>
          <div className="text-sm text-muted-foreground">
            Atomic Number: {selectedElement.atomicNumber} | Category:{" "}
            {selectedElement.category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}{" "}
            | Atomic Radius: {selectedElement.atomicRadius} pm
          </div>
        </div>
      )}
    </div>
  )
}
