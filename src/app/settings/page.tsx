"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { isAdmin } = useAuth();
  const [termsContent, setTermsContent] = React.useState("");
  const [commissionType, setCommissionType] = React.useState("percentage");
  const [commissionValue, setCommissionValue] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      setError(null);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        if (!backendUrl) {
          throw new Error("Backend URL not configured");
        }
        
        const res = await fetch(`${backendUrl}/api/terms-and-conditions`);
        if (!res.ok) {
          throw new Error("Failed to fetch terms and conditions");
        }
        const data = await res.json();
        setTermsContent(data.content);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchCommission = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        if (!backendUrl) {
          throw new Error("Backend URL not configured");
        }
        
        if (!token) {
          throw new Error("No authentication token found");
        }
        
        const res = await fetch(`${backendUrl}/api/app-commission`, {
          headers: {
            "x-auth-token": token,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch app commission");
        }
        const data = await res.json();
        setCommissionType(data.type);
        setCommissionValue(data.value);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchTerms();
      fetchCommission();
    }
  }, [isAdmin, toast]);

  const handleSaveTerms = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      if (!backendUrl) {
        setError("Backend URL not configured.");
        return;
      }
      
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const res = await fetch(`${backendUrl}/api/terms-and-conditions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ content: termsContent }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to save terms and conditions");
      }

      toast({
        title: "Success",
        description: "Terms and Conditions updated successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCommission = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      if (!backendUrl) {
        setError("Backend URL not configured.");
        return;
      }
      
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const res = await fetch(`${backendUrl}/api/app-commission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ type: commissionType, value: commissionValue }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to save app commission");
      }

      toast({
        title: "Success",
        description: "App commission updated successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    <div className="grid grid-cols-1 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
          <CardDescription>Edit the application's terms and conditions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading terms...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">Error: {error}</div>
          ) : (
            <Textarea
              className="min-h-[200px]"
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              placeholder="Enter terms and conditions here..."
            />
          )}
          <Button onClick={handleSaveTerms} disabled={loading}>
            Save Terms and Conditions
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>App Commission</CardTitle>
          <CardDescription>Set the application's commission rate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <label>
              <input
                type="radio"
                value="percentage"
                checked={commissionType === "percentage"}
                onChange={() => setCommissionType("percentage")}
              />
              <span className="ml-2">Percentage</span>
            </label>
            <label>
              <input
                type="radio"
                value="fixed"
                checked={commissionType === "fixed"}
                onChange={() => setCommissionType("fixed")}
              />
              <span className="ml-2">Fixed</span>
            </label>
          </div>
          <div>
            <label htmlFor="commissionValue">Commission Value</label>
            <input
              id="commissionValue"
              type="number"
              value={commissionValue}
              onChange={(e) => setCommissionValue(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <Button onClick={handleSaveCommission} disabled={loading}>
            Save Commission
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
