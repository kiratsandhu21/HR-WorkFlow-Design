import { Trash2, MousePointerClick } from 'lucide-react';
import type { WorkflowNode, WorkflowNodeData } from '../../types/workflow';
import StartNodeForm from '../forms/StartNodeForm';
import TaskNodeForm from '../forms/TaskNodeForm';
import ApprovalNodeForm from '../forms/ApprovalNodeForm';
import AutomatedStepNodeForm from '../forms/AutomatedStepNodeForm';
import EndNodeForm from '../forms/EndNodeForm';

interface NodeConfigPanelProps {
  selectedNode: WorkflowNode | null;
  onUpdateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
}

const NODE_TYPE_COLORS: Record<string, string> = {
  start: '#22C55E',
  task: '#3B82F6',
  approval: '#F59E0B',
  automatedStep: '#8B5CF6',
  end: '#EF4444',
};

const NODE_TYPE_LABELS: Record<string, string> = {
  start: 'Start',
  task: 'Task',
  approval: 'Approval',
  automatedStep: 'Automated Step',
  end: 'End',
};

export default function NodeConfigPanel({
  selectedNode,
  onUpdateNodeData,
  onDeleteNode,
}: NodeConfigPanelProps) {
  if (!selectedNode) {
    return (
      <aside className="config-panel">
        <div className="config-panel-empty">
          <MousePointerClick size={40} />
          <p>
            Select a node on the canvas to configure its properties here.
          </p>
        </div>
      </aside>
    );
  }

  const data = selectedNode.data as WorkflowNodeData;
  const nodeType = data.type;
  const color = NODE_TYPE_COLORS[nodeType] ?? '#64748B';
  const label = NODE_TYPE_LABELS[nodeType] ?? nodeType;

  const handleChange = (updates: Partial<WorkflowNodeData>) => {
    onUpdateNodeData(selectedNode.id, updates);
  };

  const renderForm = () => {
    switch (data.type) {
      case 'start':
        return <StartNodeForm data={data} onChange={handleChange} />;
      case 'task':
        return <TaskNodeForm data={data} onChange={handleChange} />;
      case 'approval':
        return <ApprovalNodeForm data={data} onChange={handleChange} />;
      case 'automatedStep':
        return <AutomatedStepNodeForm data={data} onChange={handleChange} />;
      case 'end':
        return <EndNodeForm data={data} onChange={handleChange} />;
      default:
        return <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Unknown node type.</p>;
    }
  };

  return (
    <aside className="config-panel">
      <div className="config-panel-header">
        <h2>
          <span
            className="node-type-badge"
            style={{ background: color }}
          >
            {label}
          </span>
          Configure
        </h2>
        <button
          className="delete-node-btn"
          onClick={() => onDeleteNode(selectedNode.id)}
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>

      <div className="config-panel-body">{renderForm()}</div>
    </aside>
  );
}
