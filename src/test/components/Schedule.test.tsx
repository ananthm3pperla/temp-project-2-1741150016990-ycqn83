import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Schedule from '../../pages/Schedule';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { googleCalendar } from '../../lib/googleCalendar';

// Mock Google Calendar
vi.mock('../../lib/googleCalendar', () => ({
  googleCalendar: {
    authorize: vi.fn().mockResolvedValue(undefined),
    getWeekEvents: vi.fn().mockResolvedValue([
      {
        date: '2025-02-10',
        totalMeetings: 3,
        totalDuration: 180,
        events: [
          {
            id: '1',
            summary: 'Team Meeting',
            start: new Date('2025-02-10T10:00:00'),
            end: new Date('2025-02-10T11:00:00'),
            isAllDay: false
          }
        ]
      }
    ])
  }
}));

describe('Schedule Page', () => {
  const renderSchedule = () => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Schedule />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders schedule page with title', () => {
    renderSchedule();
    expect(screen.getByText('Team Schedule')).toBeInTheDocument();
  });

  it('displays RTO policy information', () => {
    renderSchedule();
    expect(screen.getByText('Office Day Requirements')).toBeInTheDocument();
    expect(screen.getByText('2 Days Required')).toBeInTheDocument();
  });

  it('shows core hours information', () => {
    renderSchedule();
    expect(screen.getByText(/Core Hours:/)).toBeInTheDocument();
  });

  it('displays department summary', () => {
    renderSchedule();
    expect(screen.getByText('Department Summary')).toBeInTheDocument();
  });

  it('shows team plans section', () => {
    renderSchedule();
    expect(screen.getByText('Team Plans')).toBeInTheDocument();
  });

  it('loads calendar events', async () => {
    renderSchedule();
    
    await waitFor(() => {
      expect(googleCalendar.getWeekEvents).toHaveBeenCalled();
    });
  });

  it('displays feedback button', () => {
    renderSchedule();
    expect(screen.getByText('Provide Feedback')).toBeInTheDocument();
  });

  it('shows next week\'s schedule', () => {
    renderSchedule();
    expect(screen.getByText('Next Week\'s Schedule')).toBeInTheDocument();
  });

  it('displays work type indicators', () => {
    renderSchedule();
    const workTypes = ['In Office', 'Remote', 'Flexible'];
    workTypes.forEach(type => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });

  it('shows team member schedules', () => {
    renderSchedule();
    const teamMembers = [
      'Sarah Chen',
      'Michael Rodriguez',
      'Emily Watson'
    ];

    teamMembers.forEach(member => {
      expect(screen.getByText(member)).toBeInTheDocument();
    });
  });

  it('handles calendar authorization', async () => {
    renderSchedule();
    
    await waitFor(() => {
      expect(googleCalendar.authorize).toHaveBeenCalled();
    });
  });

  it('displays meeting counts correctly', async () => {
    renderSchedule();
    
    await waitFor(() => {
      expect(screen.getByText('3 meetings')).toBeInTheDocument();
    });
  });
});