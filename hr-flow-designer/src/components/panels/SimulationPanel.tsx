import { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Play,
  ClipboardList,
  CheckCircle,
  Zap,
  Square,
} from 'lucide-react';
import type { SimulationResult, WorkflowNodeType } from '../../types/workflow';

interface SimulationPanelProps {
  result: SimulationResult | null;
  running: boolean;
  onClose: () => void;
}

const stepIconMap: Record<WorkflowNodeType, React.ReactNode> = {
  start: <Play size={14} />,
  task: <ClipboardList size={14} />,
  approval: <CheckCircle size={14} />,
  automatedStep: <Zap size={14} />,
  end: <Square size={14} />,
};

const stepColorMap: Record<WorkflowNodeType, string> = {
  start: '#22C55E',
  task: '#3B82F6',
  approval: '#F59E0B',
  automatedStep: '#8B5CF6',
  end: '#EF4444',
};

const statusIcon: Record<string, React.ReactNode> = {
  success: <CheckCircle2 size={14} />,
  skipped: <AlertTriangle size={14} />,
  error: <XCircle size={14} />,
};

export default function SimulationPanel({
  result,
  running,
  onClose,
}: SimulationPanelProps) {
  const [jsonExpanded, setJsonExpanded] = useState(false);

  return (
    <div className="simulation-overlay" onClick={onClose}>
      <div
        className="simulation-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="simulation-header">
          <h2>Simulation Results</h2>
          <button className="simulation-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="simulation-body">
          {running && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 0',
                gap: 16,
              }}
            >
              <div className="spinner" style={{ width: 32, height: 32 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Running simulation...
              </p>
            </div>
          )}

          {!running && result && (
            <>
              {/* Status header */}
              <div
                className={`simulation-status ${result.success ? 'valid' : 'invalid'}`}
              >
                {result.success ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <XCircle size={20} />
                )}
                {result.success
                  ? 'Workflow Valid ✓'
                  : 'Workflow Invalid ✗'}
              </div>

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className="simulation-errors">
                  {result.errors.map((err, i) => (
                    <div className="simulation-error-item" key={i}>
                      <XCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                      {err}
                    </div>
                  ))}
                </div>
              )}

              {/* Steps */}
              {result.steps.length > 0 && (
                <div className="simulation-steps">
                  {result.steps.map((step, i) => (
                    <div className="simulation-step" key={i}>
                      <div
                        className="step-icon"
                        style={{
                          background:
                            stepColorMap[step.nodeType] ?? '#64748B',
                        }}
                      >
                        {stepIconMap[step.nodeType] ?? (
                          <Square size={14} />
                        )}
                      </div>
                      <div className="step-info">
                        <div className="step-label">{step.label}</div>
                        <div className="step-type">{step.nodeType}</div>
                      </div>
                      <div className={`step-status ${step.status}`}>
                        {statusIcon[step.status]}{' '}
                        {step.status === 'success'
                          ? '✓'
                          : step.status === 'skipped'
                            ? '⚠'
                            : '✗'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Raw JSON collapsible */}
              <div className="json-collapsible">
                <button
                  className="json-toggle-btn"
                  onClick={() => setJsonExpanded(!jsonExpanded)}
                >
                  {jsonExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                  Raw JSON Output
                </button>
                {jsonExpanded && (
                  <div className="json-output">
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
