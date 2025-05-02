import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PeriodicTable } from "./periodic-table";
import type { ElementData } from "../types/molecule";
import { categoryColors } from "../data/periodic-table-data";

// Mock child components
vi.mock("./element-card", () => ({
  ElementCard: ({ element, isSelected, onClick }: any) => (
    <div
      data-testid="element-card"
      data-element={element.symbol}
      data-selected={isSelected.toString()}
      onClick={onClick}
    >
      {element.symbol}
    </div>
  ),
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, style, className }: any) => (
    <div data-testid="badge" className={className} style={style}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, variant, size }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

vi.mock("lucide-react", () => ({
  Info: () => <div data-testid="info-icon" />,
}));

// Mock the periodic table data colors
vi.mock("../data/periodic-table-data", () => ({
  categoryColors: {
    "alkali-metal": "#ff8a65",
    "alkaline-earth-metal": "#ffb74d",
    "transition-metal": "#ffd54f",
    "post-transition-metal": "#dce775",
    metalloid: "#aed581",
    nonmetal: "#81c784",
    halogen: "#4db6ac",
    "noble-gas": "#4dd0e1",
    lanthanide: "#9575cd",
    actinide: "#ba68c8",
  },
}));

describe("PeriodicTable", () => {
  // Sample element data
  const mockElements: ElementData[] = [
    // Main elements
    {
      symbol: "H",
      name: "Hydrogen",
      atomicNumber: 1,
      category: "nonmetal",
      group: 1,
      period: 1,
      atomicRadius: 120,
      color: "#ffffff",
    },
    {
      symbol: "He",
      name: "Helium",
      atomicNumber: 2,
      category: "noble-gas",
      group: 18,
      period: 1,
      atomicRadius: 140,
      color: "#d9ffff",
    },
    {
      symbol: "Li",
      name: "Lithium",
      atomicNumber: 3,
      category: "alkali-metal",
      group: 1,
      period: 2,
      atomicRadius: 182,
      color: "#cc80ff",
    },
    // Lanthanide
    {
      symbol: "La",
      name: "Lanthanum",
      atomicNumber: 57,
      category: "lanthanide",
      group: 3,
      period: 6,
      specialRow: 1,
      atomicRadius: 240,
      color: "#70d4ff",
    },
    // Actinide
    {
      symbol: "Ac",
      name: "Actinium",
      atomicNumber: 89,
      category: "actinide",
      group: 3,
      period: 7,
      specialRow: 2,
      atomicRadius: 260,
      color: "#70d4ff",
    },
  ];

  const onSelectElement = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the title correctly", () => {
    render(
      <PeriodicTable
        elements={mockElements}
        selectedElement={null}
        onSelectElement={onSelectElement}
      />
    );

    expect(screen.getByText("Periodic Table")).toBeInTheDocument();
  });

  it("renders the info button correctly", () => {
    render(
      <PeriodicTable
        elements={mockElements}
        selectedElement={null}
        onSelectElement={onSelectElement}
      />
    );

    const infoButton = screen.getByTestId("button");
    expect(infoButton).toHaveTextContent("Show Legend");
    expect(infoButton).toHaveAttribute("data-variant", "outline");
    expect(infoButton).toHaveAttribute("data-size", "sm");
  });

  it("toggles legend display when info button is clicked", async () => {
    render(
      <PeriodicTable
        elements={mockElements}
        selectedElement={null}
        onSelectElement={onSelectElement}
      />
    );

    // Initially legend should not be visible
    expect(screen.queryAllByTestId("badge")).toHaveLength(0);

    // Click to show legend
    const infoButton = screen.getByTestId("button");
    fireEvent.click(infoButton);

    // Legend should now be visible
    const badges = screen.getAllByTestId("badge");
    expect(badges.length).toBeGreaterThan(0);
    expect(badges.length).toBe(Object.keys(categoryColors).length);

    // Button text should change
    expect(infoButton).toHaveTextContent("Hide Legend");

    // Click again to hide legend
    fireEvent.click(infoButton);

    // Legend should be hidden
    expect(screen.queryAllByTestId("badge")).toHaveLength(0);
    expect(infoButton).toHaveTextContent("Show Legend");
  });

  it("properly formats category names in the legend", () => {
    render(
      <PeriodicTable
        elements={mockElements}
        selectedElement={null}
        onSelectElement={onSelectElement}
      />
    );

    // Show legend
    fireEvent.click(screen.getByTestId("button"));

    // Check formatted category names
    expect(screen.getByText("Alkali Metal")).toBeInTheDocument();
    expect(screen.getByText("Noble Gas")).toBeInTheDocument();
  });

  it("renders elements in the correct sections based on specialRow", () => {
    render(
      <PeriodicTable
        elements={mockElements}
        selectedElement={null}
        onSelectElement={onSelectElement}
      />
    );

    const cards = screen.getAllByTestId("element-card");
    expect(cards).toHaveLength(mockElements.length);

    // Main elements should be first
    expect(cards[0]).toHaveTextContent("H");
    expect(cards[1]).toHaveTextContent("He");
    expect(cards[2]).toHaveTextContent("Li");

    // Followed by lanthanides and actinides
    expect(cards[3]).toHaveTextContent("La");
    expect(cards[4]).toHaveTextContent("Ac");
  });

  it("sets isSelected correctly based on selectedElement prop", () => {
    render(
      <PeriodicTable
        elements={mockElements}
        selectedElement={mockElements[0]} // Hydrogen is selected
        onSelectElement={onSelectElement}
      />
    );

    const cards = screen.getAllByTestId("element-card");

    // First element (H) should be selected
    expect(cards[0]).toHaveAttribute("data-selected", "true");

    // All others should not be selected
    for (let i = 1; i < cards.length; i++) {
      expect(cards[i]).toHaveAttribute("data-selected", "false");
    }
  });

  it("calls onSelectElement when an element card is clicked", () => {
    render(
      <PeriodicTable
        elements={mockElements}
        selectedElement={null}
        onSelectElement={onSelectElement}
      />
    );

    const cards = screen.getAllByTestId("element-card");

    // Click the second element (He)
    fireEvent.click(cards[1]);

    expect(onSelectElement).toHaveBeenCalledTimes(1);
    expect(onSelectElement).toHaveBeenCalledWith(mockElements[1]);
  });

  it("displays element details when an element is selected", () => {
    render(
      <PeriodicTable
        elements={mockElements}
        selectedElement={mockElements[0]} // Hydrogen
        onSelectElement={onSelectElement}
      />
    );

    // Should show element details section
    expect(screen.getByText("Hydrogen (H)")).toBeInTheDocument();
    expect(screen.getByText(/Atomic Number: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Category: Nonmetal/)).toBeInTheDocument();
    expect(screen.getByText(/Atomic Radius: 120 pm/)).toBeInTheDocument();
  });

  it("does not display element details when no element is selected", () => {
    render(
      <PeriodicTable
        elements={mockElements}
        selectedElement={null}
        onSelectElement={onSelectElement}
      />
    );

    // Should not show element details section
    expect(screen.queryByText(/Atomic Number:/)).not.toBeInTheDocument();
  });

  it("renders correctly with an empty elements array", () => {
    render(
      <PeriodicTable
        elements={[]}
        selectedElement={null}
        onSelectElement={onSelectElement}
      />
    );

    // Should still render the title and button
    expect(screen.getByText("Periodic Table")).toBeInTheDocument();
    expect(screen.getByTestId("button")).toBeInTheDocument();

    // But no element cards
    expect(screen.queryAllByTestId("element-card")).toHaveLength(0);
  });
});
