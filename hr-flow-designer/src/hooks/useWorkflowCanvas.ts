import { useCallback, useRef, useState } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type OnSelectionChangeParams,
} from 'reactflow';
import type { WorkflowNode, WorkflowNodeData, ValidationWarning } from '../types/workflow';
import { createDefaultNodeData } from '../constants/nodeTypes';

let nodeIdCounter = 0;
function getNextNodeId(): string {
  nodeIdCounter += 1;
  return `node_${nodeIdCounter}`;
}

export function useWorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  /* ---------- Connections ---------- */
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: '#64748b', strokeWidth: 2 },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  /* ---------- Selection ---------- */
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      if (selectedNodes.length === 1) {
        setSelectedNodeId(selectedNodes[0].id);
      } else {
        setSelectedNodeId(null);
      }
    },
    [],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  /* ---------- Drop from palette ---------- */
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, reactFlowInstance: any) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      // Only one Start node allowed
      if (nodeType === 'start') {
        const hasStart = nodes.some((n) => (n.data as WorkflowNodeData).type === 'start');
        if (hasStart) {
          alert('Only one Start node is allowed.');
          return;
        }
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: WorkflowNode = {
        id: getNextNodeId(),
        type: nodeType,
        position,
        data: createDefaultNodeData(nodeType) as WorkflowNodeData,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /* ---------- Update node data from config panel ---------- */
  const updateNodeData = useCallback(
    (nodeId: string, newData: Partial<WorkflowNodeData>) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== nodeId) return n;
          return { ...n, data: { ...n.data, ...newData } as WorkflowNodeData };
        }),
      );
    },
    [setNodes],
  );

  /* ---------- Delete node ---------- */
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId),
      );
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
    },
    [setNodes, setEdges, selectedNodeId],
  );

  /* ---------- Validation ---------- */
  const validateCanvas = useCallback(() => {
    const warns: ValidationWarning[] = [];
    const startCount = nodes.filter(
      (n) => (n.data as WorkflowNodeData).type === 'start',
    ).length;
    const endCount = nodes.filter(
      (n) => (n.data as WorkflowNodeData).type === 'end',
    ).length;

    if (startCount === 0) warns.push({ message: 'Missing Start node.' });
    if (endCount === 0) warns.push({ message: 'Missing End node.' });

    for (const n of nodes) {
      const hasConnection =
        edges.some((e) => e.source === n.id || e.target === n.id);
      if (!hasConnection) {
        warns.push({
          nodeId: n.id,
          message: `Node "${(n.data as any).title ?? (n.data as any).type}" has no connections.`,
        });
      }
    }
    setWarnings(warns);
    return warns;
  }, [nodes, edges]);

  /* ---------- Import / Export ---------- */
  const exportJSON = useCallback(() => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const importJSON = useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
          // Update counter to avoid ID conflicts
          const maxId = parsed.nodes.reduce((max: number, n: any) => {
            const num = parseInt(n.id.replace('node_', ''), 10);
            return isNaN(num) ? max : Math.max(max, num);
          }, 0);
          nodeIdCounter = maxId;
        }
      } catch {
        alert('Invalid JSON file.');
      }
    },
    [setNodes, setEdges],
  );

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    nodeIdCounter = 0;
  }, [setNodes, setEdges]);

  /* ---------- Selected node accessor ---------- */
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  return {
    nodes,
    edges,
    selectedNode,
    selectedNodeId,
    warnings,
    reactFlowWrapper,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onSelectionChange,
    onPaneClick,
    onDrop,
    onDragOver,
    updateNodeData,
    deleteNode,
    validateCanvas,
    exportJSON,
    importJSON,
    clearCanvas,
    setNodes,
    setEdges,
  };
}
