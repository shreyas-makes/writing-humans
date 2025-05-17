import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white text-[#1F2937]">
      <h1 className="text-5xl font-extrabold mb-8">Daemon Writer</h1>
      <p className="text-xl mb-10 max-w-3xl">
        A human-first writing app where AI only suggests, never writes. You maintain 100% control over your content.
      </p>
      <div className="flex gap-6">
        <Link href="/editor">
          <Button size="lg" className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white">
            Start Writing
          </Button>
        </Link>
        <Link href="/documents">
          <Button size="lg" variant="outline" className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10">
            My Documents
          </Button>
        </Link>
      </div>
    </div>
  )
}
