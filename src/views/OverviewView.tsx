import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ArrowRight,
  Sparkles,
  Bot,
  Plus,
  ShieldCheck,
  FlaskConical,
  CheckSquare,
  PackageCheck,
  GitPullRequest,
  Terminal,
  X,
  RotateCcw,
  GitBranch,
  ChevronRight,
  Layers,
  FileCode2,
  Cpu,
  TrendingDown,
  Info,
  Check
} from 'lucide-react';

interface AttentionItem {
  id: string;
  severity: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  explanation: string;
  resource: string;
  timestamp: string;
  actionText: string;
  action: () => void;
}

interface PipelineStage {
  id: string;
  name: string;
  agent: string;
  status: 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'WAITING FOR APPROVAL' | 'CANCELLED';
  duration: string;
  progress: number;
  errors: number;
}

export const OverviewView: React.FC = () => {
  const {
    currentUser,
    setActiveTab,
    setIsFolderModalOpen,
    setIsCopilotOpen,
    startDemoWorkflow,
    workflowStatus,
    approvePatch,
    approveRelease,
    benchmarkMetrics
  } = useWorkflow();

  const [humanApprovalState, setHumanApprovalState] = useState<'pending' | 'approved' | 'changes_requested'>('pending');
  const [activeDiagnosticStep, setActiveDiagnosticStep] = useState<PipelineStage | null>(null);

  // Attention Items based on real project state
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>([
    {
      id: 'att-1',
      severity: 'danger',
      title: 'Critical Security Vulnerability Isolated (BUG-142)',
      explanation: 'Race condition detected in multipart CSV parser with thread contention under concurrent writes.',
      resource: 'src/services/csvUploadService.ts',
      timestamp: '12m ago',
      actionText: 'Review & Apply Auto-Patch',
      action: () => setActiveTab('code_changes')
    },
    {
      id: 'att-2',
      severity: 'warning',
      title: 'Human-in-the-Loop Architecture Sign-Off Required',
      explanation: 'AST Write-Through Cache and BullMQ rate limiting configuration staged for review.',
      resource: 'System Design Spec v2',
      timestamp: '24m ago',
      actionText: 'Sign Off Architecture',
      action: () => setActiveTab('system_design')
    },
    {
      id: 'att-3',
      severity: 'info',
      title: 'Autonomous Test Suite Verification Complete',
      explanation: '48 of 48 test suites passing across unit, regression, and load testing vectors.',
      resource: 'tests/services/csvUploadService.test.ts',
      timestamp: '35m ago',
      actionText: 'Inspect Test Coverage',
      action: () => setActiveTab('tests')
    }
  ]);

  // 8-Stage Autonomous Development Pipeline
  const pipelineStages: PipelineStage[] = [
    {
      id: 'stage-1',
      name: 'REQUIREMENT',
      agent: 'Issue Intake Agent',
      status: 'SUCCESS',
      duration: '4.2s',
      progress: 100,
      errors: 0
    },
    {
      id: 'stage-2',
      name: 'PLANNING',
      agent: 'Sprint Planner',
      status: 'SUCCESS',
      duration: '3.8s',
      progress: 100,
      errors: 0
    },
    {
      id: 'stage-3',
      name: 'ARCHITECTURE',
      agent: 'System Architect',
      status: humanApprovalState === 'approved' ? 'SUCCESS' : 'WAITING FOR APPROVAL',
      duration: '8.1s',
      progress: humanApprovalState === 'approved' ? 100 : 85,
      errors: 0
    },
    {
      id: 'stage-4',
      name: 'IMPLEMENTATION',
      agent: 'Code Synthesizer',
      status: 'SUCCESS',
      duration: '14.2s',
      progress: 100,
      errors: 0
    },
    {
      id: 'stage-5',
      name: 'TESTING',
      agent: 'Test Orchestrator',
      status: 'SUCCESS',
      duration: '12.0s',
      progress: 100,
      errors: 0
    },
    {
      id: 'stage-6',
      name: 'CODE REVIEW',
      agent: 'Tri-Sentinel Review',
      status: 'SUCCESS',
      duration: '6.4s',
      progress: 100,
      errors: 0
    },
    {
      id: 'stage-7',
      name: 'SECURITY',
      agent: 'Security Gatekeeper',
      status: 'SUCCESS',
      duration: '5.1s',
      progress: 100,
      errors: 0
    },
    {
      id: 'stage-8',
      name: 'DEPLOYMENT',
      agent: 'Release Manager',
      status: workflowStatus === 'completed' ? 'SUCCESS' : 'RUNNING',
      duration: '9.3s',
      progress: workflowStatus === 'completed' ? 100 : 75,
      errors: 0
    }
  ];

  const presets = [
    {
      label: 'Security & Dependency Audit',
      text: 'Audit repository AST for multipart upload race conditions and verify mutex locks.'
    },
    {
      label: 'Generate Unit Tests',
      text: 'Scan all endpoints in /api and generate comprehensive Vitest regression test suites.'
    },
    {
      label: 'Summarize Open PRs',
      text: 'Fetch top open pull requests, correlate review sentinels, and stage release candidate.'
    }
  ];

  const [prompt, setPrompt] = useState(presets[0].text);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTask = () => {
    setIsRunning(true);
    startDemoWorkflow();
    setTimeout(() => setIsRunning(false), 2500);
  };

  const handleApproveArchitecture = () => {
    setHumanApprovalState('approved');
    approvePatch();
    setAttentionItems((prev) => prev.filter((item) => item.id !== 'att-2'));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Global Dashboard Hero: 5-Second Understanding */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
              <span>SYSTEM OPERATIONAL • 9 AUTONOMOUS AGENTS ACTIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Good morning, {currentUser?.name?.split(' ')[0] || 'Engineer'}.
            </h1>

            <p className="text-sm text-neutral-400 leading-relaxed">
              Here is what is happening across your workspace. Autonomous background workers are monitoring repository{' '}
              <strong className="text-neutral-200">Omtripathi1004/devflow-ai</strong>, staging pull requests, and verifying regression suites.
            </p>

            {/* Quick Status Metrics (5-Second Scannability) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">System Health</div>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">99.98%</div>
                <div className="text-[10px] text-neutral-400">32ms worker latency</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Active Projects</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">3 Repos</div>
                <div className="text-[10px] text-neutral-400">main branch synced</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Running Agents</div>
                <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">9 Subagents</div>
                <div className="text-[10px] text-neutral-400">Bob 2.0 architecture</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Pending Actions</div>
                <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">{attentionItems.length} Required</div>
                <div className="text-[10px] text-neutral-400">Decisions waiting</div>
              </div>
            </div>
          </div>

          {/* Primary Action Group */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setIsFolderModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Development Task</span>
            </button>

            <button
              onClick={() => setIsCopilotOpen(true)}
              className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Ask DevFlow AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. NEEDS YOUR ATTENTION SECTION (Actionable issues & pending decisions) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono">
              Needs Your Attention ({attentionItems.length})
            </h2>
          </div>
          <span className="text-xs text-neutral-400">Clear actions required to proceed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {attentionItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                item.severity === 'danger'
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : item.severity === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span
                    className={`px-2 py-0.5 rounded font-bold uppercase ${
                      item.severity === 'danger'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : item.severity === 'warning'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-neutral-400">{item.timestamp}</span>
                </div>

                <h3 className="text-xs font-bold text-white leading-snug">{item.title}</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{item.explanation}</p>
                <div className="text-[10px] font-mono text-neutral-400 truncate">
                  Ref: <span className="text-neutral-200">{item.resource}</span>
                </div>
              </div>

              <button
                onClick={item.action}
                className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  item.severity === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                    : item.severity === 'warning'
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                }`}
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. HUMAN-IN-THE-LOOP APPROVAL (Prominent Sign-Off Card) */}
      {humanApprovalState === 'pending' && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-amber-300 tracking-wider uppercase">
                HUMAN APPROVAL REQUIRED
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">
              System Architecture & Mutex Patch Ready for Production Sign-Off
            </h3>
            <p className="text-xs text-neutral-400">
              3 decisions require your sign-off before Stage 8 (Deployment) initiates: AST mutex serialization, Redis TTL policy, and release tagging.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('system_design')}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition"
            >
              Review Architecture
            </button>
            <button
              onClick={handleApproveArchitecture}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Approve & Release</span>
            </button>
            <button
              onClick={() => alert('Changes requested. Subagent re-evaluating branch diff.')}
              className="px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white transition"
            >
              Request Changes
            </button>
          </div>
        </div>
      )}

      {/* 4. AUTONOMOUS DEVELOPMENT PIPELINE (8-Stage Complete Value Chain) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Autonomous Development Pipeline</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Requirement &rarr; Planning &rarr; Architecture &rarr; Implementation &rarr; Testing &rarr; Code Review &rarr; Security &rarr; Deployment
            </p>
          </div>

          <button
            onClick={() => setActiveTab('workflows')}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Full Graph</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8-Stage Horizontal Scrollable Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {pipelineStages.map((stage, idx) => {
            const isApproved = stage.status === 'SUCCESS';
            const isWaiting = stage.status === 'WAITING FOR APPROVAL';
            return (
              <div
                key={stage.id}
                onClick={() => setActiveDiagnosticStep(stage)}
                className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 cursor-pointer transition select-none ${
                  isWaiting
                    ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/40'
                    : isApproved
                    ? 'bg-neutral-950 border-neutral-800 hover:border-emerald-500/40'
                    : 'bg-neutral-950/60 border-neutral-800/80 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>0{idx + 1}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isApproved
                          ? 'bg-emerald-400'
                          : isWaiting
                          ? 'bg-amber-400 animate-pulse'
                          : 'bg-neutral-600'
                      }`}
                    />
                  </div>
                  <div className="text-[11px] font-bold text-white truncate mt-1">{stage.name}</div>
                  <div className="text-[10px] text-neutral-400 truncate">{stage.agent}</div>
                </div>

                <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-neutral-400">{stage.duration}</span>
                  <span
                    className={`font-semibold ${
                      isApproved ? 'text-emerald-400' : isWaiting ? 'text-amber-400' : 'text-neutral-400'
                    }`}
                  >
                    {isWaiting ? 'WAITING' : isApproved ? 'PASS' : 'QUEUED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. QUICK-ACTION COMMAND STAGE (Prompt Input + 1-Click Presets) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Execute Workflow or Action</h2>
            <p className="text-xs text-neutral-400">Choose a 1-click preset or type your custom instruction below.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target: <strong className="text-white">main</strong> branch</span>
          </div>
        </div>

        {/* 1-Click Preset Chips */}
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setPrompt(preset.text)}
              className={`text-xs px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 font-sans ${
                prompt === preset.text
                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-medium'
                  : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Command Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what task or triage to execute..."
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500/60 font-sans"
          />
          <button
            onClick={handleRunTask}
            disabled={isRunning}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shrink-0 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Running Pipeline...' : 'Run Workflow'}</span>
          </button>
        </div>
      </div>

      {/* 6. Step Diagnostics Slide-Over Drawer */}
      {activeDiagnosticStep && (
        <aside
          role="dialog"
          aria-label="Pipeline Stage Inspector"
          className="fixed inset-y-0 right-0 w-full sm:w-96 bg-neutral-900 border-l border-neutral-800 p-6 z-50 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  Stage Inspection: {activeDiagnosticStep.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveDiagnosticStep(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                Responsible Agent
              </span>
              <span className="text-xs text-white font-medium">
                {activeDiagnosticStep.agent}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                Execution Status
              </span>
              <span className="inline-block text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                {activeDiagnosticStep.status} • Duration {activeDiagnosticStep.duration}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                Raw Telemetry Logs
              </span>
              <pre className="text-xs font-mono bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-neutral-300 overflow-x-auto leading-relaxed">
                {`[AST_INDEX] 184 files analyzed in 210ms\n[SENTINEL] Zero regression verified\n[MUTEX_LOCK] Concurrency serialized (512MB RAM cap)\n[METRICS] Latency: ${activeDiagnosticStep.duration}`}
              </pre>
            </div>
          </div>

          <button
            onClick={() => setActiveDiagnosticStep(null)}
            className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-lg text-neutral-200 transition font-mono"
          >
            Close Inspector
          </button>
        </aside>
      )}
    </div>
  );
};
