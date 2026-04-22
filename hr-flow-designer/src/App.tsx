import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from './constants/nodeTypes';
import { useWorkflowCanvas } from './hooks/useWorkflowCanvas';
import { useSimulation } from './hooks/useSimulation';

import Toolbar from './components/ui/Toolbar';
import NodePalette from './components/panels/NodePalette';
import NodeConfigPanel from './components/panels/NodeConfigPanel';
import SimulationPanel from './components/panels/SimulationPanel';
import type { WorkflowNodeData } from './types/workflow';

import { AlertTriangle } from 'lucide-react';

export default function App() {
  const {
    nodes,
    edges,
    selectedNode,
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
  } = useWorkflowCanvas();

  const {
    result: simResult,
    running: simRunning,
    panelOpen: simPanelOpen,
    runSimulation,
    closePanel: closeSimPanel,
  } = useSimulation();

  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDrop(event, reactFlowInstance.current);
    },
    [onDrop],
  );

  const handleRunSimulation = useCallback(() => {
    const warns = validateCanvas();
    if (warns.length > 0) {
      // Still run but with the validation — the mock API will catch structural errors
    }
    runSimulation({ nodes, edges });
  }, [validateCanvas, runSimulation, nodes, edges]);

  return (
    <div className="app-layout">
      <Toolbar
        onRunSimulation={handleRunSimulation}
        onExportJSON={exportJSON}
        onImportJSON={importJSON}
        onClearCanvas={clearCanvas}
        simulationRunning={simRunning}
      />

      <div className="app-body">
        <NodePalette />

        <div className="canvas-wrapper" ref={reactFlowWrapper}>
          {/* Validation warnings overlay */}
          {warnings.length > 0 && (
            <div className="canvas-warnings">
              {warnings.map((w, i) => (
                <div className="canvas-warning-badge" key={i}>
                  <AlertTriangle size={14} />
                  {w.message}
                </div>
              ))}
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onDrop={handleDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            deleteKeyCode="Delete"
            fitView
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{
              animated: true,
              interactionWidth: 25, /* Gives the edge a massive invisible hitbox for extremely easy selection & grabbing */
              style: { stroke: '#94A3B8', strokeWidth: 2 },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={32} size={3} color="#CBD5E1" />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const data = node.data as WorkflowNodeData;
                switch (data.type) {
                  case 'start': return '#22C55E';
                  case 'task': return '#3B82F6';
                  case 'approval': return '#F59E0B';
                  case 'automatedStep': return '#8B5CF6';
                  case 'end': return '#EF4444';
                  default: return '#64748B';
                }
              }}
              maskColor="rgba(0, 0, 0, 0.08)"
              style={{ borderRadius: 8 }}
            />
          </ReactFlow>
        </div>

        <NodeConfigPanel
          selectedNode={selectedNode}
          onUpdateNodeData={updateNodeData}
          onDeleteNode={deleteNode}
        />
      </div>

      {simPanelOpen && (
        <SimulationPanel
          result={simResult}
          running={simRunning}
          onClose={closeSimPanel}
        />
      )}
    </div>
  );
}
