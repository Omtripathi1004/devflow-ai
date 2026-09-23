import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Search,
  CheckCircle,
  BookOpen,
  Layers,
  ArrowRight,
  Upload,
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, selectedDocId, setSelectedDocId, setActiveTab } = useWorkflow();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter = filterType === 'ALL' || doc.type === filterType;
    const matchesSearch =
      searchTerm === '' ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 card-cyber p-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <span>Document Understanding & RFC Context Engine</span>
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Documentation Agent extracts contractual requirements, architecture constraints, and cross-references them against runtime logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
            [DETERMINISTIC EXTRACTIONS]
          </span>
          <button
            onClick={() => alert('Document upload adapter ready.')}
            className="btn-cyber-secondary text-xs flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Document List */}
        <div className="lg:col-span-4 card-cyber flex flex-col overflow-hidden">
          {/* Search & Filter */}
          <div className="p-3 border-b border-[rgba(148,163,184,0.15)] bg-[#071522]/80 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search documents or requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#06111F] border border-[rgba(148,163,184,0.15)] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto text-[10px] font-mono pb-1">
              {['ALL', 'README', 'ARCHITECTURE', 'API_SPEC', 'LOGS'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    filterType === t
                      ? 'bg-cyan-500 text-[#06111F] font-bold'
                      : 'bg-[#06111F] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Doc List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 max-h-[550px]">
            {filteredDocs.map((doc) => {
              const isSelected = activeDoc.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500/50 bg-cyan-950/30'
                      : 'border-[rgba(148,163,184,0.12)] bg-[#06111F]/70 hover:bg-[#0D2135]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white truncate">{doc.title}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0A1B2D] text-cyan-300">
                      {doc.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed">{doc.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Document Detail */}
        <div className="lg:col-span-8 card-cyber flex flex-col overflow-hidden">
          {/* Document Header */}
          <div className="p-4 border-b border-[rgba(148,163,184,0.15)] bg-[#071522]/90 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{activeDoc.title}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {activeDoc.status}
                </span>
              </div>
              <span className="text-xs font-mono text-[#94A3B8]">{activeDoc.path}</span>
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-6 max-h-[550px] text-xs">
            {/* Extracted Requirements Block */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>Extracted Requirements ({activeDoc.extractedRequirements.length})</span>
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {activeDoc.extractedRequirements.map((req, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] text-slate-200 font-mono text-[11px] leading-relaxed flex items-start gap-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center shrink-0 mt-0.5 border border-cyan-800/40">
                      {i + 1}
                    </span>
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Findings */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Key Architectural Findings</span>
              </h4>
              <div className="space-y-1.5">
                {activeDoc.keyFindings.map((finding, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-200 text-xs leading-relaxed"
                  >
                    • {finding}
                  </div>
                ))}
              </div>
            </div>

            {/* Referenced Files & Direct Evidence Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[rgba(148,163,184,0.15)]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1.5 font-semibold">
                  Referenced Code Symbols:
                </span>
                <div className="space-y-1">
                  {activeDoc.referencedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="p-2 px-3 rounded-lg bg-[#06111F] border border-[rgba(148,163,184,0.15)] text-slate-300 font-mono text-[11px]"
                    >
                      {file}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1.5 font-semibold">
                  Evidence Deep-Links:
                </span>
                <div className="space-y-1">
                  {activeDoc.evidenceLinks.map((link, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (link.target === '#diff') setActiveTab('code_changes');
                        else if (link.target === '#root-cause') setActiveTab('root_cause');
                        else setActiveTab('repository');
                      }}
                      className="w-full p-2 px-3 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/40 text-cyan-300 font-mono text-[11px] flex items-center justify-between transition-colors"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Raw Document Preview */}
            <div className="space-y-2 pt-2 border-t border-[rgba(148,163,184,0.15)]">
              <span className="text-[10px] font-mono uppercase text-[#94A3B8] block font-semibold">
                Raw Document Text Preview
              </span>
              <pre className="p-4 rounded-xl bg-[#06111F] border border-[rgba(148,163,184,0.15)] text-[#94A3B8] font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {activeDoc.rawContent}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
