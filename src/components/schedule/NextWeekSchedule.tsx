import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Video, Users, Clock, AlertCircle, Check, Edit2 } from 'lucide-react';
import { DayMeetings } from '../../lib/googleCalendar';

interface NextWeekScheduleProps {
  nextWeekStart: Date;
  selectedDays: string[];
  calendarMeetings: DayMeetings[];
  departmentSummary: {
    nextWeekVotes: {
      [key: string]: number;
    };
  };
  isLoadingCalendar: boolean;
  calendarError: string | null;
  onDaySelect: (dateStr: string) => void;
  onSubmit: (selectedDays: string[]) => void;
}

const NextWeekSchedule = ({
  nextWeekStart,
  selectedDays,
  calendarMeetings,
  departmentSummary,
  calendarError,
  onDaySelect,
  onSubmit
}: NextWeekScheduleProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localVotes, setLocalVotes] = useState<{[key: string]: number}>({});
  const [editableSelectedDays, setEditableSelectedDays] = useState<string[]>([]);
  
  React.useEffect(() => {
    setLocalVotes({...departmentSummary.nextWeekVotes});
    // Check localStorage for previously submitted days
    const savedPreferences = localStorage.getItem('officePreferences');
    if (savedPreferences) {
      const { days, submitted } = JSON.parse(savedPreferences);
      if (days && days.length > 0) {
        setEditableSelectedDays(days);
        setIsSubmitted(submitted);
      } else {
        setEditableSelectedDays(selectedDays);
      }
    } else {
      setEditableSelectedDays(selectedDays);
    }
  }, [departmentSummary.nextWeekVotes, selectedDays]);

  const nextWeekDays = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(nextWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  const handleDayToggle = (dateStr: string) => {
    if (isSubmitted && !isEditing) return;
    
    setEditableSelectedDays(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      } else {
        return [...prev, dateStr];
      }
    });
  };

  const handleSubmission = () => {
    const updatedVotes = {...localVotes};
    
    nextWeekDays.forEach(day => {
      const dayKey = format(day, 'EEEE').toLowerCase();
      const dateStr = format(day, 'yyyy-MM-dd');
      
      if (editableSelectedDays.includes(dateStr)) {
        updatedVotes[dayKey] = (updatedVotes[dayKey] || 0) + 1;
      }
    });
    
    setLocalVotes(updatedVotes);
    setIsSubmitted(true);
    setIsEditing(false);
    
    // Save to localStorage
    localStorage.setItem('officePreferences', JSON.stringify({
      days: editableSelectedDays,
      submitted: true,
      timestamp: new Date().toISOString()
    }));
    
    onSubmit(editableSelectedDays);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Revert to saved preferences
    const savedPreferences = localStorage.getItem('officePreferences');
    if (savedPreferences) {
      const { days } = JSON.parse(savedPreferences);
      setEditableSelectedDays(days);
    }
    setIsEditing(false);
  };

  return (
    <div className="lg:col-span-3 bg-card rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted" />
            <h3 className="text-lg font-medium text-default">Next Week's Schedule</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Clock className="h-4 w-4" />
              <span>Week of {format(nextWeekStart, 'MMM d, yyyy')}</span>
            </div>
            
            {isSubmitted && !isEditing && (
              <button 
                onClick={handleEdit}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>
        </div>

        {calendarError && (
          <div className="mb-4 p-3 rounded-md bg-error/10 text-error text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{calendarError}</span>
          </div>
        )}

        {isSubmitted && !isEditing && (
          <div className="mb-4 p-3 rounded-md bg-success/10 text-success text-sm flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>Your preferences have been submitted for {editableSelectedDays.length} {editableSelectedDays.length === 1 ? 'day' : 'days'}</span>
          </div>
        )}

        {isEditing && (
          <div className="mb-4 p-3 rounded-md bg-warning/10 text-warning text-sm flex items-center gap-2">
            <Edit2 className="h-4 w-4" />
            <span>You are editing your preferences</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            {nextWeekDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isSelected = editableSelectedDays.includes(dateStr);
              const dayKey = format(day, 'EEEE').toLowerCase();
              const votes = localVotes[dayKey] || 0;
              const dayMeetings = calendarMeetings.find(m => m.date === dateStr);
              
              // Determine the visual state based on selection and submission status
              const isInteractive = !isSubmitted || isEditing;
              const isHighlighted = isSelected;
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => isInteractive && handleDayToggle(dateStr)}
                  disabled={!isInteractive}
                  className={`
                    relative p-4 rounded-lg border transition-all duration-200 text-left
                    ${isHighlighted 
                      ? 'border-primary bg-primary text-white shadow-md' 
                      : 'border-default hover:border-primary/50 hover:bg-card-hover'
                    }
                    ${isSubmitted && !isEditing && isSelected ? 'ring-2 ring-success' : ''}
                    ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <span className="block text-sm font-medium">{format(day, 'EEEE')}</span>
                  <span className={`block text-xs ${isHighlighted ? 'text-white/80' : 'text-muted'}`}>
                    {format(day, 'MMM d')}
                  </span>
                  
                  <div className={`mt-3 flex items-center gap-1 ${isHighlighted ? 'text-white/90' : 'text-muted'}`}>
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{votes} {votes === 1 ? 'person' : 'people'}</span>
                  </div>
                  
                  {dayMeetings && (
                    <div className={`mt-1 flex items-center gap-1 text-xs ${isHighlighted ? 'text-white/80' : 'text-muted'}`}>
                      <Video className="h-3.5 w-3.5" />
                      <span>{dayMeetings.totalMeetings} {dayMeetings.totalMeetings === 1 ? 'meeting' : 'meetings'}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {(!isSubmitted || isEditing) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted">
                {editableSelectedDays.length} {editableSelectedDays.length === 1 ? 'day' : 'days'} selected
              </div>
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 rounded-md text-sm font-medium text-muted hover:text-default transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSubmission}
                  disabled={editableSelectedDays.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white font-medium text-sm hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="h-4 w-4" />
                  {isEditing ? 'Update Preferences' : 'Submit Preferences'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextWeekSchedule;