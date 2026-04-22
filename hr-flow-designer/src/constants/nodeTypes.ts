import StartNode from '../components/nodes/StartNode';
import TaskNode from '../components/nodes/TaskNode';
import ApprovalNode from '../components/nodes/ApprovalNode';
import AutomatedStepNode from '../components/nodes/AutomatedStepNode';
import EndNode from '../components/nodes/EndNode';
import type { NodePaletteItem } from '../types/workflow';
import type { NodeTypes } from 'reactflow';

/** React Flow custom node type map */
export const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automatedStep: AutomatedStepNode,
  end: EndNode,
};

/** Palette items for the left sidebar */
export const NODE_PALETTE_ITEMS: NodePaletteItem[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Entry point of the workflow',
    color: '#22C55E',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Assign a task to a team member',
    color: '#3B82F6',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Require approval from a role',
    color: '#F59E0B',
  },
  {
    type: 'automatedStep',
    label: 'Automated Step',
    description: 'Run an automated action',
    color: '#8B5CF6',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Terminal point of the workflow',
    color: '#EF4444',
  },
];

/** Default data factory for each node type */
export function createDefaultNodeData(type: string) {
  switch (type) {
    case 'start':
      return { type: 'start' as const, title: 'START', metadata: [] };
    case 'task':
      return {
        type: 'task' as const,
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      };
    case 'approval':
      return {
        type: 'approval' as const,
        title: '',
        approverRole: 'Manager' as const,
        autoApproveThreshold: 0,
      };
    case 'automatedStep':
      return {
        type: 'automatedStep' as const,
        title: '',
        actionId: '',
        actionParams: {},
      };
    case 'end':
      return { type: 'end' as const, endMessage: '', summaryFlag: false };
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}
