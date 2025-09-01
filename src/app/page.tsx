"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, Users, Building, DollarSign, Bell } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "January", sales: 1860 },
  { month: "February", sales: 3050 },
  { month: "March", sales: 2370 },
  { month: "April", sales: 2730 },
  { month: "May", sales: 2090 },
  { month: "June", sales: 2140 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
};

export default function Home() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-header rounded-2xl p-4 sm:p-6 border border-primary/20">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center sm:text-left">
          Welcome back, Admin! 👋
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg text-center sm:text-left">
          Here's what's happening with your taxi service today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Riders</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,234</div>
            <div className="flex items-center gap-2 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-600 font-medium">+12.2%</p>
              <p className="text-xs text-muted-foreground">from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hotels Onboarded</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Building className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">231</div>
            <div className="flex items-center gap-2 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-600 font-medium">+5.1%</p>
              <p className="text-xs text-muted-foreground">from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">$45,231.89</div>
            <div className="flex items-center gap-2 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-600 font-medium">+20.1%</p>
              <p className="text-xs text-muted-foreground">from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Requests</CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Bell className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">+573</div>
            <div className="flex items-center gap-2 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-600 font-medium">+3</p>
              <p className="text-xs text-muted-foreground">since last hour</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              A summary of sales over the past months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              There were 12 new sign-ups this week.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="person face" />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Alex Rivera
                </p>
                <p className="text-sm text-muted-foreground">
                  Joined as a new rider.
                </p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                5m ago
              </div>
            </div>
            <Separator />
            <div className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="hotel building" />
                <AvatarFallback>SH</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Seaside Hotel
                </p>
                <p className="text-sm text-muted-foreground">
                  Onboarded as a new partner.
                </p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                1h ago
              </div>
            </div>
            <Separator />
            <div className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="person face" />
                <AvatarFallback>MR</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Maria Rodriguez
                </p>
                <p className="text-sm text-muted-foreground">
                  Completed first 10 rides.
                </p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                3h ago
              </div>
            </div>
            <Separator />
            <Button asChild variant="outline" className="w-full">
              <Link href="#">
                View All Activity
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
