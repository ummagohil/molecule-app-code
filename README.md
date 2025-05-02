# 🧪 Molecule App

The periodic table view allows users to be able to build molecule structures. There is also a preset list as well. All data is mock data. The rendering of molecules is done through Three.

## 🔬 Periodic table

The mock data is imported into the component and then sorted based on the type of element it is.

```ts
const mainElements = elements.filter((e) => !e.specialRow);
const lanthanides = elements.filter((e) => e.specialRow === 1);
const actinides = elements.filter((e) => e.specialRow === 2);
```

These values are then mapped over in a grid and an onClick handler enables the user to add these elements to the view.

## ⚗️ Molecule Viewer
In this component, the canvas is created to render the molecules selected by the user.

```ts
export default function MoleculeViewer({
  molecule,
  elements,
}: MoleculeViewerProps) {
  return (
    <div className="w-full h-full bg-gray-900 rounded-md overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <MoleculeModel molecule={molecule} elements={elements} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
```

There are multiple nested components within this component however this enables you to have `refs` for each element, which help with identifying the type of element.

##  ⚗️ Molecule Builder
This is where the user is able to use the hook to render the molecules, select functionality and where the `MoleculeViewer` component comes into play.

### `use-molecule-builder` hook

- Usage: `const { molecule, selectedElement, setSelectedElement, addAtom, resetMolecule, loadPreset } = useMoleculeBuilder()`

#### ⚗️ Molecule

```ts
const [molecule, setMolecule] = useState<Molecule>({
  atoms: [],
  bonds: [],
});
```

#### ⚗️ selectedElement

```ts
const [selectedElement, setSelectedElement] = useState<ElementData | null>(
  null
);
```

#### ⚗️ addAtom

This function sets the position and then pushes the new atom or if there are multiple which form a bond.

```ts
// Add an atom to the molecule
const addAtom = () => {
  if (!selectedElement) return;

  // Generate a position that's slightly offset from existing atoms
  // or centered if it's the first atom
  const position: [number, number, number] =
    molecule.atoms.length === 0
      ? [0, 0, 0]
      : [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1];

  const newAtom = {
    element: selectedElement.symbol,
    position,
  };

  // If there are existing atoms, create a bond to the last atom
  const newBonds = [];
  if (molecule.atoms.length > 0) {
    newBonds.push({
      start: molecule.atoms.length - 1,
      end: molecule.atoms.length,
    });
  }

  setMolecule({
    atoms: [...molecule.atoms, newAtom],
    bonds: [...molecule.bonds, ...newBonds],
  });
};
```

#### ⚗️ resetMolecule

```ts
// Reset the molecule
const resetMolecule = () => {
  setMolecule({ atoms: [], bonds: [] });
};
```

#### ⚗️ loadPreset

```ts
// Load a preset molecule
const loadPreset = (preset: PresetMolecule) => {
  setMolecule({
    atoms: preset.atoms,
    bonds: preset.bonds,
    name: preset.name,
  });
};
```

## ⚙️ Testing

`npm run test`
