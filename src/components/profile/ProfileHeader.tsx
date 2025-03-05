import React from 'react';
import { Mail, Building2, Users, MapPin } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  role: string;
  department: string;
  avatar: string;
  email: string;
  location?: string;
  phone?: string;
  employeeId?: string;
  preferredName?: string;
  workLocation?: string;
}

export default function ProfileHeader({
  name,
  role,
  department,
  avatar,
  email,
  location,
  phone,
  employeeId,
  preferredName,
  workLocation
}: ProfileHeaderProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-md">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <img
          src={avatar}
          alt={name}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-default truncate">
                {name}
              </h1>
              {preferredName && (
                <p className="text-sm text-muted mt-1">
                  Preferred Name: {preferredName}
                </p>
              )}
              <p className="mt-1 text-lg text-muted">{role}</p>
            </div>
            {employeeId && (
              <div className="text-sm text-muted">
                Employee ID: {employeeId}
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="text-sm">
              <span className="text-muted">Department:</span>{" "}
              <span className="text-default">{department}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted">Email:</span>{" "}
              <a href={`mailto:${email}`} className="text-primary hover:underline">
                {email}
              </a>
            </div>
            {location && (
              <div className="text-sm">
                <span className="text-muted">Location:</span>{" "}
                <span className="text-default">{location}</span>
              </div>
            )}
            {phone && (
              <div className="text-sm">
                <span className="text-muted">Phone:</span>{" "}
                <a href={`tel:${phone}`} className="text-primary hover:underline">
                  {phone}
                </a>
              </div>
            )}
            {workLocation && (
              <div className="text-sm">
                <span className="text-muted">Work Mode:</span>{" "}
                <span className="text-default">{workLocation}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}