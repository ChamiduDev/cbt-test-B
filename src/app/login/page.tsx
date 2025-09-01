"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setIsAdmin, setUserStatus, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isAdmin) {
          login(data.token); // Use the login function to set token in AuthContext
          setIsAdmin(true);
          setUserStatus(data.userStatus);
          router.push("/");
        } else {
          setError("Access denied. You are not an administrator.");
        }
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to login. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <Image
        src="/image.jpg"
        alt="Background"
        fill
        className="absolute inset-0 z-0 object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50 z-10" />
      <Card className="z-20 w-full max-w-md border-gray-200/20 bg-white/10 text-white backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Ceylon Black Taxi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 text-white placeholder:text-gray-300 focus:bg-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/20 text-white placeholder:text-gray-300 focus:bg-white/30"
              />
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-500/30 border-red-500/50 text-white">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
