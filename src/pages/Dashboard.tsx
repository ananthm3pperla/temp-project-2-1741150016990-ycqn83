import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import KeyMetrics from '../components/dashboard/KeyMetrics';
import DailyPulse from '../components/dashboard/DailyPulse';
import TodaySchedule from '../components/dashboard/TodaySchedule';
import TeamSchedule from '../components/dashboard/TeamSchedule';
import RecentAchievements from '../components/dashboard/RecentAchievements';

export default function Dashboard() {
  const { user } = useAuth();

  // Get user's first name from the profile
  const firstName = user?.member_name?.split(' ')[0];

  if (!firstName) {
    console.error('User profile not found:', user);
  }

  return (
    <div className="space-y-6">
      <DashboardHeader firstName={firstName || 'there'} />
      <KeyMetrics />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TodaySchedule />
        <DailyPulse user={user} />
        <RecentAchievements />
        <TeamSchedule />
      </div>
    </div>
  );
}