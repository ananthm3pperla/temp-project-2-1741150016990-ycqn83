import React, { useEffect, useState } from 'react';
import { Trophy, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { generateMockAchievements } from '../../lib/mockData';
import { companySettings } from '../../data/company';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  points: number;
  type: 'attendance' | 'collaboration' | 'engagement';
}

export default function RecentAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate mock achievements using the existing function
    const mockAchievements = generateMockAchievements(3);
    setAchievements(mockAchievements);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg shadow-md">
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
    <div className="bg-card rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-muted" />
            <h3 className="text-lg font-medium text-default">Recent Achievements</h3>
          </div>
        </div>
        <div className="space-y-4">
          {achievements.length > 0 ? (
            achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className="group flex items-start gap-4 p-4 rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
              >
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: achievement.type === 'attendance' 
                      ? `${companySettings.branding.primaryColor}15`
                      : achievement.type === 'collaboration'
                      ? `${companySettings.branding.secondaryColor}15`
                      : `${companySettings.branding.accentColor}15`
                  }}
                >
                  <Trophy 
                    className="h-5 w-5"
                    style={{ 
                      color: achievement.type === 'attendance'
                        ? companySettings.branding.primaryColor
                        : achievement.type === 'collaboration'
                        ? companySettings.branding.secondaryColor
                        : companySettings.branding.accentColor
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-default">{achievement.title}</h4>
                  <p className="mt-1 text-xs text-muted">{achievement.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted">
                      {format(new Date(achievement.date), 'MMM d')}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                      +{achievement.points} pts
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted">No recent achievements</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}