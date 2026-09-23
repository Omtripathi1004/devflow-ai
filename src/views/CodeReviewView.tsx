import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileCode, 
  Check, 
  Sparkles, 
  Filter, 
  RotateCcw,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';

export const CodeReviewView: React.FC = () => {
  const { reviewFindings, approveReviewFinding, retryStage } = useWorkflow();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'correctness',
    'maintainability',
    'security',
    'performance',
    'compatibility',
    'test_coverage',
  ];

  const filteredFindings = reviewFindings.filter((f) => {
    if (selectedCategory === 'ALL') return true;
    return f.category === selectedCategory;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-950/70 text-red-400 border border-red-800/60';
      case 'MEDIUM':
        return 'bg-amber-950/70 text-amber-400 border border-amber-800/60';
      case 'LOW':
        return 'bg-cyan-950/70 text-cyan-400 border border-cyan-800/60';
      default:
        return 'bg-slate-900 text-slate-300 border border-slate-700';
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
            <span className="text-cyan-400">Quality Gates</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-white font-semibold">Autonomous Code Review</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-3">
            <span>Automated Code Review Agent</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border bg-cyan-950/40 text-cyan-400 border-cyan-800/60">
              7-AXIS EVALUATION
            </span>
          </h1>
          <p className="text-sm text-cyber-muted mt-1">
            Heuristic and LLM-driven quality analysis across correctness, security, performance, and compatibility.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => retryStage('review')}
            className="btn-cyber-secondary flex items-center space-x-2 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Re-Run AI Review</span>
          </button>
        </div>
      </div>

      {/* Review KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Overall Review Score</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            96 / 100
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            No critical blockers detected
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auto-Resolved Findings</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            4 of {reviewFindings.length}
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            Style & sanity checks cleared
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Human Review Items</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {reviewFindings.filter((f) => !f.humanApproved).length} Remaining
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            Informational advisory notices
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Evaluator Engine</span>
          </div>
          <div className="text-sm font-semibold text-white font-mono">
            Granite Code + AstGrep
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            Semantic AST parsing
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase whitespace-nowrap transition-colors border ${
              selectedCategory === cat
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-semibold'
                : 'bg-cyber-dark/60 text-cyber-muted border-cyber-border hover:text-white'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => (
          <div
            key={finding.id}
            className={`card-cyber p-5 border transition-all ${
              finding.humanApproved ? 'border-emerald-500/30' : 'border-cyber-border'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-cyber-border/40">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${getSeverityBadge(finding.severity)}`}>
                  {finding.severity}
                </span>
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyber-dark text-cyan-400 border border-cyber-border">
                  {finding.category.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono text-cyber-muted flex items-center space-x-1">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{finding.file}:{finding.line}</span>
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => approveReviewFinding(finding.id)}
                  className={`px-3 py-1 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors ${
                    finding.humanApproved
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                      : 'bg-cyber-dark hover:bg-cyber-card text-cyber-muted hover:text-white border border-cyber-border'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{finding.humanApproved ? 'Sign-Off Recorded' : 'Mark as Acknowledged'}</span>
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-sm font-semibold text-white font-mono flex items-center space-x-2">
                <span>{finding.title}</span>
              </h3>

              <p className="text-xs text-cyber-muted leading-relaxed">
                {finding.explanation}
              </p>

              <div className="bg-cyber-dark/80 p-3 rounded-md border border-cyan-500/20 text-xs font-mono">
                <div className="text-[11px] text-cyan-400 font-semibold mb-1 flex items-center space-x-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Recommended Action / Verification</span>
                </div>
                <div className="text-slate-300">
                  {finding.suggestedAction}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
