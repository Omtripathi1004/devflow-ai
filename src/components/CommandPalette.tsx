import React, { useState, useEffect, useRef } from 'react';
import { useWorkflow, NavigationTab } from '../context/WorkflowContext';
import {
  Search,
  Command,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FolderTree,
  Cpu,
  Settings,
  Layers,
  FlaskConical,
  CheckSquare,
  Bot,
  PackageCheck,
  Zap,
  TrendingDown,
  X,
  FileCode2,
  AlertCircle
} from 'lucide-react';

interface PaletteItem {
  id: string;
  title: string;
  category: 'Commands' | 'Navigation' | 'Security & Tests' | 'Codebase';
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
  description?: string;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    setIsFolderModalOpen,
    setIsCopilotOpen,
    startDemoWorkflow,
    workflowStatus
  } = useWorkflow();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const items: PaletteItem[] = [
    // Commands
    {
      id: 'cmd-new-task',
      title: 'Create New Development Task',
      category: 'Commands',
      icon: Zap,
      shortcut: 'N',
      description: 'Intake a new repository, issue, or prompt workflow',
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsFolderModalOpen(true);
      }
    },
    {
      id: 'cmd-run-workflow',
      title: 'Run Autonomous Triage & Pipeline',
      category: 'Commands',
      icon: Sparkles,
      shortcut: 'R',
      description: 'Trigger 9-agent autonomous incident resolution',
      action: () => {
        setIsCommandPaletteOpen(false);
        startDemoWorkflow();
      }
    },
    {
      id: 'cmd-ask-copilot',
      title: 'Ask DevFlow AI Assistant',
      category: 'Commands',
      icon: Bot,
      shortcut: 'A',
      description: 'Open persistent contextual engineering copilot',
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsCopilotOpen(true);
      }
    },

    // Navigation
    {
      id: 'nav-overview',
      title: 'Open Global Dashboard',
      category: 'Navigation',
      icon: Layers,
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab('overview');
      }
    },
    {
      id: 'nav-pipeline',
      title: 'Open Autonomous Development Pipeline',
      category: 'Navigation',
      icon: Layers,
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab('workflows');
      }
    },
    {
      id: 'nav-projects',
      title: 'Open Project Progress Radar',
      category: 'Navigation',
      icon: Cpu,
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab('project_progress');
      }
    },
    {
      id: 'nav-architecture',
      title: 'Open Architecture Simulator (10k PR/s)',
      category: 'Navigation',
      icon: Cpu,
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab('system_design');
      }
    },
    {
      id: 'nav-settings',
      title: 'Open System Settings',
      category: 'Navigation',
      icon: Settings,
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab('settings');
      }
    },

    // Security & Tests
    {
      id: 'cmd-sec-scan',
      title: 'Run Security Gate Audit (8/8 Checks)',
      category: 'Security & Tests',
      icon: ShieldCheck,
      description: 'Check dependencies, secrets, and AST race conditions',
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab('security');
      }
    },
    {
      id: 'cmd-test-suite',
      title: 'Run Autonomous Test Suite',
      category: 'Security & Tests',
      icon: FlaskConical,
      description: 'Validate 48/48 test suites and test runner',
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab('tests');
      }
    },
    {
      id: 'cmd-code-review',
      title: 'Inspect Parallel Sentinel Code Review',
      category: 'Security & Tests',
      icon: CheckSquare,
      description: 'Tri-sentinel peer review findings and diff approvals',
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab('review');
      }
    },

    // Codebase
    {
      id: 'code-files',
      title: 'Explore Repository Files & AST',
      category: 'Codebase',
      icon: FolderTree,
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab('repository');
      }
    },
    {
      id: 'code-documind',
      title: 'DocuMind RAG Specification Guard',
      category: 'Codebase',
      icon: FileCode2,
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab('documents');
      }
    },
    {
      id: 'code-benchmarks',
      title: 'Empirical ROI Benchmarks (-84% Cycle)',
      category: 'Codebase',
      icon: TrendingDown,
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab('benchmarks');
      }
    }
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col focus:outline-none"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-800 gap-3 bg-neutral-950">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search (Projects, Files, Tests, Deployments, Agents)..."
            className="w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 rounded">
            ESC
          </kbd>
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-400">
              No matching commands or resources found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-300 hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-medium text-neutral-200 flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                          {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-neutral-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint Bar */}
        <div className="px-4 py-2 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-emerald-400">DevFlow 9.5/10 Quick Action Engine</span>
        </div>
      </div>
    </div>
  );
};
