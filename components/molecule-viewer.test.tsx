import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MoleculeViewer from "./molecule-viewer";
import type { ElementData, Molecule } from "../types/molecule";

// Mock the React Three Fiber and Drei components
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls"></div>,
  Sphere: ({ children, args, position }: any) => (
    <div
      data-testid="sphere"
      data-radius={args[0]}
      data-position={JSON.stringify(position)}
    >
      {children}
    </div>
  ),
  Cylinder: ({ children, args, rotation }: any) => (
    <div
      data-testid="cylinder"
      data-radius={args[0]}
      data-height={args[2]}
      data-rotation={JSON.stringify(rotation)}
    >
      {children}
    </div>
  ),
}));

// Mock the Three.js Vector3 class
vi.mock("three", () => {
  class MockVector3 {
    x: number;
    y: number;
    z: number;

    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    copy(v: MockVector3) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    }

    addVectors(a: MockVector3, b: MockVector3) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      this.z = a.z + b.z;
      return this;
    }

    subVectors(a: MockVector3, b: MockVector3) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      this.z = a.z - b.z;
      return this;
    }

    multiplyScalar(s: number) {
      this.x *= s;
      this.y *= s;
      this.z *= s;
      return this;
    }

    normalize() {
      const length = Math.sqrt(
        this.x * this.x + this.y * this.y + this.z * this.z
      );
      if (length > 0) {
        this.x /= length;
        this.y /= length;
        this.z /= length;
      }
      return this;
    }

    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
  }

  return {
    Vector3: MockVector3,
  };
});

describe("MoleculeViewer", () => {
  const mockElements: ElementData[] = [
    {
      symbol: "H",
      name: "Hydrogen",
      color: "#FFFFFF",
      atomicNumber: 1,
      atomicRadius: 120, // Will be scaled down by component
      category: "nonmetal",
      group: 1,
      period: 1,
    },
    {
      symbol: "O",
      name: "Oxygen",
      color: "#FF0000",
      atomicNumber: 8,
      atomicRadius: 152,
      category: "nonmetal",
      group: 16,
      period: 2,
    },
    {
      symbol: "C",
      name: "Carbon",
      color: "#000000",
      atomicNumber: 6,
      atomicRadius: 170,
      category: "nonmetal",
      group: 14,
      period: 2,
    },
  ];

  const waterMolecule: Molecule = {
    atoms: [
      { element: "H", position: [1.0, 0.0, 0.0] },
      { element: "O", position: [0.0, 0.0, 0.0] },
      { element: "H", position: [-1.0, 0.0, 0.0] },
    ],
    bonds: [
      { start: 0, end: 1, order: 1 },
      { start: 1, end: 2, order: 1 },
    ],
  };

  it("renders a Canvas with proper className", () => {
    render(<MoleculeViewer molecule={waterMolecule} elements={mockElements} />);

    const container = screen.getByTestId("canvas").parentElement;
    expect(container).toHaveClass("w-full");
    expect(container).toHaveClass("h-full");
    expect(container).toHaveClass("bg-gray-900");
    expect(container).toHaveClass("rounded-md");
    expect(container).toHaveClass("overflow-hidden");
  });

  it("renders the correct number of atoms (Spheres)", () => {
    render(<MoleculeViewer molecule={waterMolecule} elements={mockElements} />);

    const atoms = screen.getAllByTestId("sphere");
    expect(atoms).toHaveLength(3);
  });

  it("renders the correct number of bonds (Cylinders)", () => {
    render(<MoleculeViewer molecule={waterMolecule} elements={mockElements} />);

    const bonds = screen.getAllByTestId("cylinder");
    expect(bonds).toHaveLength(2);
  });

  it("properly scales atom radius based on atomicRadius", () => {
    render(<MoleculeViewer molecule={waterMolecule} elements={mockElements} />);

    const atoms = screen.getAllByTestId("sphere");

    // H atoms should have radius of 1.2 (120/100)
    expect(atoms[0]).toHaveAttribute("data-radius", "1.2");

    // O atom should have radius of 1.52 (152/100)
    expect(atoms[1]).toHaveAttribute("data-radius", "1.52");
  });

  it("positions atoms at the correct coordinates", () => {
    render(<MoleculeViewer molecule={waterMolecule} elements={mockElements} />);

    const atoms = screen.getAllByTestId("sphere");

    expect(atoms[0]).toHaveAttribute(
      "data-position",
      JSON.stringify([1.0, 0.0, 0.0])
    );
    expect(atoms[1]).toHaveAttribute(
      "data-position",
      JSON.stringify([0.0, 0.0, 0.0])
    );
    expect(atoms[2]).toHaveAttribute(
      "data-position",
      JSON.stringify([-1.0, 0.0, 0.0])
    );
  });

  it("renders OrbitControls", () => {
    render(<MoleculeViewer molecule={waterMolecule} elements={mockElements} />);

    expect(screen.getByTestId("orbit-controls")).toBeInTheDocument();
  });

  it("handles unknown elements gracefully", () => {
    const moleculeWithUnknownElement: Molecule = {
      atoms: [
        { element: "Xx", position: [0.0, 0.0, 0.0] }, // Unknown element
      ],
      bonds: [],
    };

    render(
      <MoleculeViewer
        molecule={moleculeWithUnknownElement}
        elements={mockElements}
      />
    );

    const atoms = screen.getAllByTestId("sphere");
    expect(atoms).toHaveLength(1);

    // Should use default radius for unknown elements
    expect(atoms[0]).toHaveAttribute("data-radius", "0.5");
  });

  it("handles empty molecule", () => {
    const emptyMolecule: Molecule = {
      atoms: [],
      bonds: [],
    };

    render(<MoleculeViewer molecule={emptyMolecule} elements={mockElements} />);

    // Should render no atoms or bonds
    expect(screen.queryAllByTestId("sphere")).toHaveLength(0);
    expect(screen.queryAllByTestId("cylinder")).toHaveLength(0);
  });

  it("handles invalid bonds gracefully", () => {
    const moleculeWithInvalidBond: Molecule = {
      atoms: [{ element: "H", position: [0.0, 0.0, 0.0] }],
      bonds: [
        { start: 0, end: 999, order: 1 }, // Invalid end atom index
      ],
    };

    // This should not throw an error
    expect(() => {
      render(
        <MoleculeViewer
          molecule={moleculeWithInvalidBond}
          elements={mockElements}
        />
      );
    }).not.toThrow();

    // Should render the one atom but no bonds
    expect(screen.getAllByTestId("sphere")).toHaveLength(1);
    expect(screen.queryAllByTestId("cylinder")).toHaveLength(0);
  });
});
