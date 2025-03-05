import React from 'react';
import { Building2 } from 'lucide-react';

export default function WeekProgress() {
  return (
    <div className="bg-card rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-default mb-4">This Week's Progress</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-sm text-default">Office Days</span>
            </div>
            <span className="text-sm font-medium text-default">2/3 Required</span>
          </div>
          <div className="h-2 bg-card-hover rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '66%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}