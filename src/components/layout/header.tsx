"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  const { setToken, setIsAdmin } = useAuth();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setToken(null);
    setIsAdmin(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft">
      <div className="container flex h-16 items-center justify-between px-3 sm:px-4">
        {/* Left side - Logo and Search */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile sidebar toggle button */}
          <SidebarTrigger className="lg:hidden hover:bg-primary/10 transition-all duration-200" />

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative transform group-hover:scale-105 transition-transform duration-200">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
                <span className="text-white font-bold text-sm sm:text-lg">CBT</span>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
      
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex relative max-w-md w-full group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            <Input
              placeholder="Search anything..."
              className="pl-10 pr-4 h-10 rounded-full border-0 bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 group-hover:bg-muted/70"
            />
          </div>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden hover:bg-primary/10 transition-all duration-200"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Right side - Actions and User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-primary/10 transition-all duration-200 group">
            <Bell className="h-5 w-5 group-hover:text-primary transition-colors duration-200" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/10 transition-all duration-200 group">
            <Settings className="h-5 w-5 group-hover:text-primary transition-colors duration-200" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors duration-200">admin@admin.com</p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ring-2 ring-primary/20 hover:ring-primary/40"
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200 group"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-primary transition-colors duration-200" />
          </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden border-t border-border/50 p-4 bg-gradient-to-r from-primary/5 to-transparent animate-slide-in">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            <Input
              placeholder="Search anything..."
              className="pl-10 pr-4 h-10 rounded-full border-0 bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 group-hover:bg-muted/70"
            />
          </div>
        </div>
      )}
    </header>
  );
}
