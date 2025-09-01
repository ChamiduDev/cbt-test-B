'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  User, 
  Car, 
  AlertCircle,
  Eye,
  Download
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface RejectedRide {
  _id: string;
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
  totalAmount: number;
  riderAmount: number;
  commission: number;
  rejectionReason: string;
  rejectedAt: string;
  rejectedBy: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  user: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    userType: string;
  };
  rider: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  createdAt: string;
}

export default function RejectedRidesPage() {
  const { token } = useAuth();
  const [rejectedRides, setRejectedRides] = useState<RejectedRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [filteredRides, setFilteredRides] = useState<RejectedRide[]>([]);

  useEffect(() => {
    fetchRejectedRides();
  }, []);

  useEffect(() => {
    filterRides();
  }, [rejectedRides, searchTerm, statusFilter, dateFilter]);

  const fetchRejectedRides = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch('/api/bookings?status=rejected', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          // Filter out any rides with missing required data
          const validRides = data.filter(ride => 
            ride && 
            ride.user && 
            ride.rider && 
            ride.pickupLocation && 
            ride.destinationLocation
          );
          
          if (validRides.length !== data.length) {
            console.warn(`Filtered out ${data.length - validRides.length} rides with missing data`);
          }
          
          setRejectedRides(validRides);
        } else {
          console.error('Expected array but got:', typeof data, data);
          setRejectedRides([]);
          toast.error('Invalid data format received');
        }
      } else {
        toast.error('Failed to fetch rejected rides');
      }
    } catch (error) {
      toast.error('Error fetching rejected rides');
    } finally {
      setLoading(false);
    }
  };

  const filterRides = () => {
    let filtered = [...rejectedRides];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ride => 
        (ride.user?.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (ride.rider?.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (ride.rejectionReason?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (ride.pickupLocation?.city_id?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (ride.destinationLocation?.city_id?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(ride => {
        const rideDate = new Date(ride.rejectedAt);
        const rideDateOnly = new Date(rideDate.getFullYear(), rideDate.getMonth(), rideDate.getDate());
        
        switch (dateFilter) {
          case 'today':
            return rideDateOnly.getTime() === today.getTime();
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return rideDateOnly >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            return rideDateOnly >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredRides(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      'Ride ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Customer Type',
      'Rider Name',
      'Rider Email',
      'Rider Phone',
      'Pickup Location',
      'Destination Location',
      'Pickup Date',
      'Pickup Time',
      'Total Amount',
      'Rider Amount',
      'Commission',
      'Rejection Reason',
      'Rejected At',
      'Created At'
    ];

    const csvData = filteredRides.map(ride => [
      ride._id,
      ride.user.fullName,
      ride.user.email,
      ride.user.phoneNumber,
      ride.user.userType,
      ride.rider.fullName,
      ride.rider.email,
      ride.rider.phoneNumber,
      `${ride.pickupLocation.city_id.name}, ${ride.pickupLocation.sub_area_id.name}`,
      `${ride.destinationLocation.city_id.name}, ${ride.destinationLocation.sub_area_id.name}`,
      new Date(ride.pickupDate).toLocaleDateString(),
      ride.pickupTime,
      ride.totalAmount,
      ride.riderAmount,
      ride.commission,
      ride.rejectionReason,
      new Date(ride.rejectedAt).toLocaleString(),
      new Date(ride.createdAt).toLocaleString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rejected-rides-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('CSV exported successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }



  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Rejected Rides</h1>
          <p className="text-gray-600 mt-2">
            View and analyze rides that were rejected by riders
          </p>
        </div>
        <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rejected</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedRides.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {rejectedRides.filter(ride => {
                const rideDate = new Date(ride.rejectedAt);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return rideDate >= weekAgo;
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {rejectedRides.filter(ride => {
                const rideDate = new Date(ride.rejectedAt);
                const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                return rideDate >= monthAgo;
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue Lost</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              Rs. {rejectedRides.reduce((sum, ride) => sum + ride.totalAmount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search rides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="date-filter">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Results</Label>
              <div className="text-sm text-gray-600 pt-2">
                {filteredRides.length} of {rejectedRides.length} rides
              </div>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rejected Rides List */}
      <Card>
        <CardHeader>
          <CardTitle>Rejected Rides ({filteredRides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRides.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {rejectedRides.length === 0 ? 'No rejected rides found.' : 'No rides match the current filters.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRides.map((ride) => (
                <Card key={ride._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Customer Information */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">Customer Details</h3>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="py-1"><span className="font-medium">Name:</span> {ride.user?.fullName || 'N/A'}</div>
                          <div className="py-1"><span className="font-medium">Email:</span> {ride.user?.email || 'N/A'}</div>
                          <div className="py-1"><span className="font-medium">Phone:</span> {ride.user?.phoneNumber || 'N/A'}</div>
                          <div className="flex items-center py-1">
                            <span className="font-medium">Type:</span> 
                            <Badge variant="outline" className="ml-2 capitalize">
                              {ride.user?.userType || 'N/A'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Rider Information */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4 text-green-600" />
                          <h3 className="font-semibold text-gray-900">Rider Details</h3>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="py-1"><span className="font-medium">Name:</span> {ride.rider?.fullName || 'N/A'}</div>
                          <div className="py-1"><span className="font-medium">Email:</span> {ride.rider?.email || 'N/A'}</div>
                          <div className="py-1"><span className="font-medium">Phone:</span> {ride.rider?.phoneNumber || 'N/A'}</div>
                        </div>
                      </div>

                      {/* Ride & Rejection Details */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <h3 className="font-semibold text-gray-900">Ride & Rejection</h3>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="py-1"><span className="font-medium">Amount:</span> Rs. {ride.totalAmount || 'N/A'}</div>
                          <div className="py-1"><span className="font-medium">Rejected:</span> {ride.rejectedAt ? new Date(ride.rejectedAt).toLocaleDateString() : 'N/A'}</div>
                          <div className="flex items-center py-1">
                            <span className="font-medium">Reason:</span> 
                            <Badge variant="destructive" className="ml-2">
                              {ride.rejectionReason || 'N/A'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Route Information */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-green-600 mt-1" />
                                                      <div>
                              <div className="text-sm font-medium text-gray-900 py-1">Pickup</div>
                              <div className="text-sm text-gray-600 py-1">
                                {ride.pickupLocation?.city_id?.name || 'N/A'}, {ride.pickupLocation?.sub_area_id?.name || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500 py-1">{ride.pickupLocation?.address || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-red-600 mt-1" />
                                                      <div>
                              <div className="text-sm font-medium text-gray-900 py-1">Destination</div>
                              <div className="text-sm text-gray-600 py-1">
                                {ride.destinationLocation?.city_id?.name || 'N/A'}, {ride.destinationLocation?.sub_area_id?.name || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500 py-1">{ride.destinationLocation?.address || 'N/A'}</div>
                            </div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        <span className="font-medium">Pickup Date:</span> {ride.pickupDate ? new Date(ride.pickupDate).toLocaleDateString() : 'N/A'} at {ride.pickupTime || 'N/A'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
