"use client";

import { usePathname } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, setIsAdmin, setUserStatus, setToken } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log("useEffect triggered:", { pathname, isClient });
    
    // If we're on the login page, don't verify token
    if (pathname === "/login") {
      console.log("On login page, skipping token verification");
      return;
    }

    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      console.log("Backend URL:", backendUrl);
      
      // If no backend URL is configured, handle gracefully
      if (!backendUrl) {
        console.warn("No backend URL configured, using local token validation");
        if (token) {
          // If there's a token but no backend, assume it's valid for now
          console.log("Setting admin to true due to token presence");
          setIsAdmin(true);
          setToken(token);
        } else {
          console.log("No token, redirecting to login");
          setToken(null);
          router.push("/login");
        }
        return;
      }
      
      if (token) {
        try {
          console.log("Verifying token with backend...");
          const res = await fetch(`${backendUrl}/api/auth/verify`, {
            headers: {
              "x-auth-token": token,
            },
          });
          if (res.ok) {
            const data = await res.json();
            console.log("Backend response:", data);
            if (data.isAdmin) {
              console.log("Setting admin to true");
              setIsAdmin(true);
              setUserStatus(data.userStatus);
              setToken(token);
            } else {
              console.log("User is not admin, clearing token");
              localStorage.removeItem("token");
              setToken(null);
              router.push("/login");
            }
          } else {
            console.log("Backend verification failed, clearing token");
            localStorage.removeItem("token");
            setToken(null);
            router.push("/login");
          }
        } catch (error) {
          console.error("Token verification error:", error);
          localStorage.removeItem("token");
          setToken(null);
          router.push("/login");
        }
      } else {
        console.log("No token, redirecting to login");
        setToken(null);
        router.push("/login");
      }
    };

    if (isClient) {
      verifyToken();
    }
  }, [pathname, router, isClient, setIsAdmin, setUserStatus, setToken]);

  const isLoginPage = pathname === "/login";

  // Debug logging
  console.log("Render decision:", { pathname, isLoginPage, isAdmin, isClient });

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // If we're on the login page, show it immediately
  if (isLoginPage) {
    console.log("Rendering login page");
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  // If not logged in and not on login page, show loading
  if (!isAdmin) {
    console.log("Rendering authentication loading");
    return (
      <>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verifying authentication...</p>
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  // If logged in, show the app layout
  console.log("Rendering admin dashboard");
  return (
    <>
      <AppLayout>{children}</AppLayout>
      <Toaster />
    </>
  );
}

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}
