import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { AuthService, INITIAL_USERS } from '../services/authService';
import { UserProfile } from '../types';
import {
  User,
  Shield,
  Key,
  LogIn,
  UserPlus,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  RefreshCw,
  LogOut,
  Sliders,
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { currentUser, setCurrentUser, setActiveTab } = useWorkflow();

  const [users, setUsers] = useState<UserProfile[]>(AuthService.getUsers());
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [roleInput, setRoleInput] = useState<string>('Software Engineer');
  const [apiKeyInput, setApiKeyInput] = useState<string>(
    currentUser?.preferences?.geminiApiKey || ''
  );
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSwitchUser = (userId: string) => {
    const updated = AuthService.switchUser(userId);
    setCurrentUser(updated);
    setUsers(AuthService.getUsers());
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;

    const newUser = AuthService.registerUser(nameInput, emailInput, roleInput);
    setCurrentUser(newUser);
    setUsers(AuthService.getUsers());
    setNameInput('');
    setEmailInput('');
    setIsRegistering(false);
  };

  const handleSaveApiKey = () => {
    AuthService.updateApiKey(apiKeyInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#071522] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 uppercase">
              Authentication & Sessions
            </span>
            <span className="text-xs font-mono text-emerald-400">● Session Active</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            User Profiles & Multi-Day Session Storage
          </h1>
          <p className="text-xs text-slate-400">
            Switch engineering profiles, manage Gemini credentials, and preserve multi-day chat logs per user.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('gemini_chat')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#06111F] text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open Gemini Chatbot</span>
        </button>
      </div>

      {/* Current Active User Profile Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0A1B2D] to-[#071522] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 p-1 flex items-center justify-center text-cyan-300 text-xl font-bold shrink-0 shadow-lg shadow-cyan-500/10">
              {currentUser?.name?.[0] || 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">{currentUser?.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                  {currentUser?.role}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  Active User
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">{currentUser?.email}</p>
            </div>
          </div>

          <div className="text-right text-xs font-mono space-y-1 text-slate-400">
            <div>
              Last Session: <span className="text-slate-200">{new Date(currentUser?.lastLogin || Date.now()).toLocaleTimeString()}</span>
            </div>
            <div>
              Storage ID: <span className="text-cyan-400">{currentUser?.id}</span>
            </div>
          </div>
        </div>

        {/* Quick User Credentials & Gemini API Key Settings */}
        <div className="pt-4 border-t border-[rgba(148,163,184,0.12)] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Google Gemini API Key (Optional)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy... (leave blank for simulated smart engine)"
                className="flex-1 bg-[#06111F] border border-[rgba(148,163,184,0.2)] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#06111F] text-xs font-bold transition-all shadow-sm shrink-0"
              >
                Save
              </button>
            </div>
            {saveSuccess && (
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> API key saved to local session.
              </span>
            )}
          </div>

          <div className="bg-[#06111F]/60 p-3.5 rounded-xl border border-[rgba(148,163,184,0.1)] flex items-center justify-between text-xs font-mono">
            <div className="space-y-1">
              <span className="text-slate-400">Local Multi-Day Persistence:</span>
              <p className="text-emerald-400 font-semibold">Enabled in LocalStorage</p>
            </div>
            <button
              onClick={() => setActiveTab('project_progress')}
              className="px-3 py-1.5 rounded-lg bg-[#0D2135] hover:bg-[#102A43] text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1"
            >
              <span>View Progress Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Switch Profile Quick Selector for Judges & Team */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Demo Team Profiles & Switcher
            </h3>
            <p className="text-xs text-slate-400">
              Select any profile to inspect isolated multi-day chat histories and roles.
            </p>
          </div>

          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="px-3 py-1.5 rounded-xl bg-[#0D2135] hover:bg-[#102A43] text-slate-300 hover:text-white border border-[rgba(148,163,184,0.2)] text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isRegistering ? 'Cancel' : 'Create Custom User'}</span>
          </button>
        </div>

        {/* Custom User Registration Form */}
        {isRegistering && (
          <form
            onSubmit={handleRegister}
            className="p-5 rounded-2xl bg-[#071522] border border-cyan-500/40 space-y-4 shadow-xl"
          >
            <h4 className="text-xs font-bold text-white font-mono uppercase">Register New Engineering Profile</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Full Name (e.g. Maya Chen)"
                required
                className="bg-[#0D2135] border border-[rgba(148,163,184,0.2)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Email Address"
                required
                className="bg-[#0D2135] border border-[rgba(148,163,184,0.2)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="Role (e.g. SRE Engineer)"
                className="bg-[#0D2135] border border-[rgba(148,163,184,0.2)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#06111F] text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
              >
                Create & Switch To Profile
              </button>
            </div>
          </form>
        )}

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {users.map((user) => {
            const isSelected = currentUser?.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => handleSwitchUser(user.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-[#0D2135] border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                    : 'bg-[#071522] border-[rgba(148,163,184,0.15)] hover:border-[rgba(148,163,184,0.3)] hover:bg-[#0A1B2D]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-sm">
                    {user.name[0]}
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Current
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                  <p className="text-xs text-cyan-400 font-mono truncate">{user.role}</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">{user.email}</p>
                </div>

                <div className="pt-2 border-t border-[rgba(148,163,184,0.1)] flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>ID: {user.id.slice(0, 14)}...</span>
                  <span className="text-cyan-300 font-semibold">Switch &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
