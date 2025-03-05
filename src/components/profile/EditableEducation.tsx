import React, { useState } from 'react';
import { Pencil, X, Plus } from 'lucide-react';
import { Education } from '../../lib/mockData';

interface EditableEducationProps {
  education: Education;
  index: number;
  onSave: (index: number, data: Education) => void;
  onDelete: (index: number) => void;
  canEdit: boolean;
}

export default function EditableEducation({ 
  education, 
  index, 
  onSave, 
  onDelete, 
  canEdit 
}: EditableEducationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEducation, setEditedEducation] = useState(education);

  const handleSave = () => {
    onSave(index, editedEducation);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border-l-2 border-primary/20 pl-4 space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            value={editedEducation.school}
            onChange={(e) => setEditedEducation({ ...editedEducation, school: e.target.value })}
            className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="School"
          />
          <input
            type="text"
            value={editedEducation.degree}
            onChange={(e) => setEditedEducation({ ...editedEducation, degree: e.target.value })}
            className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Degree"
          />
          <input
            type="text"
            value={editedEducation.field}
            onChange={(e) => setEditedEducation({ ...editedEducation, field: e.target.value })}
            className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Field of Study"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={editedEducation.startYear}
              onChange={(e) => setEditedEducation({ ...editedEducation, startYear: parseInt(e.target.value) })}
              className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Start Year"
            />
            <input
              type="number"
              value={editedEducation.endYear}
              onChange={(e) => setEditedEducation({ ...editedEducation, endYear: parseInt(e.target.value) })}
              className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="End Year"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-default">Honors</label>
          {editedEducation.honors?.map((honor, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={honor}
                onChange={(e) => {
                  const newHonors = [...(editedEducation.honors || [])];
                  newHonors[i] = e.target.value;
                  setEditedEducation({ ...editedEducation, honors: newHonors });
                }}
                className="block w-full rounded-md border-default bg-card text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              <button
                onClick={() => {
                  const newHonors = editedEducation.honors?.filter((_, index) => index !== i);
                  setEditedEducation({ ...editedEducation, honors: newHonors });
                }}
                className="p-2 text-error hover:bg-error/10 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setEditedEducation({
              ...editedEducation,
              honors: [...(editedEducation.honors || []), '']
            })}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-light"
          >
            <Plus className="h-4 w-4" /> Add Honor
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
          <h3 className="text-base font-medium text-default">{education.school}</h3>
          <p className="text-sm text-muted mb-1">{education.degree}</p>
          <p className="text-xs text-muted mb-2">{education.field}</p>
          <p className="text-xs text-muted mb-3">
            {education.startYear} - {education.endYear}
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
      {education.honors && education.honors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {education.honors.map((honor, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              {honor}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}