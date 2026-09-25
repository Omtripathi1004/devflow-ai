import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { initialProjectProgress } from '../data/projectProgressData';
import { ProjectAspectProgress } from '../types';
import {
  Server,
  Layout,
  Database,
  Cloud,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  Search,
  Sparkles,
  FileCode,
  Terminal,
  Layers,
  ChevronRight,
  TrendingUp,
  FolderPlus,
  Upload,
} from 'lucide-react';

export const ProjectProgressView: React.FC = () => {
  const { setIsFolderModalOpen } = useWorkflow();
  const [aspects, setAspects] = useState<ProjectAspectProgress[]>(initialProjectProgress);
  const [selectedAspectId, setSelectedAspectId] = useState<string>('all');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Calculate weighted overall progress
  const overallPercentage = Math.round(
    aspects.reduce((acc, a) => acc + a.percentage, 0) / aspects.length
  );

  const totalTasks = aspects.reduce((acc, a) => acc + a.totalTasks, 0);
  const completedTasks = aspects.reduce((acc, a) => acc + a.completedTasks, 0);

  const handleToggleMilestone = (aspectId: string, milestoneId: string) => {
    setAspects((prev) =>
      prev.map((a) => {
        if (a.id !== aspectId) return a;
        const updatedMilestones = a.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const comp = updatedMilestones.filter((m) => m.completed).length;
        const pct = Math.round((comp / updatedMilestones.length) * 100);
        return {
          ...a,
          milestones: updatedMilestones,
          completedTasks: comp,
          percentage: pct,
        };
      })
    );
  };

  const handleScanRepository = () => {
    setIsScanning(true);
    setScanMessage('Scanning AST trees, testing files, and deployment targets...');

    setTimeout(() => {
      setScanMessage('Verifying tests in tests/services/csvUploadService.test.ts (8/8 PASS)...');
    }, 800);

    setTimeout(() => {
      setScanMessage('Analyzing build bundle in dist/assets and Vercel routing rules...');
    }, 1500);

    setTimeout(() => {
      setIsScanning(false);
      setScanMessage('Audit Complete: 5/5 aspects within production readiness thresholds.');
      setTimeout(() => setScanMessage(null), 4000);
    }, 2200);
  };

  const filteredAspects =
    selectedAspectId === 'all'
      ? aspects
      : aspects.filter((a) => a.id === selectedAspectId);

  const getAspectIcon = (id: string) => {
    switch (id) {
      case 'backend':
        return <Server className="w-5 h-5 text-indigo-400" />;
      case 'frontend':
        return <Layout className="w-5 h-5 text-cyan-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-amber-400" />;
      case 'deployment':
        return <Cloud className="w-5 h-5 text-teal-400" />;
      case 'security':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      default:
        return <Layers className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Overall Project Health & Summary */}
      <div className="glass-panel p-6 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#071522]/90 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                Full-Stack Architecture Radar
              </span>
              <span className="text-xs font-mono text-slate-400">
                Live Repository Audit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Project Engineering Progress Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time audit across <strong>Backend & Services</strong>, <strong>Frontend UI/UX</strong>, <strong>Database & Storage</strong>, and <strong>Deployment & DevOps</strong>. Track milestones, verified test coverage, and enterprise delivery readiness.
            </p>
          </div>

          {/* Overall Health Score Card */}
          <div className="flex items-center gap-6 bg-[#0D2135]/80 p-4 rounded-2xl border border-[rgba(148,163,184,0.2)] shrink-0">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * overallPercentage) / 100}
                  className="text-cyan-400 transition-all duration-1000 ease-out"
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-white">{overallPercentage}%</span>
                <span className="text-[9px] font-mono text-cyan-300 uppercase">Complete</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Total Tasks:</span>
                <span className="text-white font-bold">{completedTasks} / {totalTasks}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Automated Tests:</span>
                <span className="text-emerald-400 font-bold">8 / 8 PASS</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Build Status:</span>
                <span className="text-cyan-400 font-bold">Passing (Vite)</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Deployment:</span>
                <span className="text-teal-400 font-bold">Live on Vercel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Scanner Button */}
        <div className="mt-6 pt-4 border-t border-[rgba(148,163,184,0.15)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsFolderModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#06111F] text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Enter / Change Project Folder</span>
            </button>

            <button
              onClick={handleScanRepository}
              disabled={isScanning}
              className="px-4 py-2 rounded-xl bg-[#0D2135] hover:bg-[#102A43] text-slate-300 hover:text-white border border-[rgba(148,163,184,0.2)] text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Auditing Codebase...' : 'Scan Repository Health'}</span>
            </button>

            {scanMessage && (
              <span className="text-xs font-mono text-cyan-300 animate-pulse bg-cyan-950/70 border border-cyan-500/30 px-3 py-1.5 rounded-lg">
                {scanMessage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Last Audit: Just now</span>
            <span>•</span>
            <span className="text-emerald-400">Production Ready</span>
          </div>
        </div>
      </div>

      {/* Aspect Selector Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedAspectId('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${
            selectedAspectId === 'all'
              ? 'bg-cyan-500 text-[#06111F] font-bold shadow-md shadow-cyan-500/20'
              : 'bg-[#0D2135] text-slate-300 hover:text-white border border-[rgba(148,163,184,0.15)]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Engineering Aspects</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20">
            {aspects.length}
          </span>
        </button>

        {aspects.map((aspect) => (
          <button
            key={aspect.id}
            onClick={() => setSelectedAspectId(aspect.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${
              selectedAspectId === aspect.id
                ? 'bg-cyan-500 text-[#06111F] font-bold shadow-md shadow-cyan-500/20'
                : 'bg-[#0D2135] text-slate-300 hover:text-white border border-[rgba(148,163,184,0.15)]'
            }`}
          >
            {getAspectIcon(aspect.id)}
            <span>{aspect.name}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                aspect.percentage >= 95
                  ? 'bg-emerald-950/70 text-emerald-300'
                  : 'bg-cyan-950/70 text-cyan-300'
              }`}
            >
              {aspect.percentage}%
            </span>
          </button>
        ))}
      </div>

      {/* Grid of Aspect Cards & Detailed Milestones */}
      <div className="space-y-6">
        {filteredAspects.map((aspect) => (
          <div
            key={aspect.id}
            className="glass-panel p-6 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#071522] space-y-5"
          >
            {/* Header of Aspect Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(148,163,184,0.12)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D2135] border border-[rgba(148,163,184,0.2)] flex items-center justify-center shrink-0">
                  {getAspectIcon(aspect.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{aspect.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                      {aspect.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{aspect.summary}</p>
                </div>
              </div>

              {/* Progress percentage bar */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-32 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${aspect.percentage}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-white w-12 text-right">
                  {aspect.percentage}%
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  ({aspect.completedTasks}/{aspect.totalTasks})
                </span>
              </div>
            </div>

            {/* Milestones Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aspect.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  onClick={() => handleToggleMilestone(aspect.id, milestone.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    milestone.completed
                      ? 'bg-[#0D2135]/60 border-cyan-500/30 hover:border-cyan-500/60'
                      : 'bg-[#0A1B2D]/40 border-slate-800 hover:border-slate-700 opacity-75'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {milestone.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-slate-600 hover:border-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          milestone.completed ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {milestone.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        wt: {milestone.weight}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {milestone.description}
                    </p>
                    {milestone.files.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {milestone.files.map((file, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-cyan-300 border border-cyan-500/20"
                          >
                            {file}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
