import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CurrentMolecule } from "./current-molecule";
import type { ElementData, Molecule } from "../types/molecule";

// Mock the UI components
vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, style, ...props }: any) => (
    <div data-testid="badge" style={style} {...props}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children, className }: any) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  ),
  CardDescription: ({ children }: any) => (
    <div data-testid="card-description">{children}</div>
  ),
  CardContent: ({ children }: any) => (
    <div data-testid="card-content">{children}</div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, variant, size }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

vi.mock("lucide-react", () => ({
  Trash2: () => <div data-testid="trash-icon" />,
}));

describe("CurrentMolecule", () => {
  // Sample test data
  const mockElements: ElementData[] = [
    {
      symbol: "H",
      name: "Hydrogen",
      color: "#FF0000",
      atomicNumber: 1,
      category: "noble-gas",
      atomicRadius: 0,
      group: 0,
      period: 0,
    },
    {
      symbol: "O",
      name: "Oxygen",
      color: "#0000FF",
      atomicNumber: 8,
      category: "noble-gas",
      atomicRadius: 0,
      group: 0,
      period: 0,
    },
    {
      symbol: "C",
      name: "Carbon",
      color: "#000000",
      atomicNumber: 6,
      category: "noble-gas",
      atomicRadius: 0,
      group: 0,
      period: 0,
    },
  ];

  const emptyMolecule: Molecule = {
    atoms: [],
    bonds: [],
  };

  const sampleMolecule: Molecule = {
    atoms: [
      { element: "H", position: [1.0, 0.0, 0.0] },
      { element: "O", position: [0.0, 1.0, 0.0] },
      { element: "C", position: [0.0, 0.0, 1.0] },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
    ],
  };

  const mockReset = vi.fn();

  it("renders empty state correctly", () => {
    render(
      <CurrentMolecule
        molecule={emptyMolecule}
        elements={mockElements}
        onReset={mockReset}
      />
    );

    // Check title is rendered
    expect(screen.getByText("Current Molecule")).toBeInTheDocument();

    // Check description for empty state
    expect(screen.getByText("No atoms added yet")).toBeInTheDocument();

    // Check reset button is disabled
    const resetButton = screen.getByTestId("button");
    expect(resetButton).toBeDisabled();
    expect(resetButton).toHaveTextContent("Reset");
  });

  it("renders molecule with atoms correctly", () => {
    render(
      <CurrentMolecule
        molecule={sampleMolecule}
        elements={mockElements}
        onReset={mockReset}
      />
    );

    // Check description shows correct atom and bond count
    expect(screen.getByText("3 atoms and 2 bonds")).toBeInTheDocument();

    // Check reset button is enabled
    const resetButton = screen.getByTestId("button");
    expect(resetButton).not.toBeDisabled();

    // Check all atoms are displayed as badges
    const badges = screen.getAllByTestId("badge");
    expect(badges).toHaveLength(3);

    // Check badge content
    expect(badges[0]).toHaveTextContent("H (at position 1.0, 0.0, 0.0)");
    expect(badges[1]).toHaveTextContent("O (at position 0.0, 1.0, 0.0)");
    expect(badges[2]).toHaveTextContent("C (at position 0.0, 0.0, 1.0)");
  });

  it("applies correct background colors to badges", () => {
    render(
      <CurrentMolecule
        molecule={sampleMolecule}
        elements={mockElements}
        onReset={mockReset}
      />
    );

    const badges = screen.getAllByTestId("badge");

    // Check style properties
    expect(badges[0]).toHaveStyle({ backgroundColor: "#FF0000" }); // H
    expect(badges[1]).toHaveStyle({ backgroundColor: "#0000FF" }); // O
    expect(badges[2]).toHaveStyle({ backgroundColor: "#000000" }); // C
  });

  it("calls onReset when reset button is clicked", () => {
    render(
      <CurrentMolecule
        molecule={sampleMolecule}
        elements={mockElements}
        onReset={mockReset}
      />
    );

    const resetButton = screen.getByTestId("button");
    fireEvent.click(resetButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("handles unknown elements gracefully", () => {
    const moleculeWithUnknownElement: Molecule = {
      atoms: [
        { element: "Xx", position: [1.0, 1.0, 1.0] }, // Unknown element
      ],
      bonds: [],
    };

    render(
      <CurrentMolecule
        molecule={moleculeWithUnknownElement}
        elements={mockElements}
        onReset={mockReset}
      />
    );

    const badge = screen.getByTestId("badge");

    // Unknown elements should get the default gray color
    expect(badge).toHaveStyle({ backgroundColor: "#888" });
    expect(badge).toHaveTextContent("Xx (at position 1.0, 1.0, 1.0)");
  });

  it("applies correct button variant and size", () => {
    render(
      <CurrentMolecule
        molecule={sampleMolecule}
        elements={mockElements}
        onReset={mockReset}
      />
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveAttribute("data-variant", "destructive");
    expect(button).toHaveAttribute("data-size", "sm");
  });
});
