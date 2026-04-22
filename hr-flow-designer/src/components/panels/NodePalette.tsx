import {
  Play,
  ClipboardList,
  CheckCircle,
  Zap,
  Square,
} from 'lucide-react';
import { NODE_PALETTE_ITEMS } from '../../constants/nodeTypes';
import type { WorkflowNodeType } from '../../types/workflow';

const iconMap: Record<WorkflowNodeType, React.ReactNode> = {
  start: <Play size={18} />,
  task: <ClipboardList size={18} />,
  approval: <CheckCircle size={18} />,
  automatedStep: <Zap size={18} />,
  end: <Square size={18} />,
};

export default function NodePalette() {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="node-palette">
      <div className="node-palette-header">
        <h2>Node Palette</h2>
      </div>
      <div className="node-palette-list">
        {NODE_PALETTE_ITEMS.map((item) => (
          <div
            key={item.type}
            className="palette-card"
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
          >
            <div
              className="palette-card-icon"
              style={{ background: item.color }}
            >
              {iconMap[item.type]}
            </div>
            <div className="palette-card-info">
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
