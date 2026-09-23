import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  X,
  Bot,
  BrainCircuit,
  ListChecks,
  Files,
  Package,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AgentDetailDrawer: React.FC = () => {
  const { selectedAgentId, setSelectedAgentId, agents, setActiveTab } = useWorkflow();

  if (!selectedAgentId) return null;

  const agent = agents.find((a) => a.id === selectedAgentId);
  if (!agent) return null;

  const getStatusBadge = () => {
    switch (agent.status) {
      case 'running':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 animate-pulse">
            RUNNING
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-semibold">
            COMPLETED
          </span>
        );
      case 'failed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-rose-950 text-rose-400 border border-rose-500/40 font-semibold">
            FAILED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
            QUEUED
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#071522]/95 border-l border-[rgba(148,163,184,0.2)] shadow-2xl z-50 flex flex-col backdrop-blur-2xl animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[rgba(148,163,184,0.15)] flex items-center justify-between bg-[#0A1B2D]/80">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-md"
            style={{ backgroundColor: `${agent.avatarColor}15`, borderColor: `${agent.avatarColor}40` }}
          >
            <Bot className="w-5 h-5" style={{ color: agent.avatarColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">{agent.name}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-[#94A3B8] font-mono">{agent.role}</p>
          </div>
        </div>

        <button
          onClick={() => setSelectedAgentId(null)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0D2135] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Timing and Stage metadata */}
        <div className="grid grid-cols-2 gap-2 bg-[#0D2135] p-3 rounded-xl border border-[rgba(148,163,184,0.15)] font-mono">
          <div className="flex items-center gap-1.5 text-[#94A3B8]">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Execution Duration:</span>
          </div>
          <div className="text-right text-white font-bold">
            {(agent.durationMs / 1000).toFixed(2)}s
          </div>
          <div className="flex items-center gap-1.5 text-[#94A3B8]">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Stage Scope:</span>
          </div>
          <div className="text-right text-cyan-300 uppercase font-semibold">
            {agent.stageId}
          </div>
        </div>

        {/* Current Task & Input/Output */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#94A3B8] mb-1 block">
              Current Task Directive
            </label>
            <div className="p-3 rounded-xl bg-[#0D2135] border border-[rgba(148,163,184,0.15)] text-slate-200 leading-relaxed font-mono">
              {agent.currentTask}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-0.5 block">
                Agent Input Context
              </label>
              <div className="p-2.5 rounded-lg bg-[#06111F] border border-[rgba(148,163,184,0.15)] text-[#94A3B8] font-mono text-[11px]">
                {agent.input}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-0.5 block">
                Synthesized Output
              </label>
              <div className="p-2.5 rounded-lg bg-[#06111F] border border-[rgba(148,163,184,0.15)] text-emerald-300 font-mono text-[11px]">
                {agent.output}
              </div>
            </div>
          </div>
        </div>

        {/* Reasoning Summary */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-1.5">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <span>Reasoning & Evaluation Summary</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25 text-slate-200 leading-relaxed">
            {agent.reasoningSummary}
          </div>
        </div>

        {/* Actions Performed */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-2">
            <ListChecks className="w-4 h-4 text-blue-400" />
            <span>Actions Performed ({agent.actionsPerformed.length})</span>
          </div>
          <ul className="space-y-1.5">
            {agent.actionsPerformed.map((action, i) => (
              <li
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-[#0D2135] border border-[rgba(148,163,184,0.12)] text-slate-300"
              >
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="font-mono text-[11px] leading-tight">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Files Inspected */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-2">
            <Files className="w-4 h-4 text-cyan-400" />
            <span>Files Inspected ({agent.filesInspected.length})</span>
          </div>
          <div className="space-y-1">
            {agent.filesInspected.map((file, i) => (
              <div
                key={i}
                onClick={() => {
                  setActiveTab('repository');
                  setSelectedAgentId(null);
                }}
                className="p-2 px-3 rounded-xl bg-[#0D2135] hover:bg-[#102A43] border border-[rgba(148,163,184,0.15)] flex items-center justify-between text-slate-300 font-mono text-[11px] cursor-pointer transition-colors group"
              >
                <span className="group-hover:text-cyan-300 truncate">{file}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Output Artifacts */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>Generated Output Artifacts ({agent.outputArtifacts.length})</span>
          </div>
          <div className="space-y-1.5">
            {agent.outputArtifacts.map((art, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-[#0D2135] border border-[rgba(148,163,184,0.15)] flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-slate-200">{art.name}</div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#06111F] text-cyan-400">
                    {art.type}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedAgentId(null);
                    if (art.link === '#diff') setActiveTab('code_changes');
                    else if (art.link === '#tests') setActiveTab('tests');
                    else if (art.link === '#root-cause') setActiveTab('root_cause');
                    else if (art.link === '#docs') setActiveTab('documents');
                    else if (art.link === '#security') setActiveTab('security');
                    else if (art.link === '#release') setActiveTab('release');
                    else setActiveTab('repository');
                  }}
                  className="p-1 text-slate-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-[rgba(148,163,184,0.15)] bg-[#0A1B2D]/80 flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#94A3B8]">
          Node ID: {agent.id}
        </span>
        <button
          onClick={() => setSelectedAgentId(null)}
          className="btn-cyber-secondary text-xs"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
