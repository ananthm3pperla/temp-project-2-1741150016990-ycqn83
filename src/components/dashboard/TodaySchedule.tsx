import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, BarChart3, Video, ChevronRight, X, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { faker } from '@faker-js/faker';
import { companySettings } from '../../data/company';

interface Meeting {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  attendees: number;
  location: string;
  type: 'team' | 'strategy' | 'one-on-one';
  description?: string;
  organizer?: string;
  meetingLink?: string;
  platform?: 'Zoom' | 'Microsoft Teams' | 'Google Meet';
}

export default function TodaySchedule() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    const mockMeetings = Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => {
      const platform = faker.helpers.arrayElement(['Zoom', 'Microsoft Teams', 'Google Meet']);
      const meetingLink = platform === 'Zoom' 
        ? 'https://zoom.us/j/' + faker.number.int({ min: 10000000, max: 99999999 })
        : platform === 'Microsoft Teams'
        ? 'https://teams.microsoft.com/l/meetup-join/' + faker.string.uuid()
        : 'https://meet.google.com/' + faker.string.alphanumeric(12);

      return {
        id: faker.string.uuid(),
        title: faker.company.catchPhrase(),
        start_time: faker.date.soon().toISOString(),
        end_time: faker.date.soon().toISOString(),
        attendees: faker.number.int({ min: 2, max: 15 }),
        location: platform + ' Meeting',
        type: faker.helpers.arrayElement(['team', 'strategy', 'one-on-one']),
        description: faker.lorem.paragraph(),
        organizer: faker.person.fullName(),
        meetingLink,
        platform
      };
    });

    setMeetings(mockMeetings);
    setIsLoading(false);
  }, []);

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
            <Calendar className="h-5 w-5 text-muted" />
            <h3 className="text-lg font-medium text-default">Today's Schedule</h3>
          </div>
          <Clock className="h-5 w-5 text-muted" />
        </div>
        <div className="space-y-4">
          {meetings.length > 0 ? (
            meetings.map((meeting) => (
              <div 
                key={meeting.id}
                onClick={() => setSelectedMeeting(meeting)}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
              >
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${companySettings.branding.primaryColor}15` }}
                >
                  {meeting.type === 'team' ? (
                    <Users className="h-5 w-5" style={{ color: companySettings.branding.primaryColor }} />
                  ) : meeting.type === 'strategy' ? (
                    <BarChart3 className="h-5 w-5" style={{ color: companySettings.branding.primaryColor }} />
                  ) : (
                    <Video className="h-5 w-5" style={{ color: companySettings.branding.primaryColor }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-default">{meeting.title}</h4>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
                    <span>
                      {format(new Date(meeting.start_time), 'h:mm a')} - {format(new Date(meeting.end_time), 'h:mm a')}
                    </span>
                    <span>·</span>
                    <span>{meeting.location}</span>
                    <span>·</span>
                    <span>{meeting.attendees} attendees</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted" />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted">No meetings scheduled for today</p>
            </div>
          )}
        </div>
      </div>

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-default">{selectedMeeting.title}</h3>
                <p className="text-sm text-muted mt-1">
                  Organized by {selectedMeeting.organizer}
                </p>
              </div>
              <button 
                onClick={() => setSelectedMeeting(null)}
                className="text-muted hover:text-default"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted" />
                  <span>
                    {format(new Date(selectedMeeting.start_time), 'h:mm a')} - 
                    {format(new Date(selectedMeeting.end_time), 'h:mm a')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted" />
                  <span>{selectedMeeting.attendees} attendees</span>
                </div>
              </div>
              
              <div className="text-sm">
                <p className="text-muted mb-2">Description</p>
                <p className="text-default">{selectedMeeting.description}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              {selectedMeeting.meetingLink && (
                <a
                  href={selectedMeeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-light transition-colors"
                >
                  <Video className="h-4 w-4" />
                  Join {selectedMeeting.platform}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button
                onClick={() => setSelectedMeeting(null)}
                className="px-4 py-2 rounded-md border border-default text-default hover:bg-card-hover transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}