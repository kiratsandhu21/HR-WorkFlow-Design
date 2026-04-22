import { useState, useCallback } from 'react';
import { simulateWorkflow } from '../api/mockApi';
import type { SimulationResult, WorkflowGraph } from '../types/workflow';

export function useSimulation() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const runSimulation = useCallback(async (graph: WorkflowGraph) => {
    setRunning(true);
    setPanelOpen(true);
    try {
      const res = await simulateWorkflow(graph);
      setResult(res);
    } catch {
      setResult({
        success: false,
        steps: [],
        errors: ['An unexpected error occurred during simulation.'],
      });
    } finally {
      setRunning(false);
    }
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
  }, []);

  return { result, running, panelOpen, runSimulation, closePanel };
}
