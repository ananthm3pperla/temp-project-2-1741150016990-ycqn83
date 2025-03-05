import React from 'react';
import FeedbackButton from '../FeedbackButton';

export default function ScheduleHeader() {
  const handleFeedbackSubmit = async (score: number, text: string) => {
    console.log('Feedback submitted:', { score, text });
  };

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-default">Team Schedule</h2>
      <FeedbackButton 
        onSubmit={handleFeedbackSubmit}
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light transition-colors"
      />
    </div>
  );
}