"use client"

import { BarChart3, Users, Briefcase, Building2, Flag, LogOut, Home } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/admin/dashboard",
      active: isActive("/admin/dashboard"),
    },
    {
      title: "Workers",
      icon: Users,
      href: "/admin/workers",
      active: isActive("/admin/workers"),
    },
    {
      title: "Jobs",
      icon: Briefcase,
      href: "/admin/jobs",
      active: isActive("/admin/jobs"),
    },
    {
      title: "Employers",
      icon: Building2,
      href: "/admin/employers",
      active: isActive("/admin/employers"),
    },
    {
      title: "Reports",
      icon: Flag,
      href: "/admin/reports",
      active: isActive("/admin/reports"),
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      active: isActive("/admin/analytics"),
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold">RozgaarLink</span>
          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.active} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link href="/admin/login">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

