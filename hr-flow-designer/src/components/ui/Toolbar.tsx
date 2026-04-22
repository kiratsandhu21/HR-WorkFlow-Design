import { useRef } from 'react';
import {
  Play,
  Download,
  Upload,
  Trash2,
  Workflow,
} from 'lucide-react';

interface ToolbarProps {
  onRunSimulation: () => void;
  onExportJSON: () => void;
  onImportJSON: (json: string) => void;
  onClearCanvas: () => void;
  simulationRunning: boolean;
}

export default function Toolbar({
  onRunSimulation,
  onExportJSON,
  onImportJSON,
  onClearCanvas,
  simulationRunning,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result;
      if (typeof text === 'string') {
        onImportJSON(text);
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    e.target.value = '';
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire canvas? This cannot be undone.')) {
      onClearCanvas();
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-brand">
        <div className="toolbar-brand-icon">
          <Workflow size={18} />
        </div>
        <div>
          <h1>HR Flow Designer</h1>
          <span>by Tredence Analytics</span>
        </div>
      </div>

      <div className="toolbar-actions">
        <button
          className="toolbar-btn primary"
          onClick={onRunSimulation}
          disabled={simulationRunning}
        >
          {simulationRunning ? (
            <div className="spinner" />
          ) : (
            <Play size={14} />
          )}
          {simulationRunning ? 'Running...' : 'Run Simulation'}
        </button>

        <button className="toolbar-btn" onClick={onExportJSON}>
          <Download size={14} />
          Export JSON
        </button>

        <button className="toolbar-btn" onClick={handleImportClick}>
          <Upload size={14} />
          Import JSON
        </button>

        <button className="toolbar-btn danger" onClick={handleClear}>
          <Trash2 size={14} />
          Clear
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
