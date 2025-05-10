import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Daemon Writer</h1>
      <p className="text-xl mb-8 max-w-2xl">
        A human-first writing app where AI only suggests, never writes. You maintain 100% control over your content.
      </p>
      <div className="flex gap-4">
        <Link href="/editor">
          <Button size="lg">Start Writing</Button>
        </Link>
        <Link href="/documents">
          <Button size="lg" variant="outline">
            My Documents
          </Button>
        </Link>
      </div>
    </div>
  )
}
