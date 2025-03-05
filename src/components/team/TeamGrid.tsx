import React from 'react';
import { TeamMember } from '../../types';
import TeamCard from './TeamCard';

interface TeamGridProps {
  members: TeamMember[];
  onMemberClick: (id: string) => void;
}

export default function TeamGrid({ members, onMemberClick }: TeamGridProps) {
  const handleMemberClick = (memberId: string) => {
    onMemberClick(memberId);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map(member => (
        <TeamCard
          key={member.member_id}
          member={member}
          onClick={handleMemberClick}
        />
      ))}
    </div>
  );
}