import React from 'react';
import { useWorkflow, NavigationTab } from '../context/WorkflowContext';
import {
  LayoutDashboard,
  GitFork,
  AlertCircle,
  Bot,
  FolderTree,
  FileText,
  SearchCode,
  GitCompare,
  FlaskConical,
  CheckSquare,
  ShieldCheck,
  PackageCheck,
  TrendingUp,
  Activity,
  Settings,
  ChevronRight,
  Zap,
  Workflow,
  Sparkles,
  Cpu,
  Globe,
  X,
  Gauge,
  MessageSquare,
  Users,
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string | number;
  badgeColor?: string;
  category: 'core' | 'investigation' | 'validation' | 'ecosystem';
}

const navItems: NavItem[] = [
  // Core Orchestration
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, category: 'core' },
  { id: 'antigravity', label: 'Anti-Gravity Engine', icon: Zap, badge: '9.5/10 Spec', badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40', category: 'core' },
  { id: 'project_progress', label: 'Project Progress Radar', icon: Gauge, badge: '96% Ready', badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40', category: 'core' },
  { id: 'gemini_chat', label: 'Gemini 2.5 Flash Chat', icon: MessageSquare, badge: 'Multi-Day', badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40', category: 'core' },
  { id: 'workflows', label: 'Workflow Graph', icon: GitFork, badge: 'Live', badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40', category: 'core' },
  { id: 'automation', label: 'Automation Hub', icon: Workflow, badge: '2000+ Hub', badgeColor: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-500/40', category: 'core' },
  { id: 'copilot', label: 'AI Copilot & Models', icon: Sparkles, badge: 'Granite 34B', badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-500/40', category: 'core' },
  { id: 'agents', label: 'Agent Orchestration', icon: Bot, badge: '9 Agents', badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-500/40', category: 'core' },
  { id: 'issues', label: 'Issues Triage', icon: AlertCircle, badge: 'BUG-142', badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-500/40', category: 'core' },

  // Investigation & RAG
  { id: 'repository', label: 'Repository Explorer', icon: FolderTree, category: 'investigation' },
  { id: 'documents', label: 'DocuMind Spec Guard', icon: FileText, badge: 'RAG Spec', badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40', category: 'investigation' },
  { id: 'root_cause', label: 'Root Cause Engine', icon: SearchCode, badge: '96% Proof', badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/40', category: 'investigation' },

  // Validation & Sandbox
  { id: 'code_changes', label: 'Code Changes & Sandbox', icon: GitCompare, badge: '+24 -6', badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40', category: 'validation' },
  { id: 'tests', label: 'Autonomous Test Suite', icon: FlaskConical, badge: '47/47', badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40', category: 'validation' },
  { id: 'review', label: 'Parallel Sentinel Review', icon: CheckSquare, badge: '3 Sentinels', badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40', category: 'validation' },
  { id: 'security', label: 'Security Gate', icon: ShieldCheck, badge: '8/8 PASS', badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40', category: 'validation' },

  // Architecture & Ecosystem
  { id: 'system_design', label: 'System Architecture', icon: Cpu, badge: '10k PR/s', badgeColor: 'bg-sky-950/80 text-sky-300 border-sky-500/40', category: 'ecosystem' },
  { id: 'public_apis', label: 'Public APIs Hub', icon: Globe, badge: 'Live', badgeColor: 'bg-teal-950/80 text-teal-300 border-teal-500/40', category: 'ecosystem' },
  { id: 'release', label: 'Release Center', icon: PackageCheck, badge: 'v2.4.1', badgeColor: 'bg-teal-950/80 text-teal-300 border-teal-500/40', category: 'ecosystem' },
  { id: 'benchmarks', label: 'Benchmarks & ROI', icon: TrendingUp, badge: '-84% Time', badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-500/40', category: 'ecosystem' },
  { id: 'activity', label: 'Live Activity', icon: Activity, category: 'ecosystem' },
  { id: 'auth', label: 'User Account & Sessions', icon: Users, badge: 'Active', badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-500/40', category: 'ecosystem' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'ecosystem' },
];

export const SidebarNav: React.FC = () => {
  const { activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen } = useWorkflow();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`w-72 sm:w-64 bg-[#071522] border-r border-[rgba(148,163,184,0.15)] flex flex-col shrink-0 overflow-y-auto select-none transition-all duration-300 z-50 ${
          isMobileMenuOpen
            ? 'fixed inset-y-0 left-0 shadow-2xl flex'
            : 'hidden lg:flex'
        }`}
      >
        <div className="p-3 text-[11px] font-mono font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center justify-between border-b border-[rgba(148,163,184,0.1)]">
          <div className="flex items-center gap-2">
            <span>Control Navigation</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>
          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-2.5 space-y-1 pb-6 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-[rgba(34,211,238,0.15)] to-[rgba(59,130,246,0.08)] text-cyan-300 border border-[rgba(34,211,238,0.35)] shadow-md shadow-cyan-500/5'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#0D2135]/60 border border-transparent'
              }`}
            >
              {/* Left active glow bar */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
              )}

              <div className="flex items-center gap-2.5 truncate pl-1">
                <Icon
                  size={16}
                  className={`transition-colors shrink-0 ${
                    isActive ? 'text-cyan-400' : 'text-[#94A3B8] group-hover:text-cyan-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      item.badgeColor || 'bg-[#0D2135] text-[#94A3B8] border-[rgba(148,163,184,0.15)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Control Room Footer Footnote */}
      <div className="p-3 border-t border-[rgba(148,163,184,0.15)] bg-[#06111F]/80">
        <div className="text-[11px] font-mono text-[#94A3B8] flex items-center justify-between mb-1">
          <span>Engine Status</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        </div>
        <div className="text-[10px] text-slate-500 leading-tight">
          IBM Bob 2.0 Autonomous DevOps Console.
        </div>
      </div>
    </aside>
    </>
  );
};
