import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Sparkles,
  Bot,
  Send,
  Cpu,
  Layers,
  CheckCircle2,
  Terminal,
  Zap,
  Copy,
  Check,
  ShieldCheck,
  FileCode,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  HelpCircle,
  Code2,
} from 'lucide-react';

interface LLMModel {
  id: string;
  name: string;
  provider: string;
  role: string;
  contextWindow: string;
  latencyMs: number;
  hallucinationRate: string;
  specScore: string;
  status: 'ACTIVE' | 'STANDBY';
  description: string;
}

const llmModels: LLMModel[] = [
  {
    id: 'granite-34b-code',
    name: 'IBM Granite 3.0 Code 34B',
    provider: 'IBM Bob 2.0 / Watsonx',
    role: 'Primary AST & Code Patch Synthesizer',
    contextWindow: '128k Tokens',
    latencyMs: 380,
    hallucinationRate: '< 0.3%',
    specScore: '99.4%',
    status: 'ACTIVE',
    description:
      'Enterprise-grade foundation model optimized for full-repository AST navigation, precise refactoring, and zero-hallucination patch generation.',
  },
  {
    id: 'granite-8b-instruct',
    name: 'IBM Granite 3.0 8B Instruct',
    provider: 'IBM Watsonx',
    role: 'High-Throughput Test Generator',
    contextWindow: '64k Tokens',
    latencyMs: 140,
    hallucinationRate: '< 0.8%',
    specScore: '97.2%',
    status: 'STANDBY',
    description:
      'Ultra-fast model dedicated to synthesizing unit & regression suites in Jest, Vitest, and Playwright concurrently.',
  },
  {
    id: 'claude-35-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    role: 'Multi-Modal PRD Document & RAG Engine',
    contextWindow: '200k Tokens',
    latencyMs: 620,
    hallucinationRate: '< 0.6%',
    specScore: '98.9%',
    status: 'STANDBY',
    description:
      'Excels at parsing dense enterprise PDF architecture documents, OpenAPI 3.1 contracts, and detecting architectural spec drift.',
  },
  {
    id: 'llama-33-70b',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Meta / vLLM',
    role: 'Security Sentinel & Compliance Gate',
    contextWindow: '128k Tokens',
    latencyMs: 510,
    hallucinationRate: '< 0.9%',
    specScore: '96.5%',
    status: 'STANDBY',
    description:
      'Performs deep static vulnerability pattern analysis, OWASP Top 10 checks, and secret leak verification.',
  },
  {
    id: 'deepseek-coder-v2',
    name: 'DeepSeek Coder V2',
    provider: 'DeepSeek',
    role: 'Fast Syntax & Diff Triage',
    contextWindow: '128k Tokens',
    latencyMs: 290,
    hallucinationRate: '< 1.1%',
    specScore: '95.8%',
    status: 'STANDBY',
    description:
      'Cost-efficient initial AST parser for high-frequency commit streams and instant syntax triage.',
  },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  model: string;
  content: string;
  codeSnippet?: string;
  suggestedAction?: { label: string; tab: string };
}

const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    timestamp: '18:43:00 UTC',
    model: 'IBM Granite 3.0 Code 34B',
    content:
      'Hello engineer! I am the DevFlow AI Advisory Copilot powered by IBM Bob 2.0. I have full repository awareness of `BUG-142` in `csvUploadService.ts`, cross-referenced with your OpenAPI specification and RFC 7578 standards. How can I assist with your code investigation or release verification?',
    suggestedAction: { label: 'Inspect Root Cause Analysis', tab: 'root_cause' },
  },
];

