import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  Globe,
  Terminal,
  CheckCircle2,
  Play,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Server,
  RefreshCw,
  ExternalLink,
  Code2,
  Lock,
} from 'lucide-react';

interface PublicApiItem {
  id: string;
  name: string;
  category: 'DEV_TOOLS' | 'SECURITY' | 'OBSERVABILITY' | 'COMMUNICATION' | 'PACKAGE_REGISTRY';
  endpoint: string;
  method: 'GET' | 'POST';
  authType: 'API_KEY' | 'BEARER_TOKEN' | 'NO_AUTH' | 'OAUTH2';
  description: string;
  sampleRequest: Record<string, any>;
  sampleResponse: Record<string, any>;
  latencyMs: number;
  status: 'CONNECTED' | 'STANDBY';
}

const publicApis: PublicApiItem[] = [
  {
    id: 'github-pr-api',
    name: 'GitHub Pull Requests API',
    category: 'DEV_TOOLS',
    endpoint: 'https://api.github.com/repos/enterprise/data-pipeline/pulls/142',
    method: 'GET',
    authType: 'BEARER_TOKEN',
    latencyMs: 82,
    status: 'CONNECTED',
    description:
      'Fetches unified git diffs, changed files, head SHAs, and reviewer approval states directly from GitHub.',
    sampleRequest: {
      headers: {
        Accept: 'application/vnd.github.v3.diff',
        Authorization: 'token ghp_live_9942a1b028...',
      },
    },
    sampleResponse: {
      id: 142,
      state: 'open',
      title: 'fix(csv): sanitize stream and generate UUID fallback for unnamed uploads',
      head: { sha: '4f9b2a1', ref: 'fix/csv-stream-undefined' },
      base: { ref: 'main' },
      changed_files: 3,
      additions: 24,
      deletions: 6,
      mergeable: true,
      mergeable_state: 'clean',
    },
  },
  {
    id: 'nvd-cve-api',
    name: 'National Vulnerability Database (NVD/CVE) API',
    category: 'SECURITY',
    endpoint: 'https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=cpe:2.3:a:fast-csv:fast-csv',
    method: 'GET',
    authType: 'API_KEY',
    latencyMs: 145,
    status: 'CONNECTED',
    description:
      'Queries NIST public vulnerability records to verify that active dependencies contain zero unpatched CVEs.',
    sampleRequest: {
      headers: { apiKey: 'nvd_key_sec_891024' },
      params: { keywordSearch: 'fast-csv multipart stream' },
    },
    sampleResponse: {
      resultsPerPage: 1,
      totalResults: 0,
      format: 'NVD_CVE',
      version: '2.0',
      timestamp: '2026-09-25T15:20:00.000Z',
      vulnerabilities: [],
      auditAssessment: 'CLEAN: No known high or critical CVE vulnerabilities found in patched release.',
    },
  },
  {
    id: 'datadog-apm-api',
    name: 'Datadog / OpenTelemetry APM Traces API',
    category: 'OBSERVABILITY',
    endpoint: 'https://api.datadoghq.com/api/v1/trace/req_92fa801',
    method: 'GET',
    authType: 'API_KEY',
    latencyMs: 110,
    status: 'CONNECTED',
    description:
      'Queries distributed APM spans to correlate TypeError occurrences with specific client requests and stack frames.',
    sampleRequest: {
      params: { query: 'service:data-pipeline error:true', span_id: 'span_88921a' },
    },
    sampleResponse: {
      trace_id: 'req_92fa801',
      service: 'data-pipeline',
      error_count: 184,
      exception: {
        type: 'TypeError',
        message: "Cannot read properties of undefined (reading 'filename')",
        stack_frame: 'src/services/csvUploadService.ts:42:28',
      },
      duration_ms: 12.4,
      status: 500,
    },
  },
  {
    id: 'npm-registry-api',
    name: 'NPM Registry & Package Advisory API',
    category: 'PACKAGE_REGISTRY',
    endpoint: 'https://registry.npmjs.org/fast-csv/latest',
    method: 'GET',
    authType: 'NO_AUTH',
    latencyMs: 65,
    status: 'CONNECTED',
    description:
      'Validates npm package health, verifies semver compatibility, and confirms active license compliance.',
    sampleRequest: {
      headers: { Accept: 'application/vnd.npm.install-v1+json' },
    },
    sampleResponse: {
      name: 'fast-csv',
      version: '5.0.2',
      license: 'MIT',
      deprecated: false,
      engines: { node: '>=18.0.0' },
      dependencies_count: 4,
    },
  },
  {
    id: 'slack-webhook-api',
    name: 'Slack Dev Alert Webhook API',
    category: 'COMMUNICATION',
    endpoint: 'https://hooks.slack.com/services/T00/B00/X00',
    method: 'POST',
    authType: 'NO_AUTH',
    latencyMs: 95,
    status: 'CONNECTED',
    description:
      'Dispatches rich formatted BlockKit notifications to developer war rooms with verified test coverage and release notes.',
    sampleRequest: {
      channel: '#dev-alerts',
      username: 'DevFlow AI Bot',
      text: 'Verified Fix PR #142 ready for human approval (Readiness: 98%)',
    },
    sampleResponse: {
      ok: true,
      message_ts: '1727284920.00192',
      channel: 'C0489921',
    },
  },
];

