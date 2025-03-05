import React, { useState } from 'react';
import { Pencil, X, Plus } from 'lucide-react';
import { WorkHistory } from '../../lib/mockData';

interface EditableWorkHistoryProps {
  work: WorkHistory;
  index: number;
  onSave: (index: number, data: WorkHistory) => void;
  onDelete: (index: number) => void;
  canEdit: boolean;
}

export default function EditableWorkHistory({ 
  work, 
  index, 
  onSave, 
  onDelete, 
  canEdit 
}: EditableWorkHistoryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWork, setEditedWork] = useState(work);

  const handleSave = () => {
    onSave(index, editedWork);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border-l-2 border-primary/20 pl-4 space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            value={editedWork.role}
            onChange={(e) => setEditedWork({ ...editedWork, role: e.target.value })}
            className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Role"
          />
          <input
            type="text"
            value={editedWork.company}
            onChange={(e) => setEditedWork({ ...editedWork, company: e.target.value })}
            className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Company"
          />
          <input
            type="text"
            value={editedWork.location}
            onChange={(e) => setEditedWork({ ...editedWork, location: e.target.value })}
            className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Location"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={editedWork.startDate}
              onChange={(e) => setEditedWork({ ...editedWork, startDate: e.target.value })}
              className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Start Date"
            />
            <input
              type="text"
              value={editedWork.endDate || ''}
              onChange={(e) => setEditedWork({ ...editedWork, endDate: e.target.value })}
              className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="End Date"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-default">Highlights</label>
          {editedWork.highlights.map((highlight, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={highlight}
                onChange={(e) => {
                  const newHighlights = [...editedWork.highlights];
                  newHighlights[i] = e.target.value;
                  setEditedWork({ ...editedWork, highlights: newHighlights });
                }}
                className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              <button
                onClick={() => {
                  const newHighlights = editedWork.highlights.filter((_, index) => index !== i);
                  setEditedWork({ ...editedWork, highlights: newHighlights });
                }}
                className="p-2 text-error hover:bg-error/10 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setEditedWork({
              ...editedWork,
              highlights: [...editedWork.highlights, '']
            })}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-light"
          >
            <Plus className="h-4 w-4" /> Add Highlight
          </button>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 text-sm font-medium rounded-md text-default hover:bg-card-hover border border-default"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light"
          >
            Save
          </button>
          <button
            onClick={() => onDelete(index)}
            className="px-3 py-1.5 text-sm font-medium rounded-md text-white bg-error hover:bg-error/80"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-l-2 border-primary/20 pl-4 group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-medium text-default">{work.role}</h3>
          <p className="text-sm text-muted mb-1">{work.company}</p>
          <p className="text-xs text-muted mb-2">{work.location}</p>
          <p className="text-xs text-muted mb-3">
            {work.startDate} - {work.endDate || 'Present'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-muted hover:text-default hover:bg-card-hover rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>
      <ul className="list-disc list-inside space-y-1">
        {work.highlights.map((highlight, i) => (
          <li key={i} className="text-sm text-default">
            {highlight}
          </li>
        ))}
      </ul>
    </div>
  );
}