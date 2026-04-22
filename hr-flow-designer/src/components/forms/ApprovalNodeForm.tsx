import type { ApprovalNodeData, ApproverRole } from '../../types/workflow';

interface ApprovalNodeFormProps {
  data: ApprovalNodeData;
  onChange: (updates: Partial<ApprovalNodeData>) => void;
}

const APPROVER_ROLES: ApproverRole[] = ['Manager', 'HRBP', 'Director'];

export default function ApprovalNodeForm({ data, onChange }: ApprovalNodeFormProps) {
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
          placeholder="e.g. Manager Approval"
        />
        {titleError && <span className="form-error">{titleError}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Approver Role</label>
        <select
          className="form-select"
          value={data.approverRole}
          onChange={(e) =>
            onChange({ approverRole: e.target.value as ApproverRole })
          }
        >
          {APPROVER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Auto-Approve Threshold (%)</label>
        <input
          className="form-input"
          type="number"
          min={0}
          max={100}
          value={data.autoApproveThreshold}
          onChange={(e) =>
            onChange({
              autoApproveThreshold: Math.min(100, Math.max(0, Number(e.target.value))),
            })
          }
          placeholder="0"
        />
      </div>
    </>
  );
}