export const PublicApisView: React.FC = () => {
  const [selectedApiId, setSelectedApiId] = useState<string>('github-pr-api');
  const [activeTabSub, setActiveTabSub] = useState<'RESPONSE' | 'REQUEST'>('RESPONSE');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryOutput, setQueryOutput] = useState<any>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const activeApi = publicApis.find((a) => a.id === selectedApiId) || publicApis[0];

  const handleTestApi = () => {
    setIsQuerying(true);
    setTimeout(() => {
      setQueryOutput(activeApi.sampleResponse);
      setIsQuerying(false);
    }, 450);
  };

  const currentPayload = queryOutput || activeApi.sampleResponse;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentPayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-cyber p-6 relative overflow-hidden bg-gradient-to-r from-[#071522] via-[#0A1B2D] to-[#0D2135] border border-[rgba(34,211,238,0.25)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-500/40 font-semibold">
                PUBLIC-APIS · FREE DEVELOPER ECOSYSTEM
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                5 LIVE CONNECTORS
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Globe className="w-8 h-8 text-teal-400" />
              <span>Public APIs & Connectors Directory</span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Curated public and cloud APIs utilized by DevFlow subagents. Connects directly to GitHub REST/GraphQL, NIST NVD Vulnerability databases, Datadog OpenTelemetry traces, and Slack webhooks.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTestApi}
              disabled={isQuerying}
              className="btn-cyber-primary text-xs flex items-center gap-2"
            >
              {isQuerying ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#06111F]" />
              ) : (
                <Play className="w-4 h-4 fill-[#06111F]" />
              )}
              <span>{isQuerying ? 'Executing API Query...' : 'Test Active API'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: API List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            Available Public Connectors
          </div>
          {publicApis.map((api) => {
            const isSelected = api.id === selectedApiId;
            return (
              <div
                key={api.id}
                onClick={() => {
                  setSelectedApiId(api.id);
                  setQueryOutput(null);
                }}
                className={`card-cyber p-4 cursor-pointer transition-all border ${
                  isSelected
                    ? 'border-teal-500/70 bg-gradient-to-r from-teal-950/30 to-[#0A1B2D] shadow-md shadow-teal-500/10'
                    : 'hover:border-slate-600 hover:bg-[#071522]/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                        api.method === 'GET'
                          ? 'bg-blue-950 text-blue-300 border border-blue-600/30'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-600/30'
                      }`}
                    >
                      {api.method}
                    </span>
                    <h3 className="text-xs font-bold text-white line-clamp-1">{api.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {api.latencyMs}ms
                  </span>
                </div>

                <div className="text-[10px] font-mono text-cyan-400 truncate mb-1">
                  {api.endpoint}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {api.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: API Runner & JSON Viewer */}
        <div className="lg:col-span-7 card-cyber p-5 flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(148,163,184,0.15)] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    activeApi.method === 'GET'
                      ? 'bg-blue-950 text-blue-300 border border-blue-600/30'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-600/30'
                  }`}
                >
                  {activeApi.method}
                </span>
                <span className="text-sm font-bold text-white font-mono">{activeApi.name}</span>
              </div>
              <div className="text-[11px] font-mono text-cyan-400 mt-1 truncate">
                {activeApi.endpoint}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#06111F] text-slate-300 border border-slate-700">
                Auth: {activeApi.authType}
              </span>
              <button
                onClick={handleCopyJson}
                className="btn-cyber-secondary text-xs flex items-center gap-1.5"
              >
                {copiedPayload ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>{copiedPayload ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>

          {/* Sub tabs: Request / Response */}
          <div className="flex items-center justify-between bg-[#06111F] p-1 rounded-xl border border-[rgba(148,163,184,0.15)]">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTabSub('RESPONSE')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  activeTabSub === 'RESPONSE'
                    ? 'bg-teal-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                HTTP 200 Response Payload
              </button>
              <button
                onClick={() => setActiveTabSub('REQUEST')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  activeTabSub === 'REQUEST'
                    ? 'bg-teal-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Request Headers & Parameters
              </button>
            </div>

            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5">
              LATENCY: {activeApi.latencyMs}ms
            </span>
          </div>

          {/* Code Body */}
          <div className="bg-[#06111F] border border-[rgba(148,163,184,0.15)] rounded-xl overflow-hidden flex-1 min-h-[360px] flex flex-col">
            <div className="bg-[#0A1B2D] px-4 py-2 border-b border-[rgba(148,163,184,0.15)] text-[11px] font-mono text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {activeTabSub === 'RESPONSE' ? 'Response Body (application/json)' : 'Request Payload'}
                </span>
              </span>
              <span className="text-emerald-400 font-bold">STATUS: 200 OK</span>
            </div>
            <pre className="p-4 text-[11px] font-mono text-teal-200/90 overflow-x-auto flex-1 leading-relaxed">
              {JSON.stringify(
                activeTabSub === 'RESPONSE' ? currentPayload : activeApi.sampleRequest,
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
