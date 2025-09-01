"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";

type VehicleCategoryType = {
  _id: string;
  name: string;
};

export default function VehicleCategoriesPage() {
  const { isAdmin } = useAuth();
  const [vehicleCategories, setVehicleCategories] = React.useState<VehicleCategoryType[]>([]);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [editingCategory, setEditingCategory] = React.useState<VehicleCategoryType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchVehicleCategories = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicle-categories`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch vehicle categories");
      }
      const data = await res.json();
      setVehicleCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAdmin) {
      fetchVehicleCategories();
    }
  }, [isAdmin, fetchVehicleCategories]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Please enter a category name.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicle-categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!res.ok) {
        throw new Error("Failed to add vehicle category");
      }
      setNewCategoryName("");
      fetchVehicleCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      setError("Please enter a category name.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicle-categories/${editingCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ name: editingCategory.name }),
      });
      if (!res.ok) {
        throw new Error("Failed to update vehicle category");
      }
      setEditingCategory(null);
      fetchVehicleCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this vehicle category?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicle-categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": token,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete vehicle category");
      }
      fetchVehicleCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Vehicle Categories</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Vehicle Categories</CardTitle>
          <CardDescription>Add, edit, and delete vehicle categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}>Add Category</Button>
          </div>
          {editingCategory && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Category name"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleUpdateCategory()}
              />
              <Button onClick={handleUpdateCategory}>Update Category</Button>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2" 
                      onClick={() => setEditingCategory(category)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 