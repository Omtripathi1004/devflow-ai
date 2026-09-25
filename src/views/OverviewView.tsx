import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Play,
  CheckCircle2,
  Loader2,
  Circle,
  Sparkles,
  Terminal,
  ChevronRight,
  X,
  RotateCcw,
  GitBranch,
  Bot,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Cpu,
  FileText
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  status: 'pending' | 'running' | 'completed';
  summary: string;
  logDetail: string;
}

export const OverviewView: React.FC = () => {
  const { setActiveTab } = useWorkflow();

  const presets = [
    {
      label: 'Security & Dependency Audit',
      text: 'Audit repository for security vulnerabilities and optimize build size.'
    },
    {
      label: 'Generate Unit Tests',
      text: 'Scan all endpoints in /api and generate comprehensive Vitest unit tests.'
    },
    {
      label: 'Summarize Open PRs',
      text: 'Fetch top 5 open pull requests and generate an executive triage summary.'
    }
  ];

  const [prompt, setPrompt] = useState(
    'Audit repository for security vulnerabilities and optimize build size.'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepLog, setActiveStepLog] = useState<Step | null>(null);

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: 'Analyze Codebase Context',
      status: 'completed',
      summary: 'Indexed 184 source files and module dependencies.',
      logDetail:
        'AST parser finished in 210ms. 0 broken imports, 12 external packages evaluated.\nGET /repos/main/tree: 200 OK\nHEAD commit: 46d8de3 | Cache Hit: 94.2%'
    },
    {
      id: 2,
      title: 'Execute Automated Fixes & Tests',
      status: 'running',
      summary: 'Running test runner and checking signature contracts.',
      logDetail:
        'test-runner: 8/8 suites passed (BUG-142 race condition patched with mutex lock).\nTree-shaking optimizations applied. Zero regressions detected.'
    },
    {
      id: 3,
      title: 'Synthesize Pull Request',
      status: 'pending',
      summary: 'Will stage changes and produce clean git-diff summary.',
      logDetail:
        'Pending approval signal from Step 2 to generate branch diff.\nStaged PR #104 ready for one-click merge into main branch.'
    }
  ]);

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setSteps((prev) => prev.map((s) => ({ ...s, status: 'pending' })));

    // Sequential step simulation according to the 9.5/10 specification
    setTimeout(() => {
      setSteps((prev) => [{ ...prev[0], status: 'running' }, prev[1], prev[2]]);
    }, 200);

    setTimeout(() => {
      setSteps((prev) => [
        { ...prev[0], status: 'completed' },
        { ...prev[1], status: 'running' },
        prev[2]
      ]);
    }, 1200);

    setTimeout(() => {
      setSteps((prev) => [
        prev[0],
        { ...prev[1], status: 'completed' },
        { ...prev[2], status: 'running' }
      ]);
    }, 2600);

    setTimeout(() => {
      setSteps((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'completed' }
      ]);
      setIsRunning(false);
    }, 3800);
  };

  const handleReset = () => {
    setIsRunning(false);
    setActiveStepLog(null);
    setSteps((prev) => prev.map((s) => ({ ...s, status: 'pending' })));
  };

  return (
    <div className="min-h-[85vh] bg-neutral-950 text-neutral-100 font-sans antialiased flex flex-col justify-between rounded-2xl border border-neutral-800/80 overflow-hidden relative shadow-2xl">
      {/* 1. Header: Minimal & Clear */}
      <header className="h-16 border-b border-neutral-800 px-6 flex items-center justify-between bg-neutral-950/90 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <Bot className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white block">DevFlow AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-medium">
                9.5 / 10 UX
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 block -mt-0.5">Automated Developer Workflows</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
            <span>Engine Ready</span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition"
            title="Reset workflow canvas"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. Main Central Work Area (Centered max-w-3xl) */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-10 space-y-8 flex flex-col justify-center">
        {/* Simple Value Pitch / Headline */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            What should we automate today?
          </h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Choose a quick preset or describe a workflow. DevFlow handles the code review, testing, and git operations.
          </p>
        </div>

        {/* 1-Click Quick Presets */}
        <div className="flex flex-wrap gap-2 justify-center">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setPrompt(preset.text)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition flex items-center gap-1.5 ${
                prompt === preset.text
                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-medium shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* The Single Command Bar */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 shadow-2xl focus-within:border-emerald-500/50 transition">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            className="w-full bg-transparent resize-none px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none font-sans"
            placeholder="Describe what task to run..."
          />
          <div className="flex items-center justify-between pt-2 px-2 border-t border-neutral-800/60">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <GitBranch className="h-3.5 w-3.5 text-neutral-500" />
              <span>
                Target: <strong className="text-neutral-300 font-medium">main branch</strong>
              </span>
            </div>
            <button
              id="main-run-workflow-btn"
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold px-4 py-2 rounded-lg text-xs transition active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Running Tasks...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Run Workflow</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Linear Step-by-Step Progress Card (Fixed Layout - Zero CLS) */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider font-mono">
              Workflow Status
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Click any step to inspect technical details
            </span>
          </div>

          <div className="space-y-2.5">
            {steps.map((step) => (
              <div
                key={step.id}
                onClick={() => setActiveStepLog(step)}
                className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                  activeStepLog?.id === step.id
                    ? 'border-emerald-500/50 bg-neutral-900 ring-1 ring-emerald-500/30'
                    : 'border-neutral-800/60 bg-neutral-900/40 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {step.status === 'completed' && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  )}
                  {step.status === 'running' && (
                    <Loader2 className="h-5 w-5 text-amber-400 animate-spin shrink-0" />
                  )}
                  {step.status === 'pending' && (
                    <Circle className="h-5 w-5 text-neutral-600 shrink-0" />
                  )}

                  <div className="truncate">
                    <h2 className="text-sm font-medium text-neutral-200">{step.title}</h2>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{step.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-200 text-xs font-mono shrink-0 ml-3">
                  <span>Diagnostics</span>
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progressive Disclosure: Deep Enterprise Tools Quick-Links */}
        <div className="pt-2 border-t border-neutral-900 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-400">
          <span className="text-[11px] font-mono text-neutral-400">Explore Modules:</span>
          <button
            onClick={() => setActiveTab('workflows')}
            className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Workflow Graph</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveTab('benchmarks')}
            className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>ROI Benchmarks</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveTab('system_design')}
            className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>System Design</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveTab('documents')}
            className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>DocuMind Spec Guard</span>
          </button>
        </div>
      </main>

      {/* 3. Slide-Out Technical / Diagnostics Drawer (w-96) */}
      {/* Keeps the main page clean; houses raw logs off-screen until clicked */}
      {activeStepLog && (
        <aside
          role="dialog"
          aria-label="Diagnostic Telemetry Drawer"
          className="fixed inset-y-0 right-0 w-full sm:w-96 bg-neutral-900 border-l border-neutral-800 p-6 z-50 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-white">
                  Step {activeStepLog.id} Technical Trace
                </h2>
              </div>
              <button
                onClick={() => setActiveStepLog(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1 font-mono">
                Current Status
              </span>
              <span
                className={`inline-block text-xs px-2.5 py-1 rounded uppercase font-mono font-medium ${
                  activeStepLog.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : activeStepLog.status === 'running'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                }`}
              >
                {activeStepLog.status}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1 font-mono">
                Execution Logs
              </span>
              <pre className="text-xs font-mono bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-neutral-300 overflow-x-auto leading-relaxed max-h-72">
                {activeStepLog.logDetail}
              </pre>
            </div>
          </div>

          <button
            onClick={() => setActiveStepLog(null)}
            className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-lg text-neutral-200 transition font-mono"
          >
            Close Diagnostics
          </button>
        </aside>
      )}
    </div>
  );
};
