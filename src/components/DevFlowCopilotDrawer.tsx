import React, { useState, useEffect, useRef } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  ShieldCheck,
  FlaskConical,
  Cpu,
  Layers,
  FileCode2,
  ChevronRight
} from 'lucide-react';

interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  codeSnippet?: string;
  fileReference?: string;
}

export const DevFlowCopilotDrawer: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen, activeTab, setActiveTab, workflowStatus } = useWorkflow();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic context-aware suggestions based on the active tab
  const getContextSuggestions = () => {
    switch (activeTab) {
      case 'security':
        return [
          'Explain the multipart CSV parser race vulnerability',
          'How does the mutex lock prevent concurrent writes?',
          'Verify OWASP ASVS compliance for BUG-142'
        ];
      case 'tests':
        return [
          'Why are the csvUploadService tests passing?',
          'Generate Vitest edge case for empty multipart boundary',
          'Check test suite execution latency and coverage'
        ];
      case 'system_design':
        return [
          'Explain why we chose BullMQ Redis over synchronous RPC',
          'Calculate Kafka queue partition latency at 10,000 PR/s',
          'How does the AST Write-Through cache prevent LLM exhaustion?'
        ];
      case 'release':
        return [
          'Summarize staging diff for release v2.4.1',
          'Why did the pre-release health check pass?',
          'Generate human-readable changelog for GitHub release'
        ];
      default:
        return [
          'What is the current status of the development pipeline?',
          'Explain how the 9 autonomous subagents cooperate',
          'Run automated fix and test verification'
        ];
    }
  };

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: 'Hello! I am your DevFlow AI Engineering Copilot. I have context on your active workspace (Omtripathi1004/devflow-ai:main), the AST dependency tree, test suites, and ongoing pipeline executions. How can I assist you right now?',
      fileReference: 'src/services/csvUploadService.ts'
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Contextual intelligent responses
    setTimeout(() => {
      let replyText = '';
      let code = '';
      let fileRef = '';

      if (text.toLowerCase().includes('vulnerability') || text.toLowerCase().includes('race') || activeTab === 'security') {
        replyText =
          'The vulnerability in csvUploadService.ts stemmed from concurrent write streams without an atomic mutex lock. When two files uploaded simultaneously with missing filename headers, both worker threads attempted to acquire the same fallback filename. We implemented an in-memory Mutex Lock with a UUID fallback:';
        code = `// Atomic Mutex Guard in csvUploadService.ts\nawait uploadMutex.runExclusive(async () => {\n  const filename = header.filename || \`upload_\${crypto.randomUUID()}.csv\`;\n  await fs.promises.writeFile(targetPath, streamBuffer);\n});`;
        fileRef = 'src/services/csvUploadService.ts:L78-95';
      } else if (text.toLowerCase().includes('test') || activeTab === 'tests') {
        replyText =
          'Vitest suite tests/services/csvUploadService.test.ts passes 6/6 tests (and 8/8 overall). Tests confirm that concurrent uploads serialize cleanly, memory bounds remain below 48MB, and zero file descriptors leak.';
        code = `it('serializes concurrent uploads under high concurrency', async () => {\n  const results = await Promise.all([upload(), upload()]);\n  expect(results.every(r => r.status === 'ok')).toBe(true);\n});`;
        fileRef = 'tests/services/csvUploadService.test.ts';
      } else if (text.toLowerCase().includes('bullmq') || text.toLowerCase().includes('architecture') || activeTab === 'system_design') {
        replyText =
          'DevFlow uses an asynchronous architecture: Fastify writes tasks to BullMQ Redis in <15ms returning HTTP 202 Accepted. An isolated MicroVM worker pool processes jobs in parallel without tying up the HTTP event loop, preventing gateway timeouts.';
        fileRef = 'Architecture / System Design';
      } else {
        replyText =
          'The autonomous development pipeline is currently green. The active issue BUG-142 has been triaged, patched, verified by 3 sentinel reviews, and staged into Pull Request #104 ready for one-click merge.';
        fileRef = 'Pipeline / Overview';
      }

      const assistantMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyText,
        codeSnippet: code || undefined,
        fileReference: fileRef
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 900);
  };

  if (!isCopilotOpen) return null;

  return (
    <aside
      role="dialog"
      aria-label="DevFlow Contextual Copilot"
      className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-neutral-900 border-l border-neutral-800 z-50 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">DevFlow AI Copilot</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">
              Context: {activeTab.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1.5 ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
              <span>{msg.sender === 'user' ? 'You' : 'DevFlow Copilot'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[92%] ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-tl-none shadow-md'
              }`}
            >
              <p>{msg.text}</p>

              {msg.fileReference && (
                <div className="mt-2 pt-2 border-t border-neutral-800/80 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <FileCode2 className="w-3 h-3" />
                  <span>Ref: {msg.fileReference}</span>
                </div>
              )}

              {msg.codeSnippet && (
                <div className="mt-2.5 relative group">
                  <pre className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg font-mono text-[11px] text-emerald-300 overflow-x-auto">
                    {msg.codeSnippet}
                  </pre>
                  <button
                    onClick={() => handleCopy(msg.id, msg.codeSnippet!)}
                    className="absolute top-2 right-2 p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white text-[10px] opacity-0 group-hover:opacity-100 transition"
                    title="Copy code"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Analyzing codebase context & AST dependencies...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions based on Active Screen */}
      <div className="p-3 bg-neutral-950/80 border-t border-neutral-800 space-y-1.5">
        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Suggested Contextual Inquiries</span>
        </div>
        <div className="flex flex-col gap-1">
          {getContextSuggestions().map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(suggestion)}
              className="text-left text-[11px] text-neutral-300 hover:text-emerald-400 hover:bg-neutral-900 px-2 py-1 rounded transition truncate"
            >
              &rarr; {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Copilot about code, tests, or security..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500/60 font-sans"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
};
