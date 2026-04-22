import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { ClipboardList } from 'lucide-react';
import type { TaskNodeData } from '../../types/workflow';

const TaskNode = memo(({ data, selected }: NodeProps<TaskNodeData>) => {
  return (
    <div
      className={`task-node workflow-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: '#3B82F6' }}
    >
      <div className="node-header" style={{ background: '#3B82F6' }}>
        <ClipboardList size={14} />
        <span>TASK</span>
      </div>
      <div className="node-body">
        <p className="node-title">{data.title || 'Untitled Task'}</p>
        {data.assignee && (
          <p className="node-meta">Assignee: {data.assignee}</p>
        )}
        {data.dueDate && (
          <p className="node-meta">Due: {data.dueDate}</p>
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

TaskNode.displayName = 'TaskNode';
export default TaskNode;
