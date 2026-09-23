import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Bot,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const AgentsView: React.FC = () => {
  const { agents, selectedAgentId, setSelectedAgentId, retryStage } = useWorkflow();

  const getAgentBadge = (status: string) => {
    switch (status) {
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            RUNNING
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            COMPLETED
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-500/40 font-semibold">
            <AlertTriangle className="w-3 h-3" />
            FAILED
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#06111F] text-[#94A3B8] border border-[rgba(148,163,184,0.15)]">
            QUEUED
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 card-cyber p-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-cyan-400" />
            <span>Agent Mode & Specialized Subagents</span>
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            9 autonomous domain specialists operating with explicit inspectable reasoning and evidence artifacts.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
            <span>9 Specialized Roles</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Parallel Orchestration</span>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isSelected = selectedAgentId === agent.id;

          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`card-cyber p-5 cursor-pointer flex flex-col justify-between group ${
                isSelected ? 'card-cyber-active' : ''
              }`}
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center border shadow"
                      style={{
                        backgroundColor: `${agent.avatarColor}15`,
                        borderColor: `${agent.avatarColor}40`,
                      }}
                    >
                      <Bot className="w-4 h-4" style={{ color: agent.avatarColor }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {agent.name}
                      </h3>
                      <span className="text-[10px] font-mono text-[#94A3B8] block">{agent.role}</span>
                    </div>
                  </div>

                  {getAgentBadge(agent.status)}
                </div>

                {/* Current Task */}
                <div className="space-y-2 mt-2">
                  <div className="p-2.5 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] text-[11px] text-slate-300 font-mono line-clamp-2">
                    {agent.currentTask}
                  </div>

                  {/* Input / Output preview */}
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-start gap-1.5 text-[#94A3B8]">
                      <span className="text-slate-500 font-mono shrink-0">Input:</span>
                      <span className="text-slate-300 truncate">{agent.input}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[#94A3B8]">
                      <span className="text-emerald-400 font-mono shrink-0">Output:</span>
                      <span className="text-emerald-300/90 truncate">{agent.output}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-[rgba(148,163,184,0.12)] flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-[#94A3B8]">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{(agent.durationMs / 1000).toFixed(1)}s</span>
                </div>

                <div className="flex items-center gap-2">
                  {agent.status === 'failed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        retryStage(agent.stageId);
                      }}
                      className="px-2 py-0.5 rounded bg-rose-900 hover:bg-rose-800 text-rose-200 text-[10px]"
                    >
                      Retry
                    </button>
                  )}
                  <span className="text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
