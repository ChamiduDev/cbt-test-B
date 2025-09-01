"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navigation, PlayCircle, Car, DollarSign, Filter, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnTheWayRide {
  _id: string;
  user: { fullName: string; phone: string };
  rider: { fullName: string; phone: string };
  pickupLocation: { city_id: { name: string }; sub_area_id: { name: string } };
  destinationLocation: { city_id: { name: string }; sub_area_id: { name: string } };
  pickupDate: string;
  pickupTime: string;
  startedAt: string;
  totalAmount: number;
  phoneNumber: string;
  numberOfGuests: number;
  vehicleType: string;
  status: string;
  createdAt: string;
}

export default function OnTheWayRidesPage() {
  const [rides, setRides] = useState<OnTheWayRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/on-the-way`, {
        headers: { "x-auth-token": token || "" },
      });

      if (response.ok) {
        const data = await response.json();
        setRides(data);
      } else {
        throw new Error("Failed to fetch rides");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch on-the-way rides",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted": return <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>;
      case "in_progress": return <Badge className="bg-green-100 text-green-800">In Progress</Badge>;
      case "on_the_way": return <Badge className="bg-yellow-100 text-yellow-800">On The Way</Badge>;
      case "arrived": return <Badge className="bg-purple-100 text-purple-800">Arrived</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredRides = rides.filter(ride =>
    ride.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.rider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.pickupLocation.city_id.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-header rounded-2xl p-4 sm:p-6 border border-primary/20">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">On The Way Rides 🚗</h1>
            <p className="text-muted-foreground text-base sm:text-lg">Monitor all active and in-progress rides in real-time</p>
          </div>
          <Button onClick={fetchRides} className="btn-primary flex items-center gap-2 w-full sm:w-auto">
            <Navigation className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rides</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Navigation className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{filteredRides.length}</div>
            <p className="text-xs text-muted-foreground">{rides.length} total active</p>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <PlayCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {rides.filter(ride => ride.status === "in_progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently traveling</p>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On The Way</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
              <Car className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {rides.filter(ride => ride.status === "on_the_way").length}
            </div>
            <p className="text-xs text-muted-foreground">Heading to pickup</p>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-card border-0 shadow-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              LKR {rides.reduce((sum, ride) => sum + ride.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From active rides</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="card-hover bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Search className="h-5 w-5 text-primary" />
            Search Rides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by customer, rider, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md border-0 bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </CardContent>
      </Card>

      {/* Rides List */}
      <Card className="card-hover bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-foreground">Active Rides ({filteredRides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRides.map((ride) => (
              <div key={ride._id} className="bg-background/50 rounded-xl p-6 space-y-4 border border-border/50 hover:border-primary/20 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs px-3 py-1">#{ride._id.substring(0, 8)}</Badge>
                    {getStatusBadge(ride.status)}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">LKR {ride.totalAmount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{ride.vehicleType}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <div className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Customer</div>
                    <div className="font-semibold text-foreground">{ride.user.fullName}</div>
                    <div className="text-sm text-muted-foreground">{ride.user.phone}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Rider</div>
                    <div className="font-semibold text-foreground">{ride.rider.fullName}</div>
                    <div className="text-sm text-muted-foreground">{ride.rider.phone}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <div className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Pickup</div>
                    <div className="font-semibold text-foreground">{ride.pickupLocation.city_id.name}, {ride.pickupLocation.sub_area_id.name}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Destination</div>
                    <div className="font-semibold text-foreground">{ride.destinationLocation.city_id.name}, {ride.destinationLocation.sub_area_id.name}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
                  <span>Scheduled: {new Date(ride.pickupDate).toLocaleDateString()} at {ride.pickupTime}</span>
                  <span>Guests: {ride.numberOfGuests}</span>
                </div>
              </div>
            ))}
            
            {filteredRides.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-6xl mb-4">🚗</div>
                <div className="text-lg font-medium">No active rides found</div>
                <div className="text-sm">All drivers are currently available</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
