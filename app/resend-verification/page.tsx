"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase-client"
import { ENV } from "@/lib/env"

export default function ResendVerificationPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = getSupabaseClient()

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Use the signInWithOtp method to send a magic link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${ENV.SITE_URL}/auth/callback`,
        },
      })

      if (error) throw error

      setIsSuccess(true)
      toast({
        title: "Verification email sent",
        description: "Check your inbox for a new verification link.",
      })
    } catch (error: any) {
      console.error(error)
      // Still show success to avoid revealing if an email exists
      setIsSuccess(true)
      toast({
        title: "Verification email sent",
        description: "If an account exists with this email, you'll receive a verification link.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>We've sent a new verification link to your email.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Please check your inbox and click the link to verify your account. The link will expire in 24 hours.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Back to login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Resend Verification</CardTitle>
          <CardDescription>Enter your email to receive a new verification link</CardDescription>
        </CardHeader>
        <form onSubmit={handleResendVerification}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Verification Link"}
            </Button>
            <div className="text-center text-sm">
              Already verified?{" "}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
