import { Button } from "@/components/ui/button"

export default function ButtonDemo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-bg">
      <h1 className="text-2xl font-serif tracking-tight text-text">Neobrutalist Button Variants</h1>
      
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Button variant="neobrutalist">Neobrutalist</Button>
        <Button variant="reverse">Reverse</Button>
        <Button variant="noShadow">No Shadow</Button>
        <Button variant="neutral">Neutral</Button>
      </div>

      <h2 className="text-xl font-serif tracking-tight text-text mt-8">Original Variants (Preserved)</h2>
      
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  )
}
