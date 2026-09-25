import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Workflow,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Layers,
  Sparkles,
  Bot,
  Zap,
  Globe,
  ShieldCheck,
  Send,
  FileCode,
  Copy,
  Check,
  RefreshCw,
  GitPullRequest,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface AutomationNode {
  id: string;
  name: string;
  type: 'trigger' | 'agent' | 'condition' | 'action' | 'output';
  icon: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  durationMs?: number;
  inputPayload: string;
  outputPayload: string;
  description: string;
}

interface WorkflowRecipe {
  id: string;
  title: string;
  badge: string;
  sourceHub: string;
  description: string;
  triggerType: string;
  nodes: AutomationNode[];
}

const automationRecipes: WorkflowRecipe[] = [
  {
    id: 'pr-triage-remediation',
    title: 'Autonomous PR Triage & Remediation Pipeline',
    badge: 'Flagship Bob 2.0',
    sourceHub: 'N8N AI Workflow Hub / DevFlow Engine',
    description:
      'Triggered on GitHub PR open/update. Runs DocuMind Spec Guard against PRD PDFs, executes parallel AST code diffing, compiles patch in sandbox, and generates Jest tests.',
    triggerType: 'GitHub Webhook (pull_request.opened)',
    nodes: [
      {
        id: 'node-1',
        name: 'GitHub PR Webhook',
        type: 'trigger',
        icon: 'git',
        status: 'success',
        durationMs: 45,
        description: 'Receives webhook payload from GitHub/GitLab containing PR diff & branch ref.',
        inputPayload: JSON.stringify({ event: 'pull_request.opened', repo: 'acme/data-pipeline', pr_id: 142, author: 'sre-oncall', head_sha: '4f9b2a1' }, null, 2),
        outputPayload: JSON.stringify({ diff_url: 'https://api.github.com/repos/acme/data-pipeline/pulls/142', changed_files: 3, insertions: 24, deletions: 6 }, null, 2),
      },
      {
        id: 'node-2',
        name: 'DocuMind Spec Guard',
        type: 'agent',
        icon: 'rag',
        status: 'success',
        durationMs: 820,
        description: 'Extracts architecture boundaries from PRD PDFs and verifies OpenAPI RFC 7578 compliance.',
        inputPayload: JSON.stringify({ pdf_source: 'docs/ARCHITECTURE.md §4.2', spec_format: 'OpenAPI 3.1', target_symbols: ['validateUpload'] }, null, 2),
        outputPayload: JSON.stringify({ spec_drift: 0, compliance_score: 1.0, contract_matched: 'RFC 7578 §5.1 optional filename fallback' }, null, 2),
      },
      {
        id: 'node-3',
        name: 'Parallel Sentinel Code Review',
        type: 'agent',
        icon: 'bot',
        status: 'success',
        durationMs: 1140,
        description: 'Forks 3 concurrent workers (Security, Performance, Style) to audit AST delta.',
        inputPayload: JSON.stringify({ sentinels: ['SecuritySentinel', 'PerfSentinel', 'ArchSentinel'], target_ast: 'src/services/csvUploadService.ts' }, null, 2),
        outputPayload: JSON.stringify({ high_severity_cve: 0, memory_leak_risk: 'LOW', clean_code_passed: true }, null, 2),
      },
      {
        id: 'node-4',
        name: 'Auto-Remediation Sandbox',
        type: 'action',
        icon: 'cpu',
        status: 'success',
        durationMs: 1480,
        description: 'Spawns isolated MicroVM container, compiles TypeScript patch, and runs Jest test runner.',
        inputPayload: JSON.stringify({ container_image: 'node:22-alpine-sandbox', memory_mb: 512, command: 'npm test -- --coverage' }, null, 2),
        outputPayload: JSON.stringify({ compilation_exit_code: 0, tests_executed: 47, passed: 47, coverage_delta: '+14.4%' }, null, 2),
      },
      {
        id: 'node-5',
        name: 'Slack & GitHub Auto-Merge / Notification',
        type: 'output',
        icon: 'globe',
        status: 'success',
        durationMs: 110,
        description: 'Posts signed verification badge to PR #142 and notifies team in Slack #dev-alerts.',
        inputPayload: JSON.stringify({ pr_number: 142, readiness_score: 98, auto_approve: true, slack_channel: '#dev-alerts' }, null, 2),
        outputPayload: JSON.stringify({ pr_comment_id: 99421, slack_ts: '1727284920.00192', dispatch_status: 'DELIVERED' }, null, 2),
      },
    ],
  },
  {
    id: 'prd-spec-drift-sentinel',
    title: 'Continuous PRD & OpenAPI Spec Drift Sentinel',
    badge: 'Spec Guard RAG',
    sourceHub: 'N8N AI Hub #428',
    description:
      'Scheduled hourly cron that monitors Confluence, Notion, and Git repo PRDs. Detects architectural drift before breaking production contracts.',
    triggerType: 'Cron Schedule (0 * * * *)',
    nodes: [
      {
        id: 'drift-1',
        name: 'Hourly Spec Sync Trigger',
        type: 'trigger',
        icon: 'clock',
        status: 'success',
        durationMs: 20,
        description: 'Triggers scheduled check of repository docs vs upstream Confluence/PRD PDFs.',
        inputPayload: JSON.stringify({ schedule: '0 * * * *', tracked_documents: ['ARCHITECTURE.md', 'openapi.yaml'] }, null, 2),
        outputPayload: JSON.stringify({ docs_detected: 6, last_sync: '18:00:00 UTC' }, null, 2),
      },
      {
        id: 'drift-2',
        name: 'Milvus Vector Embedding RAG',
        type: 'agent',
        icon: 'rag',
        status: 'success',
        durationMs: 640,
        description: 'Generates chunk embeddings and compares against current git codebase AST symbols.',
        inputPayload: JSON.stringify({ chunk_size: 512, similarity_metric: 'cosine', model: 'ibm-granite-embedding-128m' }, null, 2),
        outputPayload: JSON.stringify({ vector_distance: 0.04, drift_flag: false, compliant_endpoints: 12 }, null, 2),
      },
      {
        id: 'drift-3',
        name: 'Compliance Gate & Audit Dispatcher',
        type: 'output',
        icon: 'shield',
        status: 'success',
        durationMs: 90,
        description: 'Signs zero-drift architectural compliance certificate.',
        inputPayload: JSON.stringify({ compliance_standard: 'Enterprise ISO 27001 / SOC2 Type II' }, null, 2),
        outputPayload: JSON.stringify({ status: 'CERTIFIED_ZERO_DRIFT', drift_percentage: '0.0%' }, null, 2),
      },
    ],
  },
  {
    id: 'p0-incident-responder',
    title: 'P0 Incident Auto-Responder & War Room',
    badge: 'Incident SRE',
    sourceHub: 'N8N AI Hub #1204',
    description:
      'Triggered when Datadog/PagerDuty fires a P0/P1 alert. Dispatches Log Agent to isolate error traces, Root Cause Agent to synthesize proof, and Fix Agent to craft emergency PR.',
    triggerType: 'PagerDuty Webhook (incident.triggered)',
    nodes: [
      {
        id: 'p0-1',
        name: 'PagerDuty Alert Webhook',
        type: 'trigger',
        icon: 'alert',
        status: 'success',
        durationMs: 35,
        description: 'Intercepts critical incident alert with APM correlation IDs.',
        inputPayload: JSON.stringify({ incident_id: 'INC-8891', severity: 'P0', service: 'data-pipeline', metric: '500_spike' }, null, 2),
        outputPayload: JSON.stringify({ error_rate_pct: 18.4, affected_tenants: 14, correlation_id: 'req_92fa801' }, null, 2),
      },
      {
        id: 'p0-2',
        name: 'Datadog / APM Trace Correlator',
        type: 'agent',
        icon: 'bot',
        status: 'success',
        durationMs: 910,
        description: 'Queries APM traces and isolates exact failing stack frame.',
        inputPayload: JSON.stringify({ query: 'service:data-pipeline status:error @error.type:TypeError' }, null, 2),
        outputPayload: JSON.stringify({ isolated_frame: 'csvUploadService.ts:42', matched_traces: 184 }, null, 2),
      },
      {
        id: 'p0-3',
        name: 'Causal Proof & Patch Generator',
        type: 'action',
        icon: 'cpu',
        status: 'success',
        durationMs: 1250,
        description: 'Synthesizes defensive UUID fallback patch and verifies in sandbox.',
        inputPayload: JSON.stringify({ target_file: 'src/services/csvUploadService.ts', rca_confidence: 0.96 }, null, 2),
        outputPayload: JSON.stringify({ patch_created: true, diff_summary: '+24 / -6 lines', tests_passing: '47/47' }, null, 2),
      },
      {
        id: 'p0-4',
        name: 'Canary Deployment Trigger',
        type: 'output',
        icon: 'globe',
        status: 'success',
        durationMs: 140,
        description: 'Promotes verified fix to canary cluster at 5% traffic weight.',
        inputPayload: JSON.stringify({ canary_target: 'canary.internal.cluster.local', traffic_weight: 0.05 }, null, 2),
        outputPayload: JSON.stringify({ deploy_status: 'SUCCESS', rollback_hook: 'ACTIVE' }, null, 2),
      },
    ],
  },
  {
    id: 'cve-auto-remediation',
    title: 'Autonomous Dependency CVE Auto-Patch',
    badge: 'Security SAST',
    sourceHub: 'N8N AI Hub #892',
    description:
      'Integrates with National Vulnerability Database (NVD) public APIs. Detects transitive CVEs, checks AST call impact, and auto-bumps dependency in sandbox.',
    triggerType: 'NVD / OSV Public API Alert',
    nodes: [
      {
        id: 'cve-1',
        name: 'NVD Public API Webhook',
        type: 'trigger',
        icon: 'globe',
        status: 'success',
        durationMs: 65,
        description: 'Monitors CVE database for packages present in package.json.',
        inputPayload: JSON.stringify({ ecosystem: 'npm', package: 'fast-csv', advisory_id: 'GHSA-vulnerability-check' }, null, 2),
        outputPayload: JSON.stringify({ vulnerability: 'NONE_DETECTED_IN_PATCHED_RANGE', status: 'CLEAN' }, null, 2),
      },
      {
        id: 'cve-2',
        name: 'AST Reachability Analyzer',
        type: 'agent',
        icon: 'rag',
        status: 'success',
        durationMs: 780,
        description: 'Traverses AST to determine if vulnerable method is reachable in codebase.',
        inputPayload: JSON.stringify({ target_symbol: 'parseStream', callers_detected: 2 }, null, 2),
        outputPayload: JSON.stringify({ is_reachable: false, risk_adjusted_severity: 'LOW' }, null, 2),
      },
      {
        id: 'cve-3',
        name: 'Container Build & Security Gate',
        type: 'output',
        icon: 'shield',
        status: 'success',
        durationMs: 820,
        description: 'Verifies all 8 security gates pass with zero regressions.',
        inputPayload: JSON.stringify({ gates_to_evaluate: 8 }, null, 2),
        outputPayload: JSON.stringify({ passed_gates: 8, gate_result: 'PASS' }, null, 2),
      },
    ],
  },
];

