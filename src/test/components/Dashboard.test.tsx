import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('Dashboard Page', () => {
  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Dashboard />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard with welcome message', () => {
    renderDashboard();
    expect(screen.getByText(/Welcome back, Richard!/i)).toBeInTheDocument();
  });

  it('displays current date', () => {
    renderDashboard();
    const dateRegex = /\w+, \w+ \d+, \d{4}/;
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
  });

  it('displays all key metrics', () => {
    renderDashboard();
    const metrics = [
      'Office Attendance',
      'Team Engagement',
      'Collaboration Score',
      'Goals Progress'
    ];

    metrics.forEach(metric => {
      expect(screen.getByText(metric)).toBeInTheDocument();
    });
  });

  it('shows team updates section', () => {
    renderDashboard();
    expect(screen.getByText('Executive Team Updates')).toBeInTheDocument();
  });

  it('displays recent achievements', () => {
    renderDashboard();
    expect(screen.getByText('Recent Achievements')).toBeInTheDocument();
  });

  it('shows today\'s schedule', () => {
    renderDashboard();
    expect(screen.getByText('Today\'s Schedule')).toBeInTheDocument();
  });

  it('displays executive team members', () => {
    renderDashboard();
    const executives = [
      'Sanjiv Yajnik',
      'Frank LaPrade',
      'Stephanie Ratio'
    ];

    executives.forEach(executive => {
      expect(screen.getByText(executive)).toBeInTheDocument();
    });
  });

  it('shows achievement points', () => {
    renderDashboard();
    const achievements = screen.getAllByText(/\+\d+ pts/);
    expect(achievements.length).toBeGreaterThan(0);
  });

  it('displays meeting times in correct format', () => {
    renderDashboard();
    const timeRegex = /\d{1,2}:\d{2} [AP]M/;
    const meetingTimes = screen.getAllByText(timeRegex);
    expect(meetingTimes.length).toBeGreaterThan(0);
  });
});