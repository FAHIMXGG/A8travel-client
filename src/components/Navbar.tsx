"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { Menu, User, LogOut, LayoutDashboard, Plane, Moon, Sun, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useState, useEffect } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/travelplan", label: "Travel Plans" },
  { href: "/FindTravelBuddy", label: "Find Travel Buddy" },
  { href: "/about", label: "About" },
]

type UserProfile = {
  id: string
  name: string
  email: string
  image: string | null
  role: string
}

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
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user) {
        try {
          setIsLoadingProfile(true)
          const res = await fetch("/api/profile")
          const data = await res.json()
          
          if (res.ok && data?.success && data?.data) {
            setUserProfile({
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              image: data.data.image,
              role: data.data.role,
            })
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error)
        } finally {
          setIsLoadingProfile(false)
        }
      }
    }

    fetchUserProfile()
  }, [session])

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      toast.success("Signed out successfully")
      router.push("/")
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  const userImage = userProfile?.image || null
  const userName = userProfile?.name || session?.user?.name || "User"
  const userId = userProfile?.id || session?.user?.id

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
                <Plane className="h-5 w-5 text-amber-500 relative" />
              </div>
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                TravelBuddy
              </span>
            </Link>

            <div className="hidden md:block">
              <NavItems />
            </div>
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative h-9 w-9 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

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

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 overflow-hidden"
                    >
                      {userImage ? (
                        <img
                          src={userImage}
                          alt={userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {userProfile?.email || session?.user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={userId ? `/users/${userId}` : "#"} className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        View My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  {/* Dark Mode Toggle for Mobile */}
                  <Button
                    variant="ghost"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="relative justify-start gap-2 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    <div className="relative h-4 w-4">
                      <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </div>
                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </Button>

                  {session?.user ? (
                    <>
                      <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground bg-white/5 rounded-lg backdrop-blur-sm">
                        {userImage ? (
                          <img
                            src={userImage}
                            alt={userName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold text-xs">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{userName}</span>
                          <span className="text-xs truncate">{userProfile?.email || session.user.email}</span>
                        </div>
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
                        asChild
                        variant="ghost"
                        className="justify-start gap-2 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href={userId ? `/users/${userId}` : "#"}>
                          <UserCircle className="h-4 w-4" />
                          View My Profile
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
