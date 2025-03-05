import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Team from '../../pages/Team';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';

// Mock localStorage
beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
  
  // Setup mock team data
  const mockTeamMembers = Array.from({ length: 20 }, (_, i) => ({
    member_id: `member-${i}`,
    member_name: `Test User ${i}`,
    member_email: `user${i}@example.com`,
    member_role: `Software Engineer ${i % 3 === 0 ? 'Lead' : i % 3 === 1 ? 'Senior' : ''}`,
    member_department: i % 3 === 0 ? 'Technology' : i % 3 === 1 ? 'Product Management' : 'Risk Management',
    member_avatar: `https://example.com/avatar${i}.jpg`,
    member_location: `City ${i}, State`,
    member_phone: `555-123-${i.toString().padStart(4, '0')}`,
    member_employeeId: `E${i.toString().padStart(4, '0')}`,
    member_workLocation: i % 3 === 0 ? 'Remote' : i % 3 === 1 ? 'Hybrid' : 'Onsite',
    member_attendance: {
      total: 100 + i,
      streak: 5 + (i % 10),
      lastVisit: new Date().toISOString()
    },
    member_preferences: {
      notifications: { email: true, push: i % 2 === 0, slack: i % 3 === 0 },
      theme: i % 3 === 0 ? 'light' : i % 3 === 1 ? 'dark' : 'system',
      language: 'en'
    },
    member_education: [
      {
        school: `University ${i}`,
        degree: i % 2 === 0 ? 'Bachelor of Science' : 'Master of Science',
        field: i % 3 === 0 ? 'Computer Science' : i % 3 === 1 ? 'Business Administration' : 'Data Science',
        startYear: 2010 + (i % 5),
        endYear: 2014 + (i % 5)
      }
    ],
    member_work_history: [
      {
        company: 'Capital One',
        role: `Software Engineer ${i % 3 === 0 ? 'Lead' : i % 3 === 1 ? 'Senior' : ''}`,
        location: `City ${i}, State`,
        startDate: `201${i % 9}-01-01`,
        highlights: [
          `Achievement ${i} A`,
          `Achievement ${i} B`
        ]
      }
    ],
    member_skills: ['JavaScript', 'React', i % 2 === 0 ? 'Node.js' : 'Python', i % 3 === 0 ? 'AWS' : 'Azure']
  }));
  
  localStorage.setItem('mockTeamMembers', JSON.stringify(mockTeamMembers));
});

// Mock Supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          range: vi.fn(() => ({
            data: Array.from({ length: 12 }, (_, i) => ({
              member_id: `member-${i}`,
              member_name: `Test User ${i}`,
              member_email: `user${i}@example.com`,
              member_role: `Software Engineer ${i % 3 === 0 ? 'Lead' : ''}`,
              member_department: i % 3 === 0 ? 'Technology' : i % 3 === 1 ? 'Product Management' : 'Risk Management',
              member_avatar: `https://example.com/avatar${i}.jpg`,
              member_attendance: {
                total: 100 + i,
                streak: 5 + (i % 10),
                lastVisit: new Date().toISOString()
              }
            })),
            error: null,
            count: 20
          }))
        }))
      })),
      distinct: vi.fn(() => ({
        data: [
          { member_department: 'Technology' },
          { member_department: 'Product Management' },
          { member_department: 'Risk Management' }
        ],
        error: null
      }))
    }))
  }
}));

describe('Team Component', () => {
  it('renders the team page with member cards', async () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Team />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );

    // Wait for team data to load
    await waitFor(() => {
      expect(screen.getByText(/Test User 0/i)).toBeInTheDocument();
    });

    // Check that multiple team members are displayed
    expect(screen.getByText(/Test User 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test User 2/i)).toBeInTheDocument();
    
    // Check that department filters are available
    expect(screen.getByText(/All Departments/i)).toBeInTheDocument();
  });

  it('filters team members by search query', async () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Team />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );

    // Wait for team data to load
    await waitFor(() => {
      expect(screen.getByText(/Test User 0/i)).toBeInTheDocument();
    });

    // Find the search input and type a search query
    const searchInput = screen.getByPlaceholderText(/Search team members/i);
    fireEvent.change(searchInput, { target: { value: 'Lead' } });
    
    // Wait for filtered results
    await waitFor(() => {
      // Should only show Lead engineers (every 3rd one)
      expect(screen.getByText(/Test User 0/i)).toBeInTheDocument();
      expect(screen.getByText(/Software Engineer Lead/i)).toBeInTheDocument();
    });
  });

  it('filters team members by department', async () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Team />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );

    // Wait for team data to load
    await waitFor(() => {
      expect(screen.getByText(/Test User 0/i)).toBeInTheDocument();
    });

    // Find the department dropdown and select a department
    const departmentSelect = screen.getByLabelText(/Department/i);
    fireEvent.change(departmentSelect, { target: { value: 'Technology' } });
    
    // Wait for filtered results
    await waitFor(() => {
      // Should only show Technology department members
      expect(screen.getByText(/Technology/i)).toBeInTheDocument();
    });
  });
});