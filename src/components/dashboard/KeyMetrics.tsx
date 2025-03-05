import React, { useEffect, useState } from 'react';
import { Building2, Users, Trophy, Target } from 'lucide-react';
import { companySettings } from '../../data/company';
import { faker } from '@faker-js/faker';

interface Metrics {
  officeDays: {
    completed: number;
    required: number;
  };
  teamAlignment: {
    value: number;
    change: number;
  };
  points: {
    total: number;
    weeklyChange: number;
  };
  feedbackScore: {
    value: number;
    change: number;
  };
}

export default function KeyMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    officeDays: { completed: 0, required: 3 },
    teamAlignment: { value: 0, change: 0 },
    points: { total: 0, weeklyChange: 0 },
    feedbackScore: { value: 0, change: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate mock metrics
    const mockMetrics = {
      officeDays: {
        completed: faker.number.int({ min: 0, max: 3 }),
        required: 3
      },
      teamAlignment: {
        value: faker.number.int({ min: 70, max: 100 }),
        change: faker.number.int({ min: -15, max: 15 })
      },
      points: {
        total: faker.number.int({ min: 100, max: 1000 }),
        weeklyChange: faker.number.int({ min: 10, max: 100 })
      },
      feedbackScore: {
        value: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
        change: faker.number.float({ min: -0.5, max: 0.5, precision: 0.1 })
      }
    };

    setMetrics(mockMetrics);
    setIsLoading(false);
  }, []);

  const metricsConfig = [
    {
      name: 'Office Days',
      value: `${metrics.officeDays.completed}/${metrics.officeDays.required}`,
      change: 'On Track',
      icon: Building2,
      color: companySettings.branding.primaryColor
    },
    {
      name: 'Team Alignment',
      value: `${metrics.teamAlignment.value}%`,
      change: `${metrics.teamAlignment.change >= 0 ? '+' : ''}${metrics.teamAlignment.change}%`,
      icon: Users,
      color: companySettings.branding.secondaryColor
    },
    {
      name: 'Points Earned',
      value: metrics.points.total.toString(),
      change: `+${metrics.points.weeklyChange} this week`,
      icon: Trophy,
      color: companySettings.branding.accentColor
    },
    {
      name: 'Feedback Score',
      value: `${metrics.feedbackScore.value.toFixed(1)}/5`,
      change: `${metrics.feedbackScore.change >= 0 ? '+' : ''}${metrics.feedbackScore.change}`,
      icon: Target,
      color: '#10B981'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-6 shadow-md animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metricsConfig.map((metric) => (
        <div
          key={metric.name}
          className="relative overflow-hidden rounded-lg bg-card p-6 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4">
            <div 
              className="rounded-lg p-3 flex-shrink-0"
              style={{ backgroundColor: `${metric.color}15` }}
            >
              <metric.icon 
                className="h-6 w-6" 
                style={{ color: metric.color }}
                aria-hidden="true" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted truncate">
                {metric.name}
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <p className="text-2xl font-semibold text-default">{metric.value}</p>
                <p className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-success' : 
                  metric.change.startsWith('-') ? 'text-error' : 
                  'text-muted'
                }`}>
                  {metric.change}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}