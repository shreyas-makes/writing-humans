"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ExpiredLinkPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Link Expired</CardTitle>
          <CardDescription>{error || "Your verification link has expired or is invalid."}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            Authentication links are only valid for 24 hours for security reasons. You'll need to request a new link.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link href="/resend-verification" className="w-full">
            <Button className="w-full">Request New Verification Link</Button>
          </Link>
          <Link href="/reset-password" className="w-full">
            <Button variant="outline" className="w-full">
              Reset Password Instead
            </Button>
          </Link>
          <Link href="/login" className="w-full text-center text-sm text-muted-foreground hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
