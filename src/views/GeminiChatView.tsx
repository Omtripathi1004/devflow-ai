import React, { useState, useEffect, useRef } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { GeminiService, GEMINI_MODELS } from '../services/geminiService';
import { AuthService } from '../services/authService';
import { ChatSession, ChatMessage } from '../types';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Bot,
  User,
  Key,
  Clock,
  Zap,
  ChevronDown,
  RotateCcw,
  Pin,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const GeminiChatView: React.FC = () => {
  const { currentUser, setActiveTab } = useWorkflow();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user sessions and preferences
  useEffect(() => {
    const user = currentUser || AuthService.getCurrentUser();
    const loadedSessions = GeminiService.loadSessions(user.id);
    setSessions(loadedSessions);

    if (loadedSessions.length > 0) {
      setActiveSessionId(loadedSessions[0].id);
    }

    if (user.preferences?.geminiApiKey) {
      setApiKey(user.preferences.geminiApiKey);
    }
  }, [currentUser]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);

  const handleCreateNewChat = () => {
    const user = currentUser || AuthService.getCurrentUser();
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      userId: user.id,
      title: 'New Discussion',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model: selectedModel,
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `Hello ${user.name}! I am your **DevFlow AI Assistant**, powered by **${
            GEMINI_MODELS.find((m) => m.id === selectedModel)?.name || 'Gemini 2.5 Flash'
          }**.\n\nI can analyze your full repository, debug production incidents (like **BUG-142**), optimize streaming pipelines, and review system architecture. How can I assist your engineering workflow today?`,
          timestamp: new Date().toISOString(),
          modelUsed: selectedModel,
          tokensCount: 75,
        },
      ],
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newSession.id);
    GeminiService.saveSessions(user.id, updated);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const user = currentUser || AuthService.getCurrentUser();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    setSessions(filtered);
    GeminiService.saveSessions(user.id, filtered);

    if (activeSessionId === sessionId) {
      if (filtered.length > 0) {
        setActiveSessionId(filtered[0].id);
      } else {
        handleCreateNewChat();
      }
    }
  };

  const handleSaveTitle = (sessionId: string) => {
    if (!editedTitle.trim()) {
      setEditingTitleId(null);
      return;
    }
    const user = currentUser || AuthService.getCurrentUser();
    const updated = sessions.map((s) =>
      s.id === sessionId ? { ...s, title: editedTitle.trim(), updatedAt: new Date().toISOString() } : s
    );
    setSessions(updated);
    GeminiService.saveSessions(user.id, updated);
    setEditingTitleId(null);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading || !activeSession) return;

    const user = currentUser || AuthService.getCurrentUser();
    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    // Update active session with user message
    const updatedMessages = [...activeSession.messages, userMessage];
    const isFirstUserMessage = activeSession.messages.filter((m) => m.role === 'user').length === 0;
    const sessionTitle = isFirstUserMessage
      ? textToSend.trim().slice(0, 42) + (textToSend.length > 42 ? '...' : '')
      : activeSession.title;

    const updatedSession: ChatSession = {
      ...activeSession,
      title: sessionTitle,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
      model: selectedModel,
    };

    const updatedSessionsList = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
    setSessions(updatedSessionsList);
    GeminiService.saveSessions(user.id, updatedSessionsList);

    setInputText('');
    setIsLoading(true);

    try {
      const response = await GeminiService.sendMessage(
        textToSend,
        apiKey,
        selectedModel,
        updatedMessages
      );

      const assistantMessage: ChatMessage = {
        id: `msg-assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        modelUsed: response.modelUsed,
        latencyMs: response.latencyMs,
        tokensCount: response.tokensCount,
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedMessages, assistantMessage],
        updatedAt: new Date().toISOString(),
      };

      const finalSessionsList = sessions.map((s) => (s.id === activeSession.id ? finalSession : s));
      setSessions(finalSessionsList);
      GeminiService.saveSessions(user.id, finalSessionsList);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveApiKey = () => {
    AuthService.updateApiKey(apiKey);
    setShowKeyModal(false);
  };

  const grouped = GeminiService.groupSessionsByDate(sessions);

  const promptStarters = [
    { label: 'BUG-142 CSV Stream Guard', prompt: 'Analyze production incident BUG-142 in csvUploadService.ts and explain why null filenames caused runtime TypeErrors at line 42.' },
    { label: 'Kafka 10k PRs/Day Arch', prompt: 'Explain the high-throughput Kafka event topology used by DevFlow AI to process 10,000 pull requests per day without bottlenecking.' },
    { label: 'Vitest Regression Suite', prompt: 'What are the 5 regression tests implemented in tests/services/csvUploadService.test.ts to verify the BUG-142 patch?' },
    { label: 'DocuMind 0% Drift Engine', prompt: 'How does DocuMind chunk RFC specifications and API specs to eliminate architectural drift across enterprise pull requests?' },
  ];

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[640px] rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#071522] overflow-hidden shadow-2xl relative">
      {/* Left Chat History Sidebar (ChatGPT style) */}
      <aside className="w-80 bg-[#06111F] border-r border-[rgba(148,163,184,0.15)] flex flex-col shrink-0 overflow-hidden hidden md:flex">
        {/* Sidebar Header: New Chat & Filter */}
        <div className="p-3.5 border-b border-[rgba(148,163,184,0.1)] flex items-center justify-between gap-2">
          <button
            onClick={handleCreateNewChat}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all shadow-sm active:scale-98"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>New Chat</span>
          </button>

          <button
            onClick={() => setShowKeyModal(true)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              apiKey
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-[#0D2135] text-slate-400 border-[rgba(148,163,184,0.2)] hover:text-white'
            }`}
            title={apiKey ? 'Gemini API Key Connected' : 'Configure Gemini API Key'}
          >
            <Key className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Day Chat Session List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 text-xs">
          {/* Today Group */}
          {grouped.today.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono uppercase font-semibold text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>Today</span>
              </div>
              <div className="space-y-1 mt-1">
                {grouped.today.map((s) => renderSessionItem(s))}
              </div>
            </div>
          )}

          {/* Yesterday Group */}
          {grouped.yesterday.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono uppercase font-semibold text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-indigo-400" />
                <span>Yesterday</span>
              </div>
              <div className="space-y-1 mt-1">
                {grouped.yesterday.map((s) => renderSessionItem(s))}
              </div>
            </div>
          )}

          {/* Previous 7 Days */}
          {grouped.previous7Days.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono uppercase font-semibold text-slate-400 flex items-center gap-1.5">
                <span>Previous 7 Days</span>
              </div>
              <div className="space-y-1 mt-1">
                {grouped.previous7Days.map((s) => renderSessionItem(s))}
              </div>
            </div>
          )}

          {/* Previous 30 Days */}
          {grouped.previous30Days.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono uppercase font-semibold text-slate-400 flex items-center gap-1.5">
                <span>Previous 30 Days</span>
              </div>
              <div className="space-y-1 mt-1">
                {grouped.previous30Days.map((s) => renderSessionItem(s))}
              </div>
            </div>
          )}

          {/* Older */}
          {grouped.older.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono uppercase font-semibold text-slate-400 flex items-center gap-1.5">
                <span>Older Sessions</span>
              </div>
              <div className="space-y-1 mt-1">
                {grouped.older.map((s) => renderSessionItem(s))}
              </div>
            </div>
          )}
        </div>

        {/* User Account Bar at Bottom */}
        <div className="p-3 border-t border-[rgba(148,163,184,0.15)] bg-[#0A1B2D]/80 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('auth')}
            className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity flex-1 min-w-0"
            title="Open Account Management & Switch User"
          >
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0">
              {currentUser?.name?.[0] || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.name || 'Developer'}</p>
              <p className="text-[10px] font-mono text-cyan-400 truncate">{currentUser?.role || 'Engineer'}</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Chat Conversation View */}
      <section className="flex-1 flex flex-col h-full bg-[#071522] overflow-hidden">
        {/* Top Control Bar */}
        <div className="h-14 border-b border-[rgba(148,163,184,0.12)] px-4 flex items-center justify-between bg-[#06111F]/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-[#06111F] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Gemini Chat Assistant</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                    Flash 2.5
                  </span>
                </h2>
              </div>
            </div>

            {/* Model Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-[#0D2135] text-xs font-mono text-slate-200 border border-[rgba(148,163,184,0.2)] rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
              >
                {GEMINI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.badge})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {apiKey ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Google Gemini API Connected
              </span>
            ) : (
              <button
                onClick={() => setShowKeyModal(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-950/50 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40 transition-colors"
              >
                <Key className="w-3 h-3 text-amber-400" />
                <span>Simulated Mode (Click to Add Key)</span>
              </button>
            )}

            <button
              onClick={() => handleSendMessage('Summarize the overall progress across Frontend, Backend, Database, and Deployment.')}
              className="p-1.5 rounded-lg bg-[#0D2135] text-slate-300 hover:text-white border border-[rgba(148,163,184,0.2)] text-xs hidden lg:flex items-center gap-1"
              title="Fast Progress Query"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Audit Progress</span>
            </button>
          </div>
        </div>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {activeSession?.messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shrink-0 mt-0.5">
                    <div className="w-full h-full bg-[#06111F] rounded-[9px] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                )}

                <div
                  className={`rounded-2xl p-4 text-sm leading-relaxed max-w-[85%] ${
                    isUser
                      ? 'bg-gradient-to-br from-cyan-600/90 to-blue-700/90 text-white shadow-lg shadow-cyan-900/20'
                      : 'bg-[#0D2135] border border-[rgba(148,163,184,0.15)] text-slate-200 shadow-md'
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between gap-3 mb-2 pb-1 border-b border-white/10 text-[10px] font-mono text-slate-300">
                    <span className="font-semibold uppercase tracking-wider">
                      {isUser ? currentUser?.name || 'You' : 'Gemini 2.5 Flash'}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      {msg.latencyMs && <span>{msg.latencyMs}ms</span>}
                      {msg.tokensCount && <span>{msg.tokensCount} tokens</span>}
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopyCode(msg.content, msg.id)}
                          className="hover:text-white transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message Content Render */}
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5 text-cyan-300 font-bold text-xs">
                    {currentUser?.name?.[0] || 'U'}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-4xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
              <div className="rounded-2xl p-4 bg-[#0D2135] border border-[rgba(148,163,184,0.15)] text-slate-400 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Gemini 2.5 Flash is generating an answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Starters */}
        <div className="px-4 py-2 bg-[#06111F]/50 border-t border-[rgba(148,163,184,0.1)] flex items-center gap-2 overflow-x-auto">
          {promptStarters.map((starter, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(starter.prompt)}
              className="px-2.5 py-1 rounded-lg bg-[#0D2135] hover:bg-[#102A43] text-slate-300 hover:text-white border border-[rgba(148,163,184,0.15)] text-[11px] whitespace-nowrap transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>{starter.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 md:p-4 bg-[#06111F] border-t border-[rgba(148,163,184,0.15)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-[#0D2135] border border-[rgba(148,163,184,0.25)] rounded-2xl p-2 focus-within:border-cyan-500 shadow-lg"
          >
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Ask Gemini 2.5 Flash about BUG-142, architecture, backend, frontend, or testing...`}
              rows={1}
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none px-2 max-h-32 py-1 font-sans"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#06111F] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2 px-1">
            <span>Shift + Enter for new line • Local multi-day history enabled</span>
            <span className="text-cyan-400">Connected: {currentUser?.name}</span>
          </div>
        </div>
      </section>

      {/* Gemini API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#071522] border border-[rgba(148,163,184,0.25)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Configure Google Gemini API</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your Google AI Studio API key to stream live answers from <strong>Gemini 2.5 Flash</strong> or <strong>Gemini 1.5 Pro</strong>. If omitted, DevFlow AI automatically uses its intelligent domain simulation engine.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase">Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#0D2135] border border-[rgba(148,163,184,0.2)] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#06111F] text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderSessionItem(session: ChatSession) {
    const isActive = activeSessionId === session.id;
    const isEditing = editingTitleId === session.id;

    return (
      <div
        key={session.id}
        onClick={() => {
          setActiveSessionId(session.id);
        }}
        className={`group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
          isActive
            ? 'bg-[#0D2135] border border-cyan-500/40 text-cyan-200 shadow-sm'
            : 'text-slate-300 hover:bg-[#0A1B2D] hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={() => handleSaveTitle(session.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle(session.id);
              }}
              autoFocus
              className="bg-[#06111F] text-xs text-white px-1.5 py-0.5 rounded border border-cyan-500 focus:outline-none w-full"
            />
          ) : (
            <span className="truncate text-xs">{session.title}</span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingTitleId(session.id);
              setEditedTitle(session.title);
            }}
            className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Rename Chat"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => handleDeleteSession(session.id, e)}
            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete Chat"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }
};