export const AutomationHubView: React.FC = () => {
  const { setActiveTab } = useWorkflow();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('pr-triage-remediation');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-2');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const activeRecipe =
    automationRecipes.find((r) => r.id === selectedRecipeId) || automationRecipes[0];
  const activeNode =
    activeRecipe.nodes.find((n) => n.id === selectedNodeId) || activeRecipe.nodes[0];

  const handleRunAutomation = () => {
    setIsSimulating(true);
    setSimulationLogs([
      `[${new Date().toISOString().substring(11, 19)}] [INIT] Triggering automation: "${activeRecipe.title}"`,
      `[${new Date().toISOString().substring(11, 19)}] [ORCHESTRATOR] Initializing IBM Bob 2.0 Agent Mode runtime...`,
    ]);

    activeRecipe.nodes.forEach((node, index) => {
      setTimeout(() => {
        setSimulationLogs((prev) => [
          ...prev,
          `[${new Date().toISOString().substring(11, 19)}] [EXEC] Node [${node.name}] completed in ${node.durationMs || 350}ms -> STATUS: 200 OK`,
        ]);
        if (index === activeRecipe.nodes.length - 1) {
          setTimeout(() => {
            setSimulationLogs((prev) => [
              ...prev,
              `[${new Date().toISOString().substring(11, 19)}] [SUCCESS] Pipeline execution finished with 0 errors. Audit manifest signed.`,
            ]);
            setIsSimulating(false);
          }, 400);
        }
      }, (index + 1) * 600);
    });
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activeRecipe, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-cyber p-6 relative overflow-hidden bg-gradient-to-r from-[#071522] via-[#0A1B2D] to-[#0D2135] border border-[rgba(34,211,238,0.25)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/40 font-semibold">
                AI WORKFLOW HUB · 2,000+ WORKFLOWS INDEXED
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                N8N COMPATIBLE AGENTS
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Workflow className="w-8 h-8 text-fuchsia-400" />
              <span>Autonomous Workflow Studio</span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Orchestrate end-to-end multi-agent developer workflows inspired by modern N8N automation pipelines.
              Connects GitHub webhooks, DocuMind spec verification, AST diff workers, sandboxed test containers, and auto-merge release gates.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyJson}
              className="btn-cyber-secondary text-xs flex items-center gap-1.5"
              title="Copy Workflow Definition as N8N JSON"
            >
              {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedPayload ? 'Copied JSON!' : 'Export Workflow JSON'}</span>
            </button>
            <button
              onClick={handleRunAutomation}
              disabled={isSimulating}
              className="btn-cyber-primary text-xs flex items-center gap-2"
            >
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin text-[#06111F]" /> : <Play className="w-4 h-4 fill-[#06111F]" />}
              <span>{isSimulating ? 'Executing Workflow...' : 'Execute Automation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {automationRecipes.map((recipe) => {
          const isSelected = recipe.id === selectedRecipeId;
          return (
            <div
              key={recipe.id}
              onClick={() => {
                setSelectedRecipeId(recipe.id);
                setSelectedNodeId(recipe.nodes[0].id);
              }}
              className={`card-cyber p-4 cursor-pointer transition-all border ${
                isSelected
                  ? 'border-fuchsia-500/60 bg-gradient-to-br from-fuchsia-950/30 to-[#0A1B2D] shadow-lg shadow-fuchsia-500/10'
                  : 'hover:border-slate-600 hover:bg-[#081827]/70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#06111F] text-fuchsia-300 border border-fuchsia-500/30">
                  {recipe.badge}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{recipe.nodes.length} Nodes</span>
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1 mb-1">{recipe.title}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                {recipe.description}
              </p>
              <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <span>Trigger:</span>
                <span className="text-slate-300 truncate">{recipe.triggerType}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Workflow DAG Canvas */}
      <div className="card-cyber p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(148,163,184,0.15)] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-pulse shadow-[0_0_8px_#E879F9]" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Interactive Execution DAG: {activeRecipe.title}
            </h2>
          </div>
          <span className="text-[11px] text-[#94A3B8] font-mono">
            Click any node below to inspect real-time payloads & agent parameters
          </span>
        </div>

        {/* Nodes Flow Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 px-2 bg-[#06111F]/80 rounded-xl border border-[rgba(148,163,184,0.15)]">
          {activeRecipe.nodes.map((node, index) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`min-w-[200px] p-3.5 rounded-xl border cursor-pointer transition-all relative ${
                    isSelected
                      ? 'border-fuchsia-500 bg-fuchsia-950/40 shadow-lg shadow-fuchsia-500/20'
                      : 'border-[rgba(148,163,184,0.2)] bg-[#071522] hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                        node.type === 'trigger'
                          ? 'bg-amber-950 text-amber-300 border border-amber-600/30'
                          : node.type === 'agent'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/30'
                          : node.type === 'action'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-600/30'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-600/30'
                      }`}
                    >
                      {node.type}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {node.durationMs}ms
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1 truncate">{node.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                    {node.description}
                  </p>
                </div>

                {index < activeRecipe.nodes.length - 1 && (
                  <div className="shrink-0 flex items-center justify-center text-fuchsia-400/60 px-1">
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Node Inspector & Payloads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          {/* Left: Selected Node Overview */}
          <div className="lg:col-span-4 bg-[#071522] border border-[rgba(148,163,184,0.15)] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.1)] pb-2">
              <span className="text-xs font-mono font-bold text-cyan-300">NODE PARAMETERS</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">{activeNode.type}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{activeNode.name}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeNode.description}</p>
            </div>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800 font-mono text-[11px]">
                <span className="text-slate-400">Execution Runtime:</span>
                <span className="text-cyan-400">IBM Bob 2.0 Subagent</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 font-mono text-[11px]">
                <span className="text-slate-400">Execution Duration:</span>
                <span className="text-emerald-400">{activeNode.durationMs} ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 font-mono text-[11px]">
                <span className="text-slate-400">Retry Policy:</span>
                <span className="text-slate-300">Exponential Backoff (x3)</span>
              </div>
              <div className="flex justify-between py-1 font-mono text-[11px]">
                <span className="text-slate-400">Sandbox Isolation:</span>
                <span className="text-emerald-400">MicroVM Enforced</span>
              </div>
            </div>
          </div>

          {/* Right: Input & Output JSON Payloads */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Payload */}
            <div className="bg-[#06111F] border border-[rgba(148,163,184,0.15)] rounded-xl overflow-hidden flex flex-col">
              <div className="bg-[#0A1B2D] px-3 py-2 border-b border-[rgba(148,163,184,0.15)] flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  INPUT PAYLOAD (JSON)
                </span>
                <span className="text-[10px] text-slate-400">Incoming Event</span>
              </div>
              <pre className="p-3 text-[11px] font-mono text-amber-200/90 overflow-x-auto flex-1 max-h-56 leading-relaxed">
                {activeNode.inputPayload}
              </pre>
            </div>

            {/* Output Payload */}
            <div className="bg-[#06111F] border border-[rgba(148,163,184,0.15)] rounded-xl overflow-hidden flex flex-col">
              <div className="bg-[#0A1B2D] px-3 py-2 border-b border-[rgba(148,163,184,0.15)] flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  OUTPUT ARTIFACT (JSON)
                </span>
                <span className="text-[10px] text-slate-400">Synthesized Result</span>
              </div>
              <pre className="p-3 text-[11px] font-mono text-emerald-200/90 overflow-x-auto flex-1 max-h-56 leading-relaxed">
                {activeNode.outputPayload}
              </pre>
            </div>
          </div>
        </div>

        {/* Live Execution Logs Terminal */}
        {simulationLogs.length > 0 && (
          <div className="bg-[#06111F] border border-[rgba(148,163,184,0.15)] rounded-xl overflow-hidden mt-4">
            <div className="bg-[#0A1B2D] px-4 py-2 border-b border-[rgba(148,163,184,0.15)] flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>LIVE AUTOMATION DISPATCH LOGS</span>
              </span>
              <button
                onClick={() => setSimulationLogs([])}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Clear Logs
              </button>
            </div>
            <div className="p-3 text-[11px] font-mono space-y-1 max-h-40 overflow-y-auto">
              {simulationLogs.map((log, i) => (
                <div key={i} className="text-slate-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
