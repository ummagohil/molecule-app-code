"use client"

import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Cylinder } from "@react-three/drei"
import { Vector3 } from "three"
import type { ElementData, Molecule } from "../types/molecule"

interface MoleculeViewerProps {
  molecule: Molecule
  elements: ElementData[]
}

export default function MoleculeViewer({ molecule, elements }: MoleculeViewerProps) {
  return (
    <div className="w-full h-full bg-gray-900 rounded-md overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <MoleculeModel molecule={molecule} elements={elements} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function MoleculeModel({ molecule, elements }: MoleculeViewerProps) {
  const groupRef = useRef()

  return (
    <group ref={groupRef}>
      {/* Render atoms */}
      {molecule.atoms.map((atom, index) => {
        const elementData = elements.find((e) => e.symbol === atom.element)
        return (
          <Atom
            key={`atom-${index}`}
            element={atom.element}
            position={atom.position}
            color={elementData?.color || "#FFFFFF"}
            radius={elementData ? elementData.atomicRadius / 100 : 0.5}
          />
        )
      })}

      {/* Render bonds */}
      {molecule.bonds.map((bond, index) => {
        const startAtom = molecule.atoms[bond.start]
        const endAtom = molecule.atoms[bond.end]

        if (!startAtom || !endAtom) return null

        return <Bond key={`bond-${index}`} start={startAtom.position} end={endAtom.position} />
      })}
    </group>
  )
}

function Atom({ element, position, color, radius }) {
  return (
    <Sphere args={[radius, 32, 32]} position={position}>
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
    </Sphere>
  )
}

function Bond({ start, end }) {
  // Calculate the midpoint between atoms
  const startVec = new Vector3(start[0], start[1], start[2])
  const endVec = new Vector3(end[0], end[1], end[2])

  const midpoint = new Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)

  // Calculate the direction vector
  const direction = new Vector3().subVectors(endVec, startVec)
  const length = direction.length()

  // Create a quaternion to rotate the cylinder
  direction.normalize()

  // Calculate rotation to align with the bond direction
  // This is a simplified approach
  const cylinderUp = new Vector3(0, 1, 0)
  const quaternion = new Vector3().copy(direction)

  return (
    <group position={[midpoint.x, midpoint.y, midpoint.z]}>
      <Cylinder args={[0.1, 0.1, length, 16]} rotation={[Math.PI / 2, 0, Math.atan2(direction.z, direction.x)]}>
        <meshStandardMaterial color="#cccccc" roughness={0.4} />
      </Cylinder>
    </group>
  )
}
