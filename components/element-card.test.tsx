// __tests__/ElementCard.test.tsx
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { describe, it, expect, vi } from "vitest";
import { ElementCard } from "./element-card";
import type { ElementData } from "../types/molecule";
import { categoryColors } from "../data/periodic-table-data";

// Mock the categoryColors data
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

describe("ElementCard", () => {
  // Sample element data
  const mockElement: ElementData = {
    symbol: "H",
    name: "Hydrogen",
    atomicNumber: 1,
    category: "nonmetal",
    group: 1,
    period: 1,
    color: "#FFFFFF",
    atomicRadius: 0,
  };

  it("renders element symbol and atomic number correctly", () => {
    render(
      <ElementCard
        element={mockElement}
        isSelected={false}
        onClick={() => {}}
      />
    );

    expect(screen.getByText("H")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("applies correct background color from category", () => {
    render(
      <ElementCard
        element={mockElement}
        isSelected={false}
        onClick={() => {}}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ backgroundColor: categoryColors["nonmetal"] });
  });

  it("positions the element correctly in the grid based on group and period", () => {
    render(
      <ElementCard
        element={mockElement}
        isSelected={false}
        onClick={() => {}}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({
      gridColumn: "1",
      gridRow: "1",
    });
  });

  it("applies selected styling when isSelected is true", () => {
    render(
      <ElementCard element={mockElement} isSelected={true} onClick={() => {}} />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("ring-2");
    expect(button).toHaveClass("ring-offset-2");
    expect(button).toHaveClass("ring-black");
    expect(button).toHaveClass("dark:ring-white");
  });

  it("does not apply selected styling when isSelected is false", () => {
    render(
      <ElementCard
        element={mockElement}
        isSelected={false}
        onClick={() => {}}
      />
    );

    const button = screen.getByRole("button");
    expect(button).not.toHaveClass("ring-2");
    expect(button).not.toHaveClass("ring-offset-2");
    expect(button).not.toHaveClass("ring-black");
    expect(button).not.toHaveClass("dark:ring-white");
  });

  it("calls onClick when button is clicked", () => {
    const mockOnClick = vi.fn();

    render(
      <ElementCard
        element={mockElement}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders element with different group and period correctly", () => {
    const oxygenElement: ElementData = {
      symbol: "O",
      name: "Oxygen",
      atomicNumber: 8,
      category: "nonmetal",
      group: 16,
      period: 2,
      color: "#FF0000",
      atomicRadius: 0,
    };

    render(
      <ElementCard
        element={oxygenElement}
        isSelected={false}
        onClick={() => {}}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({
      gridColumn: "16",
      gridRow: "2",
    });

    expect(screen.getByText("O")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("renders element from a different category with the correct color", () => {
    const sodiumElement: ElementData = {
      symbol: "Na",
      name: "Sodium",
      atomicNumber: 11,
      category: "alkali-metal",
      group: 1,
      period: 3,
      color: "#0000FF",
      atomicRadius: 0,
    };

    render(
      <ElementCard
        element={sodiumElement}
        isSelected={false}
        onClick={() => {}}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({
      backgroundColor: categoryColors["alkali-metal"],
    });
  });
});
