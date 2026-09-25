import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Menu,
  X,
  Search,
  Bot,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Command
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    workflowStatus,
    runId,
    elapsedSeconds,
    startDemoWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    resetWorkflow,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isCopilotOpen,
    setIsCopilotOpen,
    setIsJudgeModalOpen,
    currentUser
  } = useWorkflow();

  const getTabLabel = () => {
    switch (activeTab) {
      case 'overview':
        return 'Overview';
      case 'project_progress':
        return 'Projects';
      case 'issues':
        return 'Tasks';
      case 'workflows':
        return 'Pipelines';
      case 'copilot':
      case 'gemini_chat':
        return 'AI Copilot';
      case 'repository':
        return 'Codebase';
      case 'system_design':
        return 'Architecture';
      case 'documents':
        return 'Insights';
      case 'tests':
        return 'Tests';
      case 'review':
        return 'Code Review';
      case 'security':
        return 'Security';
      case 'release':
        return 'Deployments';
      case 'antigravity':
        return 'Monitoring';
      case 'activity':
        return 'Activity';
      case 'auth':
        return 'Team';
      case 'automation':
        return 'Integrations';
      case 'settings':
        return 'Settings';
      default:
        return 'Workspace';
    }
  };

  return (
    <header className="h-14 bg-neutral-950 border-b border-neutral-800 px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Toggle & Clean Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
          title="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-200 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <span className="font-bold text-white tracking-tight">DevFlow AI</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-neutral-400 hidden sm:inline">production-monorepo</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 hidden sm:inline" />
          <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
            {getTabLabel()}
          </span>
        </div>
      </div>

      {/* Center: Global Search + Command Palette Trigger (Ctrl+K) */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-xs text-neutral-400 hover:text-neutral-200 transition shadow-inner"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="truncate">Search projects, files, tasks, deployments...</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-950 border border-neutral-800 rounded">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Controls: Health, Copilot, Judge Tour, Profile */}
      <div className="flex items-center gap-2.5">
        {/* System Health */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-neutral-400 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]" />
          <span>99.98% Health</span>
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
          title="Open Command Palette"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Copilot Toggle Button */}
        <button
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
            isCopilotOpen
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:border-neutral-700'
          }`}
          title="Toggle Contextual AI Copilot"
        >
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Ask Copilot</span>
        </button>

        {/* Judge Tour Modal Button */}
        <button
          onClick={() => setIsJudgeModalOpen(true)}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-500/30 flex items-center gap-1.5 transition"
          title="Judge Guided Tour"
        >
          <Award className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Tour</span>
        </button>

        {/* User Account / Profile */}
        <button
          onClick={() => setActiveTab('auth')}
          className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition"
          title={`Profile: ${currentUser?.name || 'Engineer'}`}
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
            {currentUser?.name?.[0] || 'U'}
          </div>
        </button>
      </div>
    </header>
  );
};
