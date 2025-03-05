import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import Profile from '../../pages/Profile';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';

// Mock localStorage
beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
  
  // Setup mock data in localStorage
  const mockMember = {
    member_id: '123',
    member_name: 'Test User',
    member_email: 'test@example.com',
    member_role: 'Software Engineer',
    member_department: 'Technology',
    member_avatar: 'https://example.com/avatar.jpg',
    member_location: 'New York, NY',
    member_phone: '555-123-4567',
    member_employeeId: 'E1234',
    member_workLocation: 'Hybrid',
    member_attendance: {
      total: 100,
      streak: 5,
      lastVisit: '2023-02-01T12:00:00Z'
    },
    member_preferences: {
      notifications: { email: true, push: true, slack: true },
      theme: 'light',
      language: 'en'
    },
    member_education: [
      {
        school: 'Stanford University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startYear: 2015,
        endYear: 2019,
        honors: ['Magna Cum Laude']
      }
    ],
    member_work_history: [
      {
        company: 'Capital One',
        role: 'Software Engineer',
        location: 'New York, NY',
        startDate: '2019-06-01',
        highlights: [
          'Developed core banking features',
          'Led team of 3 junior developers'
        ]
      }
    ],
    member_skills: ['JavaScript', 'React', 'Node.js', 'AWS']
  };
  
  localStorage.setItem('selectedMember', JSON.stringify(mockMember));
  localStorage.setItem('mockTeamMembers', JSON.stringify([mockMember]));
});

// Mock Supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: '123',
              name: 'Test User',
              email: 'test@example.com',
              role: 'Software Engineer',
              department: 'Technology',
              avatar_url: 'https://example.com/avatar.jpg',
              attendance: {
                total: 100,
                streak: 5,
                lastVisit: '2023-02-01T12:00:00Z'
              },
              preferences: {
                notifications: { email: true, push: true, slack: true },
                theme: 'light',
                language: 'en'
              },
              education: [
                {
                  school: 'Stanford University',
                  degree: 'Bachelor of Science',
                  field: 'Computer Science',
                  startYear: 2015,
                  endYear: 2019
                }
              ],
              workHistory: [
                {
                  company: 'Capital One',
                  role: 'Software Engineer',
                  location: 'New York, NY',
                  startDate: '2019-06-01',
                  highlights: ['Developed core banking features']
                }
              ]
            },
            error: null
          }))
        }))
      }))
    }))
  }
}));

describe('Profile Component', () => {
  it('renders the profile page with user data', async () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={['/profile/123']}>
            <Routes>
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </ThemeProvider>
    );

    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Check that basic profile information is displayed
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    
    // Check for education information
    expect(screen.getByText(/Stanford University/i)).toBeInTheDocument();
    
    // Check for work history information
    expect(screen.getByText(/Capital One/i)).toBeInTheDocument();
  });

  it('handles tab navigation correctly', async () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={['/profile/123']}>
            <Routes>
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </ThemeProvider>
    );

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Find and click on different tabs
    const experienceTab = screen.getByText('Experience');
    fireEvent.click(experienceTab);
    
    // Check that the experience tab content is displayed
    await waitFor(() => {
      expect(screen.getByText(/Work History/i)).toBeInTheDocument();
    });
    
    const educationTab = screen.getByText('Education');
    fireEvent.click(educationTab);
    
    // Check that the education tab content is displayed
    await waitFor(() => {
      expect(screen.getByText(/Academic Background/i)).toBeInTheDocument();
    });
  });
});