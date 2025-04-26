"use client"

import dynamic from "next/dynamic"

// Use dynamic import with no SSR to ensure the component only loads on the client
const MoleculeViewer = dynamic(() => import("../moleculeViewer"), { ssr: false })

export default function MoleculeViewerWrapper() {
  return (
    <div className="w-full min-h-screen">
      <MoleculeViewer />
    </div>
  )
}
