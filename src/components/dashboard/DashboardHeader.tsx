import React, { useEffect, useState } from 'react';
import { Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { faker } from '@faker-js/faker';
import { useNavigate } from 'react-router-dom';
import FeedbackButton from '../FeedbackButton';

interface DashboardHeaderProps {
  firstName: string;
}

interface WeeklyProgress {
  completed: number;
  required: number;
}

export default function DashboardHeader({ firstName }: DashboardHeaderProps) {
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress>({ completed: 0, required: 3 });
  const navigate = useNavigate();

  useEffect(() => {
    // Generate mock weekly progress
    const mockProgress = {
      completed: faker.number.int({ min: 0, max: 3 }),
      required: 3
    };
    setWeeklyProgress(mockProgress);
  }, []);

  const progressPercentage = (weeklyProgress.completed / weeklyProgress.required) * 100;

  const handleScheduleClick = () => {
    navigate('/schedule');
  };

  const handleFeedbackSubmit = async (score: number, text: string) => {
    // Here you would make an API call to submit anonymous feedback
    console.log('Anonymous feedback submitted:', { score, text });
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-default">
            Welcome back, {firstName}!
          </h2>
          <p className="mt-1 text-sm text-muted">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleScheduleClick}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-light transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Schedule Office Day
          </button>
          <FeedbackButton 
            onSubmit={handleFeedbackSubmit}
            className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-md border border-default text-default hover:bg-card-hover transition-colors"
          />
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-default">Weekly Office Days Progress</span>
          <span className="text-sm text-muted">
            {weeklyProgress.completed} of {weeklyProgress.required} days completed
          </span>
        </div>
        <div className="h-2 bg-card-hover rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
      </div>
    </div>
  );
}