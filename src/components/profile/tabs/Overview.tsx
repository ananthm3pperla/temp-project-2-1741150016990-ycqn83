import React from 'react';
import { Building2, Users, MapPin, Calendar } from 'lucide-react';
import { Employee } from '../../../lib/mockData';

interface OverviewProps {
  profile: Employee;
}

export default function Overview({ profile }: OverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-default mb-6">
            Work Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted mb-4">Core Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-sm font-medium text-default">Department</p>
                    <p className="text-sm text-muted">{profile.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-sm font-medium text-default">Work Location</p>
                    <p className="text-sm text-muted capitalize">{profile.workLocation} Worker</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-sm font-medium text-default">Reporting Structure</p>
                    <p className="text-sm text-muted">
                      Reports to: {profile.reportsTo ? 'Manager Name' : 'Not Assigned'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted mb-4">Department Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-sm font-medium text-default">Team Size</p>
                    <p className="text-sm text-muted">{profile.department_size || 0} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-sm font-medium text-default">Office Attendance</p>
                    <p className="text-sm text-muted">
                      {profile.department_in_office || 0} in office today
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-sm font-medium text-default">Remote Work</p>
                    <p className="text-sm text-muted">
                      {profile.department_remote || 0} working remotely
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {profile.member_attendance?.bio && (
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-default mb-4">About</h2>
            <p className="text-default whitespace-pre-wrap">{profile.member_attendance.bio}</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-muted mb-4">Attendance Stats</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-default">Total Days</span>
                <span className="font-medium text-default">{profile.member_attendance?.total || 0}</span>
              </div>
              <div className="h-2 bg-card-hover rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${Math.min((profile.member_attendance?.total || 0) / 250 * 100, 100)}%` }} 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-default">Current Streak</span>
                <span className="font-medium text-default">{profile.member_attendance?.streak || 0} days</span>
              </div>
              <div className="h-2 bg-card-hover rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success rounded-full" 
                  style={{ width: `${Math.min((profile.member_attendance?.streak || 0) / 20 * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}