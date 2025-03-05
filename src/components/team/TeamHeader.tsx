import React from 'react';

interface TeamHeaderProps {
  totalMembers: number;
}

export default function TeamHeader({ totalMembers }: TeamHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-default">Team Directory</h2>
      <p className="mt-1 text-sm text-muted">
        Browse and search through {totalMembers.toLocaleString()} team members
      </p>
    </div>
  );
}