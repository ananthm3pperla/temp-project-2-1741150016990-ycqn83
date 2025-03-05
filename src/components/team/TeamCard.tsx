import React from 'react';
import { Mail, Building2, ChevronRight, Users } from 'lucide-react';
import { TeamMember } from '../../types';

interface TeamCardProps {
  member: TeamMember;
  onClick: (id: string) => void;
}

export default function TeamCard({ member, onClick }: TeamCardProps) {
  const handleClick = () => {
    onClick(member.member_id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(member.member_id);
    }
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="group bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-app cursor-pointer"
      aria-label={`View ${member.member_name}'s profile`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={member.member_avatar}
            alt={member.member_name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary transition-colors"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <div>
              <h4 className="text-base font-medium text-default truncate group-hover:text-primary transition-colors">
                {member.member_name}
              </h4>
              <p className="text-sm text-muted">{member.member_role}</p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted" />
                <a 
                  href={`mailto:${member.member_email}`}
                  className="text-default hover:text-primary truncate"
                  onClick={handleEmailClick}
                >
                  {member.member_email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted" />
                <span className="text-muted">
                  {member.member_department}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted" />
                <span className="text-muted">
                  Reports to: {member.member_manager || 'Not assigned'}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight 
            className="h-5 w-5 text-muted opacity-0 group-hover:opacity-100 transition-all" 
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}