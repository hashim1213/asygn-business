import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AppProvider } from "@/lib/context/app-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Asygn - Staff Hiring Platform",
  description: "Hire local staff and fill shifts with ease",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
