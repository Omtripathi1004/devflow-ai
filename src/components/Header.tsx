import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Cpu,
  Download,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    workflowStatus,
    runId,
    elapsedSeconds,
    simulationSpeed,
    setSimulationSpeed,
    isSimulatedAdapter,
    startDemoWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    resetWorkflow,
    stepForward,
    exportAuditReport,
    setIsJudgeModalOpen,
  } = useWorkflow();

  const getStatusBadge = () => {
    switch (workflowStatus) {
      case 'running':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            RUNNING
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            COMPLETED
          </span>
        );
      case 'paused':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/40">
            <Pause className="w-3.5 h-3.5" />
            PAUSED
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/40">
            FAILED
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-900 text-slate-400 border border-slate-700">
            IDLE
          </span>
        );
    }
  };

  return (
    <header className="h-16 border-b border-[rgba(148,163,184,0.15)] bg-[#071522]/90 backdrop-blur-xl px-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
      {/* Brand & Concept Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/25">
            <div className="w-full h-full bg-[#06111F] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                DevFlow <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                IBM Bob 2.0
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] font-mono hidden sm:block">
              Autonomous Software-Maintenance Platform
            </p>
          </div>
        </div>

        {/* Status indicator: ● SYSTEM ONLINE */}
        <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-[rgba(148,163,184,0.15)]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
            SYSTEM ONLINE
          </span>

          <div
            className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5 ${
              isSimulatedAdapter
                ? 'bg-amber-950/40 border border-amber-600/30 text-amber-300'
                : 'bg-emerald-950/40 border border-emerald-600/30 text-emerald-300'
            }`}
            title="Demonstration adapter running deterministic simulations. Fully modular and ready for live IBM Bob 2.0 APIs."
          >
            [BOB 2.0 ADAPTER: SIMULATED]
          </div>
        </div>
      </div>

      {/* Center: Run ID & Elapsed Timer */}
      <div className="hidden md:flex items-center gap-3.5 bg-[#0D2135]/80 border border-[rgba(148,163,184,0.15)] px-3 py-1.5 rounded-xl">
        <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-mono">
          <span className="text-slate-500">Run:</span>
          <span className="text-cyan-400 font-semibold">{runId}</span>
        </div>
        <div className="w-px h-3.5 bg-[rgba(148,163,184,0.2)]" />
        <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{elapsedSeconds}s</span>
        </div>
        <div className="w-px h-3.5 bg-[rgba(148,163,184,0.2)]" />
        {getStatusBadge()}
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2">
        {/* Speed Selector */}
        <div className="hidden sm:flex items-center bg-[#0A1B2D] border border-[rgba(148,163,184,0.2)] rounded-lg p-0.5 text-xs font-mono">
          <button
            onClick={() => setSimulationSpeed('1x')}
            className={`px-2 py-1 rounded transition-colors ${
              simulationSpeed === '1x' ? 'bg-cyan-500 text-[#06111F] font-bold' : 'text-[#94A3B8] hover:text-white'
            }`}
            title="Realistic timing (2.5s per agent stage)"
          >
            1x
          </button>
          <button
            onClick={() => setSimulationSpeed('2x')}
            className={`px-2 py-1 rounded transition-colors ${
              simulationSpeed === '2x' ? 'bg-cyan-500 text-[#06111F] font-bold' : 'text-[#94A3B8] hover:text-white'
            }`}
            title="Fast demonstration timing (1.2s per agent stage)"
          >
            2x
          </button>
          <button
            onClick={() => setSimulationSpeed('instant')}
            className={`px-2 py-1 rounded transition-colors ${
              simulationSpeed === 'instant' ? 'bg-cyan-500 text-[#06111F] font-bold' : 'text-[#94A3B8] hover:text-white'
            }`}
            title="Instant execution (200ms)"
          >
            ⚡
          </button>
        </div>

        {/* Pause/Resume buttons */}
        {workflowStatus === 'running' ? (
          <button
            onClick={pauseWorkflow}
            className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all text-xs"
            title="Pause Workflow"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : workflowStatus === 'paused' ? (
          <button
            onClick={resumeWorkflow}
            className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all text-xs"
            title="Resume Workflow"
          >
            <Play className="w-4 h-4" />
          </button>
        ) : null}

        {/* Step Forward */}
        <button
          onClick={stepForward}
          className="p-2 rounded-lg bg-[#0D2135] hover:bg-[#102A43] text-slate-300 border border-[rgba(148,163,184,0.15)] transition-all text-xs hidden sm:flex items-center gap-1"
          title="Step Forward One Stage"
        >
          <FastForward className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Reset */}
        <button
          onClick={resetWorkflow}
          className="p-2 rounded-lg bg-[#0D2135] hover:bg-[#102A43] text-[#94A3B8] hover:text-white border border-[rgba(148,163,184,0.15)] transition-all text-xs"
          title="Reset Workflow State"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Judge Guided Tour CTA */}
        <button
          onClick={() => setIsJudgeModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-900/60 to-indigo-900/60 hover:from-blue-800/80 hover:to-indigo-800/80 text-cyan-200 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          title="View Judge Guided Tour and Script"
        >
          <Award className="w-3.5 h-3.5 text-cyan-300" />
          <span className="hidden sm:inline">Judge Tour</span>
        </button>

        {/* Export Report */}
        <button
          onClick={exportAuditReport}
          className="p-2 rounded-lg bg-[#0D2135] hover:bg-[#102A43] text-slate-300 border border-[rgba(148,163,184,0.15)] transition-all text-xs hidden lg:flex items-center gap-1"
          title="Export Workflow Audit Report (JSON)"
        >
          <Download className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Primary CTA: Run Demo Workflow */}
        <button
          onClick={startDemoWorkflow}
          disabled={workflowStatus === 'running'}
          className="btn-cyber-primary text-xs sm:text-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-[#06111F]" />
          <span>Run Demo Workflow</span>
        </button>
      </div>
    </header>
  );
};
