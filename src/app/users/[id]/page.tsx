"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type VehicleType = {
  _id: string;
  model: string;
  number: string;
  year: number;
  totalPassengers: number;
  category: string;
  location: {
    city_id: { _id: string; name: string };
    sub_area_id: { _id: string; name: string };
  };
};

type UserProfileType = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  role: string;
  userStatus: "pending" | "approved" | "rejected";
  address: string;
  hotelName?: string;
  username: string;
  registrationDate: string;
  createdAt: string;
  vehicles?: VehicleType[];
  city_id: { _id: string; name: string };
  sub_area_id: { _id: string; name: string };
};

export default function UserProfilePage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Fetching user profile for ID:", id);
      console.log("isAdmin status:", isAdmin);

      if (!isAdmin) {
        setError("Access Denied: You are not authorized to view user profiles.");
        setLoading(false);
        console.log("Access Denied: Not an admin.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          console.log("Error: No authentication token found.");
          return;
        }
        console.log("Authentication token found.");

        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`;
        console.log("Fetching from URL:", url);

        const res = await fetch(url, {
          headers: {
            "x-auth-token": token,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Failed to fetch user profile. Response not OK:", res.status, errorData);
          throw new Error(errorData.msg || "Failed to fetch user profile");
        }

        const data = await res.json();
        console.log("Successfully fetched user data:", data);
        setUser(data);
      } catch (err: any) {
        console.error("Error fetching user profile:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("Loading set to false.");
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id, isAdmin]);

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

  if (loading) {
    return <div className="text-center py-8">Loading user profile...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center py-8">User not found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile: {user.fullName}</CardTitle>
        <CardDescription>Details for {user.fullName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Phone:</strong> {user.phone}
        </div>
        {user.secondaryPhone && (
          <div>
            <strong>Secondary Phone:</strong> {user.secondaryPhone}
          </div>
        )}
        <div>
          <strong>Role:</strong> {user.role}
        </div>
        <div>
          <strong>Status:</strong> {user.userStatus}
        </div>
        <div>
          <strong>Address:</strong> {user.address}
        </div>
        <div>
          <strong>City:</strong> {user.city_id?.name || 'Not specified'}
        </div>
        <div>
          <strong>Sub Area:</strong> {user.sub_area_id?.name || 'Not specified'}
        </div>
        {user.hotelName && (
          <div>
            <strong>Hotel Name:</strong> {user.hotelName}
          </div>
        )}
        <div>
          <strong>Username:</strong> {user.username}
        </div>
        <div>
          <strong>Member Since:</strong> {new Date(user.registrationDate).toLocaleDateString()}
        </div>

        {user.role === "ride" && user.vehicles && user.vehicles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mt-4">Vehicle Details</h3>
            {user.vehicles.map((vehicle, index) => (
              <Card key={index} className="p-4">
                <div>
                  <strong>Model:</strong> {vehicle.model}
                </div>
                <div>
                  <strong>Number:</strong> {vehicle.number}
                </div>
                <div>
                  <strong>Year:</strong> {vehicle.year}
                </div>
                <div>
                  <strong>Passengers:</strong> {vehicle.totalPassengers}
                </div>
                <div>
                  <strong>Category:</strong> {vehicle.category}
                </div>
                <div>
                  <strong>Vehicle City:</strong> {vehicle.location?.city_id?.name || 'Not specified'}
                </div>
                <div>
                  <strong>Vehicle Sub Area:</strong> {vehicle.location?.sub_area_id?.name || 'Not specified'}
                </div>
              </Card>
            ))}
          </div>
        )}
        <Button onClick={() => window.history.back()}>Back to User List</Button>
      </CardContent>
    </Card>
  );
}
