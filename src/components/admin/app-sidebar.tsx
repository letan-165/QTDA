"use client"

import {
  UserCog,
  Bell,
  BadgeDollarSign,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

const items = [
  {
    title: "Quản lý tài khoản",
    url: "/dashboard/admin/accounts",
    icon: UserCog,
  },
  {
    title: "Quản lý thông báo",
    url: "/dashboard/admin/notifications",
    icon: Bell,
  },
  {
    title: "Quản lý học bổng",
    url: "/dashboard/admin/scholarship",
    icon: BadgeDollarSign,
  },
  {
    title: "Đăng xuất",
    url: "#",
    icon: LogOut,
    logout: true,
  },
]

export function AppSidebar() {
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove("access_token")
    router.push("/auth/login")
  }

  return (
    <Sidebar collapsible="icon" className="h-full">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl">ADMIN DASHBOARD</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    {item.logout ? (
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
