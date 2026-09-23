import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Users, 
  Zap, 
  ChevronRight, 
  Award,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const BenchmarksView: React.FC = () => {
  const { benchmarkMetrics } = useWorkflow();
  const { manual, devflow } = benchmarkMetrics;

  const [hourlyRate, setHourlyRate] = useState<number>(120);
  const [incidentsPerMonth, setIncidentsPerMonth] = useState<number>(15);
  const [teamSize, setTeamSize] = useState<number>(8);

  const hoursSavedPerIncident = (manual.totalTimeMin - devflow.totalTimeMin) / 60;
  const monthlyHoursSaved = hoursSavedPerIncident * incidentsPerMonth;
  const annualDollarsSaved = Math.round(monthlyHoursSaved * 12 * hourlyRate);

  const chartData = [
    { stage: 'Investigation', manual: manual.investigationTimeMin, devflow: devflow.investigationTimeMin },
    { stage: 'Fix Synthesis', manual: 40, devflow: 5 },
    { stage: 'Test Creation', manual: manual.testCreationTimeMin, devflow: devflow.testCreationTimeMin },
    { stage: 'Code Review', manual: manual.reviewTimeMin, devflow: devflow.reviewTimeMin },
    { stage: 'Release Prep', manual: manual.releasePrepMin, devflow: devflow.releasePrepMin },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border/40 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-cyber-muted font-mono mb-1">
            <span>DevFlow AI</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-cyan-400">Engineering Intelligence</span>
            <ChevronRight className="w-3 h-3 text-cyan-500/50" />
            <span className="text-white font-semibold">Productivity & ROI Benchmarks</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-3">
            <span>Empirical Performance Benchmarks</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border bg-cyan-950/40 text-cyan-400 border-cyan-800/60">
              -84% CYCLE REDUCTION
            </span>
          </h1>
          <p className="text-sm text-cyber-muted mt-1">
            Quantifiable metrics comparing traditional human triage cycles against DevFlow AI autonomous agent workflows.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-emerald-400 text-xs font-mono">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Validated on Enterprise Bug BUG-142</span>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Total Resolution Time</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-cyan-400 font-mono">{devflow.totalTimeMin}m</span>
            <span className="text-xs text-cyber-muted font-mono line-through">{manual.totalTimeMin}m</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-mono font-semibold">
            -84.1% Time Saved (-164 mins)
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Manual Steps Needed</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-mono">{devflow.manualSteps}</span>
            <span className="text-xs text-cyber-muted font-mono line-through">{manual.manualSteps} steps</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-mono">
            Only 2 human approval gates
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Context Switches</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-mono">{devflow.contextSwitches}</span>
            <span className="text-xs text-cyber-muted font-mono line-through">{manual.contextSwitches} switches</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-mono">
            91% less cognitive disruption
          </div>
        </div>

        <div className="card-cyber p-4">
          <div className="text-xs font-mono text-cyber-muted mb-1 flex items-center space-x-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Est. Annual Savings</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-mono">
            ${(annualDollarsSaved / 1000).toFixed(0)}k/yr
          </div>
          <div className="text-xs text-cyber-muted mt-1 font-mono">
            Based on current calculator params
          </div>
        </div>
      </div>

      {/* Main Grid: Comparison Chart + Interactive ROI Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Chart */}
        <div className="lg:col-span-2 card-cyber p-5">
          <div className="flex items-center justify-between pb-3 border-b border-cyber-border/40">
            <div>
              <h3 className="text-sm font-semibold text-white font-mono">Stage-by-Stage Latency Breakdown</h3>
              <p className="text-xs text-cyber-muted">Minutes spent in each lifecycle phase</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-600 inline-block"></span>
                <span className="text-cyber-muted">Manual Human Dev</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-cyan-400 inline-block"></span>
                <span className="text-cyan-400">DevFlow AI</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="stage" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="m" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071522',
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="manual" name="Manual Human (min)" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="devflow" name="DevFlow AI (min)" fill="#22D3EE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Metrics Table */}
          <div className="mt-6 border-t border-cyber-border/40 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-cyber-dark/60 p-2.5 rounded border border-cyber-border">
              <div className="text-cyber-muted text-[11px]">Triage & RCA</div>
              <div className="text-white font-bold mt-0.5">80m ➔ 8m (-90%)</div>
            </div>
            <div className="bg-cyber-dark/60 p-2.5 rounded border border-cyber-border">
              <div className="text-cyber-muted text-[11px]">Patch Writing</div>
              <div className="text-white font-bold mt-0.5">40m ➔ 5m (-87%)</div>
            </div>
            <div className="bg-cyber-dark/60 p-2.5 rounded border border-cyber-border">
              <div className="text-cyber-muted text-[11px]">Test Synthesis</div>
              <div className="text-white font-bold mt-0.5">45m ➔ 4m (-91%)</div>
            </div>
            <div className="bg-cyber-dark/60 p-2.5 rounded border border-cyber-border">
              <div className="text-cyber-muted text-[11px]">Review & Release</div>
              <div className="text-white font-bold mt-0.5">30m ➔ 14m (-53%)</div>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive ROI Calculator */}
        <div className="card-cyber p-5 space-y-5">
          <div className="border-b border-cyber-border/40 pb-3">
            <h3 className="text-sm font-semibold text-white font-mono flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Interactive ROI Calculator</span>
            </h3>
            <p className="text-xs text-cyber-muted mt-0.5">Simulate cost and time savings for your team</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-cyber-muted">Dev Blended Rate ($/hr)</span>
                <span className="text-cyan-400 font-bold">${hourlyRate}/hr</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(+e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-cyber-muted">Monthly Maintenance Issues</span>
                <span className="text-cyan-400 font-bold">{incidentsPerMonth} issues/mo</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={incidentsPerMonth}
                onChange={(e) => setIncidentsPerMonth(+e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-cyber-muted">Engineering Team Size</span>
                <span className="text-cyan-400 font-bold">{teamSize} engineers</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                step="1"
                value={teamSize}
                onChange={(e) => setTeamSize(+e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-[#050e18] p-4 rounded-lg border border-cyan-500/20 space-y-3 font-mono">
            <div className="text-xs text-cyber-muted">Calculated Economic Impact:</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Engineering Hours Saved:</span>
              <span className="text-white font-bold">{Math.round(monthlyHoursSaved)} hrs/mo</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Dev Capacity Unlocked:</span>
              <span className="text-cyan-400 font-bold">~{((monthlyHoursSaved / 160)).toFixed(1)} Full-Time Devs</span>
            </div>
            <div className="pt-2 border-t border-cyber-border/60 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold">Net Annual Value:</span>
              <span className="text-lg font-bold text-emerald-400">${annualDollarsSaved.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
