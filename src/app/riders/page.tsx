import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function RidersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riders</CardTitle>
        <CardDescription>Manage your riders here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Riders content will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
