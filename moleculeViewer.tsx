"use client"

import { useState, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Cylinder, Environment, Text } from "@react-three/drei"
import { Vector3 } from "three"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Rotate3D, ZoomIn, RefreshCw, Plus } from "lucide-react"

// Element categories for colour coding
const elementCategories = {
  "noble-gas": "#FFBC42",
  "alkali-metal": "#EC674E",
  "alkaline-earth": "#D81159",
  "transition-metal": "#8F2D56",
  "post-transition-metal": "#58586B",
  metalloid: "#218380",
  nonmetal: "#4AABAF",
  halogen: "#73D2DE",
  lanthanide: "#9370DB",
  actinide: "#BA55D3",
  unknown: "#CCCCCC",
}

// Complete periodic table with all elements
const elements = {
  // Period 1
  H: { name: "Hydrogen", color: "#FFFFFF", radius: 0.31, category: "nonmetal", group: 1, period: 1 },
  He: { name: "Helium", color: "#D9FFFF", radius: 0.28, category: "noble-gas", group: 18, period: 1 },

  // Period 2
  Li: { name: "Lithium", color: "#CC80FF", radius: 1.28, category: "alkali-metal", group: 1, period: 2 },
  Be: { name: "Beryllium", color: "#C2FF00", radius: 0.96, category: "alkaline-earth", group: 2, period: 2 },
  B: { name: "Boron", color: "#FFB5B5", radius: 0.84, category: "metalloid", group: 13, period: 2 },
  C: { name: "Carbon", color: "#909090", radius: 0.77, category: "nonmetal", group: 14, period: 2 },
  N: { name: "Nitrogen", color: "#3050F8", radius: 0.71, category: "nonmetal", group: 15, period: 2 },
  O: { name: "Oxygen", color: "#FF0D0D", radius: 0.66, category: "nonmetal", group: 16, period: 2 },
  F: { name: "Fluorine", color: "#90E050", radius: 0.57, category: "halogen", group: 17, period: 2 },
  Ne: { name: "Neon", color: "#B3E3F5", radius: 0.58, category: "noble-gas", group: 18, period: 2 },

  // Period 3
  Na: { name: "Sodium", color: "#AB5CF2", radius: 1.66, category: "alkali-metal", group: 1, period: 3 },
  Mg: { name: "Magnesium", color: "#8AFF00", radius: 1.41, category: "alkaline-earth", group: 2, period: 3 },
  Al: { name: "Aluminium", color: "#BFA6A6", radius: 1.21, category: "post-transition-metal", group: 13, period: 3 },
  Si: { name: "Silicon", color: "#F0C8A0", radius: 1.11, category: "metalloid", group: 14, period: 3 },
  P: { name: "Phosphorus", color: "#FF8000", radius: 1.07, category: "nonmetal", group: 15, period: 3 },
  S: { name: "Sulfur", color: "#FFFF30", radius: 1.05, category: "nonmetal", group: 16, period: 3 },
  Cl: { name: "Chlorine", color: "#1FF01F", radius: 1.02, category: "halogen", group: 17, period: 3 },
  Ar: { name: "Argon", color: "#80D1E3", radius: 1.06, category: "noble-gas", group: 18, period: 3 },

  // Period 4
  K: { name: "Potassium", color: "#8F40D4", radius: 2.03, category: "alkali-metal", group: 1, period: 4 },
  Ca: { name: "Calcium", color: "#3DFF00", radius: 1.76, category: "alkaline-earth", group: 2, period: 4 },
  Sc: { name: "Scandium", color: "#E6E6E6", radius: 1.7, category: "transition-metal", group: 3, period: 4 },
  Ti: { name: "Titanium", color: "#BFC2C7", radius: 1.6, category: "transition-metal", group: 4, period: 4 },
  V: { name: "Vanadium", color: "#A6A6AB", radius: 1.53, category: "transition-metal", group: 5, period: 4 },
  Cr: { name: "Chromium", color: "#8A99C7", radius: 1.39, category: "transition-metal", group: 6, period: 4 },
  Mn: { name: "Manganese", color: "#9C7AC7", radius: 1.39, category: "transition-metal", group: 7, period: 4 },
  Fe: { name: "Iron", color: "#E06633", radius: 1.32, category: "transition-metal", group: 8, period: 4 },
  Co: { name: "Cobalt", color: "#F090A0", radius: 1.26, category: "transition-metal", group: 9, period: 4 },
  Ni: { name: "Nickel", color: "#50D050", radius: 1.24, category: "transition-metal", group: 10, period: 4 },
  Cu: { name: "Copper", color: "#C88033", radius: 1.32, category: "transition-metal", group: 11, period: 4 },
  Zn: { name: "Zinc", color: "#7D80B0", radius: 1.22, category: "transition-metal", group: 12, period: 4 },
  Ga: { name: "Gallium", color: "#C28F8F", radius: 1.22, category: "post-transition-metal", group: 13, period: 4 },
  Ge: { name: "Germanium", color: "#668F8F", radius: 1.2, category: "metalloid", group: 14, period: 4 },
  As: { name: "Arsenic", color: "#BD80E3", radius: 1.19, category: "metalloid", group: 15, period: 4 },
  Se: { name: "Selenium", color: "#FFA100", radius: 1.2, category: "nonmetal", group: 16, period: 4 },
  Br: { name: "Bromine", color: "#A62929", radius: 1.2, category: "halogen", group: 17, period: 4 },
  Kr: { name: "Krypton", color: "#5CB8D1", radius: 1.16, category: "noble-gas", group: 18, period: 4 },

  // Period 5
  Rb: { name: "Rubidium", color: "#702EB0", radius: 2.2, category: "alkali-metal", group: 1, period: 5 },
  Sr: { name: "Strontium", color: "#00FF00", radius: 1.95, category: "alkaline-earth", group: 2, period: 5 },
  Y: { name: "Yttrium", color: "#94FFFF", radius: 1.9, category: "transition-metal", group: 3, period: 5 },
  Zr: { name: "Zirconium", color: "#94E0E0", radius: 1.75, category: "transition-metal", group: 4, period: 5 },
  Nb: { name: "Niobium", color: "#73C2C9", radius: 1.64, category: "transition-metal", group: 5, period: 5 },
  Mo: { name: "Molybdenum", color: "#54B5B5", radius: 1.54, category: "transition-metal", group: 6, period: 5 },
  Tc: { name: "Technetium", color: "#3B9E9E", radius: 1.47, category: "transition-metal", group: 7, period: 5 },
  Ru: { name: "Ruthenium", color: "#248F8F", radius: 1.46, category: "transition-metal", group: 8, period: 5 },
  Rh: { name: "Rhodium", color: "#0A7D8C", radius: 1.42, category: "transition-metal", group: 9, period: 5 },
  Pd: { name: "Palladium", color: "#006985", radius: 1.39, category: "transition-metal", group: 10, period: 5 },
  Ag: { name: "Silver", color: "#C0C0C0", radius: 1.45, category: "transition-metal", group: 11, period: 5 },
  Cd: { name: "Cadmium", color: "#FFD98F", radius: 1.44, category: "transition-metal", group: 12, period: 5 },
  In: { name: "Indium", color: "#A67573", radius: 1.42, category: "post-transition-metal", group: 13, period: 5 },
  Sn: { name: "Tin", color: "#668080", radius: 1.39, category: "post-transition-metal", group: 14, period: 5 },
  Sb: { name: "Antimony", color: "#9E63B5", radius: 1.39, category: "metalloid", group: 15, period: 5 },
  Te: { name: "Tellurium", color: "#D47A00", radius: 1.38, category: "metalloid", group: 16, period: 5 },
  I: { name: "Iodine", color: "#940094", radius: 1.39, category: "halogen", group: 17, period: 5 },
  Xe: { name: "Xenon", color: "#429EB0", radius: 1.4, category: "noble-gas", group: 18, period: 5 },

  // Period 6
  Cs: { name: "Caesium", color: "#57178F", radius: 2.44, category: "alkali-metal", group: 1, period: 6 },
  Ba: { name: "Barium", color: "#00C900", radius: 2.15, category: "alkaline-earth", group: 2, period: 6 },
  La: {
    name: "Lanthanum",
    color: "#70D4FF",
    radius: 2.07,
    category: "lanthanide",
    group: 3,
    period: 6,
    lanthanide: true,
  },
  Ce: { name: "Cerium", color: "#FFFFC7", radius: 2.04, category: "lanthanide", group: 4, period: 9, lanthanide: true },
  Pr: {
    name: "Praseodymium",
    color: "#D9FFC7",
    radius: 2.03,
    category: "lanthanide",
    group: 5,
    period: 9,
    lanthanide: true,
  },
  Nd: {
    name: "Neodymium",
    color: "#C7FFC7",
    radius: 2.01,
    category: "lanthanide",
    group: 6,
    period: 9,
    lanthanide: true,
  },
  Pm: {
    name: "Promethium",
    color: "#A3FFC7",
    radius: 1.99,
    category: "lanthanide",
    group: 7,
    period: 9,
    lanthanide: true,
  },
  Sm: {
    name: "Samarium",
    color: "#8FFFC7",
    radius: 1.98,
    category: "lanthanide",
    group: 8,
    period: 9,
    lanthanide: true,
  },
  Eu: {
    name: "Europium",
    color: "#61FFC7",
    radius: 1.98,
    category: "lanthanide",
    group: 9,
    period: 9,
    lanthanide: true,
  },
  Gd: {
    name: "Gadolinium",
    color: "#45FFC7",
    radius: 1.96,
    category: "lanthanide",
    group: 10,
    period: 9,
    lanthanide: true,
  },
  Tb: {
    name: "Terbium",
    color: "#30FFC7",
    radius: 1.94,
    category: "lanthanide",
    group: 11,
    period: 9,
    lanthanide: true,
  },
  Dy: {
    name: "Dysprosium",
    color: "#1FFFC7",
    radius: 1.92,
    category: "lanthanide",
    group: 12,
    period: 9,
    lanthanide: true,
  },
  Ho: {
    name: "Holmium",
    color: "#00FF9C",
    radius: 1.92,
    category: "lanthanide",
    group: 13,
    period: 9,
    lanthanide: true,
  },
  Er: {
    name: "Erbium",
    color: "#00E675",
    radius: 1.89,
    category: "lanthanide",
    group: 14,
    period: 9,
    lanthanide: true,
  },
  Tm: {
    name: "Thulium",
    color: "#00D452",
    radius: 1.9,
    category: "lanthanide",
    group: 15,
    period: 9,
    lanthanide: true,
  },
  Yb: {
    name: "Ytterbium",
    color: "#00BF38",
    radius: 1.87,
    category: "lanthanide",
    group: 16,
    period: 9,
    lanthanide: true,
  },
  Lu: {
    name: "Lutetium",
    color: "#00AB24",
    radius: 1.87,
    category: "lanthanide",
    group: 17,
    period: 9,
    lanthanide: true,
  },
  Hf: { name: "Hafnium", color: "#4DC2FF", radius: 1.75, category: "transition-metal", group: 4, period: 6 },
  Ta: { name: "Tantalum", color: "#4DA6FF", radius: 1.7, category: "transition-metal", group: 5, period: 6 },
  W: { name: "Tungsten", color: "#2194D6", radius: 1.62, category: "transition-metal", group: 6, period: 6 },
  Re: { name: "Rhenium", color: "#267DAB", radius: 1.51, category: "transition-metal", group: 7, period: 6 },
  Os: { name: "Osmium", color: "#266696", radius: 1.44, category: "transition-metal", group: 8, period: 6 },
  Ir: { name: "Iridium", color: "#175487", radius: 1.41, category: "transition-metal", group: 9, period: 6 },
  Pt: { name: "Platinum", color: "#D0D0E0", radius: 1.36, category: "transition-metal", group: 10, period: 6 },
  Au: { name: "Gold", color: "#FFD123", radius: 1.36, category: "transition-metal", group: 11, period: 6 },
  Hg: { name: "Mercury", color: "#B8B8D0", radius: 1.32, category: "transition-metal", group: 12, period: 6 },
  Tl: { name: "Thallium", color: "#A6544D", radius: 1.45, category: "post-transition-metal", group: 13, period: 6 },
  Pb: { name: "Lead", color: "#575961", radius: 1.46, category: "post-transition-metal", group: 14, period: 6 },
  Bi: { name: "Bismuth", color: "#9E4FB5", radius: 1.48, category: "post-transition-metal", group: 15, period: 6 },
  Po: { name: "Polonium", color: "#AB5C00", radius: 1.4, category: "post-transition-metal", group: 16, period: 6 },
  At: { name: "Astatine", color: "#754F45", radius: 1.5, category: "halogen", group: 17, period: 6 },
  Rn: { name: "Radon", color: "#428296", radius: 1.5, category: "noble-gas", group: 18, period: 6 },

  // Period 7
  Fr: { name: "Francium", color: "#420066", radius: 2.6, category: "alkali-metal", group: 1, period: 7 },
  Ra: { name: "Radium", color: "#007D00", radius: 2.21, category: "alkaline-earth", group: 2, period: 7 },
  Ac: { name: "Actinium", color: "#70ABFA", radius: 2.15, category: "actinide", group: 3, period: 7, actinide: true },
  Th: { name: "Thorium", color: "#00BAFF", radius: 2.06, category: "actinide", group: 4, period: 10, actinide: true },
  Pa: {
    name: "Protactinium",
    color: "#00A1FF",
    radius: 2.0,
    category: "actinide",
    group: 5,
    period: 10,
    actinide: true,
  },
  U: { name: "Uranium", color: "#008FFF", radius: 1.96, category: "actinide", group: 6, period: 10, actinide: true },
  Np: { name: "Neptunium", color: "#0080FF", radius: 1.9, category: "actinide", group: 7, period: 10, actinide: true },
  Pu: { name: "Plutonium", color: "#006BFF", radius: 1.87, category: "actinide", group: 8, period: 10, actinide: true },
  Am: { name: "Americium", color: "#545CF2", radius: 1.8, category: "actinide", group: 9, period: 10, actinide: true },
  Cm: { name: "Curium", color: "#785CE3", radius: 1.69, category: "actinide", group: 10, period: 10, actinide: true },
  Bk: {
    name: "Berkelium",
    color: "#8A4FE3",
    radius: 1.68,
    category: "actinide",
    group: 11,
    period: 10,
    actinide: true,
  },
  Cf: {
    name: "Californium",
    color: "#A136D4",
    radius: 1.68,
    category: "actinide",
    group: 12,
    period: 10,
    actinide: true,
  },
  Es: {
    name: "Einsteinium",
    color: "#B31FD4",
    radius: 1.65,
    category: "actinide",
    group: 13,
    period: 10,
    actinide: true,
  },
  Fm: { name: "Fermium", color: "#B31FBA", radius: 1.67, category: "actinide", group: 14, period: 10, actinide: true },
  Md: {
    name: "Mendelevium",
    color: "#B30DA6",
    radius: 1.73,
    category: "actinide",
    group: 15,
    period: 10,
    actinide: true,
  },
  No: { name: "Nobelium", color: "#BD0D87", radius: 1.76, category: "actinide", group: 16, period: 10, actinide: true },
  Lr: {
    name: "Lawrencium",
    color: "#C70066",
    radius: 1.61,
    category: "actinide",
    group: 17,
    period: 10,
    actinide: true,
  },
  Rf: { name: "Rutherfordium", color: "#CC0059", radius: 1.57, category: "transition-metal", group: 4, period: 7 },
  Db: { name: "Dubnium", color: "#D1004F", radius: 1.49, category: "transition-metal", group: 5, period: 7 },
  Sg: { name: "Seaborgium", color: "#D90045", radius: 1.43, category: "transition-metal", group: 6, period: 7 },
  Bh: { name: "Bohrium", color: "#E00038", radius: 1.41, category: "transition-metal", group: 7, period: 7 },
  Hs: { name: "Hassium", color: "#E6002E", radius: 1.34, category: "transition-metal", group: 8, period: 7 },
  Mt: { name: "Meitnerium", color: "#EB0026", radius: 1.29, category: "unknown", group: 9, period: 7 },
  Ds: { name: "Darmstadtium", color: "#F0001C", radius: 1.28, category: "unknown", group: 10, period: 7 },
  Rg: { name: "Roentgenium", color: "#F50012", radius: 1.21, category: "unknown", group: 11, period: 7 },
  Cn: { name: "Copernicium", color: "#F90009", radius: 1.22, category: "transition-metal", group: 12, period: 7 },
  Nh: { name: "Nihonium", color: "#FD0000", radius: 1.36, category: "unknown", group: 13, period: 7 },
  Fl: { name: "Flerovium", color: "#FF1493", radius: 1.43, category: "unknown", group: 14, period: 7 },
  Mc: { name: "Moscovium", color: "#FF1493", radius: 1.62, category: "unknown", group: 15, period: 7 },
  Lv: { name: "Livermorium", color: "#FF1493", radius: 1.75, category: "unknown", group: 16, period: 7 },
  Ts: { name: "Tennessine", color: "#FF1493", radius: 1.65, category: "unknown", group: 17, period: 7 },
  Og: { name: "Oganesson", color: "#FF1493", radius: 1.57, category: "unknown", group: 18, period: 7 },
}

