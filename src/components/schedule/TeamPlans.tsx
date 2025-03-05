import React from 'react';
import { format } from 'date-fns';
import { Users, Calendar, ChevronRight } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  votedDays: string[];
  schedule: {
    [key: string]: string;
  };
}

interface TeamPlansProps {
  currentWeekStart: Date;
  teamMembers: TeamMember[];
  getWorkTypeColor: (type: string) => string;
  getWorkTypeIcon: (type: string) => React.ReactNode;
}

export default function TeamPlans({
  currentWeekStart,
  teamMembers,
  getWorkTypeColor,
  getWorkTypeIcon
}: TeamPlansProps) {
  const currentWeekDays = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <div className="lg:col-span-3 bg-card rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted" />
            <h3 className="text-lg font-medium text-default">Team Plans</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Calendar className="h-4 w-4" />
            <span>Week of {format(currentWeekStart, 'MMM d, yyyy')}</span>
          </div>
        </div>

        <div className="space-y-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="group">
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-card-hover transition-colors">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div>
                      <p className="text-sm font-medium text-default">{member.name}</p>
                      <p className="text-xs text-muted">{member.role}</p>
                    </div>
                    {member.votedDays && member.votedDays.length > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Next Week:</span>
                          <span>{member.votedDays.map(date => format(new Date(date), 'EEE')).join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {currentWeekDays.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const workType = member.schedule[dateStr] || 'flexible';
                      
                      return (
                        <div
                          key={day.toString()}
                          className={`
                            relative px-3 py-2 rounded-md text-sm font-medium 
                            border flex items-center justify-center gap-2
                            ${getWorkTypeColor(workType)}
                          `}
                        >
                          {getWorkTypeIcon(workType)}
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-normal">{format(day, 'EEE')}</span>
                            <span className="capitalize text-xs hidden sm:inline">
                              {workType}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}