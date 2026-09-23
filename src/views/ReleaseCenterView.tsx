import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import confetti from 'canvas-confetti';
import { 
  Rocket, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  ShieldCheck, 
  Terminal, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  PackageCheck,
  Sparkles
} from 'lucide-react';

export const ReleaseCenterView: React.FC = () => {
  const { releaseCenter, approveRelease, toggleChecklistItem, exportAuditReport } = useWorkflow();

  const handleDeploy = () => {
    approveRelease();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22D3EE', '#3B82F6', '#10B981', '#F8FAFC'],
      });
    } catch (e) {
      // fallback if canvas not available
    }
  };

  const allChecklistCompleted = releaseCenter.checklist.every((c) => c.completed);

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border/40 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-cyber-muted font-mono mb-1">
            <span>DevFlow AI</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-cyan-400">Continuous Delivery</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-white font-semibold">Autonomous Release Center</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-3">
            <span>Release Candidate {releaseCenter.version}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border bg-cyan-950/40 text-cyan-400 border-cyan-800/60">
              {releaseCenter.isDeployed ? 'DEPLOYED TO CANARY' : 'STAGING CANDIDATE'}
            </span>
          </h1>
          <p className="text-sm text-cyber-muted mt-1">
            Automated changelog generation, rollback plan validation, and staging-to-canary release dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportAuditReport}
            className="btn-cyber-secondary flex items-center space-x-2 text-xs"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Audit JSON</span>
          </button>

          <button
            onClick={handleDeploy}
            disabled={releaseCenter.isDeployed}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wide transition-all shadow-lg ${
              releaseCenter.isDeployed
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 cursor-default'
                : 'btn-cyber-primary'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>{releaseCenter.isDeployed ? 'Canary Active (10%)' : 'Approve & Deploy Canary'}</span>
          </button>
        </div>
      </div>

      {/* Release Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Readiness Score</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {releaseCenter.readinessScore}%
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            Automated release health index
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Regression Risk</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            Near Zero (0.2%)
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            47/47 tests passing in sandbox
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>MTTR Saved</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            164 Minutes
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            -84% reduction vs manual triage
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Autonomous Actions</span>
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono">
            10 Stages
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            Zero unhandled exceptions
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist & Release Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Checklist & Deployment Notes */}
        <div className="space-y-6">
          {/* Release Checklist */}
          <div className="card-cyber p-5">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border/40">
              <h3 className="text-sm font-semibold text-white font-mono flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Pre-Flight Checklist</span>
              </h3>
              <span className="text-xs font-mono text-cyber-muted">
                {releaseCenter.checklist.filter((c) => c.completed).length}/{releaseCenter.checklist.length} Done
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {releaseCenter.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex items-start space-x-3 p-2.5 rounded border transition-colors cursor-pointer ${
                    item.completed
                      ? 'bg-cyber-dark/40 border-cyber-border hover:border-cyan-500/30'
                      : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-cyber-border text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1 text-xs font-mono select-none">
                    <span className={item.completed ? 'text-slate-300' : 'text-amber-300 font-medium'}>
                      {item.title}
                    </span>
                    {item.required && (
                      <span className="ml-2 text-[10px] text-cyan-400 font-semibold uppercase">
                        [REQUIRED]
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rollback Strategy */}
          <div className="card-cyber p-5">
            <div className="flex items-center space-x-2 pb-3 border-b border-cyber-border/40">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white font-mono">Rollback Strategy</h3>
            </div>
            <div className="mt-3 text-xs text-cyber-muted space-y-2 font-mono">
              <p className="leading-relaxed">
                {releaseCenter.rollbackPlan}
              </p>
              <div className="bg-[#050e18] p-2 rounded text-[11px] text-cyan-400 border border-cyber-border">
                CLI: <code>kubectl rollout undo deployment/api-service -n prod</code>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Changelog / Release Notes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-cyber p-5">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border/40">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white font-mono">
                  Autonomous Release Notes ({releaseCenter.releaseCandidateName})
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                Markdown Generated
              </span>
            </div>

            <div className="mt-4 bg-[#040b14] p-4 rounded-lg border border-cyber-border/60 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap overflow-x-auto">
              {releaseCenter.releaseNotesMarkdown}
            </div>

            <div className="mt-4 pt-3 border-t border-cyber-border/40 flex items-center justify-between text-xs text-cyber-muted font-mono">
              <span>Author: DevFlow Documentation & Release Agent</span>
              <span>Commit Hash: <code>7f8a92b</code></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
