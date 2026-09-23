import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  XCircle, 
  ShieldCheck, 
  Download, 
  Clock, 
  Bot, 
  ChevronRight,
  Radio
} from 'lucide-react';

export const ActivityView: React.FC = () => {
  const { activities, exportAuditReport, workflowStatus } = useWorkflow();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = activities.filter((act) => {
    if (filterType !== 'ALL' && act.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.message.toLowerCase().includes(q) ||
        (act.agentId && act.agentId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>SUCCESS</span>
          </span>
        );
      case 'WARN':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/70 text-amber-400 border border-amber-800/60">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>WARN</span>
          </span>
        );
      case 'ERROR':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/70 text-red-400 border border-red-800/60">
            <XCircle className="w-3 h-3 text-red-400" />
            <span>ERROR</span>
          </span>
        );
      case 'CHECKPOINT':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950/70 text-purple-300 border border-purple-800/60">
            <ShieldCheck className="w-3 h-3 text-purple-300" />
            <span>GATE</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60">
            <Info className="w-3 h-3 text-cyan-400" />
            <span>INFO</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border/40 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-cyber-muted font-mono mb-1">
            <span>DevFlow AI</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-cyan-400">Observability</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-white font-semibold">Live Audit & Activity Stream</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-3">
            <span>Audit & Event Log</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border bg-cyan-950/40 text-cyan-400 border-cyan-800/60 flex items-center space-x-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${workflowStatus === 'running' ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`}></span>
              <span>{activities.length} EVENTS RECORDED</span>
            </span>
          </h1>
          <p className="text-sm text-cyber-muted mt-1">
            Tamper-evident chronological execution log capturing all multi-agent handoffs, decisions, and human gates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportAuditReport}
            className="btn-cyber-primary flex items-center space-x-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full JSON Audit</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-cyber-muted" />
          <input
            type="text"
            placeholder="Search events, agents, stages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cyber-dark/80 border border-cyber-border rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-cyber-muted focus:outline-none focus:border-cyan-500/50 font-mono"
          />
        </div>

        <div className="flex items-center space-x-1.5 bg-cyber-dark/80 p-1 rounded-md border border-cyber-border text-xs font-mono overflow-x-auto w-full sm:w-auto">
          {['ALL', 'INFO', 'SUCCESS', 'CHECKPOINT', 'WARN', 'ERROR'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
                  : 'text-cyber-muted hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="card-cyber p-0 overflow-hidden divide-y divide-cyber-border/40">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-cyber-muted">
            No events match the selected filters.
          </div>
        ) : (
          filteredEvents.map((act) => (
            <div
              key={act.id}
              className="p-4 hover:bg-cyber-dark/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex-shrink-0">
                  {getEventBadge(act.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-white font-mono">{act.title}</span>
                    {act.stageId && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyber-dark text-cyan-400 border border-cyber-border">
                        Stage: {act.stageId}
                      </span>
                    )}
                    {act.agentId && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-700 flex items-center space-x-1">
                        <Bot className="w-2.5 h-2.5 text-cyan-400" />
                        <span>{act.agentId}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-cyber-muted leading-relaxed font-mono">
                    {act.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 flex-shrink-0 font-mono text-[11px] text-cyber-muted sm:text-right pl-7 sm:pl-0">
                {act.durationMs && (
                  <span className="text-cyan-400">{(act.durationMs / 1000).toFixed(2)}s</span>
                )}
                <span className="flex items-center space-x-1 text-slate-400">
                  <Clock className="w-3 h-3 text-cyan-500/70" />
                  <span>{act.timestamp}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
