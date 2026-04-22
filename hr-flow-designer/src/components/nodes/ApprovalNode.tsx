import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { CheckCircle } from 'lucide-react';
import type { ApprovalNodeData } from '../../types/workflow';

const ApprovalNode = memo(({ data, selected }: NodeProps<ApprovalNodeData>) => {
  return (
    <div
      className={`approval-node workflow-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: '#F59E0B' }}
    >
      <div className="node-header" style={{ background: '#F59E0B' }}>
        <CheckCircle size={14} />
        <span>APPROVAL</span>
      </div>
      <div className="node-body">
        <p className="node-title">{data.title || 'Untitled Approval'}</p>
        <p className="node-meta">Role: {data.approverRole}</p>
        {data.autoApproveThreshold > 0 && (
          <p className="node-meta">
            Auto-approve: ≤{data.autoApproveThreshold}%
          </p>
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
});

ApprovalNode.displayName = 'ApprovalNode';
export default ApprovalNode;