export const AICopilotView: React.FC = () => {
  const { setActiveTab } = useWorkflow();
  const [selectedModelId, setSelectedModelId] = useState<string>('granite-34b-code');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTabSub, setActiveTabSub] = useState<'chat' | 'models' | 'prompts'>('chat');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const selectedModel = llmModels.find((m) => m.id === selectedModelId) || llmModels[0];

  const samplePrompts = [
    {
      title: 'Master Orchestrator Prompt (Bob 2.0 Agent Mode)',
      badge: 'PDF §8 Master',
      role: 'Orchestrator Controller',
      text: `System: You are DevFlow-Orchestrator powered by IBM Bob 2.0 Agent Mode. Goal: Execute an end-to-end developer workflow review, spec validation, and test generation for the target repository changes. INSTRUCTIONS: 1. Initialize Workspace: Read git diff and scan project directory structure. 2. Parallel Task Allocation: - Spawn Subagent 1 [Doc-Intelligence]: Search \`/docs\` and uploaded PDF/PRD files for relevant architecture guidelines and OpenAPI schemas. - Spawn Subagent 2 [Code-Reviewer]: Perform AST analysis on changed files. Identify bugs, security vulnerabilities, and code anti-patterns. - Spawn Subagent 3 [Test-Synthesizer]: Extract modified methods and synthesize corresponding unit tests in Jest/Vitest format. 3. Aggregate Findings: Combine outputs into a structured JSON report. 4. Patch Generation: If errors or missing test cases are detected, automatically generate clean, compilable replacement code files. 5. Verification: Execute generated tests in sandbox. Return final summary markdown report to developer.`,
    },
    {
      title: 'Subagent 1: Doc Intelligence & Spec Compliance',
      badge: 'PDF §8 Subagent 1',
      role: 'DocuMind Engine',
      text: `System: You are Subagent-DocIntel. You specialize in Document Understanding. Input: Architecture Spec PDF / OpenAPI Schema + Git Diff. Task: 1. Parse the provided PDF/schema document to extract API contracts, data models, and security constraints. 2. Compare extracted rules against code modifications in the Git Diff. 3. Highlight any spec-drift (e.g., missing required parameters, broken schemas, unauthorized endpoint additions). 4. Output concise pass/fail status with exact section references from the PDF document.`,
    },
    {
      title: 'Subagent 2: Parallel Test Gen & Patch Synthesizer',
      badge: 'PDF §8 Subagent 2',
      role: 'Sandbox Coder',
      text: `System: You are Subagent-TestAndFix. You operate in write mode within the repo. Input: Target source file path, modified code AST, and review findings. Task: 1. Analyze function inputs/outputs and boundary edge cases. 2. Generate comprehensive unit tests covering standard execution, null inputs, and error states. 3. Write test code directly to \`__tests__/[filename].test.ts\`. 4. If code review identified syntax or linter faults, refactor source code to fix the issues while ensuring tests pass.`,
    },
  ];

  const handleSendQuery = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      model: 'Developer Query',
      content: query,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      let replyContent = '';
      let snippet: string | undefined;
      let action: { label: string; tab: string } | undefined;

      const lower = query.toLowerCase();
      if (lower.includes('bug-142') || lower.includes('root cause') || lower.includes('why')) {
        replyContent = `Based on the AST parse of \`csvUploadService.ts:42\`, the error occurs because \`validateUpload(file)\` directly evaluates \`file.filename.endsWith('.csv')\`. When a client streams multipart chunks without a Content-Disposition filename header, \`file.filename\` evaluates to \`undefined\`, throwing an unhandled TypeError. The proposed patch introduces an explicit null check and generates a safe cryptographically secure fallback:`;
        snippet = `// Defense-in-depth: fallback to safe UUID filename
const safeFilename = file?.filename?.trim() 
  ? sanitizePath(file.filename)
  : \`upload_\${crypto.randomUUID()}.csv\`;

if (!safeFilename.toLowerCase().endsWith('.csv')) {
  throw new BadRequestException('Invalid file format. Only CSV accepted.');
}`;
        action = { label: 'View Code Diff in Sandbox', tab: 'code_changes' };
      } else if (lower.includes('rfc') || lower.includes('spec') || lower.includes('doc')) {
        replyContent = `Cross-referencing against \`docs/ARCHITECTURE.md §4.2\` and OpenAPI RFC 7578: The specification mandates that multipart form data should gracefully permit unnamed streams for serverless ingest clients. Our DocuMind Engine verified that generating a synthesized UUID identifier maintains 100% compliance with zero architectural drift.`;
        action = { label: 'Inspect DocuMind Spec Guard', tab: 'documents' };
      } else if (lower.includes('test') || lower.includes('jest')) {
        replyContent = `I have synthesized 5 comprehensive regression tests for Jest/Vitest in \`tests/services/csvUploadService.test.ts\`. These test cases specifically target: (1) missing filename param, (2) path traversal strings like \`../../etc/passwd\`, (3) empty multipart buffers, (4) invalid MIME headers, and (5) max stream cleanup:`;
        snippet = `describe('CsvUploadService - Regression Tests (BUG-142)', () => {
  it('should generate UUID fallback when filename is undefined', async () => {
    const stream = createMockStream({ filename: undefined, buffer: 'id,name\\n1,Alpha' });
    const result = await service.validateUpload(stream);
    expect(result.filename).toMatch(/^upload_[a-f0-9-]+\\.csv$/);
    expect(result.isValid).toBe(true);
  });
});`;
        action = { label: 'Run Automated Test Center', tab: 'tests' };
      } else {
        replyContent = `Analyzing with ${selectedModel.name}: DevFlow AI has verified this operation across all 8 security gates. No breaking AST changes or memory leaks detected. All subagents are standing by for workflow execution.`;
        action = { label: 'Inspect Parallel Sentinels', tab: 'review' };
      }

      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        model: selectedModel.name,
        content: replyContent,
        codeSnippet: snippet,
        suggestedAction: action,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 700);
  };

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-cyber p-6 relative overflow-hidden bg-gradient-to-r from-[#071522] via-[#0A1B2D] to-[#0D2135] border border-[rgba(34,211,238,0.25)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 font-semibold">
                AWESOME-LLM-APPS · AGENT SKILLS & RAG
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                ACTIVE: {selectedModel.name}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span>AI Copilot & Multi-Model Advisory Engine</span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Interactive code advisory and agent prompt console powered by IBM Granite 3.0 Code and multi-model LLMs.
              Triage codebase anomalies, evaluate prompt compliance, and review automated patch recommendations.
            </p>
          </div>

          {/* Sub-tabs switch */}
          <div className="flex bg-[#06111F] p-1 rounded-xl border border-[rgba(148,163,184,0.2)] shrink-0">
            <button
              onClick={() => setActiveTabSub('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTabSub === 'chat'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Copilot
            </button>
            <button
              onClick={() => setActiveTabSub('models')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTabSub === 'models'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Model Benchmarks
            </button>
            <button
              onClick={() => setActiveTabSub('prompts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTabSub === 'prompts'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Master Prompts (PDF §8)
            </button>
          </div>
        </div>
      </div>

      {/* Main View Body */}
      {activeTabSub === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Active Model Card & Quick Inquiries */}
          <div className="lg:col-span-4 space-y-4">
            {/* Active Model Selector */}
            <div className="card-cyber p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono border-b border-[rgba(148,163,184,0.1)] pb-2">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  ACTIVE INFERENCE MODEL
                </span>
                <span className="text-emerald-400 font-semibold">{selectedModel.status}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{selectedModel.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {selectedModel.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                <div className="bg-[#06111F] p-2 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Context Window</div>
                  <div className="text-cyan-300 font-bold mt-0.5">{selectedModel.contextWindow}</div>
                </div>
                <div className="bg-[#06111F] p-2 rounded-lg border border-slate-800">
                  <div className="text-slate-400">P95 Latency</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{selectedModel.latencyMs} ms</div>
                </div>
                <div className="bg-[#06111F] p-2 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Hallucination</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{selectedModel.hallucinationRate}</div>
                </div>
                <div className="bg-[#06111F] p-2 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Spec Adherence</div>
                  <div className="text-purple-300 font-bold mt-0.5">{selectedModel.specScore}</div>
                </div>
              </div>

              {/* Select Other Models */}
              <div className="pt-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">
                  Switch Active Inference Engine:
                </label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full bg-[#06111F] border border-[rgba(148,163,184,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                >
                  {llmModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="card-cyber p-4 space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                RECOMMENDED ADVISORY QUERIES
              </span>
              <div className="space-y-1.5">
                {[
                  'Explain BUG-142 root cause in csvUploadService.ts',
                  'Verify RFC 7578 compliance with UUID fallback',
                  'Generate Jest unit tests for null filename edge cases',
                  'Evaluate security risk of crypto.randomUUID fallback',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuery(q)}
                    className="w-full text-left p-2 rounded-lg bg-[#06111F] hover:bg-purple-950/30 border border-slate-800 hover:border-purple-500/40 text-[11px] text-slate-300 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">{q}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-purple-400 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Chat Window */}
          <div className="lg:col-span-8 card-cyber flex flex-col h-[620px] overflow-hidden">
            {/* Chat Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] font-mono text-slate-400">
                    <span className="font-semibold text-slate-300">
                      {msg.sender === 'user' ? 'You (Engineer)' : msg.model}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-tr-none'
                        : 'bg-[#071522] border border-[rgba(148,163,184,0.15)] text-slate-200 rounded-tl-none shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {msg.codeSnippet && (
                      <div className="mt-3 bg-[#06111F] rounded-lg border border-slate-800 overflow-hidden">
                        <div className="bg-[#0A1B2D] px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono text-cyan-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Code2 className="w-3 h-3" />
                            Suggested Code Snippet
                          </span>
                          <button
                            onClick={() => navigator.clipboard.writeText(msg.codeSnippet || '')}
                            className="text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            <Copy className="w-2.5 h-2.5" />
                            Copy
                          </button>
                        </div>
                        <pre className="p-3 text-[11px] font-mono text-cyan-200 overflow-x-auto">
                          {msg.codeSnippet}
                        </pre>
                      </div>
                    )}

                    {msg.suggestedAction && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">Next Action:</span>
                        <button
                          onClick={() => setActiveTab(msg.suggestedAction!.tab as any)}
                          className="px-2.5 py-1 rounded bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[10px] font-mono flex items-center gap-1 transition-all"
                        >
                          <span>{msg.suggestedAction.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{selectedModel.name} is reasoning through AST & specifications...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-[rgba(148,163,184,0.15)] bg-[#071522] flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder="Ask DevFlow Copilot about AST symbols, RFC specs, unit tests, or security..."
                className="flex-1 bg-[#06111F] border border-[rgba(148,163,184,0.2)] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-sans"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={isGenerating || !inputQuery.trim()}
                className="btn-cyber-primary px-4 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask Copilot</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Models Benchmarks Tab */}
      {activeTabSub === 'models' && (
        <div className="card-cyber p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.15)] pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>Multi-Model Architecture & Empirical Benchmarks</span>
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Evaluation results across code AST parsing, test generation, and spec compliance for DevFlow subagents.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
              HARNESS: IBM WATSONX / EVAL-2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-3 px-3">Model Name</th>
                  <th className="py-3 px-3">Specialized Role</th>
                  <th className="py-3 px-3">Context Window</th>
                  <th className="py-3 px-3">P95 Latency</th>
                  <th className="py-3 px-3">Hallucination Rate</th>
                  <th className="py-3 px-3">Spec Adherence</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {llmModels.map((m) => {
                  const isCurrent = m.id === selectedModelId;
                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-[#071522] transition-colors ${
                        isCurrent ? 'bg-purple-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                        {m.name}
                      </td>
                      <td className="py-3 px-3 text-cyan-300">{m.role}</td>
                      <td className="py-3 px-3 text-slate-300">{m.contextWindow}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{m.latencyMs} ms</td>
                      <td className="py-3 px-3 text-emerald-300">{m.hallucinationRate}</td>
                      <td className="py-3 px-3 text-purple-300 font-bold">{m.specScore}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                            isCurrent
                              ? 'bg-purple-900/80 text-purple-300 border border-purple-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isCurrent ? 'ACTIVE' : 'STANDBY'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedModelId(m.id);
                            setActiveTabSub('chat');
                          }}
                          className="px-2.5 py-1 rounded bg-[#0D2135] hover:bg-purple-900/60 text-slate-300 hover:text-white border border-[rgba(148,163,184,0.2)] text-[10px] transition-all"
                        >
                          Select Model
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Master Prompts Tab */}
      {activeTabSub === 'prompts' && (
        <div className="card-cyber p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.15)] pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <span>Anti-Gravity / IBM Bob 2.0 Master Prompt Suite</span>
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Exact production prompts defined in Section 8 of the DevFlow Architecture Specification.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              PDF SPECIFICATION §8
            </span>
          </div>

          <div className="space-y-4">
            {samplePrompts.map((p, idx) => (
              <div
                key={idx}
                className="bg-[#06111F] border border-[rgba(148,163,184,0.15)] rounded-xl overflow-hidden"
              >
                <div className="bg-[#0A1B2D] px-4 py-2.5 border-b border-[rgba(148,163,184,0.15)] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-white font-mono">{p.title}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      {p.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyPrompt(`prompt-${idx}`, p.text)}
                      className="btn-cyber-secondary text-[10px] py-1 px-2.5 flex items-center gap-1"
                    >
                      {copiedPromptId === `prompt-${idx}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-cyan-400" />
                      )}
                      <span>{copiedPromptId === `prompt-${idx}` ? 'Copied!' : 'Copy Prompt'}</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSendQuery(p.text);
                        setActiveTabSub('chat');
                      }}
                      className="btn-cyber-primary text-[10px] py-1 px-2.5 flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 fill-[#06111F]" />
                      <span>Execute in Copilot</span>
                    </button>
                  </div>
                </div>
                <pre className="p-4 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {p.text}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
