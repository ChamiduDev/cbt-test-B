"use client";

import { useEffect, useState } from 'react';
import { RiderStatusTable } from './RiderStatusTable';
import { RiderStatusSummary } from './RiderStatusSummary';
import { RiderStatusFilters } from './RiderStatusFilters';

interface VehicleStatus {
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
}

interface FilterFilters {
  vehicleNumber?: string;
  vehicleName?: string;
  status?: string;
}

interface Counts {
  waiting: number;
  onTheWay: number;
  notAvailable: number;
}

export const RiderStatusClient = () => {
  const [statuses, setStatuses] = useState<VehicleStatus[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<VehicleStatus[]>([]);
  const [counts, setCounts] = useState<Counts>({ waiting: 0, onTheWay: 0, notAvailable: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [statusesRes, countsRes] = await Promise.all([
          fetch('/api/admin/vehicle-status', {
            headers: {
              'x-auth-token': token || '',
            },
          }),
          fetch('/api/admin/vehicle-status/counts', {
            headers: {
              'x-auth-token': token || '',
            },
          }),
        ]);

        if (!statusesRes.ok) {
            console.error('Failed to fetch statuses:', statusesRes.status, await statusesRes.text());
            setStatuses([]);
        } else {
            const statusesData = await statusesRes.json();
            console.log('Received Statuses Data:', statusesData);
            setStatuses(statusesData);
            setFilteredStatuses(statusesData);
        }

        if (!countsRes.ok) {
            console.error('Failed to fetch counts:', countsRes.status, await countsRes.text());
            setCounts({ waiting: 0, onTheWay: 0, notAvailable: 0 });
        } else {
            const countsData = await countsRes.json();
            setCounts(countsData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setStatuses([]);
        setCounts({ waiting: 0, onTheWay: 0, notAvailable: 0 });
      }
    };
    fetchData();
  }, []);

  const handleFilter = (filters: FilterFilters) => {
    let filtered = statuses;
    if (filters.vehicleNumber) {
      filtered = filtered.filter(status => status.vehicle?.vehicleNumber?.includes(filters.vehicleNumber) || false);
    }
    if (filters.vehicleName) {
      filtered = filtered.filter(status => status.vehicle?.vehicleName?.toLowerCase().includes(filters.vehicleName.toLowerCase()) || false);
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(status => status.status === filters.status);
    }
    setFilteredStatuses(filtered);
  };

  return (
    <div>
      <RiderStatusSummary counts={counts} />
      <RiderStatusFilters onFilter={handleFilter} />
      <RiderStatusTable statuses={filteredStatuses} />
    </div>
  );
};