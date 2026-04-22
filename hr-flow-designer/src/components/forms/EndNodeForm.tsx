import type { EndNodeData } from '../../types/workflow';

interface EndNodeFormProps {
  data: EndNodeData;
  onChange: (updates: Partial<EndNodeData>) => void;
}

export default function EndNodeForm({ data, onChange }: EndNodeFormProps) {
  return (
    <>
      <div className="form-group">
        <label className="form-label">End Message</label>
        <input
          className="form-input"
          type="text"
          value={data.endMessage}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="e.g. Onboarding Complete"
        />
      </div>

      <div className="form-toggle">
        <label>Generate Summary Report</label>
        <button
          type="button"
          className={`toggle-switch ${data.summaryFlag ? 'active' : ''}`}
          onClick={() => onChange({ summaryFlag: !data.summaryFlag })}
          aria-label="Toggle summary flag"
        />
      </div>
    </>
  );
}
