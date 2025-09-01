import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function RevenuePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>View your revenue analytics here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Revenue content will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
