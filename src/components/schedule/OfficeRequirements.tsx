import React from 'react';
import { Building2, Clock } from 'lucide-react';

export default function OfficeRequirements() {
  return (
    <div className="bg-card rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-default mb-4">Office Day Requirements</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-default">2 Days Required</p>
              <p className="text-xs text-muted">Per Week</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-default">Core Hours: 10:00 - 16:00</p>
              <p className="text-xs text-muted">When in Office</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}