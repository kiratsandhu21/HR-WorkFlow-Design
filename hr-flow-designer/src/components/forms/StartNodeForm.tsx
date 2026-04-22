import type { StartNodeData, KeyValuePair } from '../../types/workflow';
import KeyValueEditor from '../ui/KeyValueEditor';

interface StartNodeFormProps {
  data: StartNodeData;
  onChange: (updates: Partial<StartNodeData>) => void;
}

export default function StartNodeForm({ data, onChange }: StartNodeFormProps) {
  return (
    <>
      <div className="form-group">
        <label className="form-label">Start Title</label>
        <input
          className="form-input"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Onboarding Start"
        />
      </div>

      <KeyValueEditor
        label="Metadata"
        pairs={data.metadata}
        onChange={(metadata: KeyValuePair[]) => onChange({ metadata })}
        keyPlaceholder="Key"
        valuePlaceholder="Value"
      />
    </>
  );
}
