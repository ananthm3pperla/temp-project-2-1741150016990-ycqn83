import React from 'react';

interface DepartmentSummaryProps {
  summary: {
    totalMembers: number;
    inOffice: number;
    remote: number;
    flexible: number;
    nextWeekVotes: {
      [key: string]: number;
    };
  };
}

export default function DepartmentSummary({ summary }: DepartmentSummaryProps) {
  return (
    <div className="bg-card rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-default mb-4">Department Summary</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-primary">{summary.inOffice}</div>
              <div className="text-xs text-muted">In Office</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-success">{summary.remote}</div>
              <div className="text-xs text-muted">Remote</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-warning">{summary.flexible}</div>
              <div className="text-xs text-muted">Flexible</div>
            </div>
          </div>
          <div className="pt-4 border-t border-default">
            <div className="text-sm text-muted">Most Popular Next Week</div>
            <div className="text-sm font-medium text-default mt-1">Wednesday (7 team members)</div>
          </div>
        </div>
      </div>
    </div>
  );
}