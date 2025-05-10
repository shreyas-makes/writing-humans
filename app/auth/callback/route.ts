import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ENV } from "@/lib/env"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  // If there's an error, redirect to the appropriate page with the error message
  if (error) {
    let redirectUrl = "/login"
    let errorMessage = errorDescription || "Authentication failed"

    // Handle specific error cases
    if (error === "access_denied" && requestUrl.searchParams.get("error_code") === "otp_expired") {
      redirectUrl = "/expired-link"
      errorMessage = "Your verification link has expired. Please request a new one."
    }

    return NextResponse.redirect(new URL(`${redirectUrl}?error=${encodeURIComponent(errorMessage)}`, ENV.SITE_URL))
  }

  // If there's no code, redirect to login
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=Missing authentication code", ENV.SITE_URL))
  }

  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL("/documents", ENV.SITE_URL))
  } catch (error) {
    console.error("Auth callback error:", error)
    // If there's an error, redirect to login with an error parameter
    return NextResponse.redirect(new URL("/login?error=Authentication failed. Please try again.", ENV.SITE_URL))
  }
}
