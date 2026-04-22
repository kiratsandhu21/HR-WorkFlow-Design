import { useAutomations } from '../../hooks/useAutomations';
import type { AutomatedStepNodeData } from '../../types/workflow';

interface AutomatedStepNodeFormProps {
  data: AutomatedStepNodeData;
  onChange: (updates: Partial<AutomatedStepNodeData>) => void;
}

export default function AutomatedStepNodeForm({
  data,
  onChange,
}: AutomatedStepNodeFormProps) {
  const { automations, loading } = useAutomations();
  const titleError = data.title.trim() === '' ? 'Title is required' : '';

  const selectedAction = automations.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    // Reset params when action changes
    const action = automations.find((a) => a.id === actionId);
    const newParams: Record<string, string> = {};
    if (action) {
      for (const param of action.params) {
        newParams[param] = data.actionParams[param] ?? '';
      }
    }
    onChange({ actionId, actionParams: newParams });
  };

  const handleParamChange = (paramKey: string, value: string) => {
    onChange({
      actionParams: { ...data.actionParams, [paramKey]: value },
    });
  };

  return (
    <>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          className="form-input"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Send Welcome Email"
        />
        {titleError && <span className="form-error">{titleError}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Action</label>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
            <div className="spinner" style={{ borderTopColor: 'var(--accent)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Loading actions...</span>
          </div>
        ) : (
          <select
            className="form-select"
            value={data.actionId}
            onChange={(e) => handleActionChange(e.target.value)}
          >
            <option value="">Select an action...</option>
            {automations.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <>
          <div className="form-separator" />
          <div className="form-group">
            <label className="form-label">Action Parameters</label>
          </div>
          {selectedAction.params.map((param) => (
            <div className="form-group" key={param}>
              <label className="form-label" style={{ textTransform: 'capitalize' }}>
                {param}
              </label>
              <input
                className="form-input"
                type="text"
                value={data.actionParams[param] ?? ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}...`}
              />
            </div>
          ))}
        </>
      )}
    </>
  );
}
