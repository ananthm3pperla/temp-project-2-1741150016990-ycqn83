import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { User } from '../types';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import Overview from '../components/profile/tabs/Overview';
import Experience from '../components/profile/tabs/Experience';
import Education from '../components/profile/tabs/Education';
import Team from '../components/profile/tabs/Team';
import Activity from '../components/profile/tabs/Activity';
import { getOrgChart } from '../lib/orgChart';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<'overview' | 'experience' | 'education' | 'team' | 'activity'>('overview');
  const [orgChart, setOrgChart] = useState(null);

  const profileId = id || user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!profileId) {
          throw new Error('No profile ID provided');
        }

        // Fetch profile from team_directory view to get all necessary data
        const { data: profileData, error: profileError } = await supabase
          .from('team_directory')
          .select('*')
          .eq('member_id', profileId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw new Error('Failed to load profile');
        }

        if (!profileData) {
          throw new Error('Profile not found');
        }

        setProfile(profileData);

        // Fetch org chart data if on team tab
        if (currentTab === 'team') {
          const orgChartData = await getOrgChart(profileId);
          setOrgChart(orgChartData);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, currentTab]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleNodeClick = useCallback((nodeId: string) => {
    navigate(`/profile/${nodeId}`);
  }, [navigate]);

  if (loading) return <LoadingState message="Loading profile..." />;
  if (error) return <ErrorState message={error} onRetry={() => setError(null)} />;
  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="text-sm text-muted hover:text-default transition-colors"
        >
          ← Back
        </button>

        {/* Profile Header */}
        <ProfileHeader profile={profile} />

        {/* Profile Tabs */}
        <ProfileTabs currentTab={currentTab} onTabChange={setCurrentTab} />

        {/* Tab Content */}
        <div className="space-y-6">
          {currentTab === 'overview' && (
            <Overview profile={profile} />
          )}

          {currentTab === 'experience' && (
            <Experience
              workHistory={profile.member_work_history || []}
              canEdit={user?.id === profile.member_id}
              isSaving={false}
              onAdd={() => {}}
              onSave={() => {}}
              onDelete={() => {}}
            />
          )}

          {currentTab === 'education' && (
            <Education
              education={profile.member_education || []}
              canEdit={user?.id === profile.member_id}
              isSaving={false}
              onAdd={() => {}}
              onSave={() => {}}
              onDelete={() => {}}
            />
          )}

          {currentTab === 'team' && (
            <Team
              orgChart={orgChart}
              currentProfileId={profileId}
              onNodeClick={handleNodeClick}
            />
          )}

          {currentTab === 'activity' && (
            <Activity profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}