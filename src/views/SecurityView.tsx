import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Key, 
  FileCheck, 
  Cpu, 
  GitBranch, 
  ChevronRight,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { securityGates, retryStage, injectFailure } = useWorkflow();

  const getGateIcon = (category: string) => {
    switch (category) {
      case 'TESTS':
        return <FileCheck className="w-4 h-4 text-cyan-400" />;
      case 'SECRETS':
        return <Key className="w-4 h-4 text-amber-400" />;
      case 'DEPENDENCY':
        return <Lock className="w-4 h-4 text-emerald-400" />;
      case 'API_COMPAT':
        return <GitBranch className="w-4 h-4 text-purple-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PASS</span>
          </span>
        );
      case 'WARN':
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-950/70 text-amber-400 border border-amber-800/60">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>WARN</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-red-950/70 text-red-400 border border-red-800/60">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>FAIL</span>
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
            <span className="text-cyan-400">Enterprise Compliance</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-white font-semibold">Security & Quality Gatekeeper</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-3">
            <span>Security & Policy Gates</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border bg-emerald-950/40 text-emerald-400 border-emerald-800/60">
              8/8 GATES SATISFIED
            </span>
          </h1>
          <p className="text-sm text-cyber-muted mt-1">
            Multi-stage automated vulnerability scanning, secret detection, SAST, and compliance rule verification.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => retryStage('security')}
            className="btn-cyber-primary flex items-center space-x-2 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-Verify Gates</span>
          </button>
          <button
            onClick={() => injectFailure('security')}
            className="px-3 py-1.5 rounded-md text-xs font-mono bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/50 transition-colors flex items-center space-x-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simulate Gate Block</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gate Clearance Rate</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            100% Passed
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            8 of 8 enterprise gates green
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Secret Leakage Scan</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            0 Detected
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            Entropy check & regex patterns clean
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>CVE Vulnerability Rating</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            Grade A+
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            0 high / critical CVEs in tree
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>Contract Compatibility</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            100% Backwards
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            OpenAPI spec 3.0 schema intact
          </div>
        </div>
      </div>

      {/* Security Gate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityGates.map((gate) => (
          <div key={gate.id} className="card-cyber p-5 border border-cyber-border hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-cyber-border/40">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyber-dark border border-cyber-border flex items-center justify-center">
                  {getGateIcon(gate.category)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white font-mono">{gate.title}</h3>
                  <div className="text-[11px] text-cyber-muted font-mono">{gate.category}</div>
                </div>
              </div>

              <div>
                {getStatusBadge(gate.status)}
              </div>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <p className="text-cyber-muted leading-relaxed">
                {gate.description}
              </p>

              <div className="bg-[#050e18] p-2.5 rounded border border-cyber-border/60 font-mono text-[11px] flex items-center justify-between">
                <span className="text-cyan-400/90 font-medium truncate mr-2">Rule: {gate.rule}</span>
                {gate.isSimulated && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 select-none flex-shrink-0">
                    MOCK HARNESS
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise Policy Footer Banner */}
      <div className="card-cyber p-4 border border-cyan-500/20 bg-cyber-dark/40 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-cyber-muted">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Automated security sign-off policy: SOC2 Type II & FedRAMP High compliant pipeline orchestration.</span>
        </div>
        <span className="text-emerald-400 font-semibold select-none flex-shrink-0">ALL GATES VERIFIED</span>
      </div>
    </div>
  );
};
