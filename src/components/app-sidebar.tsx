import {
  UserCog,
  Users,
  CalendarDays,
  Bell,
  BadgeDollarSign,
  FileCheck2,
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

const items = [
  {
    title: "Quản lý tài khoản",
    url: "/dashboard/admin/accounts",
    icon: UserCog,
  },

  {
    title: "Quản lý sự kiện",
    url: "/dashboard/admin/events",
    icon: CalendarDays,
  },
  {
    title: "Quản lý thông báo",
    url: "/dashboard/admin/notifications",
    icon: Bell,
  },
  {
    title: "Quản lý học bổng",
    url: "/dashboard/admin/scholarships",
    icon: BadgeDollarSign,
  },
  {
    title: "Duyệt đơn học bổng",
    url: "/dashboard/admin/scholarship-requests",
    icon: FileCheck2,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="h-full">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ADMIN DASHBOARD</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
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