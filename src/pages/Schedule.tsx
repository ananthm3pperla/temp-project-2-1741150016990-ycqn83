import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { Building2, Home, Clock } from 'lucide-react';
import { googleCalendar, DayMeetings } from '../lib/googleCalendar';
import ScheduleHeader from '../components/schedule/ScheduleHeader';
import WeekProgress from '../components/schedule/WeekProgress';
import OfficeRequirements from '../components/schedule/OfficeRequirements';
import DepartmentSummary from '../components/schedule/DepartmentSummary';
import NextWeekSchedule from '../components/schedule/NextWeekSchedule';
import TeamPlans from '../components/schedule/TeamPlans';

// Helper functions
const getWorkTypeColor = (type: string) => {
  switch (type) {
    case 'office':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'remote':
      return 'bg-success/10 text-success border-success/20';
    case 'flexible':
      return 'bg-warning/10 text-warning border-warning/20';
    default:
      return 'bg-muted/10 text-muted border-muted/20';
  }
};

const getWorkTypeIcon = (type: string) => {
  switch (type) {
    case 'office':
      return <Building2 className="h-4 w-4" />;
    case 'remote':
      return <Home className="h-4 w-4" />;
    case 'flexible':
      return <Clock className="h-4 w-4" />;
    default:
      return null;
  }
};

// Mock data
const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
const nextWeekStart = addWeeks(currentWeekStart, 1);

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Distinguished Engineer",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    votedDays: ["2025-02-11", "2025-02-12", "2025-02-13"],
    schedule: {
      "2025-02-03": "office",
      "2025-02-04": "office",
      "2025-02-05": "remote",
      "2025-02-06": "flexible",
      "2025-02-07": "remote"
    }
  },
  {
    name: "Michael Rodriguez",
    role: "Senior Software Engineer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    votedDays: ["2025-02-10", "2025-02-12", "2025-02-14"],
    schedule: {
      "2025-02-03": "remote",
      "2025-02-04": "office",
      "2025-02-05": "office",
      "2025-02-06": "remote",
      "2025-02-07": "flexible"
    }
  },
  {
    name: "Emily Watson",
    role: "Principal Cloud Architect",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    votedDays: ["2025-02-11", "2025-02-13", "2025-02-14"],
    schedule: {
      "2025-02-03": "flexible",
      "2025-02-04": "office",
      "2025-02-05": "office",
      "2025-02-06": "remote",
      "2025-02-07": "remote"
    }
  },
  {
    name: "David Park",
    role: "Staff Software Engineer",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
    votedDays: ["2025-02-10", "2025-02-11", "2025-02-13"],
    schedule: {
      "2025-02-03": "office",
      "2025-02-04": "remote",
      "2025-02-05": "office",
      "2025-02-06": "office",
      "2025-02-07": "remote"
    }
  },
  {
    name: "Jennifer Lee",
    role: "Senior DevOps Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    votedDays: ["2025-02-12", "2025-02-13", "2025-02-14"],
    schedule: {
      "2025-02-03": "remote",
      "2025-02-04": "remote",
      "2025-02-05": "office",
      "2025-02-06": "office",
      "2025-02-07": "flexible"
    }
  },
  {
    name: "Alex Thompson",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    votedDays: ["2025-02-10", "2025-02-11", "2025-02-12"],
    schedule: {
      "2025-02-03": "flexible",
      "2025-02-04": "remote",
      "2025-02-05": "remote",
      "2025-02-06": "office",
      "2025-02-07": "office"
    }
  }
];

const departmentSummary = {
  totalMembers: 8,
  inOffice: 5,
  remote: 2,
  flexible: 1,
  nextWeekVotes: {
    monday: 3,
    tuesday: 6,
    wednesday: 7,
    thursday: 4,
    friday: 2
  }
};

export default function Schedule() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [calendarMeetings, setCalendarMeetings] = useState<DayMeetings[]>([]);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  useEffect(() => {
    const loadCalendarEvents = async () => {
      try {
        setIsLoadingCalendar(true);
        setCalendarError(null);

        try {
          await googleCalendar.getWeekEvents(
            nextWeekStart,
            addDays(nextWeekStart, 5)
          );
        } catch (error: any) {
          if (error.message === 'Not authorized') {
            await googleCalendar.authorize();
            return;
          }
          throw error;
        }

        const meetings = await googleCalendar.getWeekEvents(
          nextWeekStart,
          addDays(nextWeekStart, 5)
        );

        setCalendarMeetings(meetings);
      } catch (error) {
        console.error('Error loading calendar events:', error);
        setCalendarError('Failed to load calendar events');
      } finally {
        setIsLoadingCalendar(false);
      }
    };

    loadCalendarEvents();
  }, []);

  const handleDaySelect = (dateStr: string) => {
    setSelectedDays(days => 
      days.includes(dateStr)
        ? days.filter(d => d !== dateStr)
        : [...days, dateStr]
    );
  };

  const handleSubmit = () => {
    console.log('Submitted days:', selectedDays);
    setSelectedDays([]);
  };

  return (
    <div className="space-y-6">
      <ScheduleHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <WeekProgress />
        <OfficeRequirements />
        <DepartmentSummary summary={departmentSummary} />

        <NextWeekSchedule
          nextWeekStart={nextWeekStart}
          selectedDays={selectedDays}
          calendarMeetings={calendarMeetings}
          departmentSummary={departmentSummary}
          isLoadingCalendar={isLoadingCalendar}
          calendarError={calendarError}
          onDaySelect={handleDaySelect}
          onSubmit={handleSubmit}
        />

        <TeamPlans
          currentWeekStart={currentWeekStart}
          teamMembers={teamMembers}
          getWorkTypeColor={getWorkTypeColor}
          getWorkTypeIcon={getWorkTypeIcon}
        />
      </div>
    </div>
  );
}