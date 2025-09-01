import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Counts {
  waiting: number;
  onTheWay: number;
  notAvailable: number;
}

interface RiderStatusSummaryProps {
  counts: Counts;
}

export const RiderStatusSummary = ({ counts }: RiderStatusSummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>On the Way</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counts.onTheWay}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Waiting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counts.waiting}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Not Available</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counts.notAvailable}</div>
        </CardContent>
      </Card>
    </div>
  );
};
