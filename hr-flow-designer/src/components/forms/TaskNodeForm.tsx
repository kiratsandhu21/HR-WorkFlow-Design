import type { TaskNodeData, KeyValuePair } from '../../types/workflow';
import KeyValueEditor from '../ui/KeyValueEditor';

interface TaskNodeFormProps {
  data: TaskNodeData;
  onChange: (updates: Partial<TaskNodeData>) => void;
}

export default function TaskNodeForm({ data, onChange }: TaskNodeFormProps) {
  const titleError = data.title.trim() === '' ? 'Title is required' : '';

  return (
    <>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          className="form-input"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Review Documents"
        />
        {titleError && <span className="form-error">{titleError}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe what this task involves..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Assignee</label>
        <input
          className="form-input"
          type="text"
          value={data.assignee}
          onChange={(e) => onChange({ assignee: e.target.value })}
          placeholder="e.g. John Smith"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Due Date</label>
        <input
          className="form-input"
          type="date"
          value={data.dueDate}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
      </div>

      <KeyValueEditor
        label="Custom Fields"
        pairs={data.customFields}
        onChange={(customFields: KeyValuePair[]) => onChange({ customFields })}
        keyPlaceholder="Field name"
        valuePlaceholder="Field value"
      />
    </>
  );
}
