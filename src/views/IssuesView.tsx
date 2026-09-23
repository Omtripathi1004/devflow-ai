import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  AlertCircle,
  Play,
  Copy,
  Check,
  Terminal,
  FileCode,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const IssuesView: React.FC = () => {
  const { issue, startDemoWorkflow, workflowStatus, setActiveTab } = useWorkflow();
  const [copiedTrace, setCopiedTrace] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(issue.errorTrace);
    setCopiedTrace(true);
    setTimeout(() => setCopiedTrace(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 card-cyber p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800">
              {issue.priority} {issue.severity}
            </span>
            <span className="text-sm font-mono text-cyan-400 font-bold">{issue.id}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-[#94A3B8] font-mono">{issue.status}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{issue.title}</h2>
        </div>

        <button
          onClick={startDemoWorkflow}
          disabled={workflowStatus === 'running'}
          className="btn-cyber-primary text-xs flex items-center gap-2 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-[#06111F]" />
          <span>Launch Autonomous Investigation</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Triage Details & Repro */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Overview & Description */}
          <div className="card-cyber p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              <span>Incident Description & Impact</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{issue.description}</p>

            <div className="pt-3 border-t border-[rgba(148,163,184,0.15)] grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-[#94A3B8] block">Affected Component:</span>
                <span className="text-slate-200">{issue.affectedComponent}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block">Reported By:</span>
                <span className="text-slate-200">{issue.reporter}</span>
              </div>
            </div>
          </div>

          {/* Reproduction Vector */}
          <div className="card-cyber p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Reproduction Steps</span>
            </h3>
            <ol className="space-y-2 text-xs">
              {issue.reproductionSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.15)] text-slate-300 font-mono"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-cyan-800/40">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Application Error Trace */}
          <div className="card-cyber p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-400" />
                <span>Captured Production Stack Trace</span>
              </h3>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-[#06111F] hover:bg-[#102A43] text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors border border-[rgba(148,163,184,0.15)]"
              >
                {copiedTrace ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Trace</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#06111F] border border-rose-950 text-rose-300 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
              {issue.errorTrace}
            </pre>
          </div>
        </div>

        {/* Right Column: Artifacts & Direct Navigation */}
        <div className="space-y-6">
          <div className="card-cyber p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Triage Artifacts</h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveTab('repository')}
                className="w-full p-2.5 rounded-xl bg-[#06111F]/80 hover:bg-[#102A43] border border-[rgba(148,163,184,0.15)] flex items-center justify-between text-slate-300 group transition-all"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <div className="text-left font-mono">
                    <span className="block text-slate-200">csvUploadService.ts</span>
                    <span className="text-[10px] text-[#94A3B8]">Source file (Line 42)</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              </button>

              <button
                onClick={() => setActiveTab('documents')}
                className="w-full p-2.5 rounded-xl bg-[#06111F]/80 hover:bg-[#102A43] border border-[rgba(148,163,184,0.15)] flex items-center justify-between text-slate-300 group transition-all"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <div className="text-left font-mono">
                    <span className="block text-slate-200">ARCHITECTURE.md §4.2</span>
                    <span className="text-[10px] text-[#94A3B8]">Stream Guard Contract</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
              </button>

              <button
                onClick={() => setActiveTab('root_cause')}
                className="w-full p-2.5 rounded-xl bg-[#06111F]/80 hover:bg-[#102A43] border border-[rgba(148,163,184,0.15)] flex items-center justify-between text-slate-300 group transition-all"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <div className="text-left font-mono">
                    <span className="block text-slate-200">RCA Diagnostic Graph</span>
                    <span className="text-[10px] text-[#94A3B8]">96% Causal Certainty</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </button>
            </div>
          </div>

          {/* Quick Context Card */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/25 space-y-2 text-xs text-slate-300">
            <span className="font-semibold text-cyan-300 block font-mono">Why this matters:</span>
            <p className="leading-relaxed">
              In a traditional manual triage flow, an on-call engineer would take ~75 minutes digging through APM logs,
              reproducing the curl boundary request, and checking RFC specs. DevFlow AI conducts these three tracks
              in parallel in under 4.5 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