// Common molecule presets
const moleculePresets = {
  H2O: {
    name: "Water",
    formula: "H2O",
    atoms: [
      { element: "O", position: [0, 0, 0] },
      { element: "H", position: [-0.8, 0.6, 0] },
      { element: "H", position: [0.8, 0.6, 0] },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
    ],
  },
  CO2: {
    name: "Carbon Dioxide",
    formula: "CO2",
    atoms: [
      { element: "C", position: [0, 0, 0] },
      { element: "O", position: [-1.2, 0, 0] },
      { element: "O", position: [1.2, 0, 0] },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
    ],
  },
  CH4: {
    name: "Methane",
    formula: "CH4",
    atoms: [
      { element: "C", position: [0, 0, 0] },
      { element: "H", position: [0.6, 0.6, 0.6] },
      { element: "H", position: [-0.6, -0.6, 0.6] },
      { element: "H", position: [0.6, -0.6, -0.6] },
      { element: "H", position: [-0.6, 0.6, -0.6] },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
      { start: 0, end: 3 },
      { start: 0, end: 4 },
    ],
  },
  NH3: {
    name: "Ammonia",
    formula: "NH3",
    atoms: [
      { element: "N", position: [0, 0, 0] },
      { element: "H", position: [0.8, 0.6, 0] },
      { element: "H", position: [-0.4, 0.6, 0.7] },
      { element: "H", position: [-0.4, 0.6, -0.7] },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
      { start: 0, end: 3 },
    ],
  },
  C2H5OH: {
    name: "Ethanol",
    formula: "C2H5OH",
    atoms: [
      { element: "C", position: [0, 0, 0] },
      { element: "C", position: [1.2, 0, 0] },
      { element: "O", position: [2.4, 0, 0] },
      { element: "H", position: [-0.4, 0.9, 0] },
      { element: "H", position: [-0.4, -0.5, 0.9] },
      { element: "H", position: [-0.4, -0.5, -0.9] },
      { element: "H", position: [1.6, 0.9, 0] },
      { element: "H", position: [1.6, -0.5, -0.9] },
      { element: "H", position: [2.8, 0.9, 0] },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 0, end: 3 },
      { start: 0, end: 4 },
      { start: 0, end: 5 },
      { start: 1, end: 6 },
      { start: 1, end: 7 },
      { start: 2, end: 8 },
    ],
  },
  C6H6: {
    name: "Benzene",
    formula: "C6H6",
    atoms: [
      { element: "C", position: [0, 0, 0] },
      { element: "C", position: [1.2, 0, 0] },
      { element: "C", position: [1.8, 1.2, 0] },
      { element: "C", position: [1.2, 2.4, 0] },
      { element: "C", position: [0, 2.4, 0] },
      { element: "C", position: [-0.6, 1.2, 0] },
      { element: "H", position: [-0.5, -0.9, 0] },
      { element: "H", position: [2.1, -0.5, 0] },
      { element: "H", position: [2.9, 1.2, 0] },
      { element: "H", position: [1.7, 3.3, 0] },
      { element: "H", position: [-0.9, 2.9, 0] },
      { element: "H", position: [-1.7, 1.2, 0] },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 2, end: 3 },
      { start: 3, end: 4 },
      { start: 4, end: 5 },
      { start: 5, end: 0 },
      { start: 0, end: 6 },
      { start: 1, end: 7 },
      { start: 2, end: 8 },
      { start: 3, end: 9 },
      { start: 4, end: 10 },
      { start: 5, end: 11 },
    ],
  },
}

