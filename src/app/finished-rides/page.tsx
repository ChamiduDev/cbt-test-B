"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Clock, MapPin, User, Car, Filter, Search, Eye, Download, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FinishedRide {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  rider: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  pickupLocation: {
    city_id: { name: string };
    sub_area_id: { name: string };
    address: string;
  };
  destinationLocation: {
    city_id: { name: string };
    sub_area_id: { name: string };
    address: string;
  };
  pickupDate: string;
  pickupTime: string;
  startedAt: string;
  completedAt: string;
  riderAmount: number;
  commission: number;
  totalAmount: number;
  phoneNumber: string;
  numberOfGuests: number;
  vehicleType: string;
  status: string;
  rideDuration?: number;
  daysAgo?: number;
  createdAt: string;
}

export default function FinishedRidesPage() {
  const [finishedRides, setFinishedRides] = useState<FinishedRide[]>([]);
  const [filteredRides, setFilteredRides] = useState<FinishedRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<FinishedRide | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchFinishedRides();
  }, []);

  useEffect(() => {
    filterRides();
  }, [finishedRides, searchTerm, statusFilter, dateFilter, vehicleFilter]);

  const fetchFinishedRides = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/finished`, {
        headers: {
          "x-auth-token": token || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFinishedRides(data);
      } else {
        throw new Error("Failed to fetch finished rides");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch finished rides",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterRides = () => {
    let filtered = [...finishedRides];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (ride) =>
          ride.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ride.rider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ride.pickupLocation.city_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ride.destinationLocation.city_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ride.phoneNumber.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((ride) => ride.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter((ride) => {
        const rideDate = new Date(ride.completedAt);
        switch (dateFilter) {
          case "today":
            return rideDate >= today;
          case "yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return rideDate >= yesterday && rideDate < today;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return rideDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return rideDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Vehicle filter
    if (vehicleFilter !== "all") {
      filtered = filtered.filter((ride) => ride.vehicleType === vehicleFilter);
    }

    setFilteredRides(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Ride ID",
      "Customer",
      "Rider",
      "Pickup",
      "Destination",
      "Date",
      "Time",
      "Amount",
      "Status",
      "Duration",
    ];

    const csvData = filteredRides.map((ride) => [
      ride._id.substring(0, 8),
      ride.user.fullName,
      ride.rider.fullName,
      `${ride.pickupLocation.city_id.name}, ${ride.pickupLocation.sub_area_id.name}`,
      `${ride.destinationLocation.city_id.name}, ${ride.destinationLocation.sub_area_id.name}`,
      formatDate(ride.pickupDate),
      ride.pickupTime,
      `LKR ${ride.totalAmount}`,
      ride.status,
      ride.rideDuration ? `${ride.rideDuration} min` : "N/A",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finished-rides-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Finished Rides ✅</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              View and manage all completed and cancelled rides with detailed analytics
            </p>
          </div>
          <Button onClick={exportToCSV} className="btn-primary flex items-center gap-2 w-full sm:w-auto">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rides</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Car className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{filteredRides.length}</div>
            <p className="text-xs text-muted-foreground">
              {finishedRides.length} total in system
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              LKR {filteredRides.reduce((sum, ride) => sum + ride.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {filteredRides.length} rides
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {filteredRides.filter((ride) => ride.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful rides
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
            <div className="p-2 rounded-lg bg-red-100 text-red-600">
              <XCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {filteredRides.filter((ride) => ride.status === "cancelled").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cancelled rides
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-hover bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Filter className="h-5 w-5 text-primary" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search rides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Type</label>
              <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                  setVehicleFilter("all");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rides Table */}
      <Card className="card-hover bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-foreground">Rides ({filteredRides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ride ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRides.map((ride) => (
                  <TableRow key={ride._id}>
                    <TableCell className="font-mono text-sm">
                      #{ride._id.substring(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{ride.user.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {ride.user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{ride.rider.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {ride.rider.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-green-600" />
                          {ride.pickupLocation.city_id.name}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-red-600" />
                          {ride.destinationLocation.city_id.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {formatDate(ride.pickupDate)}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {ride.pickupTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          LKR {ride.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {ride.rideDuration ? `${ride.rideDuration} min` : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(ride.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedRide(ride)}>
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ride Details Dialog */}
      <Dialog open={!!selectedRide} onOpenChange={() => setSelectedRide(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ride Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected ride
            </DialogDescription>
          </DialogHeader>
          {selectedRide && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ride Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Ride ID:</span>
                      <span className="font-mono">#{selectedRide._id.substring(0, 8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      {getStatusBadge(selectedRide.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Vehicle Type:</span>
                      <span>{selectedRide.vehicleType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Guests:</span>
                      <span>{selectedRide.numberOfGuests}</span>
                    </div>
                    {selectedRide.rideDuration && (
                      <div className="flex justify-between">
                        <span className="font-medium">Duration:</span>
                        <span>{selectedRide.rideDuration} minutes</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold text-green-600">
                        LKR {selectedRide.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Rider Amount:</span>
                      <span>LKR {selectedRide.riderAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Commission:</span>
                      <span>LKR {selectedRide.commission.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer & Rider Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{selectedRide.user.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{selectedRide.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Phone:</span>
                      <span>{selectedRide.phoneNumber}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rider Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{selectedRide.rider.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{selectedRide.rider.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Phone:</span>
                      <span>{selectedRide.rider.phone}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Location Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Route Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">Pickup Location</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        <div className="font-medium">
                          {selectedRide.pickupLocation.city_id.name}, {selectedRide.pickupLocation.sub_area_id.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedRide.pickupLocation.address}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-red-600">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">Destination</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        <div className="font-medium">
                          {selectedRide.destinationLocation.city_id.name}, {selectedRide.destinationLocation.sub_area_id.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedRide.destinationLocation.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ride Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Scheduled:</span>
                    <span>{formatDate(selectedRide.pickupDate)} at {selectedRide.pickupTime}</span>
                  </div>
                  {selectedRide.startedAt && (
                    <div className="flex justify-between">
                      <span className="font-medium">Started:</span>
                      <span>{formatTime(selectedRide.startedAt)}</span>
                    </div>
                  )}
                  {selectedRide.completedAt && (
                    <div className="flex justify-between">
                      <span className="font-medium">Completed:</span>
                      <span>{formatTime(selectedRide.completedAt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Created:</span>
                    <span>{formatDate(selectedRide.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
