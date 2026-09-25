import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Cpu,
  Server,
  Layers,
  Database,
  ShieldAlert,
  Zap,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  GitBranch,
  Box,
  Sliders,
  DollarSign,
  Clock,
  HardDrive,
} from 'lucide-react';

interface ScalabilityMetric {
  title: string;
  value: string;
  unit: string;
  badge: string;
  color: string;
}

export const SystemDesignView: React.FC = () => {
  const { setActiveTab } = useWorkflow();
  const [dailyPRs, setDailyPRs] = useState<number>(3500);
  const [avgFilesPerPR, setAvgFilesPerPR] = useState<number>(8);
  const [sandboxConcurrency, setSandboxConcurrency] = useState<number>(64);
  const [activeTabSub, setActiveTabSub] = useState<'blueprint' | 'capacity' | 'tradeoffs'>('blueprint');

  // Dynamic calculations based on System Design Primer formulas
  const subagentInvocationsPerDay = dailyPRs * 9; // 9 subagents per PR
  const peakQps = Math.round((subagentInvocationsPerDay / 86400) * 3.5); // Peak 3.5x average
  const queueLatencyMs = Math.max(12, Math.round(18 + (dailyPRs / 1000) * 4));
  const vectorDbQueriesPerSec = Math.round(peakQps * 2.4);
  const estimatedCostPerPR = (0.042 * (avgFilesPerPR / 8)).toFixed(3);
  const totalEngineerHoursSavedAnnual = Math.round(dailyPRs * 365 * 2.7); // 2.7 hrs saved per PR
  const totalDollarSavingsAnnual = Math.round(totalEngineerHoursSavedAnnual * 120);

  const architectureLayers = [
    {
      id: 'ingress',
      title: '1. Ingress & Edge Gateway',
      icon: Server,
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
      components: [
        { name: 'Cloudflare / Envoy Gateway', desc: 'TLS termination, DDoS mitigation, GitHub Webhook HMAC verification' },
        { name: 'Token-Bucket Rate Limiter', desc: '10,000 req/sec enterprise quota management' },
        { name: 'GraphQL / REST Router', desc: 'Payload validation and idempotency key caching' },
      ],
    },
    {
      id: 'event-bus',
      title: '2. Distributed Event Queue',
      icon: Activity,
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
      components: [
        { name: 'Apache Kafka / Redis Streams', desc: 'Partitioned by repository_id for sequential AST consistency' },
        { name: 'Dead-Letter Queue (DLQ)', desc: 'Automatic exponential backoff with 3 retries' },
        { name: 'Event Consumer Workers', desc: 'Pulls PR diff jobs to dispatch to Bob 2.0 Agent clusters' },
      ],
    },
    {
      id: 'orchestration',
      title: '3. IBM Bob 2.0 Multi-Agent Orchestrator',
      icon: Cpu,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
      components: [
        { name: 'Durable State Machine', desc: 'Temporal-style persistent execution state per stage' },
        { name: 'Parallel Subagent Fork/Join', desc: 'Runs AST analysis, Log triage, and DocuMind spec checks concurrently' },
        { name: 'Human-in-the-Loop Checkpoint', desc: 'Cryptographic approval barrier before production merges' },
      ],
    },
    {
      id: 'sandbox',
      title: '4. Sandboxed Execution Container Engine',
      icon: Box,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
      components: [
        { name: 'Firecracker MicroVMs / Wasm', desc: 'Isolated 5ms boot container execution per test suite' },
        { name: 'Strict Network Isolation', desc: 'Zero egress access during patch synthesis & test runs' },
        { name: 'Resource Quotas', desc: 'Strict memory caps (512MB) and CPU throttling' },
      ],
    },
    {
      id: 'storage',
      title: '5. Multi-Tier Distributed Storage',
      icon: Database,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
      components: [
        { name: 'Redis L2 Symbol Cache', desc: 'AST call graphs & symbol tables (<2ms latency)' },
        { name: 'Milvus / Qdrant Vector DB', desc: 'PRD and OpenAPI semantic chunk embeddings (HNSW index)' },
        { name: 'PostgreSQL & MinIO Object Store', desc: 'Audit manifests, signed certificates, and test coverage XML' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-cyber p-6 relative overflow-hidden bg-gradient-to-r from-[#071522] via-[#0A1B2D] to-[#0D2135] border border-[rgba(34,211,238,0.25)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-500/40 font-semibold">
                SYSTEM DESIGN PRIMER · DISTRIBUTED ARCHITECTURE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                CAPACITY: 10,000+ PRs/DAY
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Cpu className="w-8 h-8 text-sky-400" />
              <span>Enterprise Backend Scalability & System Design</span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Architectural blueprint for scaling autonomous developer agents across enterprise codebases.
              Features event-driven queues, isolated MicroVM sandboxes, multi-tier AST caching, and high-availability vector retrieval.
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex bg-[#06111F] p-1 rounded-xl border border-[rgba(148,163,184,0.2)] shrink-0">
            <button
              onClick={() => setActiveTabSub('blueprint')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTabSub === 'blueprint' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              System Topology
            </button>
            <button
              onClick={() => setActiveTabSub('capacity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTabSub === 'capacity' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Capacity Simulator
            </button>
            <button
              onClick={() => setActiveTabSub('tradeoffs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTabSub === 'tradeoffs' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Design Trade-Offs
            </button>
          </div>
        </div>
      </div>

      {/* Blueprint View */}
      {activeTabSub === 'blueprint' && (
        <div className="space-y-6">
          {/* Architecture Topology Layers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {architectureLayers.map((layer) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.id}
                  className={`card-cyber p-4 rounded-xl border flex flex-col justify-between ${layer.color}`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-[#06111F] border border-current">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-white leading-tight">{layer.title}</h3>
                    </div>

                    <div className="space-y-2">
                      {layer.components.map((comp, idx) => (
                        <div
                          key={idx}
                          className="bg-[#06111F]/80 p-2 rounded-lg border border-[rgba(148,163,184,0.1)] text-[11px]"
                        >
                          <div className="font-bold text-slate-200">{comp.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                            {comp.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[rgba(148,163,184,0.1)] text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Availability</span>
                    <span className="text-emerald-400 font-bold">99.99%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Core System Architectural Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-cyber p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                ASYNCHRONOUS DECOUPLING
              </span>
              <h3 className="text-sm font-bold text-white">Non-Blocking Webhook Ingestion</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                GitHub PR webhooks acknowledge HTTP 200 within &lt;15ms. The PR diff is enqueued onto Kafka topic partitions keyed by repository UUID to preserve strict commit linearization.
              </p>
            </div>

            <div className="card-cyber p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <Box className="w-4 h-4" />
                ISOLATED EXECUTION SANDBOX
              </span>
              <h3 className="text-sm font-bold text-white">Zero-Trust Patch Compilation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Before proposing any code change, patches are compiled and verified inside isolated MicroVM execution containers (Node.js sandbox with 512MB RAM cap and zero outbound internet access).
              </p>
            </div>

            <div className="card-cyber p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                MULTI-TIER CACHING MATRIX
              </span>
              <h3 className="text-sm font-bold text-white">Hierarchical AST & Embedding Cache</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Repetitive AST traversals use a Redis L2 Write-Through cache. Unchanged files bypass AST re-indexing, yielding an 82% reduction in subagent token consumption.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Capacity Simulator */}
      {activeTabSub === 'capacity' && (
        <div className="card-cyber p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.15)] pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-400" />
                <span>Interactive Capacity & Throughput Planner</span>
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Model throughput, worker thread allocation, and infrastructure costs for enterprise repositories.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-sky-950 text-sky-300 border border-sky-500/40">
              SCALE FORMULA: PRIMER v2
            </span>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#06111F] p-4 rounded-xl border border-[rgba(148,163,184,0.15)]">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Daily PR Volume:</span>
                <span className="text-cyan-400 font-bold">{dailyPRs.toLocaleString()} PRs/day</span>
              </div>
              <input
                type="range"
                min="100"
                max="20000"
                step="100"
                value={dailyPRs}
                onChange={(e) => setDailyPRs(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>100 PRs</span>
                <span>20,000 PRs</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Avg Changed Files / PR:</span>
                <span className="text-cyan-400 font-bold">{avgFilesPerPR} files</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={avgFilesPerPR}
                onChange={(e) => setAvgFilesPerPR(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1 file</span>
                <span>30 files</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Sandbox Concurrency:</span>
                <span className="text-cyan-400 font-bold">{sandboxConcurrency} Workers</span>
              </div>
              <input
                type="range"
                min="8"
                max="256"
                step="8"
                value={sandboxConcurrency}
                onChange={(e) => setSandboxConcurrency(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>8 MicroVMs</span>
                <span>256 MicroVMs</span>
              </div>
            </div>
          </div>

          {/* Calculated Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#071522] border border-[rgba(148,163,184,0.15)] rounded-xl p-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Subagent Invocations</div>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                {subagentInvocationsPerDay.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Daily across 9 domains</div>
            </div>

            <div className="bg-[#071522] border border-[rgba(148,163,184,0.15)] rounded-xl p-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase">P99 Queue Latency</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {queueLatencyMs} ms
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Kafka partitioned consumers</div>
            </div>

            <div className="bg-[#071522] border border-[rgba(148,163,184,0.15)] rounded-xl p-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Cost Per Analyzed PR</div>
              <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
                ₹{(parseFloat(estimatedCostPerPR) * 86.5).toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Compute & token inference (₹ INR)</div>
            </div>

            <div className="bg-[#071522] border border-[rgba(148,163,184,0.15)] rounded-xl p-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Annual Engineer Savings</div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                ₹{((totalDollarSavingsAnnual * 86.5) / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {totalEngineerHoursSavedAnnual.toLocaleString()} hours saved/yr
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trade-Offs View */}
      {activeTabSub === 'tradeoffs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-cyber p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-400">ARCHITECTURAL PATTERN</span>
              <span className="text-[10px] font-mono text-emerald-400">CHOSEN: ASYNCHRONOUS</span>
            </div>
            <h3 className="text-sm font-bold text-white">Asynchronous Workers vs Synchronous RPC</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synchronous HTTP webhook calls risk timing out during complex AST diffing on 5,000+ line pull requests. By routing via Kafka partitioned topics, DevFlow provides instantaneous 200 OK webhook receipts, isolates agent failure domains, and guarantees single-stage retries without dropping events.
            </p>
          </div>

          <div className="card-cyber p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-purple-400">DATA PATTERN</span>
              <span className="text-[10px] font-mono text-emerald-400">CHOSEN: WRITE-THROUGH</span>
            </div>
            <h3 className="text-sm font-bold text-white">Write-Through Redis Cache for AST Graphs</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instead of parsing TypeScript AST from disk on every invocation, parsed syntax tree nodes and symbol dependency tables are cached in Redis with SHA-256 commit hashes. Cache hits resolve in &lt;1.8ms, preventing repetitive LLM token re-ingestion.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
