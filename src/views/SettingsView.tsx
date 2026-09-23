import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { 
  Settings, 
  Cpu, 
  Key, 
  Terminal, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldCheck, 
  Server, 
  Zap, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    isSimulatedAdapter, 
    setIsSimulatedAdapter, 
    simulationSpeed, 
    setSimulationSpeed, 
    resetWorkflow 
  } = useWorkflow();

  const [apiKey, setApiKey] = useState('ibm_bob_live_sk_89f02931a2810f92b7');
  const [modelId, setModelId] = useState('ibm/granite-34b-code-instruct');
  const [endpoint, setEndpoint] = useState('https://api.watsonx.ai/v1/devflow/orchestrate');
  const [copiedEnv, setCopiedEnv] = useState(false);

  const envSample = `IBM_BOB_API_KEY=${apiKey}
IBM_WATSONX_ENDPOINT=${endpoint}
DEVFLOW_MODEL_ID=${modelId}
ORCHESTRATOR_MODE=${isSimulatedAdapter ? 'simulation' : 'live'}
SIMULATION_SPEED=${simulationSpeed}
MAX_AUTO_RETRIES=3
HUMAN_IN_THE_LOOP_ENFORCED=true`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border/40 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-cyber-muted font-mono mb-1">
            <span>DevFlow AI</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-cyan-400">Configuration</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-white font-semibold">System & Model Settings</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-3">
            <span>Orchestrator Settings</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border bg-cyan-950/40 text-cyan-400 border-cyan-800/60">
              {isSimulatedAdapter ? 'SANDBOX ADAPTER' : 'LIVE WATSONX ADAPTER'}
            </span>
          </h1>
          <p className="text-sm text-cyber-muted mt-1">
            Toggle between offline deterministic simulation and live IBM Bob 2.0 Granite model inference.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={resetWorkflow}
            className="btn-cyber-secondary flex items-center space-x-2 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* Adapter Architecture Mode Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => setIsSimulatedAdapter(true)}
          className={`card-cyber p-5 cursor-pointer transition-all border ${
            isSimulatedAdapter
              ? 'border-cyan-500 shadow-glow bg-cyan-950/20'
              : 'border-cyber-border hover:border-cyan-500/40 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-cyber-dark border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white font-mono">Offline Simulation Sandbox</h3>
                <p className="text-xs text-cyber-muted">Deterministic evaluation without API tokens</p>
              </div>
            </div>
            {isSimulatedAdapter && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
          </div>
          <div className="mt-4 text-xs text-cyber-muted leading-relaxed font-mono">
            Uses high-fidelity simulated agent telemetry for BUG-142 with zero network latency or token quotas. Ideal for judge tours and hackathon offline demonstrations.
          </div>
        </div>

        <div
          onClick={() => setIsSimulatedAdapter(false)}
          className={`card-cyber p-5 cursor-pointer transition-all border ${
            !isSimulatedAdapter
              ? 'border-cyan-500 shadow-glow bg-cyan-950/20'
              : 'border-cyber-border hover:border-cyan-500/40 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-cyber-dark border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white font-mono">Live IBM Bob 2.0 / watsonx.ai</h3>
                <p className="text-xs text-cyber-muted">Direct multi-agent streaming endpoints</p>
              </div>
            </div>
            {!isSimulatedAdapter && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
          </div>
          <div className="mt-4 text-xs text-cyber-muted leading-relaxed font-mono">
            Connects orchestrator agents directly to Granite-34B and Bob 2.0 remote agent harnesses. Requires valid API credentials and active connectivity.
          </div>
        </div>
      </div>

      {/* Orchestrator Speed & Timing Controls */}
      <div className="card-cyber p-5 space-y-4">
        <div className="border-b border-cyber-border/40 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white font-mono">Execution Simulation Timing</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">Active Speed: {simulationSpeed}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: '1x', title: '1x Realistic', desc: '2.5s per agent stage. Perfect for in-depth judge review.' },
            { id: '2x', title: '2x Accelerated', desc: '1.2s per stage. Balanced presentation velocity.' },
            { id: 'instant', title: 'Instant / Turbo', desc: '200ms per stage. Instant verification of all 10 stages.' },
          ].map((sp) => (
            <div
              key={sp.id}
              onClick={() => setSimulationSpeed(sp.id as any)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                simulationSpeed === sp.id
                  ? 'bg-cyan-500/10 border-cyan-500/60 text-white'
                  : 'bg-cyber-dark/60 border-cyber-border text-cyber-muted hover:border-cyber-border/80'
              }`}
            >
              <div className="text-xs font-mono font-bold text-cyan-400">{sp.title}</div>
              <div className="text-[11px] text-cyber-muted mt-1 leading-snug">{sp.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live WatsonX / IBM Bob Config Inputs */}
      <div className="card-cyber p-5 space-y-4">
        <div className="border-b border-cyber-border/40 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white font-mono">Live IBM API Credentials</h3>
          </div>
          <span className="text-[11px] text-cyber-muted font-mono">Saved in browser session</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="block text-cyber-muted mb-1">IBM WatsonX API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#040b14] border border-cyber-border rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-cyber-muted mb-1">Foundation Model ID</label>
            <input
              type="text"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full bg-[#040b14] border border-cyber-border rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-cyber-muted mb-1">Orchestration Endpoint</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full bg-[#040b14] border border-cyber-border rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Environment Config Preview */}
      <div className="card-cyber p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-cyber-border/40">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white font-mono">.env.local Deployment Template</h3>
          </div>

          <button
            onClick={handleCopyEnv}
            className="px-2.5 py-1 rounded text-xs font-mono bg-cyber-dark hover:bg-cyber-card border border-cyber-border text-cyber-muted hover:text-white transition-colors flex items-center space-x-1"
          >
            {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEnv ? 'Copied!' : 'Copy .env'}</span>
          </button>
        </div>

        <pre className="p-3 bg-[#040b14] rounded-lg border border-cyber-border/60 text-xs font-mono text-cyan-300 leading-relaxed overflow-x-auto">
          {envSample}
        </pre>
      </div>
    </div>
  );
};
