"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ClipboardList, UserCircle, MessageSquare, LogOut, Menu, PlusCircle } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { LanguageSelector } from "@/components/language-selector"

interface EmployerLayoutProps {
  children: React.ReactNode
}

export function EmployerLayout({ children }: EmployerLayoutProps) {
  const { user, logout, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || user.role !== "employer")) {
      router.push("/auth/login?role=employer")
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
      name: t("employer.dashboard"),
      href: "/employer/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t("employer.applications"),
      href: "/employer/applications",
      icon: ClipboardList,
    },
    {
      name: t("employer.messages"),
      href: "/employer/messages",
      icon: MessageSquare,
    },
    {
      name: t("employer.profile"),
      href: "/employer/profile",
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
        {t("employer.logout")}
      </Button>
    </>
  )

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-10 border-b bg-background lg:hidden">
        <div className="container flex h-14 items-center justify-between px-4 md:px-8 lg:px-12">
          <Link href="/employer/dashboard" className="flex items-center gap-2 font-semibold">
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
                  <Link href="/employer/dashboard" className="flex items-center gap-2 font-semibold">
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
            <Link href="/employer/dashboard" className="flex items-center gap-2 font-semibold">
              {t("app.name")}
            </Link>
            <LanguageSelector />
          </div>
          <nav className="flex flex-col gap-1 p-4">
            <NavItems />
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="container py-4 px-4 md:px-8 lg:px-12">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {pathname.includes("/job/new")
                  ? t("employer.post_job")
                  : pathname.includes("/messages")
                    ? t("messages.title")
                    : t("employer.dashboard")}
              </h1>
              {!pathname.includes("/job/new") && !pathname.includes("/messages") && (
                <Link href="/employer/job/new">
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    {t("employer.post_job")}
                  </Button>
                </Link>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

