import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Square } from 'lucide-react';
import type { EndNodeData } from '../../types/workflow';

const EndNode = memo(({ data, selected }: NodeProps<EndNodeData>) => {
  return (
    <div
      className={`end-node workflow-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: '#EF4444' }}
    >
      <div className="node-header" style={{ background: '#EF4444' }}>
        <Square size={14} />
        <span>END</span>
      </div>
      <div className="node-body">
        <p className="node-title">{data.endMessage || 'End'}</p>
        {data.summaryFlag && (
          <p className="node-meta">Summary enabled</p>
        )}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="flow-handle"
      />
    </div>
  );
});

EndNode.displayName = 'EndNode';
export default EndNode;
