import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  CheckCircle2,
  Clock,
  ChevronRight,
  GitBranch,
  Terminal,
  Activity,
  Layers,
  Database,
  ArrowRight,
  GitPullRequest,
  Box,
  RotateCcw,
  Sparkles,
  Server,
  ShieldCheck,
  Cpu,
  X,
  FileCode2,
  ExternalLink,
  Info
} from 'lucide-react';

interface StageEvent {
  jobId: string;
  timestamp: number;
  step: 1 | 2 | 3;
  status: 'idle' | 'queued' | 'running' | 'completed' | 'failed';
  humanMessage: string;
  diagnostics: {
    cpuUsage: string;
    memoryRss: string;
    activeModule: string;
    queuePosition?: number;
    latencyMs?: number;
  };
}

export const AntiGravityView: React.FC = () => {
  // Preset options specified in the 9.5/10 spec
  const presets = [
    'Audit Monorepo Dependencies',
    'Security Triage',
    'Fix BUG-142 Ingestion Race',
    'Refactor Auth Middleware'
  ];

  const [selectedPreset, setSelectedPreset] = useState<string>(presets[0]);
  const [promptInput, setPromptInput] = useState<string>(
    'Audit workspace AST and resolve race condition in multipart CSV intake'
  );

  // Workflow stages: 0 = idle, 1 = enqueueing (HTTP 202), 2 = Step 1 running, 3 = Step 2 running, 4 = Step 3 staging, 5 = finalized
  const [pipelineState, setPipelineState] = useState<'idle' | 'enqueuing' | 'step1' | 'step2' | 'step3' | 'done'>('idle');
  const [jobId, setJobId] = useState<string>('run_89f2a01c');
  const [activeStepModal, setActiveStepModal] = useState<number | null>(null);
  const [isDiagnosticDrawerOpen, setIsDiagnosticDrawerOpen] = useState<boolean>(false);
  const [activeDiagnosticStep, setActiveDiagnosticStep] = useState<1 | 2 | 3>(2);

  // SSE telemetry contract snapshot
  const [currentTelemetry, setCurrentTelemetry] = useState<StageEvent>({
    jobId: 'run_89f2a01c',
    timestamp: Date.now(),
    step: 2,
    status: 'idle',
    humanMessage: 'Connecting to development workspace...',
    diagnostics: {
      cpuUsage: '12.4%',
      memoryRss: '48MB',
      activeModule: '@ast/analyzer-engine',
      queuePosition: 1,
      latencyMs: 12
    }
  });

  const [telemetryLogs, setTelemetryLogs] = useState<Array<{ time: string; text: string; rawJargon: string }>>([
    {
      time: '00:00.012',
      text: 'Connecting to development workspace...',
      rawJargon: 'INIT_MCP_SOCKET_CONNECTION: PENDING'
    },
    {
      time: '00:00.340',
      text: 'Allocating isolated MicroVM sandbox (Node.js 20, 512MB RAM cap)...',
      rawJargon: 'POST /api/runs HTTP/1.1 -> 202 Accepted { queuePosition: 1 }'
    },
    {
      time: '00:01.120',
      text: '482 files indexed across 9 subagent domains.',
      rawJargon: 'AST_INDEX_MAP_INITIALIZED [files=482, symbols=3891]'
    },
    {
      time: '00:02.480',
      text: 'Syntax issue detected in auth.ts on line 42.',
      rawJargon: 'ERR_AST_PARSE_EXCEPTION: TOKEN_OOB'
    }
  ]);

  // Simulation execution timer refs
  const executionTimerRef = useRef<NodeJS.Timeout[]>([]);

  const handleSelectPreset = (preset: string) => {
    setSelectedPreset(preset);
    if (preset === 'Audit Monorepo Dependencies') {
      setPromptInput('Audit workspace AST and resolve race condition in multipart CSV intake');
    } else if (preset === 'Security Triage') {
      setPromptInput('Scan dependency graph for CVE vulnerabilities and generate zero-downtime hotfixes');
    } else if (preset === 'Fix BUG-142 Ingestion Race') {
      setPromptInput('Correlate multipart upload logs with worker thread contention and patch mutex lock');
    } else {
      setPromptInput('Refactor authentication middleware token verification into zero-copy async stream');
    }
  };

  const runExecutionPipeline = () => {
    // Clear any previous timers
    executionTimerRef.current.forEach(clearTimeout);
    executionTimerRef.current = [];

    const newJobId = `run_${Math.random().toString(16).substring(2, 10)}`;
    setJobId(newJobId);
    setPipelineState('enqueuing');

    // Stage 1: Enqueue (HTTP 202 in <15ms)
    setCurrentTelemetry({
      jobId: newJobId,
      timestamp: Date.now(),
      step: 1,
      status: 'queued',
      humanMessage: 'Connecting to development workspace...',
      diagnostics: {
        cpuUsage: '4.2%',
        memoryRss: '32MB',
        activeModule: 'bullmq:agent-runs',
        queuePosition: 1,
        latencyMs: 14
      }
    });

    // Step 1: Cloned Context (after 800ms)
    const t1 = setTimeout(() => {
      setPipelineState('step1');
      setCurrentTelemetry({
        jobId: newJobId,
        timestamp: Date.now(),
        step: 1,
        status: 'running',
        humanMessage: 'Connecting to development workspace...',
        diagnostics: {
          cpuUsage: '9.8%',
          memoryRss: '41MB',
          activeModule: '@ast/analyzer-engine',
          queuePosition: 0,
          latencyMs: 18
        }
      });
    }, 900);

    // Step 2: Evaluation (after 2500ms)
    const t2 = setTimeout(() => {
      setPipelineState('step2');
      setCurrentTelemetry({
        jobId: newJobId,
        timestamp: Date.now(),
        step: 2,
        status: 'running',
        humanMessage: 'Evaluating workspace dependencies against security registry...',
        diagnostics: {
          cpuUsage: '12.4%',
          memoryRss: '48MB',
          activeModule: '@ast/analyzer-engine'
        }
      });
    }, 2800);

    // Step 3: Pull Request Staging (after 5000ms)
    const t3 = setTimeout(() => {
      setPipelineState('step3');
      setCurrentTelemetry({
        jobId: newJobId,
        timestamp: Date.now(),
        step: 3,
        status: 'running',
        humanMessage: 'Review Proposed Pull Request',
        diagnostics: {
          cpuUsage: '6.1%',
          memoryRss: '52MB',
          activeModule: '@github/pr-synthesizer'
        }
      });
    }, 5200);

    // Finalize: done (after 6800ms)
    const t4 = setTimeout(() => {
      setPipelineState('done');
      setCurrentTelemetry({
        jobId: newJobId,
        timestamp: Date.now(),
        step: 3,
        status: 'completed',
        humanMessage: 'Staged PR #104 ready for one-click merge.',
        diagnostics: {
          cpuUsage: '2.1%',
          memoryRss: '36MB',
          activeModule: '@github/merge-gate'
        }
      });
    }, 6900);

    executionTimerRef.current = [t1, t2, t3, t4];
  };

  const handleReset = () => {
    executionTimerRef.current.forEach(clearTimeout);
    executionTimerRef.current = [];
    setPipelineState('idle');
  };

  const openDrawerForStep = (stepNumber: 1 | 2 | 3) => {
    setActiveDiagnosticStep(stepNumber);
    setIsDiagnosticDrawerOpen(true);
  };

  return (
    <div className="min-h-[85vh] bg-[#090D16] text-[#F8FAFC] font-sans antialiased border border-[#1E293B] rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
      {/* 2. PROGRESSIVE DISCLOSURE LAYOUT: Top Masthead (52px height) */}
      <header className="h-[52px] bg-[#090D16] border-b border-[#1E293B] px-6 flex items-center justify-between shrink-0 select-none z-20">
        {/* Left: Brand Badge & Masthead Identity */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md bg-[#10B981]/15 border border-[#10B981]/50 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm tracking-tight text-white">Anti-Gravity</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981] font-semibold">
                9.5 / 10 SPEC
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-[#1E293B] hidden sm:block" />

          {/* Active Workspace Switcher */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-slate-400 bg-[#0E1524] px-2.5 py-1 rounded border border-[#1E293B]">
            <GitBranch className="w-3 h-3 text-[#10B981]" />
            <span>repo:</span>
            <span className="text-white font-medium">Omtripathi1004/devflow-ai</span>
            <span className="text-slate-600">:</span>
            <span className="text-emerald-400">main</span>
          </div>
        </div>

        {/* Right: Worker Health Indicator (32ms latency) & Diagnostics Toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs font-mono px-3 py-1 rounded bg-[#0E1524] border border-[#1E293B]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-slate-300">Worker Health:</span>
            <span className="text-[#10B981] font-bold">32ms latency</span>
          </div>

          <button
            onClick={() => setIsDiagnosticDrawerOpen(!isDiagnosticDrawerOpen)}
            className={`text-xs font-mono px-3 py-1 rounded transition-colors flex items-center space-x-1.5 border ${
              isDiagnosticDrawerOpen
                ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                : 'bg-[#0E1524] border-[#1E293B] text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Diagnostics Drawer</span>
          </button>
        </div>
      </header>

      {/* Main Body Area: Left Sidebar (240px) + Center Execution Canvas (max-w-4xl) + Right Slide-Out (380px) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar (240px) */}
        <aside className="w-[240px] bg-[#090D16] border-r border-[#1E293B] p-4 flex flex-col justify-between shrink-0 select-none hidden lg:flex">
          <div className="space-y-6">
            {/* Project Runs Section */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold flex items-center justify-between">
                <span>Recent Runs</span>
                <span className="text-[10px] text-slate-500">BullMQ</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { id: jobId, state: pipelineState === 'done' ? 'passed' : pipelineState === 'idle' ? 'idle' : 'running', time: 'Just now' },
                  { id: 'run_74b1e02a', state: 'passed', time: '14m ago' },
                  { id: 'run_55c9d11f', state: 'passed', time: '1h ago' }
                ].map((run, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded border text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ${
                      run.id === jobId && pipelineState !== 'idle'
                        ? 'bg-[#10B981]/10 border-[#10B981]/40 text-white'
                        : 'bg-[#0E1524] border-[#1E293B] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          run.state === 'running'
                            ? 'bg-[#10B981] animate-ping'
                            : run.state === 'passed'
                            ? 'bg-[#10B981]'
                            : 'bg-slate-600'
                        }`}
                      />
                      <span>{run.id}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{run.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 1-Click Recipes */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                1-Click Recipes
              </div>
              <div className="space-y-1">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(p)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors truncate ${
                      selectedPreset === p
                        ? 'bg-[#10B981]/15 text-[#10B981] font-medium border border-[#10B981]/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0E1524]'
                    }`}
                  >
                    • {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Connectors */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Active Connectors
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300 py-1 border-b border-[#1E293B]/50">
                  <span className="flex items-center space-x-1.5">
                    <Server className="w-3.5 h-3.5 text-slate-400" />
                    <span>Fastify Gateway</span>
                  </span>
                  <span className="text-[#10B981] text-[10px]">&lt;15ms</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 py-1 border-b border-[#1E293B]/50">
                  <span className="flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                    <span>BullMQ Redis</span>
                  </span>
                  <span className="text-[#10B981] text-[10px]">Queue OK</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 py-1 border-b border-[#1E293B]/50">
                  <span className="flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-slate-400" />
                    <span>SSE EventStream</span>
                  </span>
                  <span className="text-[#10B981] text-[10px]">Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Golden Rule Reminder Footer */}
          <div className="p-2.5 rounded bg-[#0E1524] border border-[#1E293B] text-[11px] text-slate-400 leading-snug">
            <span className="text-[#10B981] font-bold block mb-1">9.5/10 Golden Rule</span>
            Eliminate cognitive friction & visual bloat: 3-step vertical progress cards, 1-click presets, and an isolated slide-out diagnostic drawer.
          </div>
        </aside>

        {/* Center Execution Canvas (max-w-4xl) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 flex flex-col items-center">
          <div className="w-full max-w-4xl space-y-6">
            {/* Zone A: The Primary Canvas (Zero Clutter) */}
            
            {/* Header Description */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
                  <span>Linear Execution Pipeline</span>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[#0E1524] text-slate-400 border border-[#1E293B]">
                    Industrial Asynchronous Engine
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Queue-backed worker pipeline with live Server-Sent Events, progressive disclosure, and zero layout shift.
                </p>
              </div>

              {pipelineState !== 'idle' && (
                <button
                  onClick={handleReset}
                  className="text-xs font-mono px-3 py-1.5 rounded border border-[#1E293B] text-slate-400 hover:text-white hover:bg-[#0E1524] flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Pipeline</span>
                </button>
              )}
            </div>

            {/* 1-Click Preset Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>1-Click Preset Sandboxes (No Pre-Auth Config Wall)</span>
                <span className="text-[10px] text-[#10B981]">Instant Execution</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                      selectedPreset === preset
                        ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981] font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : 'bg-[#0E1524] text-slate-300 border-[#1E293B] hover:border-slate-600'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Single Prompt / Action Field with Single Primary Action Color (#10B981) */}
            <div className="bg-[#0E1524] border border-[#1E293B] rounded-xl p-3 shadow-lg space-y-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-[#10B981] shrink-0" />
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Enter developer intent or choose a 1-click preset above..."
                  className="bg-transparent text-sm text-white placeholder-slate-500 w-full focus:outline-none font-sans"
                />
              </div>

              {/* Single Primary Focus Button (#10B981) */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/60">
                <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-2">
                  <span>Fastify endpoint:</span>
                  <span className="text-white bg-[#090D16] px-1.5 py-0.5 rounded border border-[#1E293B]">
                    POST /api/runs
                  </span>
                  <span>(Returns 202 in &lt;15ms)</span>
                </div>

                <button
                  id="primary-antigravity-button"
                  onClick={runExecutionPipeline}
                  disabled={pipelineState === 'enqueuing' || pipelineState === 'step1' || pipelineState === 'step2' || pipelineState === 'step3'}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold font-mono tracking-wide text-[#090D16] bg-[#10B981] hover:bg-[#059669] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  {pipelineState === 'enqueuing' ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#090D16] border-t-transparent rounded-full animate-spin" />
                      <span>Allocating isolated sandbox...</span>
                    </>
                  ) : pipelineState === 'step1' || pipelineState === 'step2' || pipelineState === 'step3' ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#090D16] border-t-transparent rounded-full animate-spin" />
                      <span>Executing AST Analysis...</span>
                    </>
                  ) : pipelineState === 'done' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#090D16]" />
                      <span>Review Proposed Pull Request</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-[#090D16] fill-[#090D16]" />
                      <span>Run Automated Triage</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Linear Stepper: 3 Cards Showing (1) Cloned Context, (2) Evaluation, (3) Pull Request Staging */}
            {/* Fixed height per card: Zero Layout Shifts (CLS = 0) */}
            <div className="space-y-4 w-full">
              {/* Card 1: Cloned Context */}
              <div
                onClick={() => openDrawerForStep(1)}
                className={`w-full min-h-[128px] p-6 rounded-xl border transition-all cursor-pointer select-none relative bg-[#0E1524] ${
                  pipelineState === 'step1'
                    ? 'border-[#10B981] shadow-[0_0_16px_rgba(16,185,129,0.15)] ring-1 ring-[#10B981]/50'
                    : pipelineState === 'step2' || pipelineState === 'step3' || pipelineState === 'done'
                    ? 'border-[#10B981]/60'
                    : 'border-[#1E293B] hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    {/* Stepper Node Status Indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                        pipelineState === 'step2' || pipelineState === 'step3' || pipelineState === 'done'
                          ? 'bg-[#10B981] text-[#090D16]'
                          : pipelineState === 'step1'
                          ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981] animate-pulse'
                          : 'bg-[#1E293B] text-slate-400'
                      }`}
                    >
                      {pipelineState === 'step2' || pipelineState === 'step3' || pipelineState === 'done' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        '1'
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-sm font-semibold text-white">1. Cloned Context</h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#090D16] border border-[#1E293B] text-slate-300">
                          Isolated MicroVM
                        </span>
                        {(pipelineState === 'step2' || pipelineState === 'step3' || pipelineState === 'done') && (
                          <span className="text-[10px] font-mono text-[#10B981] font-semibold bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
                            482 files indexed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {pipelineState === 'step1'
                          ? 'Connecting to development workspace...'
                          : pipelineState === 'step2' || pipelineState === 'step3' || pipelineState === 'done'
                          ? 'Workspace cloned into isolated Node.js 20 sandbox. Branch main (commit 46d8de3) parsed.'
                          : 'Awaiting execution trigger to spawn sandbox container and clone repository AST.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                    <span className="hidden sm:inline text-[11px]">Inspect Telemetry</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Fixed Metadata Bottom Row */}
                <div className="mt-3 pt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center space-x-4">
                    <span>
                      commit: <span className="text-slate-200">46d8de3</span>
                    </span>
                    <span>
                      branch: <span className="text-slate-200">main</span>
                    </span>
                    <span>
                      sandbox: <span className="text-slate-200">512MB RAM cap</span>
                    </span>
                  </div>
                  <span className="text-[#10B981] text-[10px]">Step 1 / 3</span>
                </div>
              </div>

              {/* Card 2: Evaluation */}
              <div
                onClick={() => openDrawerForStep(2)}
                className={`w-full min-h-[128px] p-6 rounded-xl border transition-all cursor-pointer select-none relative bg-[#0E1524] ${
                  pipelineState === 'step2'
                    ? 'border-[#10B981] shadow-[0_0_16px_rgba(16,185,129,0.15)] ring-1 ring-[#10B981]/50'
                    : pipelineState === 'step3' || pipelineState === 'done'
                    ? 'border-[#10B981]/60'
                    : 'border-[#1E293B] hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    {/* Stepper Node Status Indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                        pipelineState === 'step3' || pipelineState === 'done'
                          ? 'bg-[#10B981] text-[#090D16]'
                          : pipelineState === 'step2'
                          ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981] animate-pulse'
                          : 'bg-[#1E293B] text-slate-400'
                      }`}
                    >
                      {pipelineState === 'step3' || pipelineState === 'done' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        '2'
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-sm font-semibold text-white">2. Evaluation</h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#090D16] border border-[#1E293B] text-slate-300">
                          @ast/analyzer-engine
                        </span>
                        {pipelineState === 'step2' && (
                          <span className="text-[10px] font-mono text-emerald-400 animate-pulse bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                            Evaluating dependencies...
                          </span>
                        )}
                        {(pipelineState === 'step3' || pipelineState === 'done') && (
                          <span className="text-[10px] font-mono text-[#10B981] font-semibold bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
                            Root Cause Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {pipelineState === 'step2'
                          ? 'Evaluating workspace dependencies against security registry...'
                          : pipelineState === 'step3' || pipelineState === 'done'
                          ? 'Syntax issue detected in auth.ts on line 42. Race condition isolated in csvUploadService mutex.'
                          : 'Runs AST static analysis, dependency graph security checks, and cross-file symbol correlation.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                    <span className="hidden sm:inline text-[11px]">Inspect Telemetry</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Fixed Metadata Bottom Row */}
                <div className="mt-3 pt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center space-x-4">
                    <span>
                      CPU: <span className="text-slate-200">12.4%</span>
                    </span>
                    <span>
                      RSS Memory: <span className="text-slate-200">48MB</span>
                    </span>
                    <span>
                      Tests: <span className="text-[#10B981]">8/8 Passing</span>
                    </span>
                  </div>
                  <span className="text-[#10B981] text-[10px]">Step 2 / 3</span>
                </div>
              </div>

              {/* Card 3: Pull Request Staging */}
              <div
                onClick={() => openDrawerForStep(3)}
                className={`w-full min-h-[128px] p-6 rounded-xl border transition-all cursor-pointer select-none relative bg-[#0E1524] ${
                  pipelineState === 'step3' || pipelineState === 'done'
                    ? 'border-[#10B981] shadow-[0_0_16px_rgba(16,185,129,0.15)] ring-1 ring-[#10B981]/50'
                    : 'border-[#1E293B] hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    {/* Stepper Node Status Indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                        pipelineState === 'done'
                          ? 'bg-[#10B981] text-[#090D16]'
                          : pipelineState === 'step3'
                          ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981] animate-pulse'
                          : 'bg-[#1E293B] text-slate-400'
                      }`}
                    >
                      {pipelineState === 'done' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        '3'
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-sm font-semibold text-white">3. Pull Request Staging</h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#090D16] border border-[#1E293B] text-slate-300">
                          1-Click Merge Gate
                        </span>
                        {pipelineState === 'done' && (
                          <span className="text-[10px] font-mono text-[#10B981] font-semibold bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
                            PR #104 Ready
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {pipelineState === 'done'
                          ? 'Staged PR #104 ready for one-click merge. Zero-regression verified against test suite.'
                          : pipelineState === 'step3'
                          ? 'Review Proposed Pull Request. Synthesizing unified git diff and validating changelog.'
                          : 'Synthesizes defensive code patch, attaches test verification artifacts, and stages ready-to-merge PR.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                    <span className="hidden sm:inline text-[11px]">Inspect Telemetry</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Fixed Metadata Bottom Row */}
                <div className="mt-3 pt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center space-x-4">
                    <span>
                      PR: <span className="text-slate-200">#104 (devflow/bug-142-fix)</span>
                    </span>
                    <span>
                      Diff: <span className="text-emerald-400">+24</span> / <span className="text-rose-400">-6</span>
                    </span>
                    <span>
                      Gate: <span className="text-[#10B981]">Passed (0 errors)</span>
                    </span>
                  </div>
                  <span className="text-[#10B981] text-[10px]">Step 3 / 3</span>
                </div>
              </div>
            </div>

            {/* Micro-Copy Dictionary: Translating Jargon into Clarity (Section 7 in Spec) */}
            <div className="bg-[#0E1524] border border-[#1E293B] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <span className="text-xs font-mono font-bold text-[#10B981] flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-[#10B981]" />
                  <span>Micro-Copy Dictionary: Translating Jargon into Clarity</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Section 7 • 9.5/10 Quality</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-[#090D16] border border-[#1E293B] space-y-1">
                  <div className="text-[10px] font-mono text-rose-400 line-through">
                    INIT_MCP_SOCKET_CONNECTION: PENDING
                  </div>
                  <div className="text-white font-medium flex items-center space-x-1.5">
                    <span className="text-[#10B981]">✓</span>
                    <span>"Connecting to development workspace..."</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#090D16] border border-[#1E293B] space-y-1">
                  <div className="text-[10px] font-mono text-rose-400 line-through">
                    ERR_AST_PARSE_EXCEPTION: TOKEN_OOB
                  </div>
                  <div className="text-white font-medium flex items-center space-x-1.5">
                    <span className="text-[#10B981]">✓</span>
                    <span>"Syntax issue detected in auth.ts on line 42."</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#090D16] border border-[#1E293B] space-y-1">
                  <div className="text-[10px] font-mono text-rose-400 line-through">
                    EXECUTE_MULTI_AGENT_ORCHESTRATION
                  </div>
                  <div className="text-white font-medium flex items-center space-x-1.5">
                    <span className="text-[#10B981]">✓</span>
                    <span>"Run Automated Triage"</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#090D16] border border-[#1E293B] space-y-1">
                  <div className="text-[10px] font-mono text-rose-400 line-through">
                    DIFF_SYNTHESIS_STAGED_TO_ORIGIN
                  </div>
                  <div className="text-white font-medium flex items-center space-x-1.5">
                    <span className="text-[#10B981]">✓</span>
                    <span>"Review Proposed Pull Request"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone B: Right Diagnostic Slide-Over (380px, collapsible) */}
        {/* Triggered ONLY when clicking a step or toggle button */}
        {isDiagnosticDrawerOpen && (
          <aside className="w-[380px] bg-[#090D16] border-l border-[#1E293B] p-5 flex flex-col justify-between shrink-0 select-none overflow-y-auto z-30 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-5">
              {/* Drawer Masthead */}
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-[#10B981]" />
                    <span>Diagnostic Drawer</span>
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    Step {activeDiagnosticStep} Telemetry & Traces
                  </p>
                </div>
                <button
                  onClick={() => setIsDiagnosticDrawerOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1E293B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step Tabs within drawer */}
              <div className="grid grid-cols-3 gap-1 bg-[#0E1524] p-1 rounded-lg border border-[#1E293B] text-xs font-mono">
                <button
                  onClick={() => setActiveDiagnosticStep(1)}
                  className={`py-1 rounded text-center transition-colors ${
                    activeDiagnosticStep === 1
                      ? 'bg-[#10B981] text-[#090D16] font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1. Context
                </button>
                <button
                  onClick={() => setActiveDiagnosticStep(2)}
                  className={`py-1 rounded text-center transition-colors ${
                    activeDiagnosticStep === 2
                      ? 'bg-[#10B981] text-[#090D16] font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2. Eval
                </button>
                <button
                  onClick={() => setActiveDiagnosticStep(3)}
                  className={`py-1 rounded text-center transition-colors ${
                    activeDiagnosticStep === 3
                      ? 'bg-[#10B981] text-[#090D16] font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3. Staging
                </button>
              </div>

              {/* Memory & CPU Real-Time Gauges */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  Worker Telemetry & Sandbox
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#0E1524] border border-[#1E293B]">
                    <div className="text-slate-400 text-[10px]">CPU USAGE</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {currentTelemetry.diagnostics.cpuUsage}
                    </div>
                    <div className="text-[10px] text-[#10B981] mt-0.5">Isolated AST worker</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0E1524] border border-[#1E293B]">
                    <div className="text-slate-400 text-[10px]">RSS MEMORY</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {currentTelemetry.diagnostics.memoryRss}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Cap: 512MB RAM</div>
                  </div>
                </div>
              </div>

              {/* Section 5 Backend Event Contract (SSE JSON Spec) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="font-semibold uppercase">Backend Event Contract (SSE JSON)</span>
                  <span className="text-[#10B981] text-[10px]">Spec v2</span>
                </div>
                <div className="bg-[#060A12] border border-[#1E293B] rounded-lg p-3 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                  <pre className="text-emerald-400">
                    {JSON.stringify(
                      {
                        jobId: currentTelemetry.jobId,
                        timestamp: currentTelemetry.timestamp,
                        step: currentTelemetry.step,
                        status: currentTelemetry.status,
                        humanMessage: currentTelemetry.humanMessage,
                        diagnostics: currentTelemetry.diagnostics
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>

              {/* BullMQ Worker Topology Info */}
              <div className="p-3 rounded-lg bg-[#0E1524] border border-[#1E293B] text-xs font-mono space-y-1.5">
                <div className="text-slate-300 font-semibold">Distributed Worker Topology</div>
                <div className="text-slate-400 text-[11px]">
                  • Fastify HTTP 202: &lt;15ms queue response
                </div>
                <div className="text-slate-400 text-[11px]">
                  • BullMQ concurrency limit = 4 jobs/instance
                </div>
                <div className="text-slate-400 text-[11px]">
                  • Memory leak guard: isolated subprocess stdout piped to Redis cache keys
                </div>
              </div>

              {/* Execution Telemetry Log stream */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  Humanized Event Log
                </div>
                <div className="space-y-2 text-xs font-mono max-h-48 overflow-y-auto pr-1">
                  {telemetryLogs.map((log, i) => (
                    <div key={i} className="p-2 rounded bg-[#0E1524] border border-[#1E293B]/70 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{log.time}</span>
                        <span className="text-[#10B981]">SSE STREAM</span>
                      </div>
                      <div className="text-slate-200">{log.text}</div>
                      <div className="text-[10px] text-slate-500 truncate">{log.rawJargon}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Merge PR Action if Done */}
            {pipelineState === 'done' && (
              <div className="pt-4 border-t border-[#1E293B]">
                <button
                  onClick={() => alert('Pull Request #104 successfully merged into main!')}
                  className="w-full py-2.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2"
                >
                  <GitPullRequest className="w-4 h-4 text-[#090D16]" />
                  <span>One-Click Merge PR #104</span>
                </button>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};
