import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  WorkflowStatus,
  StageId,
  SpecializedAgent,
  WorkflowNode,
  IssueItem,
  DocumentItem,
  RepositoryFile,
  RootCauseModel,
  CodeChangeModel,
  TestCenterModel,
  ReviewFinding,
  SecurityGateItem,
  ReleaseCenterModel,
  BenchmarkMetrics,
  ActivityEvent,
} from '../types';
import {
  initialIssue,
  initialAgents,
  initialWorkflowNodes,
  sampleDocuments,
  sampleRepositoryFiles,
  sampleRootCause,
  sampleCodeChange,
  sampleTestCenter,
  sampleReviewFindings,
  sampleSecurityGates,
  sampleReleaseCenter,
  sampleBenchmarkMetrics,
  sampleActivities,
} from '../data/sampleData';

export type NavigationTab =
  | 'overview'
  | 'workflows'
  | 'issues'
  | 'agents'
  | 'repository'
  | 'documents'
  | 'root_cause'
  | 'code_changes'
  | 'tests'
  | 'review'
  | 'security'
  | 'release'
  | 'benchmarks'
  | 'activity'
  | 'settings';

interface WorkflowContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;
  selectedDocId: string | null;
  setSelectedDocId: (id: string | null) => void;
  selectedFilePath: string | null;
  setSelectedFilePath: (path: string | null) => void;
  isJudgeModalOpen: boolean;
  setIsJudgeModalOpen: (open: boolean) => void;

  workflowStatus: WorkflowStatus;
  currentStageId: StageId | null;
  runId: string;
  elapsedSeconds: number;
  simulationSpeed: '1x' | '2x' | 'instant';
  setSimulationSpeed: (speed: '1x' | '2x' | 'instant') => void;
  isSimulatedAdapter: boolean;
  setIsSimulatedAdapter: (simulated: boolean) => void;

  issue: IssueItem;
  setIssue: React.Dispatch<React.SetStateAction<IssueItem>>;
  agents: SpecializedAgent[];
  workflowNodes: WorkflowNode[];
  documents: DocumentItem[];
  repositoryFiles: RepositoryFile[];
  rootCause: RootCauseModel;
  codeChange: CodeChangeModel;
  testCenter: TestCenterModel;
  reviewFindings: ReviewFinding[];
  securityGates: SecurityGateItem[];
  releaseCenter: ReleaseCenterModel;
  benchmarkMetrics: { manual: BenchmarkMetrics; devflow: BenchmarkMetrics };
  setBenchmarkMetrics: React.Dispatch<React.SetStateAction<{ manual: BenchmarkMetrics; devflow: BenchmarkMetrics }>>;
  activities: ActivityEvent[];

  startDemoWorkflow: () => void;
  pauseWorkflow: () => void;
  resumeWorkflow: () => void;
  cancelWorkflow: () => void;
  retryStage: (stageId: StageId) => void;
  stepForward: () => void;
  injectFailure: (stageId: StageId) => void;
  approvePatch: () => void;
  rejectPatch: () => void;
  approveRelease: () => void;
  toggleChecklistItem: (id: string) => void;
  approveReviewFinding: (id: string) => void;
  exportAuditReport: () => void;
  resetWorkflow: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>('doc-readme');
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>('src/services/csvUploadService.ts');
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);

  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('completed');
  const [currentStageId, setCurrentStageId] = useState<StageId | null>('release');
  const [runId, setRunId] = useState<string>('WF-2026-0923-8821');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(31.4);
  const [simulationSpeed, setSimulationSpeed] = useState<'1x' | '2x' | 'instant'>('2x');
  const [isSimulatedAdapter, setIsSimulatedAdapter] = useState(true);

  const [issue, setIssue] = useState<IssueItem>(initialIssue);
  const [agents, setAgents] = useState<SpecializedAgent[]>(initialAgents);
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>(initialWorkflowNodes);
  const [documents] = useState<DocumentItem[]>(sampleDocuments);
  const [repositoryFiles] = useState<RepositoryFile[]>(sampleRepositoryFiles);
  const [rootCause] = useState<RootCauseModel>(sampleRootCause);
  const [codeChange, setCodeChange] = useState<CodeChangeModel>(sampleCodeChange);
  const [testCenter, setTestCenter] = useState<TestCenterModel>(sampleTestCenter);
  const [reviewFindings, setReviewFindings] = useState<ReviewFinding[]>(sampleReviewFindings);
  const [securityGates, setSecurityGates] = useState<SecurityGateItem[]>(sampleSecurityGates);
  const [releaseCenter, setReleaseCenter] = useState<ReleaseCenterModel>(sampleReleaseCenter);
  const [benchmarkMetrics, setBenchmarkMetrics] = useState(sampleBenchmarkMetrics);
  const [activities, setActivities] = useState<ActivityEvent[]>(sampleActivities);

  const timerRef = useRef<any>(null);
  const elapsedTimerRef = useRef<any>(null);

  const STAGE_ORDER: StageId[] = [
    'intake',
    'repo_analysis',
    'log_analysis',
    'doc_analysis',
    'root_cause',
    'fix',
    'test',
    'review',
    'security',
    'release',
  ];

  const logActivity = useCallback((event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toISOString().substring(11, 19) + ' UTC';
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      ...event,
    };
    setActivities((prev) => [newEvent, ...prev]);
  }, []);

  useEffect(() => {
    if (workflowStatus === 'running') {
      elapsedTimerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => +(prev + 0.1).toFixed(1));
      }, 100);
    } else {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    }
    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [workflowStatus]);

  const executeStage = useCallback((stageIndex: number) => {
    if (stageIndex >= STAGE_ORDER.length) {
      setWorkflowStatus('completed');
      setCurrentStageId('release');
      logActivity({
        type: 'SUCCESS',
        stageId: 'release',
        title: 'Workflow Execution Completed',
        message: 'All 10 stages executed. Release candidate v2.4.1-rc.1 ready with 98% release score.',
      });
      return;
    }

    const stageId = STAGE_ORDER[stageIndex];
    setCurrentStageId(stageId);

    setWorkflowNodes((prev) =>
      prev.map((node) => (node.id === stageId ? { ...node, status: 'running' } : node))
    );
    setAgents((prev) =>
      prev.map((agent) => (agent.stageId === stageId ? { ...agent, status: 'running' } : agent))
    );

    const nodeMeta = initialWorkflowNodes.find((n) => n.id === stageId);
    logActivity({
      type: 'INFO',
      stageId,
      agentId: nodeMeta?.agentId,
      title: `${nodeMeta?.label || stageId} Started`,
      message: `Executing autonomous task: ${nodeMeta?.description}`,
    });

    const speedDelayMap = { '1x': 2500, '2x': 1200, instant: 200 };
    const delay = speedDelayMap[simulationSpeed];

    timerRef.current = setTimeout(() => {
      setWorkflowNodes((prev) =>
        prev.map((node) => (node.id === stageId ? { ...node, status: 'completed' } : node))
      );
      setAgents((prev) =>
        prev.map((agent) => (agent.stageId === stageId ? { ...agent, status: 'completed' } : agent))
      );

      const agentData = initialAgents.find((a) => a.stageId === stageId);
      logActivity({
        type: 'SUCCESS',
        stageId,
        agentId: agentData?.id,
        title: `${nodeMeta?.label || stageId} Completed`,
        message: agentData?.output || 'Stage finished with verified artifacts.',
        durationMs: agentData?.durationMs || delay,
      });

      executeStage(stageIndex + 1);
    }, delay);
  }, [simulationSpeed, logActivity]);

  const startDemoWorkflow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const newRunId = `WF-${new Date().toISOString().substring(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRunId(newRunId);
    setElapsedSeconds(0);
    setWorkflowStatus('running');

    setWorkflowNodes((prev) => prev.map((n) => ({ ...n, status: 'queued' })));
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'queued' })));

    logActivity({
      type: 'INFO',
      title: 'DevFlow Demo Workflow Initialized',
      message: `Run ${newRunId} started for ${initialIssue.id}: ${initialIssue.title}`,
    });

    executeStage(0);
  }, [executeStage, logActivity]);

  const pauseWorkflow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setWorkflowStatus('paused');
    logActivity({
      type: 'WARN',
      title: 'Workflow Paused',
      message: `Workflow paused by operator at stage [${currentStageId}].`,
    });
  }, [currentStageId, logActivity]);

  const resumeWorkflow = useCallback(() => {
    if (!currentStageId) return;
    setWorkflowStatus('running');
    const currentIndex = STAGE_ORDER.indexOf(currentStageId);
    logActivity({
      type: 'INFO',
      title: 'Workflow Resumed',
      message: `Workflow resumed at stage [${currentStageId}].`,
    });
    executeStage(currentIndex >= 0 ? currentIndex : 0);
  }, [currentStageId, executeStage, logActivity]);

  const cancelWorkflow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setWorkflowStatus('idle');
    logActivity({
      type: 'WARN',
      title: 'Workflow Cancelled',
      message: 'Workflow execution aborted by operator.',
    });
  }, [logActivity]);

  const retryStage = useCallback((stageId: StageId) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    logActivity({
      type: 'WARN',
      stageId,
      title: `Retrying Stage [${stageId}]`,
      message: 'Operator initiated targeted stage retry without restarting full workflow.',
    });

    setWorkflowNodes((prev) =>
      prev.map((n) => (n.id === stageId ? { ...n, status: 'running' } : n))
    );
    setAgents((prev) =>
      prev.map((a) => (a.stageId === stageId ? { ...a, status: 'running' } : a))
    );

    const speedDelayMap = { '1x': 2000, '2x': 1000, instant: 200 };
    setTimeout(() => {
      setWorkflowNodes((prev) =>
        prev.map((n) => (n.id === stageId ? { ...n, status: 'completed' } : n))
      );
      setAgents((prev) =>
        prev.map((a) => (a.stageId === stageId ? { ...a, status: 'completed' } : a))
      );
      logActivity({
        type: 'SUCCESS',
        stageId,
        title: `Stage [${stageId}] Retry Succeeded`,
        message: 'Diagnostics and synthesis re-verified with clean status.',
      });
    }, speedDelayMap[simulationSpeed]);
  }, [simulationSpeed, logActivity]);

  const stepForward = useCallback(() => {
    const currentIndex = currentStageId ? STAGE_ORDER.indexOf(currentStageId) : -1;
    const nextIndex = currentIndex + 1;
    if (nextIndex < STAGE_ORDER.length) {
      executeStage(nextIndex);
    }
  }, [currentStageId, executeStage]);

  const injectFailure = useCallback((stageId: StageId) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setWorkflowStatus('failed');
    setCurrentStageId(stageId);

    setWorkflowNodes((prev) =>
      prev.map((n) => (n.id === stageId ? { ...n, status: 'failed' } : n))
    );
    setAgents((prev) =>
      prev.map((a) => (a.stageId === stageId ? { ...a, status: 'failed' } : a))
    );

    logActivity({
      type: 'ERROR',
      stageId,
      title: `Error Injected at [${stageId}]`,
      message: 'Simulated failure: Timeout or validation mismatch triggered. Use Single-Stage Retry to recover.',
    });
  }, [logActivity]);

  const approvePatch = useCallback(() => {
    setCodeChange((prev) => ({
      ...prev,
      approvedByHuman: true,
      approvalTimestamp: new Date().toISOString(),
    }));
    logActivity({
      type: 'CHECKPOINT',
      stageId: 'fix',
      title: 'Human Approval: Patch Accepted',
      message: 'Lead developer approved proposed code changes for src/services/csvUploadService.ts.',
    });
  }, [logActivity]);

  const rejectPatch = useCallback(() => {
    setCodeChange((prev) => ({
      ...prev,
      approvedByHuman: false,
    }));
    logActivity({
      type: 'WARN',
      stageId: 'fix',
      title: 'Human Review: Patch Rejected',
      message: 'Operator requested patch regeneration with stricter boundary checks.',
    });
  }, [logActivity]);

  const approveRelease = useCallback(() => {
    setReleaseCenter((prev) => ({
      ...prev,
      humanApproved: true,
      isDeployed: true,
    }));
    logActivity({
      type: 'CHECKPOINT',
      stageId: 'release',
      title: 'Human Approval: Release Dispatched',
      message: 'Release candidate v2.4.1-rc.1 deployed to canary cluster.',
    });
  }, [logActivity]);

  const toggleChecklistItem = useCallback((id: string) => {
    setReleaseCenter((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  }, []);

  const approveReviewFinding = useCallback((id: string) => {
    setReviewFindings((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, humanApproved: !f.humanApproved, status: 'APPROVED' } : f
      )
    );
  }, []);

  const exportAuditReport = useCallback(() => {
    const report = {
      runId,
      timestamp: new Date().toISOString(),
      taskInput: issue,
      workflowStatus,
      elapsedSeconds,
      agentEvents: activities.slice(0, 15),
      filesInspected: initialAgents.flatMap((a) => a.filesInspected),
      generatedArtifacts: initialAgents.flatMap((a) => a.outputArtifacts),
      testResults: {
        total: testCenter.totalTestsCount,
        passed: testCenter.passedCount,
        coverage: testCenter.coverageAfter,
      },
      securityGateResult: '8/8 Gates Passed',
      releaseCandidate: releaseCenter.releaseCandidateName,
      humanSignoff: {
        patchApproved: codeChange.approvedByHuman,
        releaseApproved: releaseCenter.humanApproved,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DevFlow_Audit_Report_${runId}.json`;
    a.click();
    URL.revokeObjectURL(url);

    logActivity({
      type: 'INFO',
      title: 'Audit Report Exported',
      message: `Exported comprehensive audit artifact DevFlow_Audit_Report_${runId}.json`,
    });
  }, [runId, issue, workflowStatus, elapsedSeconds, activities, testCenter, releaseCenter, codeChange, logActivity]);

  const resetWorkflow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setWorkflowStatus('idle');
    setCurrentStageId(null);
    setElapsedSeconds(0);
    setWorkflowNodes((prev) => prev.map((n) => ({ ...n, status: 'queued' })));
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'queued' })));
    logActivity({
      type: 'INFO',
      title: 'Workflow Reset',
      message: 'Reset all orchestrator states to clean idle baseline.',
    });
  }, [logActivity]);

  return (
    <WorkflowContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedAgentId,
        setSelectedAgentId,
        selectedDocId,
        setSelectedDocId,
        selectedFilePath,
        setSelectedFilePath,
        isJudgeModalOpen,
        setIsJudgeModalOpen,
        workflowStatus,
        currentStageId,
        runId,
        elapsedSeconds,
        simulationSpeed,
        setSimulationSpeed,
        isSimulatedAdapter,
        setIsSimulatedAdapter,
        issue,
        setIssue,
        agents,
        workflowNodes,
        documents,
        repositoryFiles,
        rootCause,
        codeChange,
        testCenter,
        reviewFindings,
        securityGates,
        releaseCenter,
        benchmarkMetrics,
        setBenchmarkMetrics,
        activities,
        startDemoWorkflow,
        pauseWorkflow,
        resumeWorkflow,
        cancelWorkflow,
        retryStage,
        stepForward,
        injectFailure,
        approvePatch,
        rejectPatch,
        approveRelease,
        toggleChecklistItem,
        approveReviewFinding,
        exportAuditReport,
        resetWorkflow,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
