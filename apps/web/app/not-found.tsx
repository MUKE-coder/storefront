import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DialMark } from "@/components/shared/dial-mark"

export default function NotFoundPage() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <DialMark className="h-10 w-10 text-brass-dark" />
      <p className="eyebrow mt-6">404</p>
      <h1 className="mt-2 font-display text-4xl">This page has wandered off</h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        The page you're looking for doesn't exist, or the link has stopped ticking.
      </p>
      <Button size="lg" variant="brass" className="mt-8" asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
