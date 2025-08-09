import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/student/app-sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster position="top-center" richColors />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}