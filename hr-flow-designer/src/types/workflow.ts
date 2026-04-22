import { type Node, type Edge } from 'reactflow';

/* ------------------------------------------------------------------ */
/*  Node-type discriminator                                            */
/* ------------------------------------------------------------------ */
export type WorkflowNodeType =
  | 'start'
  | 'task'
  | 'approval'
  | 'automatedStep'
  | 'end';

/* ------------------------------------------------------------------ */
/*  Per-node data payloads                                             */
/* ------------------------------------------------------------------ */
export interface KeyValuePair {
  key: string;
  value: string;
}

export interface StartNodeData {
  type: 'start';
  title: string;
  metadata: KeyValuePair[];
}

export interface TaskNodeData {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
}

export type ApproverRole = 'Manager' | 'HRBP' | 'Director';

export interface ApprovalNodeData {
  type: 'approval';
  title: string;
  approverRole: ApproverRole;
  autoApproveThreshold: number;
}

export interface AutomatedStepNodeData {
  type: 'automatedStep';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  type: 'end';
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

/* ------------------------------------------------------------------ */
/*  React Flow node wrapper                                            */
/* ------------------------------------------------------------------ */
export type WorkflowNode = Node<WorkflowNodeData>;

/* ------------------------------------------------------------------ */
/*  Simulation                                                         */
/* ------------------------------------------------------------------ */
export type StepStatus = 'success' | 'skipped' | 'error';

export interface SimulationStep {
  nodeId: string;
  nodeType: WorkflowNodeType;
  label: string;
  status: StepStatus;
  message: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
}

/* ------------------------------------------------------------------ */
/*  Mock API types                                                     */
/* ------------------------------------------------------------------ */
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

/* ------------------------------------------------------------------ */
/*  Workflow graph (for serialisation / simulation payload)             */
/* ------------------------------------------------------------------ */
export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: Edge[];
}

/* ------------------------------------------------------------------ */
/*  Validation warning                                                 */
/* ------------------------------------------------------------------ */
export interface ValidationWarning {
  nodeId?: string;
  message: string;
}

/* ------------------------------------------------------------------ */
/*  Node palette descriptor                                            */
/* ------------------------------------------------------------------ */
export interface NodePaletteItem {
  type: WorkflowNodeType;
  label: string;
  description: string;
  color: string;
}
