"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, RotateCw } from "lucide-react"
import { elements, presetMolecules } from "./data/periodic-table-data"
import { PeriodicTable } from "./components/periodic-table"
import { MoleculeList } from "./components/molecule-list"
import { CurrentMolecule } from "./components/current-molecule"
import MoleculeViewer from "./components/molecule-viewer"
import { useMoleculeBuilder } from "./hooks/use-molecule-builder"

export default function MoleculeBuilder() {
  const { molecule, selectedElement, setSelectedElement, addAtom, resetMolecule, loadPreset } = useMoleculeBuilder()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Interactive Molecule Builder</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Tabs defaultValue="periodic-table">
            <TabsList className="mb-4">
              <TabsTrigger value="periodic-table">Periodic Table</TabsTrigger>
              <TabsTrigger value="presets">Preset Molecules</TabsTrigger>
            </TabsList>

            <TabsContent value="periodic-table">
              <Card>
                <CardHeader>
                  <CardTitle>Periodic Table</CardTitle>
                  <CardDescription>Select elements to build your molecule</CardDescription>
                </CardHeader>
                <CardContent>
                  <PeriodicTable
                    elements={elements}
                    selectedElement={selectedElement}
                    onSelectElement={setSelectedElement}
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={addAtom} disabled={!selectedElement}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add to Molecule
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="presets">
              <Card>
                <CardHeader>
                  <CardTitle>Preset Molecules</CardTitle>
                  <CardDescription>Choose from common molecular structures</CardDescription>
                </CardHeader>
                <CardContent>
                  <MoleculeList molecules={presetMolecules} onSelectMolecule={loadPreset} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <CurrentMolecule molecule={molecule} elements={elements} onReset={resetMolecule} />
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>3D Visualization</CardTitle>
              <CardDescription>{molecule.name ? molecule.name : "Your custom molecule"}</CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              {molecule.atoms.length > 0 ? (
                <MoleculeViewer molecule={molecule} elements={elements} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <RotateCw className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Select elements and add atoms to visualize your molecule</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
