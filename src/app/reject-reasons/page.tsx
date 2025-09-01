'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface RejectReason {
  _id: string;
  reason: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function RejectReasonsPage() {
  const { token } = useAuth();
  const [reasons, setReasons] = useState<RejectReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReason, setEditingReason] = useState<RejectReason | null>(null);
  const [newReason, setNewReason] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());

  const categories = [
    'General',
    'Vehicle Related',
    'Distance Related',
    'Safety Related',
    'Personal',
    'Weather',
    'Other'
  ];

  useEffect(() => {
    if (token) {
      fetchRejectReasons();
    }
  }, [token]);

  const fetchRejectReasons = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      console.log('Fetching reject reasons with token:', token.substring(0, 20) + '...');
      console.log('Request URL:', '/api/reject-reasons');

      const response = await fetch('/api/reject-reasons', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Fetch response status:', response.status);
      console.log('Fetch response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched reject reasons:', data);
        setReasons(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch reject reasons:', response.status, errorData);
        toast.error(`Failed to fetch reject reasons: ${errorData.msg || response.statusText}`);
      }
    } catch (error) {
      toast.error('Error fetching reject reasons');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReason = async () => {
    if (!newReason.trim()) {
      toast.error('Please enter a reason');
      return;
    }

    try {
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      console.log('Sending add request with token:', token.substring(0, 20) + '...');
      console.log('Request URL:', '/api/reject-reasons');
      console.log('Request body:', { reason: newReason.trim(), category: newCategory });

      const response = await fetch('/api/reject-reasons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: newReason.trim(),
          category: newCategory,
        }),
      });

      console.log('Add response status:', response.status);
      console.log('Add response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        toast.success('Reject reason added successfully');
        setNewReason('');
        setNewCategory('General');
        setIsAddDialogOpen(false);
        fetchRejectReasons();
      } else {
        toast.error('Failed to add reject reason');
      }
    } catch (error) {
      toast.error('Error adding reject reason');
    }
  };

  const handleEditReason = async () => {
    if (!editingReason || !newReason.trim()) {
      toast.error('Please enter a reason');
      return;
    }

    const actionId = `edit-${editingReason._id}`;
    setProcessing(actionId, true);

    try {
      if (!token) {
        toast.error('Authentication required');
        setProcessing(actionId, false);
        return;
      }

      console.log('Sending edit request with token:', token.substring(0, 20) + '...');
      console.log('Request URL:', `/api/reject-reasons/${editingReason._id}`);
      console.log('Request body:', { reason: newReason.trim(), category: newCategory });

      const response = await fetch(`/api/reject-reasons/${editingReason._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: newReason.trim(),
          category: newCategory,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('Success response:', data);
        toast.success('Reject reason updated successfully');
        setNewReason('');
        setNewCategory('General');
        setEditingReason(null);
        setIsEditDialogOpen(false);
        fetchRejectReasons();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to update reject reason:', response.status, errorData);
        toast.error(`Failed to update reject reason: ${errorData.msg || response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating reject reason:', error);
      toast.error('Error updating reject reason');
    } finally {
      setProcessing(actionId, false);
    }
  };

  const handleDeleteReason = async (reasonId: string) => {
    if (!confirm('Are you sure you want to delete this reject reason?')) {
      return;
    }

    const actionId = `delete-${reasonId}`;
    setProcessing(actionId, true);

    try {
      if (!token) {
        toast.error('Authentication required');
        setProcessing(actionId, false);
        return;
      }

      console.log('Sending delete request with token:', token.substring(0, 20) + '...');
      console.log('Request URL:', `/api/reject-reasons/${reasonId}`);

      const response = await fetch(`/api/reject-reasons/${reasonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        toast.success('Reject reason deleted successfully');
        fetchRejectReasons();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to delete reject reason:', response.status, errorData);
        toast.error(`Failed to delete reject reason: ${errorData.msg || response.statusText}`);
      }
    } catch (error) {
      toast.error('Error deleting reject reason');
    } finally {
      setProcessing(actionId, false);
    }
  };

  const handleToggleStatus = async (reasonId: string, currentStatus: boolean) => {
    const actionId = `toggle-${reasonId}`;
    setProcessing(actionId, true);

    try {
      if (!token) {
        toast.error('Authentication required');
        setProcessing(actionId, false);
        return;
      }

      console.log('Sending toggle request with token:', token.substring(0, 20) + '...');
      console.log('Request URL:', `/api/reject-reasons/${reasonId}/toggle`);
      console.log('Request body:', { isActive: !currentStatus });

      const response = await fetch(`/api/reject-reasons/${reasonId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      console.log('Toggle response status:', response.status);
      console.log('Toggle response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        toast.success('Status updated successfully');
        fetchRejectReasons();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to update status:', response.status, errorData);
        toast.error(`Failed to update status: ${errorData.msg || response.statusText}`);
      }
    } catch (error) {
      toast.error('Error updating status');
    } finally {
      setProcessing(actionId, false);
    }
  };

  const openEditDialog = (reason: RejectReason) => {
    setEditingReason(reason);
    setNewReason(reason.reason);
    setNewCategory(reason.category);
    setIsEditDialogOpen(true);
  };

  const setProcessing = (actionId: string, isProcessing: boolean) => {
    setProcessingActions(prev => {
      const newSet = new Set(prev);
      if (isProcessing) {
        newSet.add(actionId);
      } else {
        newSet.delete(actionId);
      }
      return newSet;
    });
  };

  const isProcessing = (actionId: string) => processingActions.has(actionId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Reject Reasons Management</h1>
          <p className="text-gray-600 mt-2">
            Manage predefined reasons for ride rejections
          </p>
          {/* Debug info - remove in production */}
          <div className="text-xs text-gray-400 mt-1">
            Token: {token ? `${token.substring(0, 20)}...` : 'None'} | 
            Reasons: {reasons.length} | 
            Processing: {processingActions.size}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={fetchRejectReasons}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Reason
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Reject Reason</DialogTitle>
                <DialogDescription>
                  Add a new predefined reason that riders can select when rejecting rides.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="Enter reject reason"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddReason}>Add Reason</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reasons</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reasons.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reasons</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reasons.filter(r => r.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Reasons</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {reasons.filter(r => !r.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(reasons.map(r => r.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reasons List */}
      <Card>
        <CardHeader>
          <CardTitle>Reject Reasons</CardTitle>
        </CardHeader>
        <CardContent>
          {reasons.length === 0 ? (
            <div className="text-center py-8 text-white">
              No reject reasons found. Add your first reason to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {reasons.map((reason) => (
                <div
                  key={reason._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-white">{reason.reason}</h3>
                      <Badge variant={reason.isActive ? "default" : "secondary"}>
                        {reason.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{reason.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {new Date(reason.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(reason)}
                      disabled={isProcessing(`edit-${reason._id}`) || isProcessing(`delete-${reason._id}`) || isProcessing(`toggle-${reason._id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={reason.isActive ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleStatus(reason._id, reason.isActive)}
                      disabled={isProcessing(`edit-${reason._id}`) || isProcessing(`delete-${reason._id}`) || isProcessing(`toggle-${reason._id}`)}
                    >
                      {isProcessing(`toggle-${reason._id}`) ? 'Updating...' : (reason.isActive ? 'Deactivate' : 'Activate')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteReason(reason._id)}
                      disabled={isProcessing(`edit-${reason._id}`) || isProcessing(`delete-${reason._id}`) || isProcessing(`toggle-${reason._id}`)}
                    >
                      {isProcessing(`delete-${reason._id}`) ? 'Deleting...' : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reject Reason</DialogTitle>
            <DialogDescription>
              Update the reject reason and category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-reason">Reason</Label>
              <Input
                id="edit-reason"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Enter reject reason"
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditReason}
              disabled={!editingReason || isProcessing(`edit-${editingReason?._id || ''}`)}
            >
              {isProcessing(`edit-${editingReason?._id || ''}`) ? 'Updating...' : 'Update Reason'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
