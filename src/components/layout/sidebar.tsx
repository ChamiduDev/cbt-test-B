"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Building,
  DollarSign,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Mountain,
  Map,
  Car,
  UserCheck,
  Gavel,
  XCircle,
  AlertTriangle,
  CheckCircle,
  Navigation,
  TrendingUp,
  Shield,
} from "lucide-react";

const menuItems = [
  { 
    href: "/", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    description: "Overview & analytics"
  },
  { 
    href: "/riders", 
    label: "Riders", 
    icon: Users,
    description: "Manage drivers"
  },
  { 
    href: "/hotels", 
    label: "Hotels", 
    icon: Building,
    description: "Hotel partners"
  },
  { 
    href: "/revenue", 
    label: "Revenue", 
    icon: TrendingUp,
    description: "Financial insights"
  },
  { 
    href: "/requests", 
    label: "Requests", 
    icon: Bell,
    description: "Booking requests"
  },
  { 
    href: "/users", 
    label: "Users", 
    icon: Shield,
    description: "User management"
  },
  { 
    href: "/locations", 
    label: "Locations", 
    icon: Map,
    description: "Cities & areas"
  },
  { 
    href: "/vehicle-categories", 
    label: "Vehicle Types", 
    icon: Car,
    description: "Vehicle categories"
  },
  { 
    href: "/rider-status", 
    label: "Driver Status", 
    icon: UserCheck,
    description: "Driver status"
  },
  { 
    href: "/bid-limits", 
    label: "Bid Limits", 
    icon: Gavel,
    description: "Bidding rules"
  },
  { 
    href: "/reject-reasons", 
    label: "Reject Reasons", 
    icon: XCircle,
    description: "Rejection causes"
  },
  { 
    href: "/rejected-rides", 
    label: "Rejected Rides", 
    icon: AlertTriangle,
    description: "Declined bookings"
  },
  { 
    href: "/finished-rides", 
    label: "Finished Rides", 
    icon: CheckCircle,
    description: "Completed trips"
  },
  { 
    href: "/on-the-way-rides", 
    label: "Active Rides", 
    icon: Navigation,
    description: "Active trips"
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    return pathname === href;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  return (
    <>
      <SidebarHeader className="p-4 sm:p-6 border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center gap-3 sm:gap-4 group">
          {/* Logo */}
          <div className="relative transform group-hover:scale-105 transition-transform duration-200">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
              <span className="text-white font-bold text-lg sm:text-xl">CBT</span>
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
          </div>
          
          {/* Brand */}
          <div className="flex flex-col">
            <h2 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-primary via-yellow-400 to-yellow-300 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-primary transition-all duration-300">
              Ceylon Black Taxi
            </h2>
            <p className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors duration-200">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 p-3 sm:p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                className="justify-start h-10 sm:h-12 px-3 sm:px-4 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 group hover:shadow-md hover:scale-[1.02] transform"
              >
                <Link 
                  href={item.href} 
                  className="w-full"
                >
                  <div className="flex items-center gap-2 sm:gap-3 w-full">
                    <div className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
                      isActive(item.href) 
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md ring-2 ring-primary/30' 
                        : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:shadow-sm'
                    }`}>
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium transition-all duration-300 text-sm sm:text-base ${
                        isActive(item.href) ? 'text-primary' : 'text-foreground group-hover:text-primary/90'
                      }`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-muted-foreground truncate hidden sm:block group-hover:text-primary/70 transition-colors duration-200">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/settings")}
              className="justify-start h-12 px-4 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 group"
            >
              <Link href="/settings">
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive("/settings") 
                      ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md' 
                      : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    <Settings className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium transition-colors duration-200 ${
                      isActive("/settings") ? 'text-primary' : 'text-foreground'
                    }`}>
                      Settings
                    </div>
                    <div className="text-xs text-muted-foreground">
                      System configuration
                    </div>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton className="justify-start h-12 px-4 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 group">
              <div className="flex items-center gap-3 w-full">
                <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                    Support
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Help & documentation
                  </div>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="justify-start h-12 px-4 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-500/5 group"
              onClick={handleLogout}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-red-500/10 group-hover:text-red-600 transition-all duration-200">
                  <LogOut className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground group-hover:text-red-600 transition-colors duration-200">
                    Logout
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sign out of account
                  </div>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}