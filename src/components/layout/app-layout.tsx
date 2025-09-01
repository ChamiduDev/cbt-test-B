"use client";

import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppHeader } from "./header";
import { AppSidebar } from "./sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      
      <SidebarInset>
        <div className="flex h-svh flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
