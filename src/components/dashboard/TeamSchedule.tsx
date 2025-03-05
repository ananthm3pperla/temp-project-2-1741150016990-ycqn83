import React, { useEffect, useState } from 'react';
import { Users, Calendar } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';
import { faker } from '@faker-js/faker';
import { getDepartmentSummary } from '../../lib/mockData';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  officeDays: Date[];
}

export default function TeamSchedule() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate mock team data using department summary
    const mockDepartment = faker.helpers.arrayElement(['Technology', 'Product Management', 'Risk Management']);
    const departmentData = getDepartmentSummary(mockDepartment);
    
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    
    const mockTeamMembers = departmentData.department_members.map(member => ({
      id: member.member_id,
      name: member.member_name,
      role: member.member_role,
      avatar: faker.image.avatar(),
      officeDays: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => {
        const dayIndex = faker.number.int({ min: 0, max: 4 });
        return addDays(currentWeekStart, dayIndex);
      })
    }));

    setTeamMembers(mockTeamMembers);
    setIsLoading(false);
  }, []);

  const weekDays = Array.from({ length: 5 }, (_, i) => 
    addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i)
  );

  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-card rounded-lg shadow-md">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-card-hover rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-card-hover rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-card rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted" />
            <h3 className="text-lg font-medium text-default">Team Office Days</h3>
          </div>
          <Calendar className="h-5 w-5 text-muted" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-4 text-sm font-medium text-muted">Team Member</th>
                {weekDays.map(day => (
                  <th key={day.toString()} className="px-2 pb-4 text-center text-sm font-medium text-muted">
                    {format(day, 'EEE')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-default">
              {teamMembers.map((member) => (
                <tr key={member.id} className="group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-default">{member.name}</div>
                        <div className="text-sm text-muted">{member.role}</div>
                      </div>
                    </div>
                  </td>
                  {weekDays.map(day => {
                    const isOfficeDay = member.officeDays.some(officeDay => 
                      format(officeDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                    );
                    return (
                      <td key={day.toString()} className="px-2 py-4 text-center">
                        {isOfficeDay && (
                          <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}