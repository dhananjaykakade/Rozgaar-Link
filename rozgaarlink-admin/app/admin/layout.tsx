import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AuthProvider } from "@/components/auth-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="flex flex-col flex-1">
            <AdminHeader />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  )
}

