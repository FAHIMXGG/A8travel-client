"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  ChevronRight,
  Loader2,
  Users,
  CalendarPlus,
  UserRoundCheck,
  X,
  UserCog,
  KeyRound,
  UserCircle,
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
  description: string
}

const commonItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Dashboard overview",
  },
  // {
  //   href: "/dashboard/blogs",
  //   label: "All Posts",
  //   icon: FileText,
  //   description: "View all blog posts",
  // },
  // {
  //   href: "/dashboard/blogs/new",
  //   label: "Create Post",
  //   icon: PenSquare,
  //   description: "Write a new post",
  // },
  {
    href: "/dashboard/profile",
    label: "Update Profile",
    icon: UserCog,
    description: "Edit your account details",
  },
  {
    href: "/dashboard/password",
    label: "Update Password",
    icon: KeyRound,
    description: "Change your password",
  },
]

const adminOnlyItems: NavItem[] = [
  {
    href: "/dashboard/users",
    label: "All Users",
    icon: Users,
    description: "Manage every traveler profile",
  },
]

const userOnlyItems: NavItem[] = [
  {
    href: "/dashboard/profile/view",
    label: "View My Profile",
    icon: UserCircle,
    description: "View your complete profile",
  },
  {
    href: "/dashboard/events/host",
    label: "Host Event",
    icon: CalendarPlus,
    description: "Create your next travel meetup",
  },
]

export default function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [targetPath, setTargetPath] = useState<string | null>(null)
  const role = session?.user?.role
  const visibleItems = useMemo(() => {
    const list = [...commonItems]
    if (role === "ADMIN") list.push(...adminOnlyItems)
    if (role === "USER") list.push(...userOnlyItems)
    return list
  }, [role])

  useEffect(() => {
    if (targetPath && pathname === targetPath) {
      setIsNavigating(false)
      setTargetPath(null)
    }
  }, [pathname, targetPath])

  const handleNavClick = (href: string) => {
    if (href !== pathname) {
      setIsNavigating(true)
      setTargetPath(href)
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-16 left-5 z-50 lg:hidden backdrop-blur-md bg-background/80 border-border/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <nav
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen lg:h-auto z-40",
          "w-72 lg:w-auto",
          "bg-background/95 lg:bg-background/60 backdrop-blur-xl",
          "border-r lg:border lg:rounded-2xl",
          "border-border/50",
          "p-6 lg:p-5",
          "transition-transform duration-300 ease-in-out",
          "shadow-2xl lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isNavigating && "opacity-75 pointer-events-none",
        )}
      >
        

        {/* Header */}
        <div className="mb-8 lg:mb-6 space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {role === "ADMIN" ? "Admin" : role === "USER" ? "Traveler" : "Dashboard"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {role === "ADMIN" ? "Full workspace access" : role === "USER" ? "Personal workspace" : "Sign in required"}
              </p>
            </div>
          </div>
          {role && (
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground">
              <UserRoundCheck className="h-3.5 w-3.5 text-primary" />
              Signed in as {role}
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const isLoading = isNavigating && targetPath === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3.5",
                    "text-sm font-medium transition-all duration-200",
                    "hover:bg-accent/50 hover:shadow-sm",
                    "relative overflow-hidden",
                    isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                      isActive ? "bg-primary/15" : "bg-accent/30 group-hover:bg-accent/50",
                    )}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    ) : (
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-transform group-hover:scale-110",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex-1">
                    <div className={cn("font-medium", isActive ? "text-primary" : "")}>{item.label}</div>
                    <div className="text-xs text-muted-foreground/70 hidden xl:block">{item.description}</div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Footer - Optional */}
        <div className="mt-8 pt-6 border-t border-border/50 hidden lg:block">
          <div className="text-xs text-muted-foreground/60 text-center">v1.0.0</div>
        </div>
      </nav>
    </>
  )
}

