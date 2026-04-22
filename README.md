# HR Flow Designer

> A visual, node-based workflow builder for HR processes — built as a case study submission for Tredence Analytics' Full Stack Engineering Internship.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)
![React Flow](https://img.shields.io/badge/React%20Flow-11-green)
![Vite](https://img.shields.io/badge/Vite-8-purple)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173/`.

---

## 📐 Architecture Overview

```
src/
├── api/
│   └── mockApi.ts              ← In-memory mock API (automations + simulation)
├── components/
│   ├── nodes/                  ← 5 custom React Flow node components
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedStepNode.tsx
│   │   └── EndNode.tsx
│   ├── panels/
│   │   ├── NodeConfigPanel.tsx ← Right panel: dispatches to correct form
│   │   ├── SimulationPanel.tsx ← Slide-in drawer with simulation results
│   │   └── NodePalette.tsx     ← Left sidebar with draggable node cards
│   ├── forms/                  ← Per-node-type configuration forms
│   │   ├── StartNodeForm.tsx
│   │   ├── TaskNodeForm.tsx
│   │   ├── ApprovalNodeForm.tsx
│   │   ├── AutomatedStepNodeForm.tsx
│   │   └── EndNodeForm.tsx
│   └── ui/
│       ├── KeyValueEditor.tsx  ← Reusable dynamic key-value row component
│       └── Toolbar.tsx         ← Top bar with actions
├── hooks/
│   ├── useWorkflowCanvas.ts   ← React Flow state, CRUD, drag-drop, validation
│   ├── useSimulation.ts       ← Simulation runner + panel state
│   └── useAutomations.ts      ← Fetches automation actions from mock API
├── types/
│   └── workflow.ts            ← All TypeScript interfaces and types
├── constants/
│   └── nodeTypes.ts           ← React Flow nodeTypes map + palette items
└── App.tsx                    ← Root layout wiring everything together
```

### Key Architectural Decisions

1. **Hooks-based state management**: All canvas state (nodes, edges, selection, validation) lives in `useWorkflowCanvas`. No external state library needed — React's built-in hooks + React Flow's state hooks are sufficient for this scope.

2. **Form–Node separation**: Node components (`components/nodes/`) are purely visual and live on the canvas. Configuration forms (`components/forms/`) are separate components rendered in the right panel. This keeps canvas rendering fast and forms independently testable.

3. **Mock API with realistic async**: `mockApi.ts` simulates network latency with `200–400ms` delays. The simulation endpoint performs real graph analysis: DFS cycle detection, BFS traversal, and connectivity validation.

4. **Type-driven architecture**: A discriminated union (`WorkflowNodeData`) with a `type` field enables exhaustive pattern matching in the config panel and simulation engine.

---

## ✅ Completed Features

### Feature 1 — Workflow Canvas
- [x] 5 custom node types: Start (green), Task (blue), Approval (amber), AutomatedStep (purple), End (red)
- [x] Drag-and-drop from sidebar palette onto canvas
- [x] Edge connections between nodes via handles (top/bottom)
- [x] Click node → opens configuration in right panel
- [x] Click canvas background → deselects node
- [x] Delete nodes via config panel button or `Delete` key
- [x] Delete edges by selecting + `Delete` key
- [x] Auto-validation: warns on missing Start/End nodes or disconnected nodes
- [x] Single StartNode constraint enforced on drop

### Feature 2 — Node Configuration Panel
- [x] Context-sensitive: renders correct form per node type
- [x] All forms use controlled components with real-time sync to canvas
- [x] Required field validation (Title on Task/Approval/AutomatedStep)
- [x] Dynamic key-value editor for metadata and custom fields
- [x] AutomatedStepNode: action dropdown fetches from mock API, renders dynamic parameter fields per action
- [x] Delete button per node in config panel

### Feature 3 — Mock API Layer
- [x] `GET /automations` → 4 automation actions with typed parameter arrays
- [x] `POST /simulate` → Full graph validation + BFS traversal
- [x] DFS cycle detection
- [x] Connectivity validation (no isolated nodes)
- [x] Structural validation (exactly 1 Start, at least 1 End)
- [x] Simulated async delay (200–400 ms)

### Feature 4 — Workflow Sandbox
- [x] "Run Simulation" button triggers simulation
- [x] Slide-in drawer with step-by-step execution log
- [x] Per-step: node label, type icon, status badge (✓ success / ⚠ skipped / ✗ error)
- [x] Error list at top for invalid workflows
- [x] "Workflow Valid ✓" / "Workflow Invalid ✗" header
- [x] Collapsible raw JSON output section

### Feature 5 — Toolbar
- [x] App branding: "HR Flow Designer" with gradient icon
- [x] "Run Simulation" button with loading spinner
- [x] "Export JSON" — downloads workflow as `.json` file
- [x] "Import JSON" — file picker to load workflow from JSON
- [x] "Clear Canvas" with `window.confirm` safety prompt

### Feature 6 — Left Sidebar
- [x] 5 draggable node type cards with icons, labels, and descriptions
- [x] Color-coded icons matching node type colors
- [x] HTML5 drag-and-drop to instantiate nodes on canvas

### Bonus
- [x] MiniMap with color-coded node indicators
- [x] Zoom controls (+/−, fit-to-view, lock)
- [x] Dark enterprise SaaS theme with Plus Jakarta Sans typography
- [x] Animated edges between connected nodes
- [x] Responsive scrolling on sidebar and config panel

---

## 🎨 Design System

| Token | Value |
|---|---|
| Sidebar BG | `#0F1117` |
| Canvas BG | `#F8F9FA` |
| Panel BG | `#13151C` |
| Accent | `#F97316` (orange) |
| Start Node | `#22C55E` (green) |
| Task Node | `#3B82F6` (blue) |
| Approval Node | `#F59E0B` (amber) |
| Automated Node | `#8B5CF6` (purple) |
| End Node | `#EF4444` (red) |
| Font | Plus Jakarta Sans |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build Tool | Vite 8 |
| Flow Canvas | React Flow 11 |
| Icons | Lucide React |
| Styling | Tailwind CSS 4 + Custom CSS |
| API | In-memory mock (no server) |

---

## 💡 What I'd Add With More Time

- **Undo/Redo** — Command pattern with a history stack for node/edge mutations
- **Persist to localStorage** — Auto-save workflow state to survive page refreshes
- **Conditional branching** — Node type for if/else logic with multiple output handles
- **Drag-to-rearrange** — Auto-layout using Dagre or ELK for automatic graph positioning
- **Real API integration** — Connect to a backend for persisting workflows and running actual automations
- **Accessibility** — Full keyboard navigation, ARIA labels, screen reader announcements
- **Unit tests** — Jest + React Testing Library for form validation, simulation logic, and hook behavior
- **E2E tests** — Playwright for full drag-drop, connection, and simulation flow testing
- **Collaborative editing** — WebSocket-based real-time multi-user canvas via Yjs or CRDT

---

## 📄 License

Built for Tredence Analytics Full Stack Engineering Internship case study.