// Parse a chemical formula into element counts
function parseFormula(formula) {
  const elementCounts = {}
  const regex = /([A-Z][a-z]*)(\d*)/g
  let match

  while ((match = regex.exec(formula)) !== null) {
    const element = match[1]
    const count = match[2] ? Number.parseInt(match[2]) : 1

    if (elements[element]) {
      elementCounts[element] = (elementCounts[element] || 0) + count
    } else {
      console.warn(`Unknown element: ${element}`)
    }
  }

  return elementCounts
}

// Generate a simple molecule structure from a formula
function generateMoleculeFromFormula(formula) {
  const elementCounts = parseFormula(formula)
  const atoms = []
  const bonds = []

  let position = 0

  // Place atoms in a line with proper spacing
  Object.entries(elementCounts).forEach(([element, count]) => {
    for (let i = 0; i < count; i++) {
      atoms.push({
        element,
        position: [position, 0, 0],
      })

      // Add bond to previous atom if not the first atom
      if (atoms.length > 1) {
        bonds.push({
          start: atoms.length - 2,
          end: atoms.length - 1,
        })
      }

      position += 1.5 // Space between atoms
    }
  })

  return { atoms, bonds }
}

// Periodic Table Component
function PeriodicTable({ onSelectElement, selectedElement }) {
  // Separate main elements from lanthanides and actinides
  const mainElements = Object.entries(elements).filter(([_, el]) => !el.lanthanide && !el.actinide)
  const lanthanides = Object.entries(elements).filter(([_, el]) => el.lanthanide)
  const actinides = Object.entries(elements).filter(([_, el]) => el.actinide)

  return (
    <div className="overflow-x-auto pb-4">
      {/* Main periodic table */}
      <div
        className="grid gap-1 min-w-[800px]"
        style={{
          gridTemplateColumns: "repeat(18, minmax(30px, 1fr))",
        }}
      >
        {mainElements.map(([symbol, element]) => (
          <button
            key={symbol}
            className={`p-1 rounded-md text-center transition-all text-xs ${
              selectedElement === symbol ? "ring-2 ring-offset-1 ring-black dark:ring-white" : ""
            }`}
            style={{
              backgroundColor: element.color,
              gridColumn: element.group,
              gridRow: element.period,
              visibility: element.group === 3 && element.period >= 6 ? "hidden" : "visible",
            }}
            onClick={() => onSelectElement(symbol)}
          >
            <div className="font-bold">{symbol}</div>
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="h-2"></div>

      {/* Lanthanides */}
      <div className="flex justify-center mt-2">
        <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(30px, 1fr))" }}>
          {lanthanides.map(([symbol, element]) => (
            <button
              key={symbol}
              className={`p-1 rounded-md text-center transition-all text-xs ${
                selectedElement === symbol ? "ring-2 ring-offset-1 ring-black dark:ring-white" : ""
              }`}
              style={{ backgroundColor: element.color }}
              onClick={() => onSelectElement(symbol)}
            >
              <div className="font-bold">{symbol}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Actinides */}
      <div className="flex justify-center mt-1">
        <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(30px, 1fr))" }}>
          {actinides.map(([symbol, element]) => (
            <button
              key={symbol}
              className={`p-1 rounded-md text-center transition-all text-xs ${
                selectedElement === symbol ? "ring-2 ring-offset-1 ring-black dark:ring-white" : ""
              }`}
              style={{ backgroundColor: element.color }}
              onClick={() => onSelectElement(symbol)}
            >
              <div className="font-bold">{symbol}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Custom Molecule Builder Component
function CustomMoleculeBuilder({ onAddElement, selectedElement }) {
  const [customMolecule, setCustomMolecule] = useState({
    atoms: [],
    bonds: [],
  })

  // Add the selected element to the custom molecule
  const addElement = () => {
    if (!selectedElement) return

    // Generate a position that's slightly offset from existing atoms or centred if it's the first atom
    const position =
      customMolecule.atoms.length === 0
        ? [0, 0, 0]
        : [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]

    const newAtom = {
      element: selectedElement,
      position,
    }

    // Create a bond to the last atom if not the first atom
    const newBonds = []
    if (customMolecule.atoms.length > 0) {
      newBonds.push({
        start: customMolecule.atoms.length - 1,
        end: customMolecule.atoms.length,
      })
    }

    const updatedMolecule = {
      atoms: [...customMolecule.atoms, newAtom],
      bonds: [...customMolecule.bonds, ...newBonds],
    }

    setCustomMolecule(updatedMolecule)
    onAddElement(updatedMolecule)
  }

  // Reset the custom molecule
  const resetMolecule = () => {
    setCustomMolecule({
      atoms: [],
      bonds: [],
    })
    onAddElement({
      atoms: [],
      bonds: [],
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          {selectedElement ? (
            <div className="text-sm">
              Selected: <strong>{elements[selectedElement].name}</strong> ({selectedElement})
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Select an element from the periodic table</div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button onClick={addElement} disabled={!selectedElement} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Element
          </Button>
          <Button onClick={resetMolecule} variant="outline" size="sm" disabled={customMolecule.atoms.length === 0}>
            Reset
          </Button>
        </div>
      </div>

      <div className="bg-muted p-3 rounded-md">
        <div className="text-sm font-medium mb-2">Current Custom Molecule:</div>
        {customMolecule.atoms.length === 0 ? (
          <div className="text-sm text-muted-foreground">No atoms added yet</div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {customMolecule.atoms.map((atom, index) => (
              <div
                key={index}
                className="px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: elements[atom.element].color }}
              >
                {atom.element}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MoleculeViewer() {
  const [molecule, setMolecule] = useState(moleculePresets["H2O"])
  const [formula, setFormula] = useState("H2O")
  const [atomSize, setAtomSize] = useState(1)
  const [bondSize, setBondSize] = useState(1)
  const [quality, setQuality] = useState("medium")
  const controlsRef = useRef()
  const [selectedElement, setSelectedElement] = useState(null)

  // Handle formula input
  const handleFormulaSubmit = (e) => {
    e.preventDefault()

    if (moleculePresets[formula]) {
      // Use preset if available
      setMolecule(moleculePresets[formula])
    } else {
      // Generate molecule from formula
      const { atoms, bonds } = generateMoleculeFromFormula(formula)
      setMolecule({
        name: formula,
        formula,
        atoms,
        bonds,
      })
    }
  }

  // Handle custom molecule from periodic table
  const handleCustomMolecule = (customMolecule) => {
    if (customMolecule.atoms.length === 0) {
      // If reset, go back to default molecule
      setMolecule(moleculePresets["H2O"])
      setFormula("H2O")
    } else {
      // Create a formula from the custom molecule
      const elementCounts = {}
      customMolecule.atoms.forEach((atom) => {
        elementCounts[atom.element] = (elementCounts[atom.element] || 0) + 1
      })

      const customFormula = Object.entries(elementCounts)
        .map(([element, count]) => element + (count > 1 ? count : ""))
        .join("")

      setMolecule({
        name: "Custom Molecule",
        formula: customFormula,
        atoms: customMolecule.atoms,
        bonds: customMolecule.bonds,
      })
      setFormula(customFormula)
    }
  }

  // Reset camera view
  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  // Quality settings
  const qualitySettings = {
    low: { segments: 16 },
    medium: { segments: 32 },
    high: { segments: 64 },
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Molecule Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="periodic">
                <TabsList className="w-full">
                  <TabsTrigger value="periodic" className="flex-1">
                    Periodic Table
                  </TabsTrigger>
                  <TabsTrigger value="formula" className="flex-1">
                    Formula
                  </TabsTrigger>
                  <TabsTrigger value="presets" className="flex-1">
                    Presets
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="periodic" className="space-y-4">
                  <PeriodicTable onSelectElement={setSelectedElement} selectedElement={selectedElement} />
                  <CustomMoleculeBuilder onAddElement={handleCustomMolecule} selectedElement={selectedElement} />
                </TabsContent>

                <TabsContent value="formula" className="space-y-4">
                  <form onSubmit={handleFormulaSubmit} className="flex space-x-2">
                    <Input
                      value={formula}
                      onChange={(e) => setFormula(e.target.value)}
                      placeholder="Enter formula (e.g., H2O)"
                    />
                    <Button type="submit">Build</Button>
                  </form>
                  <div className="text-sm text-muted-foreground">Enter a chemical formula like H2O, CO2, CH4, etc.</div>
                </TabsContent>

                <TabsContent value="presets">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(moleculePresets).map(([key, preset]) => (
                      <Button
                        key={key}
                        variant="outline"
                        onClick={() => {
                          setMolecule(preset)
                          setFormula(preset.formula)
                        }}
                        className={formula === preset.formula ? "border-primary" : ""}
                      >
                        {preset.name} ({preset.formula})
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-4 pt-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Atom Size: {atomSize.toFixed(1)}x</h3>
                  <Slider
                    value={[atomSize]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => setAtomSize(value[0])}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Bond Size: {bondSize.toFixed(1)}x</h3>
                  <Slider
                    value={[bondSize]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => setBondSize(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Rendering Quality</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant={quality === "low" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuality("low")}
                    >
                      Low
                    </Button>
                    <Button
                      variant={quality === "medium" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuality("medium")}
                    >
                      Medium
                    </Button>
                    <Button
                      variant={quality === "high" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuality("high")}
                    >
                      High
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3D Visualisation */}
        <div>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>
                {molecule.name} ({molecule.formula})
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={resetView}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[700px] p-0 relative">
              <div className="absolute top-4 left-4 z-10 bg-black/10 backdrop-blur-sm rounded-md p-2 text-white text-sm">
                <div className="flex items-center space-x-2">
                  <Rotate3D className="h-4 w-4" />
                  <span>Drag to rotate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ZoomIn className="h-4 w-4" />
                  <span>Scroll to zoom</span>
                </div>
              </div>

              <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <MoleculeModel
                  molecule={molecule}
                  atomSize={atomSize}
                  bondSize={bondSize}
                  quality={qualitySettings[quality]}
                />
                <OrbitControls
                  ref={controlsRef}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={2}
                  maxDistance={20}
                />
                <Environment preset="city" />
              </Canvas>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MoleculeModel({ molecule, atomSize, bondSize, quality }) {
  const groupRef = useRef()

  return (
    <group ref={groupRef}>
      {/* Render atoms */}
      {molecule.atoms.map((atom, index) => {
        const elementData = elements[atom.element]
        if (!elementData) return null

        return (
          <Atom
            key={`atom-${index}`}
            element={atom.element}
            position={atom.position}
            color={elementData.color}
            radius={elementData.radius * 0.7 * atomSize}
            segments={quality.segments}
          />
        )
      })}

      {/* Render bonds */}
      {molecule.bonds.map((bond, index) => {
        const startAtom = molecule.atoms[bond.start]
        const endAtom = molecule.atoms[bond.end]

        if (!startAtom || !endAtom) return null

        return (
          <Bond
            key={`bond-${index}`}
            start={startAtom.position}
            end={endAtom.position}
            radius={0.1 * bondSize}
            segments={quality.segments}
          />
        )
      })}
    </group>
  )
}

function Atom({ element, position, color, radius, segments }) {
  return (
    <group position={position}>
      <Sphere args={[radius, segments, segments]}>
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
      </Sphere>

      {/* Element label - only show for larger atoms */}
      {radius > 0.5 && (
        <group position={[0, radius + 0.2, 0]}>
          <Text color="white" fontSize={0.3} anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="black">
            {element}
          </Text>
        </group>
      )}
    </group>
  )
}

function Bond({ start, end, radius, segments }) {
  // Calculate the midpoint between atoms
  const startVec = new Vector3(start[0], start[1], start[2])
  const endVec = new Vector3(end[0], end[1], end[2])

  const midpoint = new Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)

  // Calculate the direction vector
  const direction = new Vector3().subVectors(endVec, startVec)
  const length = direction.length()

  // Calculate rotation to align with the bond direction
  direction.normalize()

  return (
    <group position={[midpoint.x, midpoint.y, midpoint.z]}>
      <Cylinder
        args={[radius, radius, length, segments]}
        rotation={[Math.PI / 2, 0, Math.atan2(direction.z, direction.x)]}
      >
        <meshStandardMaterial color="#cccccc" roughness={0.4} />
      </Cylinder>
    </group>
  )
}
