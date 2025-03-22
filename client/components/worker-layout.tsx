"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ClipboardList, UserCircle, MessageSquare, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { LanguageSelector } from "@/components/language-selector"

interface WorkerLayoutProps {
  children: React.ReactNode
}

export function WorkerLayout({ children }: WorkerLayoutProps) {
  const { user, logout, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || user.role !== "worker")) {
      router.push("/auth/login?role=worker")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const navItems = [
    {
      name: t("worker.dashboard"),
      href: "/worker/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t("worker.applications"),
      href: "/worker/applications",
      icon: ClipboardList,
    },
    {
      name: t("worker.messages"),
      href: "/worker/messages",
      icon: MessageSquare,
    },
    {
      name: t("worker.profile"),
      href: "/worker/profile",
      icon: UserCircle,
    },
  ]

  const NavItems = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
            pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
      <Button
        variant="ghost"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent text-muted-foreground justify-start font-normal"
        onClick={logout}
      >
        <LogOut className="h-4 w-4" />
        {t("worker.logout")}
      </Button>
    </>
  )

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-10 border-b bg-background lg:hidden">
        <div className="container flex h-14 items-center justify-between px-4 md:px-8 lg:px-12">
          <Link href="/worker/dashboard" className="flex items-center gap-2 font-semibold">
            {t("app.name")}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col gap-4 py-4">
                  <Link href="/worker/dashboard" className="flex items-center gap-2 font-semibold">
                    {t("app.name")}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <NavItems />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-background lg:flex">
          <div className="flex h-14 items-center border-b px-4 justify-between">
            <Link href="/worker/dashboard" className="flex items-center gap-2 font-semibold">
              {t("app.name")}
            </Link>
            <LanguageSelector />
          </div>
          <nav className="flex flex-col gap-1 p-4">
            <NavItems />
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

