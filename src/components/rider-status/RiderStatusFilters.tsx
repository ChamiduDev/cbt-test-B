"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FilterFilters {
  vehicleNumber: string;
  vehicleName: string;
  status: string;
}

interface RiderStatusFiltersProps {
  onFilter: (filters: FilterFilters) => void;
}

export const RiderStatusFilters = ({ onFilter }: RiderStatusFiltersProps) => {
  const [filters, setFilters] = useState<FilterFilters>({ vehicleNumber: '', vehicleName: '', status: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value });
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  return (
    <div className="flex items-center space-x-4 my-4">
      <Input
        name="vehicleNumber"
        placeholder="Vehicle Number"
        value={filters.vehicleNumber}
        onChange={handleChange}
      />
      <Input
        name="vehicleName"
        placeholder="Vehicle Name"
        value={filters.vehicleName}
        onChange={handleChange}
      />
      <Select onValueChange={handleStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="on_the_way">On the Way</SelectItem>
          <SelectItem value="waiting">Waiting</SelectItem>
          <SelectItem value="not_available">Not Available</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleFilter}>Filter</Button>
    </div>
  );
};
