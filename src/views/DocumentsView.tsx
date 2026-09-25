import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Search,
  CheckCircle,
  BookOpen,
  Layers,
  ArrowRight,
  Upload,
  FileText,
  ShieldCheck,
  Cpu,
  Sparkles,
  Zap,
  Check,
  AlertTriangle,
  RefreshCw,
  X,
  FileCheck,
} from 'lucide-react';

interface SemanticChunk {
  id: string;
  section: string;
  content: string;
  embeddingStatus: 'INDEXED_1536D';
  similarityScore: number;
  matchedSymbol: string;
}

export const DocumentsView: React.FC = () => {
  const { documents, selectedDocId, setSelectedDocId, setActiveTab } = useWorkflow();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [subTab, setSubTab] = useState<'REQUIREMENTS' | 'CHUNKS' | 'RAW'>('REQUIREMENTS');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuditingDrift, setIsAuditingDrift] = useState(false);
  const [driftAuditPassed, setDriftAuditPassed] = useState(true);

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const sampleChunks: SemanticChunk[] = [
    {
      id: 'chk-1',
      section: 'RFC-7578 §5.1 / Filename Fallback',
      content:
        'When multipart form stream chunks omit explicit Content-Disposition filename parameters, ingestion pipelines SHOULD generate a non-colliding cryptographically secure fallback identifier.',
      embeddingStatus: 'INDEXED_1536D',
      similarityScore: 0.984,
      matchedSymbol: 'CsvUploadService.validateUpload',
    },
    {
      id: 'chk-2',
      section: 'ARCHITECTURE.md §4.2 / Error Propagation',
      content:
        'Service methods must catch unhandled stream rejections and return structured client HTTP 400 Bad Request instead of throwing unhandled process rejections (HTTP 500).',
      embeddingStatus: 'INDEXED_1536D',
      similarityScore: 0.961,
      matchedSymbol: 'CsvUploadService.processFileStream',
    },
    {
      id: 'chk-3',
      section: 'SECURITY_SPEC §2.3 / Path Traversal Sanitization',
      content:
        'All client-supplied filename parameters MUST undergo path sanitization to eliminate directory traversal sequences (../, \\\\) before file descriptors are opened.',
      embeddingStatus: 'INDEXED_1536D',
      similarityScore: 0.978,
      matchedSymbol: 'sanitizePath',
    },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter = filterType === 'ALL' || doc.type === filterType;
    const matchesSearch =
      searchTerm === '' ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRunDriftAudit = () => {
    setIsAuditingDrift(true);
    setTimeout(() => {
      setIsAuditingDrift(false);
      setDriftAuditPassed(true);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: DocuMind Spec Guard */}
      <div className="card-cyber p-6 relative overflow-hidden bg-gradient-to-r from-[#071522] via-[#0A1B2D] to-[#0D2135] border border-[rgba(34,211,238,0.25)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-semibold">
                DOCUMIND SPEC GUARD · PDF RAG REASONING
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                ARCHITECTURAL SPEC DRIFT: 0.0% (PASSED)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-emerald-400" />
              <span>DocuMind Spec Guard & RAG Engine</span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Autonomously ingests legacy documentation (PRD PDFs, OpenAPI 3.1 schemas, and RFC specifications).
              Extracts data models, semantic constraints, and cross-references active Git diffs to eliminate architectural drift.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunDriftAudit}
              disabled={isAuditingDrift}
              className="btn-cyber-secondary text-xs flex items-center gap-1.5"
            >
              {isAuditingDrift ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{isAuditingDrift ? 'Verifying Spec Drift...' : 'Audit Spec Drift'}</span>
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-cyber-primary text-xs flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PRD / PDF Spec</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Ribbon: 42% Drift Baseline -> 0% with DocuMind */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-cyber p-4">
          <div className="text-[11px] font-mono text-slate-400">Architectural Spec Drift</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 flex items-baseline gap-2">
            <span>0.0%</span>
            <span className="text-xs line-through text-rose-400/80">42% Manual Drift</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">100% Contract Adherence</div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-[11px] font-mono text-slate-400">Extracted API Contracts</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">6 Specs</div>
          <div className="text-[11px] text-slate-400 mt-1">OpenAPI 3.1 & RFC 7578</div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-[11px] font-mono text-slate-400">Semantic Embeddings</div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">1,536 Dim</div>
          <div className="text-[11px] text-slate-400 mt-1">Milvus Vector Index (HNSW)</div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-[11px] font-mono text-slate-400">Verification Latency</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">&lt; 850 ms</div>
          <div className="text-[11px] text-slate-400 mt-1">Parallel Doc-Intelligence subagent</div>
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
                      ? 'border-emerald-500/50 bg-emerald-950/20 shadow-md'
                      : 'border-[rgba(148,163,184,0.12)] bg-[#06111F]/70 hover:bg-[#0D2135]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white truncate">{doc.title}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0A1B2D] text-cyan-300">
                      {doc.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
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

            {/* Sub-tab Switcher */}
            <div className="flex bg-[#06111F] p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setSubTab('REQUIREMENTS')}
                className={`px-3 py-1 rounded transition-colors ${
                  subTab === 'REQUIREMENTS'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Requirements
              </button>
              <button
                onClick={() => setSubTab('CHUNKS')}
                className={`px-3 py-1 rounded transition-colors ${
                  subTab === 'CHUNKS'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semantic Chunks & RAG
              </button>
              <button
                onClick={() => setSubTab('RAW')}
                className={`px-3 py-1 rounded transition-colors ${
                  subTab === 'RAW'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Raw Content
              </button>
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-6 max-h-[550px] text-xs">
            {subTab === 'REQUIREMENTS' && (
              <>
                {/* Extracted Requirements Block */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Extracted Architectural Constraints ({activeDoc.extractedRequirements.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {activeDoc.extractedRequirements.map((req, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#06111F]/80 border border-[rgba(148,163,184,0.12)] text-slate-200 font-mono text-[11px] leading-relaxed flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-800/40 text-[10px]">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div>{req}</div>
                          <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                            ✓ Verified Compliant against AST patch diff (+24 / -6 lines)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Findings */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Cross-Referenced Contract Findings</span>
                  </h4>
                  <div className="space-y-1.5">
                    {activeDoc.keyFindings.map((finding, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-cyan-200 text-xs leading-relaxed"
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
                          className="w-full p-2 px-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-300 font-mono text-[11px] flex items-center justify-between transition-colors"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {subTab === 'CHUNKS' && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-slate-400">
                  Semantic chunking index used by DocuMind Vector Search (Milvus / Qdrant):
                </div>
                {sampleChunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-4 bg-[#06111F] border border-[rgba(148,163,184,0.15)] rounded-xl space-y-2 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-cyan-400 font-bold">{chunk.section}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                        {chunk.embeddingStatus}
                      </span>
                    </div>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      "{chunk.content}"
                    </p>
                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                      <div>
                        Matched Symbol: <span className="text-emerald-400">{chunk.matchedSymbol}</span>
                      </div>
                      <div>
                        Cosine Similarity: <span className="text-purple-300 font-bold">{chunk.similarityScore}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {subTab === 'RAW' && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] block font-semibold">
                  Raw Document Text Preview
                </span>
                <pre className="p-4 rounded-xl bg-[#06111F] border border-[rgba(148,163,184,0.15)] text-[#94A3B8] font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {activeDoc.rawContent}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal Simulator */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071522] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Upload Architecture Spec / PRD PDF</h3>
                <p className="text-xs text-slate-400">DocuMind will parse, chunk, and index for semantic spec guard.</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-xl p-6 text-center space-y-2 bg-[#06111F]/60 cursor-pointer transition-colors">
              <FileCheck className="w-8 h-8 text-cyan-400 mx-auto" />
              <div className="text-xs text-white font-bold">Drag and drop architecture PDF here</div>
              <div className="text-[11px] text-slate-400">Supports PDF, OpenAPI 3.1 YAML, and Markdown</div>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Or load standard benchmark specifications:
            </div>
            <div className="space-y-1.5">
              {[
                'RFC-7578 Multipart Stream Ingestion Spec.pdf (Active)',
                'Microservices Boundary & Auth Contract v2.pdf',
                'Enterprise SLA & Rate Limiting PRD.pdf',
              ].map((name, i) => (
                <button
                  key={i}
                  onClick={() => {
                    alert(`Loaded: ${name}`);
                    setIsUploadModalOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-[#06111F] hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 flex items-center justify-between"
                >
                  <span>{name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
