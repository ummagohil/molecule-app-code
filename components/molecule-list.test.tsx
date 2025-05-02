import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { describe, it, expect, vi } from "vitest";
import { MoleculeList } from "./molecule-list";
import type { PresetMolecule } from "../types/molecule";

// Mock the UI components
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className, onClick }: any) => (
    <div data-testid="card" className={className} onClick={onClick}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className }: any) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  ),
  CardDescription: ({ children }: any) => (
    <div data-testid="card-description">{children}</div>
  ),
}));

describe("MoleculeList", () => {
  // Sample molecules data
  const mockMolecules: PresetMolecule[] = [
    {
      name: "Water",
      atoms: [
        { element: "H", position: [1.0, 0.0, 0.0] },
        { element: "H", position: [-1.0, 0.0, 0.0] },
        { element: "O", position: [0.0, 0.0, 0.0] },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 },
        { from: 1, to: 2, order: 1 },
      ],
    },
    {
      name: "Methane",
      atoms: [
        { element: "C", position: [0.0, 0.0, 0.0] },
        { element: "H", position: [1.0, 0.0, 0.0] },
        { element: "H", position: [-1.0, 0.0, 0.0] },
        { element: "H", position: [0.0, 1.0, 0.0] },
        { element: "H", position: [0.0, -1.0, 0.0] },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 },
        { from: 0, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 },
        { from: 0, to: 4, order: 1 },
      ],
    },
  ];

  it("renders a grid with the correct classes", () => {
    render(
      <MoleculeList molecules={mockMolecules} onSelectMolecule={() => {}} />
    );

    const grid = screen.getByRole("generic");
    expect(grid).toHaveClass("grid");
    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("md:grid-cols-2");
    expect(grid).toHaveClass("gap-4");
  });

  it("renders the correct number of molecule cards", () => {
    render(
      <MoleculeList molecules={mockMolecules} onSelectMolecule={() => {}} />
    );

    const cards = screen.getAllByTestId("card");
    expect(cards).toHaveLength(2);
  });

  it("displays the correct molecule information in each card", () => {
    render(
      <MoleculeList molecules={mockMolecules} onSelectMolecule={() => {}} />
    );

    // Check molecule names
    expect(screen.getByText("Water")).toBeInTheDocument();
    expect(screen.getByText("Methane")).toBeInTheDocument();

    // Check molecule descriptions
    expect(screen.getByText("3 atoms, 2 bonds")).toBeInTheDocument();
    expect(screen.getByText("5 atoms, 4 bonds")).toBeInTheDocument();
  });

  it("applies the correct styling to cards", () => {
    render(
      <MoleculeList molecules={mockMolecules} onSelectMolecule={() => {}} />
    );

    const cards = screen.getAllByTestId("card");

    // Check that all cards have the required classes
    cards.forEach((card) => {
      expect(card).toHaveClass("cursor-pointer");
      expect(card).toHaveClass("hover:bg-muted/50");
      expect(card).toHaveClass("transition-colors");
    });
  });

  it("calls onSelectMolecule with the correct molecule when a card is clicked", () => {
    const mockOnSelectMolecule = vi.fn();

    render(
      <MoleculeList
        molecules={mockMolecules}
        onSelectMolecule={mockOnSelectMolecule}
      />
    );

    const cards = screen.getAllByTestId("card");

    // Click the first card (Water)
    fireEvent.click(cards[0]);
    expect(mockOnSelectMolecule).toHaveBeenCalledTimes(1);
    expect(mockOnSelectMolecule).toHaveBeenCalledWith(mockMolecules[0]);

    // Click the second card (Methane)
    fireEvent.click(cards[1]);
    expect(mockOnSelectMolecule).toHaveBeenCalledTimes(2);
    expect(mockOnSelectMolecule).toHaveBeenCalledWith(mockMolecules[1]);
  });

  it("renders correctly with an empty molecules array", () => {
    render(<MoleculeList molecules={[]} onSelectMolecule={() => {}} />);

    // Should render the grid but no cards
    const grid = screen.getByRole("generic");
    expect(grid).toBeInTheDocument();

    const cards = screen.queryAllByTestId("card");
    expect(cards).toHaveLength(0);
  });

  it("applies the correct styling to card headers", () => {
    render(
      <MoleculeList molecules={mockMolecules} onSelectMolecule={() => {}} />
    );

    const cardHeaders = screen.getAllByTestId("card-header");

    cardHeaders.forEach((header) => {
      expect(header).toHaveClass("p-4");
    });
  });

  it("applies the correct styling to card titles", () => {
    render(
      <MoleculeList molecules={mockMolecules} onSelectMolecule={() => {}} />
    );

    const cardTitles = screen.getAllByTestId("card-title");

    cardTitles.forEach((title) => {
      expect(title).toHaveClass("text-lg");
    });
  });
});
