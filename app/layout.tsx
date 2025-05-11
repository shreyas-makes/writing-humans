import type React from "react"
import type { Metadata } from "next"
        // The Inter font import is removed as we are switching to system fonts.
// System UI will be applied via a CSS class with Verdana as fallback.
// Class defined in globals.css with font-family: system-ui, Verdana, sans-serif;
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/components/auth/auth-provider"

const systemFont = { className: "font-system" }

export const metadata: Metadata = {
  title: "Daemon Writer - Human-First Writing",
  description: "A writing app where humans do the writing, AI only suggests",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={systemFont.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
