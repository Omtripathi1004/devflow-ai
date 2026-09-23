import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { StageId } from '../types';
import {
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  GitBranch,
  Bot,
  ExternalLink,
} from 'lucide-react';

export const WorkflowsView: React.FC = () => {
  const {
    workflowNodes,
    workflowStatus,
    runId,
    startDemoWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    cancelWorkflow,
    retryStage,
    injectFailure,
    setSelectedAgentId,
    setActiveTab,
  } = useWorkflow();

  const getNodeStatusBadge = (status: string) => {
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

  const getCorrespondingTab = (stageId: StageId) => {
    switch (stageId) {
      case 'intake': return 'issues';
      case 'repo_analysis': return 'repository';
      case 'log_analysis': return 'documents';
      case 'doc_analysis': return 'documents';
      case 'root_cause': return 'root_cause';
      case 'fix': return 'code_changes';
      case 'test': return 'tests';
      case 'review': return 'review';
      case 'security': return 'security';
      case 'release': return 'release';
      default: return 'overview';
    }
  };

  const intakeNode = workflowNodes.find((n) => n.id === 'intake');
  const parallelNodes = workflowNodes.filter((n) =>
    ['repo_analysis', 'log_analysis', 'doc_analysis'].includes(n.id)
  );
  const sequentialDownstream = workflowNodes.filter((n) =>
    ['root_cause', 'fix', 'test', 'review', 'security', 'release'].includes(n.id)
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Orchestrator Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 card-cyber p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              <span>Visual Workflow Orchestrator</span>
            </h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              Run: {runId}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Multi-agent dependency graph with parallel investigation branches and failure-resilient recovery.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {workflowStatus === 'running' ? (
            <button
              onClick={pauseWorkflow}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          ) : workflowStatus === 'paused' ? (
            <button
              onClick={resumeWorkflow}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              onClick={startDemoWorkflow}
              className="btn-cyber-primary text-xs flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-[#06111F]" />
              <span>Start Workflow</span>
            </button>
          )}

          <button
            onClick={cancelWorkflow}
            className="btn-cyber-secondary text-xs"
          >
            Cancel
          </button>

          {/* Test resilience: Inject failure toggle */}
          <button
            onClick={() => injectFailure('test')}
            className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Demonstrate single-stage retry recovery"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Stage Failure</span>
          </button>
        </div>
      </div>

      {/* Visual Graph Layout */}
      <div className="bg-[#06111F] border border-[rgba(148,163,184,0.15)] rounded-2xl p-6 relative overflow-x-auto shadow-2xl">
        <div className="min-w-[850px] space-y-8">
          {/* Phase 1: Intake Node */}
          {intakeNode && (
            <div className="flex flex-col items-center">
              <div
                className={`w-80 p-4 rounded-xl border transition-all ${
                  intakeNode.status === 'running'
                    ? 'border-cyan-500 bg-[#0D2135] shadow-lg shadow-cyan-500/20'
                    : intakeNode.status === 'completed'
                    ? 'border-emerald-500/50 bg-[#0D2135]'
                    : 'border-[rgba(148,163,184,0.15)] bg-[#0A1B2D]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">{intakeNode.label}</span>
                  {getNodeStatusBadge(intakeNode.status)}
                </div>
                <p className="text-xs text-[#94A3B8] mt-1">{intakeNode.description}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[rgba(148,163,184,0.15)] text-[11px] font-mono text-slate-500">
                  <span>Duration: {intakeNode.durationSec}s</span>
                  <button
                    onClick={() => setActiveTab('issues')}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>View Issue</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Connecting Split Fork Lines */}
              <div className="w-px h-8 bg-cyan-500/50 mt-1" />
              <div className="w-2/3 h-px bg-cyan-500/50" />
              <div className="flex justify-between w-2/3">
                <div className="w-px h-6 bg-cyan-500/50" />
                <div className="w-px h-6 bg-cyan-500/50" />
                <div className="w-px h-6 bg-cyan-500/50" />
              </div>
            </div>
          )}

          {/* Phase 2: Parallel Investigation Branches */}
          <div className="space-y-2">
            <div className="text-center">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40">
                ⚡ Parallel Investigation Phase (Concurrent Subagents)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {parallelNodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    node.status === 'running'
                      ? 'border-cyan-500 bg-[#0D2135] shadow-lg shadow-cyan-500/20'
                      : node.status === 'completed'
                      ? 'border-emerald-500/50 bg-[#0D2135]'
                      : node.status === 'failed'
                      ? 'border-rose-500 bg-rose-950/40'
                      : 'border-[rgba(148,163,184,0.15)] bg-[#0A1B2D]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-white">{node.label}</span>
                      {getNodeStatusBadge(node.status)}
                    </div>
                    <p className="text-xs text-[#94A3B8]">{node.description}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-[rgba(148,163,184,0.15)] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">{node.durationSec}s</span>
                    <div className="flex items-center gap-2">
                      {node.status === 'failed' && (
                        <button
                          onClick={() => retryStage(node.id)}
                          className="px-2 py-0.5 rounded bg-rose-900 text-rose-200 hover:bg-rose-800 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Retry</span>
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedAgentId(node.agentId)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <Bot className="w-3 h-3" />
                        <span>Agent</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Converge Fork Lines */}
            <div className="flex justify-between w-2/3 mx-auto">
              <div className="w-px h-6 bg-cyan-500/50" />
              <div className="w-px h-6 bg-cyan-500/50" />
              <div className="w-px h-6 bg-cyan-500/50" />
            </div>
            <div className="w-2/3 h-px bg-cyan-500/50 mx-auto" />
            <div className="w-px h-8 bg-cyan-500/50 mx-auto" />
          </div>

          {/* Phase 3: Downstream Sequential Pipeline */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {sequentialDownstream.map((node, idx) => (
              <React.Fragment key={node.id}>
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    node.status === 'running'
                      ? 'border-cyan-500 bg-[#0D2135] shadow-lg shadow-cyan-500/20'
                      : node.status === 'completed'
                      ? 'border-emerald-500/50 bg-[#0D2135]'
                      : node.status === 'failed'
                      ? 'border-rose-500 bg-rose-950/40'
                      : 'border-[rgba(148,163,184,0.15)] bg-[#0A1B2D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#06111F] text-cyan-400 font-mono text-[10px] flex items-center justify-center font-bold border border-[rgba(148,163,184,0.15)]">
                        {idx + 5}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">{node.label}</span>
                    </div>
                    {getNodeStatusBadge(node.status)}
                  </div>

                  <p className="text-xs text-[#94A3B8] mt-1 pl-7">{node.description}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[rgba(148,163,184,0.15)] text-[11px] font-mono pl-7">
                    <span className="text-slate-500">Duration: {node.durationSec}s</span>
                    <div className="flex items-center gap-3">
                      {node.status === 'failed' && (
                        <button
                          onClick={() => retryStage(node.id)}
                          className="px-2.5 py-1 rounded bg-rose-900 text-rose-200 hover:bg-rose-800 flex items-center gap-1 font-semibold"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Retry Stage Only</span>
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedAgentId(node.agentId)}
                        className="text-[#94A3B8] hover:text-cyan-400 flex items-center gap-1"
                      >
                        <Bot className="w-3 h-3" />
                        <span>Agent Details</span>
                      </button>
                      <button
                        onClick={() => setActiveTab(getCorrespondingTab(node.id))}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                      >
                        <span>Workspace</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {idx < sequentialDownstream.length - 1 && (
                  <div className="flex justify-center">
                    <div className="w-px h-6 bg-[rgba(148,163,184,0.2)]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
