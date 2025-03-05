import React, { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';

interface FeedbackButtonProps {
  onSubmit: (feedback: FeedbackSubmission) => Promise<void>;
  className?: string;
}

interface FeedbackSubmission {
  rating: number;
  category: 'work_environment' | 'management' | 'team_collaboration' | 'other';
  feedback: string;
  isAnonymous: boolean;
}

export default function FeedbackButton({ onSubmit, className = '' }: FeedbackButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState<FeedbackSubmission['category']>('work_environment');
  const [feedback, setFeedback] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'work_environment', label: 'Work Environment' },
    { value: 'management', label: 'Management' },
    { value: 'team_collaboration', label: 'Team Collaboration' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }

    if (!feedback.trim()) {
      setError('Please provide feedback details');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        rating,
        category,
        feedback,
        isAnonymous
      });
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setCategory('work_environment');
    setFeedback('');
    setIsAnonymous(true);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
        type="button"
      >
        <MessageSquare className="h-4 w-4" />
        Give Feedback
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="feedback-modal" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-default/30 transition-opacity" 
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="inline-block transform overflow-hidden rounded-lg bg-card px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md text-muted hover:text-default focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => setIsModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-default">
                    Share Your Feedback
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    Your feedback helps improve our workplace environment.
                  </p>
                </div>

                {error && (
                  <div className="rounded-md bg-error/10 p-4">
                    <p className="text-sm text-error">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-default mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`p-2 rounded-md transition-colors ${
                          rating >= value 
                            ? 'text-yellow-400' 
                            : 'text-muted hover:text-yellow-400'
                        }`}
                      >
                        <Star className="h-6 w-6" fill={rating >= value ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-default mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FeedbackSubmission['category'])}
                    className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-default mb-2">
                    Feedback Details
                  </label>
                  <textarea
                    id="feedback"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="Share your thoughts..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="anonymous"
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded border-default text-primary focus:ring-primary"
                  />
                  <label htmlFor="anonymous" className="ml-2 block text-sm text-default">
                    Submit anonymously
                  </label>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-default hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}