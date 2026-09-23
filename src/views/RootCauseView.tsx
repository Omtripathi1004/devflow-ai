import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  SearchCode,
  ShieldAlert,
  CheckCircle,
  XCircle,
  GitBranch,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const RootCauseView: React.FC = () => {
  const { rootCause, setActiveTab } = useWorkflow();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* View Header with Confidence Gauge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 card-cyber p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Target: {rootCause.issueId}
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">Synthesized by Root-Cause Agent</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Root Cause Analysis & Diagnostic Proof
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Multi-modal synthesis reconciling observed telemetry evidence with TypeScript AST and architectural specifications.
          </p>
        </div>

        {/* Confidence Gauge */}
        <div className="p-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#0D2135] to-[#0A1B2D] border border-cyan-500/35 flex items-center gap-4 shadow-lg shrink-0">
          <div>
            <span className="text-[10px] font-mono text-cyan-300 uppercase block font-semibold">
              Diagnostic Confidence
            </span>
            <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-1">
              <span>{rootCause.confidenceScore}%</span>
              <span className="text-xs text-emerald-400 font-sans font-normal">Certainty</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-cyan-400 flex items-center justify-center font-bold text-xs text-cyan-300 bg-[#06111F] shadow-[0_0_12px_rgba(34,211,238,0.3)]">
            P0
          </div>
        </div>
      </div>

      {/* Selected Root Cause Hero */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/25 via-[#0D2135] to-blue-950/25 border border-cyan-500/35 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Selected Autonomous Diagnosis</span>
        </div>
        <p className="text-sm font-semibold text-slate-100 leading-relaxed font-mono">
          {rootCause.selectedRootCause}
        </p>
      </div>

      {/* Grid: Symptoms vs Suspected Condition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Observed Symptoms */}
        <div className="card-cyber p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Observed Symptoms (Empirical Evidence)</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#06111F] text-[#94A3B8]">
              LOG / APM OBSERVED
            </span>
          </div>

          <ul className="space-y-2 text-xs">
            {rootCause.observedSymptoms.map((symptom, idx) => (
              <li
                key={idx}
                className="p-2.5 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] text-slate-300 flex items-start gap-2.5 font-mono"
              >
                <span className="w-4 h-4 rounded-full bg-rose-950 text-rose-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <span className="text-[11px] leading-relaxed">{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suspected Failure Condition & Component */}
        <div className="card-cyber p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SearchCode className="w-4 h-4 text-cyan-400" />
              <span>Suspected Failure Condition (AI Inference)</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              SYNTHESIZED
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.15)] text-xs text-slate-200 leading-relaxed font-mono">
            {rootCause.suspectedFailureCondition}
          </div>

          <div className="pt-2 border-t border-[rgba(148,163,184,0.15)]">
            <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1 font-semibold">
              Affected Component Coordinates:
            </span>
            <div className="p-2.5 rounded-xl bg-[#06111F] border border-[rgba(148,163,184,0.15)] text-cyan-300 font-mono text-xs flex items-center justify-between">
              <span>{rootCause.affectedComponent}</span>
              <button
                onClick={() => setActiveTab('repository')}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                <span>Inspect in Repo</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Causal Dependency Chain */}
      <div className="card-cyber p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span>Causal Propagation Chain (Deterministic Timeline)</span>
        </h3>

        <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-500/40">
          {rootCause.dependencyChain.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-3">
              <div className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#06111F] shadow-[0_0_8px_#22D3EE]" />
              <div className="p-3 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] text-xs text-slate-300 font-mono w-full leading-relaxed">
                <span className="text-cyan-400 font-bold mr-2">Phase {idx + 1}:</span>
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Hypotheses Evaluated */}
      <div className="card-cyber p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Alternative Hypotheses Matrix (Scientific Falsification)</span>
          <span className="text-xs font-mono text-[#94A3B8]">3 Hypotheses Evaluated</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rootCause.alternativeHypotheses.map((h, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                h.status === 'ACCEPTED'
                  ? 'border-emerald-500/50 bg-emerald-950/20'
                  : 'border-[rgba(148,163,184,0.15)] bg-[#06111F]/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      h.status === 'ACCEPTED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {h.status}
                  </span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">Likelihood: {h.likelihood}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-100">{h.hypothesis}</h4>
                <p className="text-[11px] text-[#94A3B8] mt-2 leading-relaxed">{h.reasoning}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[rgba(148,163,184,0.12)] text-[10px] font-mono text-slate-500 flex items-center gap-1">
                {h.status === 'ACCEPTED' ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>{h.status === 'ACCEPTED' ? 'Confirmed Root Cause' : 'Disproved by Data'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Panel Linking Back to Artifacts */}
      <div className="card-cyber p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">
          Evidence Panel (Backlinked Artifacts)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rootCause.evidenceItems.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.15)] space-y-2 text-xs font-mono"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  {ev.source}
                </span>
                <span className="text-[11px] text-[#94A3B8] truncate">{ev.location}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#071522] border border-[rgba(148,163,184,0.1)] text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                {ev.snippet}
              </div>

              <p className="text-[10px] text-[#94A3B8] font-sans leading-tight">
                {ev.impactExplanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
