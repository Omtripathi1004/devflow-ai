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
  Info,
  Zap,
  Activity,
  Cpu,
  Layers,
} from 'lucide-react';

export const CodeReviewView: React.FC = () => {
  const { reviewFindings, approveReviewFinding, retryStage } = useWorkflow();
  const [selectedSentinel, setSelectedSentinel] = useState<'ALL' | 'PERF' | 'SEC' | 'STYLE'>('ALL');
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
    if (selectedCategory !== 'ALL' && f.category !== selectedCategory) return false;
    if (selectedSentinel === 'PERF' && f.category !== 'performance') return false;
    if (selectedSentinel === 'SEC' && f.category !== 'security') return false;
    if (selectedSentinel === 'STYLE' && f.category !== 'maintainability' && f.category !== 'correctness') return false;
    return true;
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
      <div className="card-cyber p-6 relative overflow-hidden bg-gradient-to-r from-[#071522] via-[#0A1B2D] to-[#0D2135] border border-[rgba(34,211,238,0.25)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 font-semibold">
                PARALLEL SENTINEL REVIEW · 3 CONCURRENT SUBAGENTS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                OVERALL SCORE: 96/100
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
              <span>Parallel Sentinel Code Review Engine</span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Splits large pull requests across three specialized concurrent sentinel agents (Performance Sentinel, Security Sentinel, and Style/Architecture Sentinel) to eliminate review bottlenecks.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => retryStage('review')}
              className="btn-cyber-secondary flex items-center space-x-2 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Re-Run Sentinel Suite</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Dedicated Concurrent Sentinel Subagent Cards (PDF Feature B) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Performance Sentinel */}
        <div
          onClick={() => setSelectedSentinel(selectedSentinel === 'PERF' ? 'ALL' : 'PERF')}
          className={`card-cyber p-4 cursor-pointer transition-all border ${
            selectedSentinel === 'PERF'
              ? 'border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-500/10'
              : 'hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
              SENTINEL 1: PERFORMANCE
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              PASS
            </span>
          </div>
          <h3 className="text-xs font-bold text-white mb-1">Async Event Loop & Memory Profiler</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Monitors heap allocations and stream backpressure in <code className="text-cyan-300">csvUploadService.ts</code>.
          </p>
          <div className="bg-[#06111F] p-2 rounded-lg border border-slate-800 text-[10px] font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Memory Complexity:</span>
              <span className="text-emerald-400 font-bold">O(1) Streaming</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Backpressure Guard:</span>
              <span className="text-emerald-400 font-bold">Verified Intact</span>
            </div>
          </div>
        </div>

        {/* Security Sentinel */}
        <div
          onClick={() => setSelectedSentinel(selectedSentinel === 'SEC' ? 'ALL' : 'SEC')}
          className={`card-cyber p-4 cursor-pointer transition-all border ${
            selectedSentinel === 'SEC'
              ? 'border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-500/10'
              : 'hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
              SENTINEL 2: SECURITY
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              PASS
            </span>
          </div>
          <h3 className="text-xs font-bold text-white mb-1">OWASP & Vulnerability Auditor</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Validates path sanitization, cryptographic UUID entropy, and injection vectors.
          </p>
          <div className="bg-[#06111F] p-2 rounded-lg border border-slate-800 text-[10px] font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Path Traversal:</span>
              <span className="text-emerald-400 font-bold">Sanitized (../../ blocked)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">CSPRNG Entropy:</span>
              <span className="text-emerald-400 font-bold">crypto.randomUUID()</span>
            </div>
          </div>
        </div>

        {/* Style & Architecture Sentinel */}
        <div
          onClick={() => setSelectedSentinel(selectedSentinel === 'STYLE' ? 'ALL' : 'STYLE')}
          className={`card-cyber p-4 cursor-pointer transition-all border ${
            selectedSentinel === 'STYLE'
              ? 'border-purple-500 bg-purple-950/30 shadow-lg shadow-purple-500/10'
              : 'hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-bold">
              SENTINEL 3: ARCHITECTURE & STYLE
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              PASS
            </span>
          </div>
          <h3 className="text-xs font-bold text-white mb-1">RFC 7578 & Clean Code Verifier</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Cross-checks TypeScript strict typing, method modularity, and error conventions.
          </p>
          <div className="bg-[#06111F] p-2 rounded-lg border border-slate-800 text-[10px] font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Spec Adherence:</span>
              <span className="text-emerald-400 font-bold">100% RFC 7578 §5.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Strict Type Safety:</span>
              <span className="text-emerald-400 font-bold">zero any casts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(148,163,184,0.15)] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-[#06111F] font-bold'
                  : 'bg-[#06111F] text-slate-400 hover:text-white'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing {filteredFindings.length} evaluated findings
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredFindings.map((finding) => (
          <div
            key={finding.id}
            className="card-cyber p-4 space-y-2 border hover:border-slate-600 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${getSeverityBadge(
                    finding.severity
                  )}`}
                >
                  {finding.severity}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#06111F] text-cyan-300 border border-slate-800 uppercase">
                  {finding.category}
                </span>
                <h4 className="text-xs font-bold text-white">{finding.title}</h4>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span>{finding.file}:{finding.line}</span>
                {finding.humanApproved ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Approved
                  </span>
                ) : (
                  <button
                    onClick={() => approveReviewFinding(finding.id)}
                    className="px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono flex items-center gap-1 transition-all"
                  >
                    <span>Acknowledge & Sign</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{finding.explanation}</p>

            <div className="bg-[#06111F] p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-cyan-200">
              <span className="text-slate-400">Suggested Action: </span>
              {finding.suggestedAction}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
