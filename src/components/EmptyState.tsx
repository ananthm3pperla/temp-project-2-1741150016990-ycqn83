import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <FileQuestion className="h-12 w-12 text-muted" />
        </div>
        <h3 className="text-lg font-medium text-default mb-2">{title}</h3>
        <p className="text-sm text-muted mb-4">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}