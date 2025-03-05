import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface TeamFiltersProps {
  searchQuery: string;
  selectedDepartment: string;
  departments: string[];
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
}

export default function TeamFilters({
  searchQuery,
  selectedDepartment,
  departments,
  onSearchChange,
  onDepartmentChange,
}: TeamFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-card border border-default rounded-md focus:border-primary focus:ring-primary text-sm"
          aria-label="Search team members"
        />
      </div>

      {/* Department Filter */}
      <div className="relative w-full sm:w-48">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <select
          value={selectedDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 bg-card border border-default rounded-md focus:border-primary focus:ring-primary text-sm appearance-none"
          aria-label="Filter by department"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
      </div>
    </div>
  );
}