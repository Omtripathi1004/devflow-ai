import React from 'react';
import { useWorkflow, NavigationTab } from '../context/WorkflowContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare2,
  GitFork,
  Bot,
  FolderTree,
  Cpu,
  FileCode2,
  FlaskConical,
  CheckSquare,
  ShieldCheck,
  PackageCheck,
  Activity,
  Users,
  Workflow,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  Layers,
  X
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'BUILD',
    items: [
      { id: 'project_progress', label: 'Projects', icon: FolderKanban, badge: 'Active', badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' },
      { id: 'issues', label: 'Tasks', icon: CheckSquare2, badge: 'BUG-142', badgeColor: 'bg-amber-950 text-amber-300 border-amber-500/40' },
      { id: 'workflows', label: 'Pipelines', icon: GitFork, badge: 'Autonomous', badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40' },
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'copilot', label: 'AI Copilot', icon: Bot, badge: 'Contextual', badgeColor: 'bg-purple-950 text-purple-300 border-purple-500/40' },
      { id: 'repository', label: 'Codebase', icon: FolderTree },
      { id: 'system_design', label: 'Architecture', icon: Cpu, badge: '10k PR/s', badgeColor: 'bg-sky-950 text-sky-300 border-sky-500/40' },
      { id: 'documents', label: 'Insights (DocuMind)', icon: FileCode2, badge: 'RAG Spec', badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' },
    ]
  },
  {
    title: 'QUALITY',
    items: [
      { id: 'tests', label: 'Tests', icon: FlaskConical, badge: '8/8 PASS', badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' },
      { id: 'review', label: 'Code Review', icon: CheckSquare, badge: 'Sentinels', badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-500/40' },
      { id: 'security', label: 'Security', icon: ShieldCheck, badge: 'Verified', badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'release', label: 'Deployments', icon: PackageCheck, badge: 'v2.4.1', badgeColor: 'bg-teal-950 text-teal-300 border-teal-500/40' },
      { id: 'antigravity', label: 'Monitoring', icon: Zap, badge: 'BullMQ', badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' },
      { id: 'activity', label: 'Activity', icon: Activity },
    ]
  },
  {
    title: 'WORKSPACE',
    items: [
      { id: 'auth', label: 'Team', icon: Users },
      { id: 'automation', label: 'Integrations', icon: Workflow, badge: '2000+', badgeColor: 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500/40' },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  }
];

export const SidebarNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    sidebarCollapsed,
    setSidebarCollapsed
  } = useWorkflow();

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`bg-neutral-950 border-r border-neutral-800/80 flex flex-col shrink-0 select-none transition-all duration-200 z-40 ${
          isMobileMenuOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl flex'
            : 'hidden lg:flex'
        } ${sidebarCollapsed ? 'lg:w-[70px]' : 'lg:w-64'}`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between">
          <div
            onClick={() => handleNavClick('overview')}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <span className="font-bold text-sm tracking-tight text-white block">DEVFLOW AI</span>
                <span className="text-[10px] font-mono text-neutral-400 block -mt-0.5">Control Center</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {/* Top-Level: Overview */}
          <div>
            <button
              onClick={() => handleNavClick('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
              title="Overview"
            >
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-emerald-400' : 'text-neutral-400'}`} />
              {!sidebarCollapsed && <span>Overview</span>}
            </button>
          </div>

          {/* Categorized Sections */}
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                          item.badgeColor || 'bg-neutral-900 text-neutral-400 border-neutral-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: System Status */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/80">
          {!sidebarCollapsed ? (
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] font-mono space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">System Health:</span>
                <span className="text-emerald-400 font-bold">99.98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Worker Latency:</span>
                <span className="text-neutral-200">32ms</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="System Health: 99.98% Operational">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
