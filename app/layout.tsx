import type React from "react"
import type { Metadata } from "next"
import { Robo } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { ThemeScript } from "./theme-script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Upwork AI Proposal Generator",
  description: "Generate professional Upwork proposals with AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeScript />
          {children}
        </Providers>
      </body>
    </html>
  )
}
