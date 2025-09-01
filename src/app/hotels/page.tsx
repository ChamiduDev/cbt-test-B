import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function HotelsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hotels</CardTitle>
        <CardDescription>Manage your hotels here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Hotels content will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
