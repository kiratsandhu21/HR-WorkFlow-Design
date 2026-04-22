import type {
  AutomationAction,
  SimulationResult,
  SimulationStep,
  WorkflowGraph,
  WorkflowNodeData,
  WorkflowNodeType,
} from '../types/workflow';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const delay = (ms = 200): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------------ */
/*  GET /automations                                                   */
/* ------------------------------------------------------------------ */
const AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient'],
  },
  {
    id: 'notify_slack',
    label: 'Notify Slack',
    params: ['channel', 'message'],
  },
  {
    id: 'create_ticket',
    label: 'Create Ticket',
    params: ['project', 'summary', 'priority'],
  },
];

export async function fetchAutomations(): Promise<AutomationAction[]> {
  await delay();
  return structuredClone(AUTOMATIONS);
}

/* ------------------------------------------------------------------ */
/*  POST /simulate                                                     */
/* ------------------------------------------------------------------ */

/** Basic DFS cycle detection on a directed adjacency list. */
function hasCycle(
  adjList: Map<string, string[]>,
  allNodeIds: Set<string>,
): boolean {
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map<string, number>();
  allNodeIds.forEach((id) => color.set(id, WHITE));

  function dfs(u: string): boolean {
    color.set(u, GRAY);
    for (const v of adjList.get(u) ?? []) {
      if (color.get(v) === GRAY) return true; // back edge → cycle
      if (color.get(v) === WHITE && dfs(v)) return true;
    }
    color.set(u, BLACK);
    return false;
  }

  for (const id of allNodeIds) {
    if (color.get(id) === WHITE && dfs(id)) return true;
  }
  return false;
}

/** Walk the graph BFS from start, respecting edge direction. */
function walkGraph(
  startId: string,
  adjList: Map<string, string[]>,
  nodeMap: Map<string, { type: WorkflowNodeType; label: string }>,
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const visited = new Set<string>();
  const queue: string[] = [startId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const info = nodeMap.get(current);
    if (!info) continue;

    steps.push({
      nodeId: current,
      nodeType: info.type,
      label: info.label,
      status: 'success',
      message: `Executed ${info.type} node "${info.label}" successfully.`,
    });

    for (const next of adjList.get(current) ?? []) {
      if (!visited.has(next)) queue.push(next);
    }
  }

  // Mark nodes not visited as skipped
  for (const [id, info] of nodeMap.entries()) {
    if (!visited.has(id)) {
      steps.push({
        nodeId: id,
        nodeType: info.type,
        label: info.label,
        status: 'skipped',
        message: `Node "${info.label}" was not reachable from Start.`,
      });
    }
  }

  return steps;
}

export async function simulateWorkflow(
  graph: WorkflowGraph,
): Promise<SimulationResult> {
  await delay(400);

  const errors: string[] = [];
  const { nodes, edges } = graph;

  // ---------- Structural validation ----------
  const startNodes = nodes.filter(
    (n) => (n.data as WorkflowNodeData).type === 'start',
  );
  const endNodes = nodes.filter(
    (n) => (n.data as WorkflowNodeData).type === 'end',
  );

  if (startNodes.length === 0) errors.push('Workflow must have a Start node.');
  if (startNodes.length > 1)
    errors.push('Workflow must have exactly one Start node.');
  if (endNodes.length === 0) errors.push('Workflow must have an End node.');

  // Build adjacency list
  const adjList = new Map<string, string[]>();
  const incomingCount = new Map<string, number>();
  const allNodeIds = new Set<string>();
  const nodeMap = new Map<
    string,
    { type: WorkflowNodeType; label: string }
  >();

  for (const n of nodes) {
    allNodeIds.add(n.id);
    adjList.set(n.id, []);
    if (!incomingCount.has(n.id)) incomingCount.set(n.id, 0);

    const data = n.data as WorkflowNodeData;
    const label =
      data.type === 'start'
        ? data.title || 'START'
        : data.type === 'end'
          ? data.endMessage || 'END'
          : data.type === 'task' ||
              data.type === 'approval' ||
              data.type === 'automatedStep'
            ? data.title || data.type
            : data.type;

    nodeMap.set(n.id, { type: data.type, label });
  }

  for (const e of edges) {
    adjList.get(e.source)?.push(e.target);
    incomingCount.set(e.target, (incomingCount.get(e.target) ?? 0) + 1);
  }

  // Isolated nodes (except Start which has no incoming)
  for (const n of nodes) {
    const data = n.data as WorkflowNodeData;
    if (data.type === 'start') continue;
    if ((incomingCount.get(n.id) ?? 0) === 0) {
      errors.push(
        `Node "${nodeMap.get(n.id)?.label}" has no incoming connections.`,
      );
    }
  }

  // Cycle detection
  if (hasCycle(adjList, allNodeIds)) {
    errors.push('Workflow contains a cycle.');
  }

  if (errors.length > 0) {
    return { success: false, steps: [], errors };
  }

  // ---------- Walk the graph ----------
  const startId = startNodes[0].id;
  const steps = walkGraph(startId, adjList, nodeMap);

  return { success: true, steps, errors: [] };
}
