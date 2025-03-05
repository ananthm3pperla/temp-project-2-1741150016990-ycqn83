import React, { useState, useEffect } from 'react';
import { MessageSquare, Frown, Meh, Smile, Check, Pencil } from 'lucide-react';
import { format } from 'date-fns';

type Mood = 'challenging' | 'neutral' | 'good';

interface MoodOption {
  value: Mood;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface DailyPulseSubmission {
  mood: Mood;
  timestamp: string;
}

export default function DailyPulse() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadTodaysPulse = () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const savedPulse = localStorage.getItem(`dailyPulse_${today}`);
      
      if (savedPulse) {
        const submission: DailyPulseSubmission = JSON.parse(savedPulse);
        setSelectedMood(submission.mood);
        setLastUpdated(submission.timestamp);
        setIsSubmitted(true);
      }
    };

    loadTodaysPulse();
  }, []);

  const moodOptions: MoodOption[] = [
    {
      value: 'challenging',
      label: 'Challenging',
      description: 'Feeling overwhelmed or stressed',
      icon: Frown,
      color: '#EF4444', // red-500
      bgColor: '#FEE2E2' // red-100
    },
    {
      value: 'neutral',
      label: 'Neutral',
      description: 'Getting through the day',
      icon: Meh,
      color: '#F59E0B', // amber-500
      bgColor: '#FEF3C7' // amber-100
    },
    {
      value: 'good',
      label: 'Good',
      description: 'Feeling positive and productive',
      icon: Smile,
      color: '#10B981', // emerald-500
      bgColor: '#D1FAE5' // emerald-100
    }
  ];

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    
    const submission: DailyPulseSubmission = {
      mood,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage (replace with API call in production)
    const today = format(new Date(), 'yyyy-MM-dd');
    localStorage.setItem(`dailyPulse_${today}`, JSON.stringify(submission));

    setIsSubmitted(true);
    setLastUpdated(submission.timestamp);
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted" />
          <h3 className="text-lg font-medium text-default">Daily Pulse</h3>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-sm text-muted">
              Last updated: {format(new Date(lastUpdated), 'h:mm a')}
            </span>
          )}
          {isSubmitted && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-muted hover:text-default hover:bg-card-hover rounded-md transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <h4 className="text-xl text-default mb-6">
        {isSubmitted && !isEditing ? "Today's Selection" : "How are you feeling today?"}
      </h4>

      <div className="space-y-3">
        {isSubmitted && !isEditing ? (
          moodOptions
            .filter(option => option.value === selectedMood)
            .map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.value}
                  className={`
                    w-full p-4 rounded-lg border transition-all duration-200
                    flex items-center gap-4 border-${option.color} bg-${option.bgColor} ring-2 ring-${option.color}/50
                  `}
                >
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: option.bgColor,
                      color: option.color
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-left flex-1">
                    <h5 className="font-medium text-default">{option.label}</h5>
                    <p className="text-sm text-muted">{option.description}</p>
                  </div>
                  <Check className="h-5 w-5 text-success" />
                </div>
              );
            })
        ) : (
          moodOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleMoodSelect(option.value)}
                className={`
                  w-full p-4 rounded-lg border transition-all duration-200
                  flex items-center gap-4 border-default 
                  hover:border-primary/50 hover:bg-card-hover
                `}
              >
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#F3F4F6',
                    color: option.color
                  }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-left flex-1">
                  <h5 className="font-medium text-default">{option.label}</h5>
                  <p className="text-sm text-muted">{option.description}</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}