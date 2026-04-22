import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';
import type { AutomatedStepNodeData } from '../../types/workflow';

const AutomatedStepNode = memo(
  ({ data, selected }: NodeProps<AutomatedStepNodeData>) => {
    return (
      <div
        className={`automated-step-node workflow-node ${selected ? 'selected' : ''}`}
        style={{ borderColor: '#8B5CF6' }}
      >
        <div className="node-header" style={{ background: '#8B5CF6' }}>
          <Zap size={14} />
          <span>AUTOMATED</span>
        </div>
        <div className="node-body">
          <p className="node-title">{data.title || 'Untitled Step'}</p>
          {data.actionId && (
            <p className="node-meta">Action: {data.actionId}</p>
          )}
        </div>
        <Handle
          type="target"
          position={Position.Top}
          className="flow-handle"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="flow-handle"
        />
      </div>
    );
  },
);

AutomatedStepNode.displayName = 'AutomatedStepNode';
export default AutomatedStepNode;
