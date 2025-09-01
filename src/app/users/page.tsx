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

export default function UserManagementPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All Statuses");

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`;
      if (statusFilter !== "All Statuses") {
        url += `?status=${statusFilter.toLowerCase()}`;
      }

      const res = await fetch(url, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  React.useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, fetchUsers]);

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
      fetchUsers();
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
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: UserType["userStatus"]) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage and review user accounts, including approval status.
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
          <div className="flex gap-2">
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading users...</div>
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
                          {getStatusText(user.userStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link href={`/users/${user._id}`}>
                          <Button variant="outline" size="sm" className="px-2">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {user.userStatus !== "approved" && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveReject(user._id, "approve")}
                          >
                            Approve
                          </Button>
                        )}
                        {user.userStatus !== "rejected" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleApproveReject(user._id, "reject")}
                          >
                            Reject
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No users found.
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