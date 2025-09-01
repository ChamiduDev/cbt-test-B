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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type UserType = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  userStatus: "pending" | "approved" | "rejected";
  role: string;
};

export default function RequestsPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchPendingUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?status=pending`, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to fetch pending users");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAdmin) {
      fetchPendingUsers();
    }
  }, [isAdmin, fetchPendingUsers]);

  const handleApproveReject = async (userId: string, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}/${action}`,
        {
          method: "PUT",
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || `Failed to ${action} user`);
      }

      // Refetch users to update the list
      fetchPendingUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredUsers = React.useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [users, searchTerm]);

  const getStatusVariant = (status: UserType["userStatus"]) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
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
    <Card>
      <CardHeader>
        <CardTitle>Pending User Requests</CardTitle>
        <CardDescription>
          Review and manage user accounts awaiting approval.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        {loading ? (
          <div className="text-center py-8">Loading pending users...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">Error: {error}</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(user.userStatus)}>
                          {user.userStatus.charAt(0).toUpperCase() + user.userStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveReject(user._id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleApproveReject(user._id, "reject")}
                        >
                          Reject
                        </Button>
                        <Link href={`/users/${user._id}`}>
                          <Button variant="outline" size="sm" className="px-2">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No pending user requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
