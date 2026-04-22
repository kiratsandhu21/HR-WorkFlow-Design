import { Plus, X } from 'lucide-react';
import type { KeyValuePair } from '../../types/workflow';

interface KeyValueEditorProps {
  label: string;
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export default function KeyValueEditor({
  label,
  pairs,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}: KeyValueEditorProps) {
  const handleAdd = () => {
    onChange([...pairs, { key: '', value: '' }]);
  };

  const handleRemove = (index: number) => {
    onChange(pairs.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = pairs.map((pair, i) =>
      i === index ? { ...pair, [field]: val } : pair,
    );
    onChange(updated);
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="kv-editor">
        {pairs.map((pair, index) => (
          <div className="kv-row" key={index}>
            <input
              className="form-input"
              type="text"
              placeholder={keyPlaceholder}
              value={pair.key}
              onChange={(e) => handleChange(index, 'key', e.target.value)}
            />
            <input
              className="form-input"
              type="text"
              placeholder={valuePlaceholder}
              value={pair.value}
              onChange={(e) => handleChange(index, 'value', e.target.value)}
            />
            <button
              className="kv-remove-btn"
              onClick={() => handleRemove(index)}
              title="Remove field"
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button className="kv-add-btn" onClick={handleAdd} type="button">
          <Plus size={14} />
          Add Field
        </button>
      </div>
    </div>
  );
}
