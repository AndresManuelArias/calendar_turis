import type { Metadata } from "next"
import "./globals.css"
import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"
import { Navbar } from "@/infrastructure/driving/next/components/Navbar"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Agenda Lugar",
  description: "Descubre los mejores eventos en tu ciudad",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        <footer className="border-t py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; 2026 Agenda Lugar. Todos los derechos reservados.
          </div>
        </footer>
      </body>
    </html>
  )
}
