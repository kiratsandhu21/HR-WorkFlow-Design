import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import type { StartNodeData } from '../../types/workflow';

const StartNode = memo(({ data, selected }: NodeProps<StartNodeData>) => {
  return (
    <div
      className={`start-node workflow-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: '#22C55E' }}
    >
      <div className="node-header" style={{ background: '#22C55E' }}>
        <Play size={14} />
        <span>START</span>
      </div>
      <div className="node-body">
        <p className="node-title">{data.title || 'Start'}</p>
        {data.metadata.length > 0 && (
          <p className="node-meta">{data.metadata.length} metadata field(s)</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="flow-handle"
      />
    </div>
  );
});

StartNode.displayName = 'StartNode';
export default StartNode;
