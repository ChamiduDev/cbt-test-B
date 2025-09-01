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

type CityType = {
  _id: string;
  name: string;
};

type SubAreaType = {
  _id: string;
  name: string;
  city_id: string;
};

export default function LocationsPage() {
  const { isAdmin } = useAuth();
  const [cities, setCities] = React.useState<CityType[]>([]);
  const [subAreas, setSubAreas] = React.useState<SubAreaType[]>([]);
  const [newCityName, setNewCityName] = React.useState("");
  const [newSubAreaName, setNewSubAreaName] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState<string | null>(null);
  const [editingCity, setEditingCity] = React.useState<CityType | null>(null);
  const [editingSubArea, setEditingSubArea] = React.useState<SubAreaType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCities = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await res.json();
      setCities(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchSubAreas = React.useCallback(async (cityId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subAreas?city_id=${cityId}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch sub-areas");
      }
      const data = await res.json();
      setSubAreas(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  React.useEffect(() => {
    if (isAdmin) {
      fetchCities();
    }
  }, [isAdmin, fetchCities]);

  React.useEffect(() => {
    if (selectedCity) {
      fetchSubAreas(selectedCity);
    }
  }, [selectedCity, fetchSubAreas]);

  const handleAddCity = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ name: newCityName }),
      });
      if (!res.ok) {
        throw new Error("Failed to add city");
      }
      setNewCityName("");
      fetchCities();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddSubArea = async () => {
    if (!selectedCity) {
      setError("Please select a city first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subAreas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ name: newSubAreaName, city_id: selectedCity }),
      });
      if (!res.ok) {
        throw new Error("Failed to add sub-area");
      }
      setNewSubAreaName("");
      fetchSubAreas(selectedCity);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateCity = async () => {
    if (!editingCity) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities/${editingCity._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ name: editingCity.name }),
      });
      if (!res.ok) {
        throw new Error("Failed to update city");
      }
      setEditingCity(null);
      fetchCities();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateSubArea = async () => {
    if (!editingSubArea || !selectedCity) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subAreas/${editingSubArea._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ name: editingSubArea.name, city_id: selectedCity }),
      });
      if (!res.ok) {
        throw new Error("Failed to update sub-area");
      }
      setEditingSubArea(null);
      fetchSubAreas(selectedCity);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCity = async (cityId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities/${cityId}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": token,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete city");
      }
      fetchCities();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteSubArea = async (subAreaId: string) => {
    if (!selectedCity) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subAreas/${subAreaId}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": token,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete sub-area");
      }
      fetchSubAreas(selectedCity);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have administrative access to view this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Cities</CardTitle>
          <CardDescription>Manage cities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New city name"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
            />
            <Button onClick={handleAddCity}>Add City</Button>
          </div>
          {editingCity && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="New city name"
                value={editingCity.name}
                onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
              />
              <Button onClick={handleUpdateCity}>Update City</Button>
              <Button variant="outline" onClick={() => setEditingCity(null)}>Cancel</Button>
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
              {cities.map((city) => (
                <TableRow key={city._id} onClick={() => setSelectedCity(city._id)} className={selectedCity === city._id ? "bg-gray-100" : ""}>
                  <TableCell>{city.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingCity(city)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCity(city._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sub-areas</CardTitle>
          <CardDescription>Manage sub-areas for the selected city.</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedCity && (
            <>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="New sub-area name"
                  value={newSubAreaName}
                  onChange={(e) => setNewSubAreaName(e.target.value)}
                />
                <Button onClick={handleAddSubArea}>Add Sub-area</Button>
              </div>
              {editingSubArea && (
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="New sub-area name"
                    value={editingSubArea.name}
                    onChange={(e) => setEditingSubArea({ ...editingSubArea, name: e.target.value })}
                  />
                  <Button onClick={handleUpdateSubArea}>Update Sub-area</Button>
                  <Button variant="outline" onClick={() => setEditingSubArea(null)}>Cancel</Button>
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
                  {subAreas.map((subArea) => (
                    <TableRow key={subArea._id}>
                      <TableCell>{subArea.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingSubArea(subArea)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteSubArea(subArea._id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
          {!selectedCity && <p>Please select a city to see its sub-areas.</p>}
        </CardContent>
      </Card>
    </div>
  );
}