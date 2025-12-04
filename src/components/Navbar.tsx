"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Menu, User, LogOut, LayoutDashboard, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
]

interface NavItemsProps {
  onClick?: () => void
  className?: string
}

function NavItems({ onClick, className }: NavItemsProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col md:flex-row md:items-center gap-1 md:gap-1", className)}>
      {navLinks.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group",
              "hover:scale-105 hover:shadow-md",
              isActive
                ? "text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30"
                : "text-foreground/70 hover:text-foreground hover:bg-white/10 backdrop-blur-sm",
            )}
          >
            {link.label}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export default function Navbar() {
  const { data: session } = useSession()
  console.log(session)
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      toast.success("Signed out successfully")
      router.push("/")
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-orange-500/5 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight transition-all duration-300 hover:scale-105 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <Sparkles className="h-5 w-5 text-amber-500 relative" />
              </div>
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Portify
              </span>
            </Link>

            <div className="hidden md:block">
              <NavItems />
            </div>
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <>
                {/* Dashboard visible to ANY logged-in user */}
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 bg-transparent border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-amber-500/50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/40"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-80 bg-background/95 backdrop-blur-xl border-l border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 pointer-events-none" />

              <div className="flex flex-col gap-6 mt-6 relative">
                {/* Mobile Navigation */}
                <NavItems onClick={() => setIsOpen(false)} className="gap-2" />

                {/* Mobile Auth Actions */}
                <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                  {session?.user ? (
                    <>
                      <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground bg-white/5 rounded-lg backdrop-blur-sm">
                        <div className="p-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <span className="truncate">{session.user.email}</span>
                      </div>

                      {/* Dashboard visible on mobile for ANY logged-in user */}
                      <Button
                        asChild
                        variant="ghost"
                        className="justify-start gap-2 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/dashboard">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="justify-start gap-2 border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className="hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                      >
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button
                        asChild
                        onClick={() => setIsOpen(false)}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30 transition-all duration-300"
                      >
                        <Link href="/register">Register</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
