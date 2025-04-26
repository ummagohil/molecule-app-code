"use client"

import type { ElementData } from "../types/molecule"
import { categoryColors } from "../data/periodic-table-data"

interface ElementCardProps {
  element: ElementData
  isSelected: boolean
  onClick: () => void
}

export function ElementCard({ element, isSelected, onClick }: ElementCardProps) {
  return (
    <button
      className={`p-2 rounded-md text-center transition-all ${
        isSelected ? "ring-2 ring-offset-2 ring-black dark:ring-white" : ""
      }`}
      style={{
        backgroundColor: categoryColors[element.category],
        gridColumn: `${element.group}`,
        gridRow: `${element.period}`,
      }}
      onClick={onClick}
    >
      <div className="font-bold">{element.symbol}</div>
      <div className="text-xs">{element.atomicNumber}</div>
    </button>
  )
}
