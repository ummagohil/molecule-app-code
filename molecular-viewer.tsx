"use client"

import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Cylinder, Environment } from "@react-three/drei"
import { Vector3 } from "three"

// Simple water molecule model (H2O)
const waterMolecule = {
  atoms: [
    { element: "O", position: [0, 0, 0], color: "#ff0000" },
    { element: "H", position: [-0.8, 0.6, 0], color: "#ffffff" },
    { element: "H", position: [0.8, 0.6, 0], color: "#ffffff" },
  ],
  bonds: [
    { start: 0, end: 1 },
    { start: 0, end: 2 },
  ],
}

export default function MolecularViewer() {
  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      <div className="p-4 text-white">
        <h1 className="text-2xl font-bold">Water Molecule (H₂O) Viewer</h1>
        <p>Drag to rotate, scroll to zoom, right-click to pan</p>
      </div>
      <div className="flex-1">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Molecule molecule={waterMolecule} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          <Environment preset="city" />
        </Canvas>
      </div>
    </div>
  )
}

function Molecule({ molecule }) {
  const groupRef = useRef()

  return (
    <group ref={groupRef}>
      {/* Render atoms */}
      {molecule.atoms.map((atom, index) => (
        <Atom key={`atom-${index}`} element={atom.element} position={atom.position} color={atom.color} />
      ))}

      {/* Render bonds */}
      {molecule.bonds.map((bond, index) => {
        const startAtom = molecule.atoms[bond.start]
        const endAtom = molecule.atoms[bond.end]

        return <Bond key={`bond-${index}`} start={startAtom.position} end={endAtom.position} />
      })}
    </group>
  )
}

function Atom({ element, position, color }) {
  // Scale atoms based on element (oxygen is larger than hydrogen)
  const radius = element === "O" ? 0.6 : 0.4

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
