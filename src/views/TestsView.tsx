import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Play, 
  ShieldCheck, 
  Terminal, 
  Clock, 
  Layers, 
  Sparkles, 
  RefreshCw,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';

export const TestsView: React.FC = () => {
  const { testCenter, retryStage, injectFailure } = useWorkflow();
  const [filter, setFilter] = useState<'ALL' | 'REGRESSION' | 'PASSED' | 'FAILED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRerunTests = () => {
    setIsExecuting(true);
    retryStage('test');
    setTimeout(() => {
      setIsExecuting(false);
    }, 1200);
  };

  const filteredTests = testCenter.testCases.filter((tc) => {
    if (filter === 'REGRESSION' && !tc.isRegression) return false;
    if (filter === 'PASSED' && tc.status !== 'PASSED') return false;
    if (filter === 'FAILED' && tc.status !== 'FAILED') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return tc.name.toLowerCase().includes(q) || tc.suite.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border/40 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-cyber-muted font-mono mb-1">
            <span>DevFlow AI</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-cyan-400">Quality Assurance</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-white font-semibold">Autonomous Test Suite</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-3">
            <span>Automated Test Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border bg-emerald-950/40 text-emerald-400 border-emerald-800/60">
              100% SUITE PASS RATE
            </span>
          </h1>
          <p className="text-sm text-cyber-muted mt-1">
            Regression test generation, edge-case coverage validation, and test harness execution.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRerunTests}
            disabled={isExecuting}
            className="btn-cyber-primary flex items-center space-x-2 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Executing Suite...' : 'Re-Run Test Suite'}</span>
          </button>

          <button
            onClick={() => injectFailure('test')}
            className="px-3 py-1.5 rounded-md text-xs font-mono bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/50 transition-colors flex items-center space-x-1.5"
            title="Simulate regression failure to test orchestrator recovery"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Simulate Failure</span>
          </button>
        </div>
      </div>

      {/* Test Center Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Pass Rate Metric */}
        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pass Rate</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {testCenter.passedCount} / {testCenter.totalTestsCount}
          </div>
          <div className="text-xs text-cyber-muted mt-1 flex items-center space-x-2">
            <span className="text-emerald-400 font-mono font-semibold">100% Passed</span>
            <span>•</span>
            <span className="font-mono text-cyan-400">+{testCenter.regressionTestsCount} new tests</span>
          </div>
        </div>

        {/* Coverage Jump Metric */}
        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Code Coverage Delta</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {testCenter.coverageAfter}%
          </div>
          <div className="text-xs text-cyber-muted mt-1 flex items-center space-x-1 font-mono">
            <span>from</span>
            <span className="text-cyber-muted/80">{testCenter.coverageBefore}%</span>
            <span className="text-emerald-400 font-semibold">(+{(testCenter.coverageAfter - testCenter.coverageBefore).toFixed(1)}%)</span>
          </div>
        </div>

        {/* Suite Duration */}
        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Execution Duration</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {(testCenter.durationMs / 1000).toFixed(2)}s
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            In-band parallel worker execution
          </div>
        </div>

        {/* Regression Guard */}
        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Regression Guard</span>
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono">
            5 Scenarios
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            Zero regressions detected on trunk
          </div>
        </div>
      </div>

      {/* Terminal Command Snippet */}
      <div className="card-cyber p-3 bg-[#050e18] flex items-center justify-between border-cyan-500/20 font-mono text-xs">
        <div className="flex items-center space-x-2 text-cyber-muted truncate">
          <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="text-cyan-400 select-none">$</span>
          <span className="text-slate-200">{testCenter.command}</span>
        </div>
        <span className="text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 flex-shrink-0">
          EXIT CODE 0
        </span>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-cyber-muted" />
          <input
            type="text"
            placeholder="Search tests or suites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cyber-dark/80 border border-cyber-border rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-cyber-muted focus:outline-none focus:border-cyan-500/50 font-mono"
          />
        </div>

        <div className="flex items-center space-x-1.5 bg-cyber-dark/80 p-1 rounded-md border border-cyber-border text-xs font-mono w-full sm:w-auto">
          {(['ALL', 'REGRESSION', 'PASSED', 'FAILED'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1 rounded transition-colors ${
                filter === mode
                  ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
                  : 'text-cyber-muted hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="card-cyber overflow-hidden">
        <div className="p-3 bg-cyber-dark/80 border-b border-cyber-border flex items-center justify-between text-xs font-mono text-cyber-muted">
          <span>Showing {filteredTests.length} of {testCenter.totalTestsCount} Test Specifications</span>
          <span>Harness: Jest / ts-jest runner</span>
        </div>

        <div className="divide-y divide-cyber-border/40">
          {filteredTests.map((tc) => (
            <div
              key={tc.id}
              className="p-3.5 hover:bg-cyber-dark/40 transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-3">
                {tc.status === 'PASSED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                )}

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-white font-mono">{tc.name}</span>
                    {tc.isRegression && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50 flex items-center space-x-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>AI GENERATED REGRESSION</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-cyber-muted font-mono mt-0.5 flex items-center space-x-2">
                    <span className="text-cyan-400/80">{tc.suite}</span>
                    <span>•</span>
                    <span>ID: {tc.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 flex-shrink-0 font-mono text-xs">
                <span className="text-cyber-muted">{tc.durationMs}ms</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  tc.status === 'PASSED'
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : 'bg-red-950/60 text-red-400 border border-red-800/40'
                }`}>
                  {tc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
