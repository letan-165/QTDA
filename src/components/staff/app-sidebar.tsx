"use client"

import {
  Home,
  Award,
  Bell,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronUp,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

const items = [
  {
    title: "Thông báo",
    url: "/dashboard/staff/notifications",
    icon: Bell,
  },
  {
    title: "Hỗ trợ",
    icon: HelpCircle,
    subItems: [
      { title: "Tạo danh mục hỗ trợ mới", url: "/dashboard/staff/support/response" },
      { title: "Phản hồi", url: "/dashboard/student/supports/feedback" },
    ],
  },
]

const settingsItem = {
  title: "Cài đặt",
  icon: Settings,
  subItems: [
    { title: "Thông tin cá nhân", url: "/dashboard/staff/profile" },
    { title: "Đăng xuất", logout: true },
  ],
}

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
          <SidebarGroupLabel className="text-xl text-black-1000">Staff Portal</SidebarGroupLabel>
          <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.subItems ? (
                      <Collapsible defaultOpen className="group/collapsible">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                            <ChevronDown className="w-4 h-4 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <a href={subItem.url} className="flex items-center gap-2 pl-8">
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Settings /> {settingsItem.title}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {settingsItem.subItems.map((item) => (
                  <DropdownMenuItem
                    key={item.title}
                    asChild={!item.logout} 
                    onClick={item.logout ? handleLogout : undefined}
                  >
                    {item.url && !item.logout ? (
                      <a href={item.url}>
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <span className={item.logout ? "text-red-700 cursor-pointer" : ""}>
                        {item.title}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
