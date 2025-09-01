'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  RefreshCw, 
  Settings, 
  User, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe
} from 'lucide-react';

interface GlobalBidLimit {
  _id: string;
  dailyLimit: number;
  isActive: boolean;
  lastResetDate: string;
  createdAt: string;
  updatedAt: string;
}

interface RiderStats {
  rider: {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    role: string;
  };
  ridesUsedToday: number;
  remainingRides: number;
}

export default function BidLimitsPage() {
  const { toast } = useToast();
  const [globalLimit, setGlobalLimit] = useState<GlobalBidLimit | null>(null);
  const [riderStats, setRiderStats] = useState<RiderStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    dailyLimit: 10,
    isActive: true,
  });

  useEffect(() => {
    fetchGlobalBidLimit();
  }, []);

  const fetchGlobalBidLimit = async () => {
    try {
      console.log('Fetching global bid limit...');
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('/api/bid-limits/global', {
        headers: {
          'x-auth-token': token || '',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Global bid limit data:', data);
        setGlobalLimit(data.data.globalLimit);
        setRiderStats(data.data.riderStats || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        toast({
          title: "Error",
          description: `Failed to fetch global bid limit: ${response.status} ${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: `Error fetching global bid limit: ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (globalLimit) {
      setFormData({
        dailyLimit: globalLimit.dailyLimit,
        isActive: globalLimit.isActive,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/bid-limits/global', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: data.message,
        });
        fetchGlobalBidLimit();
        setIsEditDialogOpen(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || 'Failed to update global bid limit',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error updating global bid limit",
        variant: "destructive",
      });
    }
  };

  const handleResetDaily = async () => {
    try {
      const response = await fetch('/api/bid-limits/reset-daily', {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Daily usage reset successfully for all riders",
        });
        fetchGlobalBidLimit();
      } else {
        toast({
          title: "Error",
          description: "Failed to reset daily usage",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error resetting daily usage",
        variant: "destructive",
      });
    }
  };

  const handleResetAll = async () => {
    try {
      const response = await fetch('/api/bid-limits/reset-all', {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "All bid limits reset successfully",
        });
        fetchGlobalBidLimit();
      } else {
        toast({
          title: "Error",
          description: "Failed to reset all bid limits",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error resetting all bid limits",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (riderStat: RiderStats) => {
    if (!globalLimit?.isActive) {
      return <Badge variant="secondary">System Disabled</Badge>;
    }
    
    if (riderStat.remainingRides === 0) {
      return <Badge variant="destructive">Limit Reached</Badge>;
    } else if (riderStat.remainingRides <= 2) {
      return <Badge variant="destructive">Low ({riderStat.remainingRides} left)</Badge>;
    } else if (riderStat.remainingRides <= 5) {
      return <Badge variant="default">Medium ({riderStat.remainingRides} left)</Badge>;
    } else {
      return <Badge variant="secondary">Good ({riderStat.remainingRides} left)</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Global Ride Limits Management</h1>
          <p className="text-gray-600 mt-2">
            Manage daily ride limits that apply to all riders (bids + accepts)
          </p>
        </div>
        <div className="flex gap-2">
                       <Button 
               onClick={handleEdit} 
               className="bg-blue-600 hover:bg-blue-700"
               disabled={!globalLimit}
             >
               <Settings className="h-4 w-4 mr-2" />
               Edit Global Ride Limit
             </Button>
          <Button 
            onClick={handleResetDaily} 
            variant="outline"
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Daily Usage
          </Button>
          <Button 
            onClick={handleResetAll} 
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset All Limits
          </Button>
        </div>
      </div>

      {/* Global Settings Card */}
      {globalLimit && (
        <Card>
          <CardHeader>
                         <CardTitle className="flex items-center gap-2">
               <Globe className="h-5 w-5" />
               Global Ride Limit Settings
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="text-center p-4 bg-blue-50 rounded-lg">
                 <div className="text-2xl font-bold text-blue-600">{globalLimit.dailyLimit}</div>
                 <div className="text-sm text-blue-600">Daily Ride Limit</div>
               </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {globalLimit.isActive ? 'Active' : 'Inactive'}
                </div>
                <div className="text-sm text-green-600">Status</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {new Date(globalLimit.lastResetDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-purple-600">Last Reset</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rider Statistics Card */}
      <Card>
        <CardHeader>
                       <CardTitle className="flex items-center gap-2">
               <User className="h-5 w-5" />
               Rider Daily Ride Usage Statistics
             </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rider</TableHead>
                               <TableHead>Daily Limit</TableHead>
               <TableHead>Rides Used Today</TableHead>
               <TableHead>Remaining Rides</TableHead>
               <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riderStats && riderStats.length > 0 ? (
                riderStats.map((riderStat) => (
                  <TableRow key={riderStat.rider._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{riderStat.rider.fullName}</div>
                        <div className="text-sm text-gray-500">{riderStat.rider.email}</div>
                      </div>
                    </TableCell>
                                         <TableCell className="font-medium">{globalLimit?.dailyLimit || 0}</TableCell>
                     <TableCell>{riderStat.ridesUsedToday}</TableCell>
                     <TableCell>
                       <span className={`font-medium ${
                         riderStat.remainingRides <= 2 
                           ? 'text-red-600' 
                           : 'text-green-600'
                       }`}>
                         {riderStat.remainingRides}
                       </span>
                     </TableCell>
                    <TableCell>{getStatusBadge(riderStat)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <RefreshCw className="h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">
                        {loading ? 'Loading rider statistics...' : 'No rider statistics found'}
                      </p>
                      {!loading && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={fetchGlobalBidLimit}
                        >
                          Refresh
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Global Ride Limit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
                             <Label htmlFor="dailyLimit">Daily Ride Limit for All Riders</Label>
               <Input
                 id="dailyLimit"
                 type="number"
                 min="1"
                 max="100"
                 value={formData.dailyLimit}
                 onChange={(e) => setFormData({
                   ...formData,
                   dailyLimit: parseInt(e.target.value) || 1
                 })}
                 className="mt-1"
               />
               <p className="text-sm text-gray-500 mt-1">
                 This limit applies to all riders. Each rider can take up to {formData.dailyLimit} ride actions per day (bids + accepts).
               </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  isActive: checked
                })}
              />
                             <Label htmlFor="isActive">Enable Ride Limits</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
