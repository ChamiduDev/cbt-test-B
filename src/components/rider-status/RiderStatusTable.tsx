import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type VehicleStatus = {
  _id: string;
  status: 'waiting' | 'on_the_way' | 'not_available';
  vehicle?: {
    vehicleNumber: string;
    vehicleName: string;
  };
  city_id?: {
    _id: string;
    name: string;
  };
  sub_area_id?: {
    _id: string;
    name: string;
  };
  fromLocation?: {
    _id: string;
    name: string;
  } | string;
  toLocation?: {
    _id: string;
    name: string;
  } | string;
  user?: {
    _id: string;
    name: string;
  };
};

export const RiderStatusTable = ({ statuses }: { statuses: VehicleStatus[] }) => {
  if (!Array.isArray(statuses)) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle Number</TableHead>
            <TableHead>Vehicle Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location/Destination</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Loading or no data available.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vehicle Number</TableHead>
          <TableHead>Vehicle Model</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Location/Destination</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {statuses.map(status => (
          <TableRow key={status._id}>
            <TableCell>{status.vehicle?.vehicleNumber || 'N/A'}</TableCell>
            <TableCell>{status.vehicle?.vehicleName || 'N/A'}</TableCell>
            <TableCell>{status.status ? status.status.replace('_', ' ') : 'N/A'}</TableCell>
            <TableCell>
              {status.status === 'waiting' && `${status.city_id?.name}, ${status.sub_area_id?.name}`}
              {status.status === 'on_the_way' && (
                status.fromLocation && status.toLocation 
                ? typeof status.fromLocation === 'object' && 'name' in status.fromLocation
                  ? `${status.fromLocation.name} to ${
                      typeof status.toLocation === 'object' && 'name' in status.toLocation 
                        ? status.toLocation.name 
                        : status.toLocation
                    }`
                  : `${status.fromLocation} to ${status.toLocation}`
                : 'Location information unavailable'
              )}
            </TableCell>
            <TableCell>{status.user?.name || 'N/A'}</TableCell>
            <TableCell>
              {status.user?._id &&
                <Link href={`/users/${status.user._id}`}>
                  <Button>View Profile</Button>
                </Link>
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};