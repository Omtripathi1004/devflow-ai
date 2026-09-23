import React, { useState } from 'react';
import { useWorkflow, NavigationTab } from '../context/WorkflowContext';
import {
  X,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  Play,
  FileCode,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';

interface TourStep {
  stepNumber: number;
  title: string;
  tab: NavigationTab;
  headline: string;
  description: string;
  keyHighlights: string[];
  actionLabel?: string;
  onAction?: () => void;
}

export const JudgeTourModal: React.FC = () => {
  const {
    isJudgeModalOpen,
    setIsJudgeModalOpen,
    setActiveTab,
    startDemoWorkflow,
    approvePatch,
    approveRelease,
  } = useWorkflow();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: TourStep[] = [
    {
      stepNumber: 1,
      title: 'Problem Statement & Architecture',
      tab: 'overview',
      headline: 'Autonomous Software Maintenance vs. Generic Chatbots',
      description:
        'DevFlow AI implements IBM Bob 2.0 multi-agent patterns for complex developer workflows. Rather than asking a developer to copy-paste code back and forth, DevFlow coordinates specialized autonomous subagents to ingest issues, analyze code/AST, trace logs, verify specifications, generate patches, run regression tests, and enforce release gates.',
      keyHighlights: [
        'End-to-end autonomous pipeline from Bug Intake to Release Candidate',
        'Multi-agent parallel investigation branches (Repository, Log, Doc agents)',
        'Human-in-the-loop approval gates before code modifications & release deployments',
      ],
      actionLabel: 'View Overview KPIs',
    },
    {
      stepNumber: 2,
      title: 'Start Demo & Ingest BUG-142',
      tab: 'issues',
      headline: 'Real-world P0 Issue: CSV Upload Intermittently Fails',
      description:
        'A high-severity production issue is ingested with real stack traces: unhandled TypeError when clients upload multipart CSVs without filename parameters.',
      keyHighlights: [
        'Reproducible failure vector in Data Pipeline Service',
        'Raw stack trace pointing to csvUploadService.ts:42',
        'Affects 14 enterprise tenants and automated ETL ingestion jobs',
      ],
      actionLabel: 'Trigger Autonomous Workflow',
      onAction: () => startDemoWorkflow(),
    },
    {
      stepNumber: 3,
      title: 'Workflow Orchestration Graph',
      tab: 'workflows',
      headline: 'Visual Dependency Graph with Parallel Execution',
      description:
        'Notice how the workflow graph branches after Issue Intake. Repository Agent, Log Agent, and Documentation Agent execute concurrently in parallel before synthesizing findings at Root Cause.',
      keyHighlights: [
        'Parallel execution reduces investigation time by 78%',
        'Visual node states: queued, running, completed, failed',
        'Includes pause, resume, single-stage retry, and failure injection',
      ],
    },
    {
      stepNumber: 4,
      title: 'Agent Mode & Specialized Subagents',
      tab: 'agents',
      headline: '9 Specialized Subagents with Explicit Reasoning',
      description:
        'Each agent has a dedicated role, input, output, duration, and inspectable reasoning summary. Click any agent to inspect its actions performed and generated artifacts.',
      keyHighlights: [
        'No hidden chain-of-thought: inspectable reasoning summary',
        'Discrete artifact outputs linked directly across workspaces',
        'Live execution telemetry and time tracking',
      ],
    },
    {
      stepNumber: 5,
      title: 'Multi-Modal Document Understanding',
      tab: 'documents',
      headline: 'Extracting Requirements from Architecture & Specs',
      description:
        'Documentation Agent analyzed README.md, ARCHITECTURE.md, and OpenAPI 3.1 specifications to discover that filename fallback is an explicit architectural SLA requirement.',
      keyHighlights: [
        'Discovers RFC 7578 multipart compliance rules',
        'Cross-references OpenAPI spec against runtime error logs',
        'Evidence links point directly back to source documents',
      ],
    },
    {
      stepNumber: 6,
      title: 'Evidence-Based Root Cause Analysis',
      tab: 'root_cause',
      headline: 'Synthesizing Logs, Code AST, and Spec into Causal Proof',
      description:
        'Root Cause Agent generated a 96% confidence causal diagnosis with alternative hypotheses evaluation (ruling out memory leaks and delimiter corruption).',
      keyHighlights: [
        'Strict separation between observed evidence and AI inference',
        'Interactive causal dependency chain from client request to TypeError',
        'Disproved alternative hypotheses with APM metrics',
      ],
    },
    {
      stepNumber: 7,
      title: 'Code Change Center (Git Diff)',
      tab: 'code_changes',
      headline: 'High-Quality Defensive Patch with Human Approval Gate',
      description:
        'Fix Agent generated a non-breaking patch (+24 / -6 lines) with crypto.randomUUID() fallback, path traversal sanitization, and MIME-type verification.',
      keyHighlights: [
        'Interactive side-by-side or unified Git-style diff viewer',
        'Human-in-the-loop signoff button (developer retains ultimate control)',
        'Zero architectural regression with complete rollback plan',
      ],
      actionLabel: 'Sign Off Patch (Human Approval)',
      onAction: () => approvePatch(),
    },
    {
      stepNumber: 8,
      title: 'Automated Test Center & Regression Suite',
      tab: 'tests',
      headline: '42 Baseline Tests + 5 New Synthetic Regression Tests',
      description:
        'Test Agent executed the test suite, verified all 42 preexisting tests passed, and added 5 new regression tests targeting the reproduction vector. Coverage jumped from 74.2% to 88.6%.',
      keyHighlights: [
        '47/47 passing tests with terminal command output logs',
        'Interactive test failure simulator demonstrating single-stage retry',
        'Line & branch coverage delta visualization',
      ],
    },
    {
      stepNumber: 9,
      title: 'AI Code Review (7 Categories)',
      tab: 'review',
      headline: 'Comprehensive Enterprise Quality Scorecard',
      description:
        'Review Agent evaluated the patch across Correctness, Maintainability, Security, Performance, Compatibility, Style, and Test Coverage.',
      keyHighlights: [
        'Severity-ranked findings with line coordinate references',
        'Suggested diff fixes with 1-click human approval toggle',
        'Security & performance validations prior to staging',
      ],
    },
    {
      stepNumber: 10,
      title: 'Security & Quality Gate',
      tab: 'security',
      headline: '8 Comprehensive Release Gates (All Passed)',
      description:
        'Security Agent conducted SAST, secret scanning, dependency vulnerability audit, and AST pattern matching. 0 secrets and 0 High/Critical CVEs detected.',
      keyHighlights: [
        'Gates: Tests, Lint, Dependencies, Secrets, AST, API, Docs, Deployment',
        'Pass/Warn/Fail status indicators',
        'Clear simulation badges denoting mock sandbox execution',
      ],
    },
    {
      stepNumber: 11,
      title: 'Release Center & Before/After Benchmarks',
      tab: 'benchmarks',
      headline: '84% Reduction in Time-to-Resolution (164 Mins Saved)',
      description:
        'Inspect the measurable productivity impact: Manual workflow of 195 minutes reduced to 31 minutes with DevFlow AI. Plus exportable audit reports for enterprise compliance.',
      keyHighlights: [
        '195 min manual vs 31 min DevFlow = 164 minutes saved (84% reduction)',
        'Release Candidate v2.4.1-rc.1 ready with automated Release Notes',
        'Exportable JSON & Markdown audit compliance manifest',
      ],
      actionLabel: 'Approve Canary Release',
      onAction: () => approveRelease(),
    },
  ];

  if (!isJudgeModalOpen) return null;

  const currentStep = steps[currentStepIndex];

  const handleGoToStep = (index: number) => {
    setCurrentStepIndex(index);
    setActiveTab(steps[index].tab);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      handleGoToStep(currentStepIndex + 1);
    } else {
      setIsJudgeModalOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      handleGoToStep(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#071522] border border-[rgba(34,211,238,0.35)] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-cyan-950/80 via-[#0A1B2D] to-blue-950/80 border-b border-[rgba(148,163,184,0.15)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Judge Guided Demo Tour
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                  Step {currentStep.stepNumber} of {steps.length}
                </span>
              </h2>
              <p className="text-xs text-[#94A3B8]">
                11-Step Evaluation Journey according to the specification prompt
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsJudgeModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0D2135] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Step Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Progress dots bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[rgba(148,163,184,0.15)]">
            {steps.map((s, idx) => (
              <button
                key={s.stepNumber}
                onClick={() => handleGoToStep(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all flex items-center gap-1 ${
                  idx === currentStepIndex
                    ? 'bg-cyan-500 text-[#06111F] font-bold shadow-md shadow-cyan-500/20'
                    : idx < currentStepIndex
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : 'bg-[#0D2135] text-[#94A3B8] hover:bg-[#102A43]'
                }`}
              >
                <span>{s.stepNumber}.</span>
                <span className="hidden sm:inline">{s.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Current Step Title & Headline */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Evaluation Checkpoint {currentStep.stepNumber}
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">{currentStep.headline}</h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Key Highlights list */}
          <div className="bg-[#0D2135] p-4 rounded-xl border border-[rgba(148,163,184,0.15)] space-y-2">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block font-mono">
              Key Architecture & Functional Proof Points:
            </span>
            <ul className="space-y-1.5">
              {currentStep.keyHighlights.map((hl, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contextual Action Button if available */}
          {currentStep.actionLabel && (
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
              <span className="text-xs text-cyan-200 font-mono">
                Interactive action for this checkpoint:
              </span>
              <button
                onClick={() => {
                  if (currentStep.onAction) currentStep.onAction();
                  setActiveTab(currentStep.tab);
                  setIsJudgeModalOpen(false);
                }}
                className="btn-cyber-primary text-xs flex items-center gap-1.5 shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentStep.actionLabel}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-[#0A1B2D]/80 border-t border-[rgba(148,163,184,0.15)] flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="btn-cyber-secondary text-xs flex items-center gap-1 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab(currentStep.tab);
                setIsJudgeModalOpen(false);
              }}
              className="px-3.5 py-1.5 rounded-lg border border-[rgba(148,163,184,0.2)] hover:bg-[#0D2135] text-slate-300 text-xs transition-colors"
            >
              Jump to Section
            </button>

            <button
              onClick={handleNext}
              className="btn-cyber-primary text-xs flex items-center gap-1.5"
            >
              <span>{currentStepIndex === steps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
