import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Sparkles,
  Zap,
  TrendingDown,
  CheckCircle,
  FlaskConical,
  ShieldCheck,
  Bot,
  ArrowRight,
  GitPullRequest,
  Play,
  Clock,
  Layers,
  Activity,
  Workflow,
  Cpu,
  Globe,
  BookOpen,
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    startDemoWorkflow,
    workflowStatus,
    runId,
    setActiveTab,
    benchmarkMetrics,
    testCenter,
    reviewFindings,
    activities,
    setSelectedAgentId,
  } = useWorkflow();

  const timeSavedMin = benchmarkMetrics.manual.totalTimeMin - benchmarkMetrics.devflow.totalTimeMin;
  const reductionPct = Math.round(
    ((benchmarkMetrics.manual.totalTimeMin - benchmarkMetrics.devflow.totalTimeMin) /
      benchmarkMetrics.manual.totalTimeMin) *
      100
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Hero Banner: Autonomous Control Center Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#071522] via-[#0A1B2D] to-[#0D2135] border border-[rgba(34,211,238,0.25)] p-6 md:p-8 shadow-2xl">
        {/* Subtle radial glow & micro-grid */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(34,211,238,0.06)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
            <span>SYSTEM ONLINE — IBM Bob 2.0 Autonomous Architecture</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            DevFlow <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">AI</span>{' '}
            — Autonomous Developer Platform
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            AI-powered orchestration for faster, resilient incident resolution. Coordinates 9 specialized
            autonomous subagents to investigate code AST, correlate production logs, synthesize defensive
            patches, run regression suites, and enforce release gates.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('antigravity')}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-mono tracking-wide text-[#090D16] bg-[#10B981] hover:bg-[#059669] flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.35)] active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 text-[#090D16] fill-[#090D16]" />
              <span>Anti-Gravity 9.5 Engine (Spec)</span>
            </button>

            <button
              onClick={startDemoWorkflow}
              disabled={workflowStatus === 'running'}
              className="btn-cyber-primary text-xs sm:text-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-[#06111F]" />
              <span>Run Autonomous Demo Workflow</span>
            </button>

            <button
              onClick={() => setActiveTab('workflows')}
              className="btn-cyber-secondary text-xs sm:text-sm flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Inspect Workflow Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmarks')}
              className="btn-cyber-secondary text-xs sm:text-sm flex items-center gap-2"
            >
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Productivity Impact (-{reductionPct}%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Anti-Gravity 9.5/10 Execution Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D16] border border-[#10B981]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-[#10B981] flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-[#10B981]" />
              <span>ANTI-GRAVITY: 9.5/10 ARCHITECTURE & SPECIFICATION READY</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40">
              DE-CLUTTER MANIFEST
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Replaces spaghetti node graphs and raw terminal streams with a <strong>Linear 3-Step Execution Pipeline</strong> (Cloned Context &rarr; Evaluation &rarr; Pull Request Staging), Fastify + BullMQ Redis asynchronous queues, and an isolated slide-out diagnostic drawer.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('antigravity')}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-[#090D16] bg-[#10B981] hover:bg-[#059669] flex items-center space-x-1.5 shrink-0 transition-colors shadow-[0_0_12px_rgba(16,185,129,0.25)]"
        >
          <span>Launch 9.5/10 Pipeline</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#090D16]" />
        </button>
      </div>

      {/* KPI Intelligence Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="card-cyber p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-mono">
            <span>Avg Investigation</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white font-mono">4.5 min</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
              94% faster than manual
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="card-cyber p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-mono">
            <span>Incident Time Saved</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {timeSavedMin} min
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
              -{reductionPct}% turnaround cut
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="card-cyber p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-mono">
            <span>Test Pass Rate</span>
            <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white font-mono">
              {testCenter.passedCount}/{testCenter.totalTestsCount}
            </div>
            <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
              +{testCenter.regressionTestsCount} new scenarios
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="card-cyber p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-mono">
            <span>AI Review Findings</span>
            <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white font-mono">
              {reviewFindings.length} evaluated
            </div>
            <div className="text-[11px] text-indigo-300 font-mono mt-0.5">
              across 7 quality axes
            </div>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="card-cyber p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-mono">
            <span>Release Readiness</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white font-mono">98%</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
              8/8 Gates Passed
            </div>
          </div>
        </div>

        {/* KPI 6 */}
        <div className="card-cyber p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-mono">
            <span>Agent Utilization</span>
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white font-mono">89%</div>
            <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
              9 parallel subagents
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Active Investigation Summary & Before vs After comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Incident Card (BUG-142) */}
        <div className="lg:col-span-2 card-cyber p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800">
                P0 CRITICAL
              </span>
              <span className="font-mono text-xs text-[#94A3B8]">Target Issue:</span>
              <span className="font-mono text-xs text-cyan-300 font-bold">BUG-142</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#94A3B8]">Run ID:</span>
              <span className="text-xs font-mono text-cyan-400">{runId}</span>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">
              CSV upload intermittently fails with TypeError in production
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Legacy ETL curl clients uploading without explicit filename header trigger unhandled exception at{' '}
              <code className="text-cyan-300 bg-[#06111F] px-1.5 py-0.5 rounded border border-[rgba(148,163,184,0.15)]">
                csvUploadService.ts:42
              </code>.
            </p>
          </div>

          {/* Quick status milestones */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[rgba(148,163,184,0.15)]">
            <div className="p-2.5 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.15)]">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">1. Ingest & AST</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" /> Resolved
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.15)]">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">2. Root Cause</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" /> 96% Certainty
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.15)]">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">3. Defensive Patch</span>
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 mt-0.5">
                <GitPullRequest className="w-3.5 h-3.5" /> +24 / -6 Lines
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.15)]">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">4. Regression Suite</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" /> 47/47 Tests
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-[#94A3B8] font-mono">
              Proposed Fix:{' '}
              <span className="text-slate-200">
                src/services/csvUploadService.ts (Stream guard & UUID fallback)
              </span>
            </div>
            <button
              onClick={() => setActiveTab('code_changes')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>View Git Diff</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Before vs After Quick Productivity Card */}
        <div className="card-cyber p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span>Productivity Impact</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                84% Time Reduction
              </span>
            </div>

            <div className="space-y-4">
              {/* Manual Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
                  <span>Manual Workflow</span>
                  <span className="text-slate-300 font-semibold">{benchmarkMetrics.manual.totalTimeMin} min</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#06111F] overflow-hidden border border-[rgba(148,163,184,0.1)]">
                  <div className="w-full h-full bg-rose-600/70 rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>Investigate: 75m</span>
                  <span>Tests: 45m</span>
                  <span>Release: 40m</span>
                </div>
              </div>

              {/* DevFlow Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
                  <span>DevFlow Autonomous</span>
                  <span className="text-emerald-400 font-bold">{benchmarkMetrics.devflow.totalTimeMin} min</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#06111F] overflow-hidden border border-[rgba(148,163,184,0.1)]">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 rounded-full"
                    style={{
                      width: `${(benchmarkMetrics.devflow.totalTimeMin / benchmarkMetrics.manual.totalTimeMin) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-cyan-400/80 font-mono mt-0.5">
                  <span>Investigate: 4.5m</span>
                  <span>Tests: 6m</span>
                  <span>Release: 4.5m</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-600/30 text-xs text-emerald-300">
              <span className="font-semibold">{timeSavedMin} minutes saved</span> on every bug lifecycle. Context
              switches reduced from 24 to 2.
            </div>
          </div>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className="w-full mt-4 py-2 rounded-xl bg-[#06111F] hover:bg-[#102A43] border border-[rgba(148,163,184,0.15)] text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Detailed Benchmark Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Live Agent Stream & Specialized Subagents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Agent Activity Stream */}
        <div className="card-cyber p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Live Agent Activity Stream</span>
            </h3>
            <button
              onClick={() => setActiveTab('activity')}
              className="text-xs text-[#94A3B8] hover:text-cyan-400 font-mono transition-colors"
            >
              View Full Audit Log →
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{act.title}</span>
                    {act.agentId && (
                      <button
                        onClick={() => setSelectedAgentId(act.agentId!)}
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hover:border-cyan-400 transition-colors"
                      >
                        {act.agentId}
                      </button>
                    )}
                  </div>
                  <p className="text-[#94A3B8] text-[11px] leading-relaxed">{act.message}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-500 block">{act.timestamp}</span>
                  {act.durationMs && (
                    <span className="text-[10px] font-mono text-cyan-400">
                      {(act.durationMs / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Autonomous Execution Highlights */}
        <div className="card-cyber p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Specialized Subagent Orchestration Summary</span>
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <div
              onClick={() => setSelectedAgentId('repo-agent')}
              className="p-3 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] hover:border-cyan-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono text-cyan-400 uppercase block font-semibold">AST Graph</span>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 block mt-1">
                Repository Agent
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Line 42 resolved</span>
            </div>

            <div
              onClick={() => setSelectedAgentId('log-agent')}
              className="p-3 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] hover:border-blue-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono text-blue-400 uppercase block font-semibold">Telemetry</span>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 block mt-1">
                Log Agent
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">184 traces matched</span>
            </div>

            <div
              onClick={() => setSelectedAgentId('doc-agent')}
              className="p-3 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono text-emerald-400 uppercase block font-semibold">Specs</span>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 block mt-1">
                Doc Agent
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">RFC 7578 contract</span>
            </div>

            <div
              onClick={() => setSelectedAgentId('root-cause-agent')}
              className="p-3 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] hover:border-amber-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono text-amber-400 uppercase block font-semibold">Synthesis</span>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 block mt-1">
                Root-Cause Agent
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">96% confidence</span>
            </div>

            <div
              onClick={() => setSelectedAgentId('fix-agent')}
              className="p-3 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] hover:border-cyan-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono text-cyan-400 uppercase block font-semibold">Code Patch</span>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 block mt-1">
                Fix Agent
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">+24 -6 lines</span>
            </div>

            <div
              onClick={() => setSelectedAgentId('test-agent')}
              className="p-3 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] hover:border-blue-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono text-blue-400 uppercase block font-semibold">Regression</span>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 block mt-1">
                Test Agent
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">47/47 passed</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Click any subagent to view its reasoning summary and artifacts.</span>
            <button
              onClick={() => setActiveTab('agents')}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              All 9 Agents →
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Multi-Agent Capability Grid */}
      <div className="card-cyber p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-border/40 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>DevFlow AI × IBM Bob 2.0 Extended Engines</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Direct access to automation pipelines, multi-model advisory, PDF spec guard, and distributed scalability.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            5 CORE CAPABILITIES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('automation')}
            className="p-4 rounded-xl bg-[#06111F] border border-[rgba(148,163,184,0.15)] hover:border-fuchsia-500/60 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-fuchsia-950/60 text-fuchsia-400 border border-fuchsia-500/30">
                <Workflow className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-fuchsia-300">2,000+ Flows</span>
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-fuchsia-300">
              Autonomous Workflow Studio
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              N8N-compatible multi-agent trigger & triage pipelines with webhook simulation.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('copilot')}
            className="p-4 rounded-xl bg-[#06111F] border border-[rgba(148,163,184,0.15)] hover:border-purple-500/60 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-purple-300">Granite 34B</span>
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-purple-300">
              AI Copilot & Multi-Model Hub
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Interactive code advisory, PDF §8 master prompts, and model benchmark matrix.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('documents')}
            className="p-4 rounded-xl bg-[#06111F] border border-[rgba(148,163,184,0.15)] hover:border-emerald-500/60 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-emerald-300">0% Drift</span>
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">
              DocuMind Spec Guard
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              PDF architecture understanding, OpenAPI RAG chunking, and spec adherence.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('system_design')}
            className="p-4 rounded-xl bg-[#06111F] border border-[rgba(148,163,184,0.15)] hover:border-sky-500/60 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-500/30">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-sky-300">10k PRs/Day</span>
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-sky-300">
              Enterprise System Design
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Kafka event queues, isolated MicroVM sandboxes, and Redis AST caching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
