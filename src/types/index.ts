export type WorkflowStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';

export type StageId = 
  | 'intake'
  | 'repo_analysis'
  | 'log_analysis'
  | 'doc_analysis'
  | 'root_cause'
  | 'fix'
  | 'test'
  | 'review'
  | 'security'
  | 'release';

export type AgentStatus = 'queued' | 'running' | 'completed' | 'failed' | 'waiting_approval';

export interface SpecializedAgent {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  currentTask: string;
  input: string;
  output: string;
  status: AgentStatus;
  durationMs: number;
  stageId: StageId;
  reasoningSummary: string;
  actionsPerformed: string[];
  filesInspected: string[];
  outputArtifacts: { name: string; type: string; link: string }[];
}

export interface WorkflowNode {
  id: StageId;
  label: string;
  agentId: string;
  dependencies: StageId[];
  status: AgentStatus;
  durationSec: number;
  description: string;
  isParallelBranch?: boolean;
}

export interface IssueItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  priority: 'P0' | 'P1' | 'P2';
  status: 'OPEN' | 'IN_INVESTIGATION' | 'FIX_PROPOSED' | 'VERIFIED' | 'RESOLVED';
  reportedAt: string;
  reporter: string;
  affectedComponent: string;
  description: string;
  errorTrace: string;
  reproductionSteps: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'README' | 'ARCHITECTURE' | 'API_SPEC' | 'BUG_REPORT' | 'LOGS' | 'TEST_REPORT';
  path: string;
  status: 'PARSED' | 'INDEXED' | 'WARNING';
  summary: string;
  extractedRequirements: string[];
  referencedFiles: string[];
  keyFindings: string[];
  evidenceLinks: { label: string; target: string }[];
  rawContent: string;
}

export interface RepositoryFile {
  path: string;
  name: string;
  type: 'file' | 'dir';
  language?: string;
  status?: 'normal' | 'inspected' | 'affected' | 'modified';
  size?: string;
  content?: string;
  children?: RepositoryFile[];
}

export interface RootCauseHypothesis {
  hypothesis: string;
  likelihood: 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string;
  status: 'ACCEPTED' | 'DISPROVED' | 'CONSIDERED';
}

export interface RootCauseModel {
  issueId: string;
  issueSummary: string;
  observedSymptoms: string[];
  affectedComponent: string;
  suspectedFailureCondition: string;
  dependencyChain: string[];
  confidenceScore: number;
  alternativeHypotheses: RootCauseHypothesis[];
  selectedRootCause: string;
  evidenceItems: {
    id: string;
    source: 'LOGS' | 'DOCS' | 'CODE';
    snippet: string;
    location: string;
    impactExplanation: string;
  }[];
}

export interface DiffLine {
  type: 'context' | 'add' | 'del';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface CodeChangeModel {
  filePath: string;
  additions: number;
  deletions: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  rationale: string;
  testImpact: string;
  rollbackNotes: string;
  lines: DiffLine[];
  approvedByHuman: boolean;
  approvalTimestamp?: string;
}

export interface TestCaseItem {
  id: string;
  name: string;
  suite: string;
  durationMs: number;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  isRegression: boolean;
  failureMessage?: string;
}

export interface TestCenterModel {
  command: string;
  existingTestsCount: number;
  regressionTestsCount: number;
  totalTestsCount: number;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
  durationMs: number;
  coverageBefore: number;
  coverageAfter: number;
  testCases: TestCaseItem[];
}

export interface ReviewFinding {
  id: string;
  category: 'correctness' | 'maintainability' | 'security' | 'performance' | 'compatibility' | 'style' | 'test_coverage';
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  file: string;
  line: number;
  title: string;
  explanation: string;
  suggestedAction: string;
  status: 'APPROVED' | 'RESOLVED' | 'FLAGGED';
  humanApproved: boolean;
}

export interface SecurityGateItem {
  id: string;
  title: string;
  category: 'TESTS' | 'LINT' | 'DEPENDENCY' | 'SECRETS' | 'UNSAFE_PATTERNS' | 'API_COMPAT' | 'DOCS' | 'DEPLOYMENT';
  status: 'PASS' | 'WARN' | 'FAIL' | 'NOT_RUN';
  description: string;
  rule: string;
  findingsCount: number;
  isSimulated: boolean;
}

export interface ReleaseChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  required: boolean;
}

export interface ReleaseCenterModel {
  version: string;
  releaseCandidateName: string;
  readinessScore: number;
  releaseNotesMarkdown: string;
  rollbackPlan: string;
  deploymentNotes: string;
  checklist: ReleaseChecklistItem[];
  humanApproved: boolean;
  isDeployed: boolean;
}

export interface BenchmarkMetrics {
  totalTimeMin: number;
  investigationTimeMin: number;
  manualSteps: number;
  contextSwitches: number;
  testCreationTimeMin: number;
  reviewTimeMin: number;
  releasePrepMin: number;
  regressionCoveragePct: number;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  stageId?: StageId;
  agentId?: string;
  title: string;
  message: string;
  durationMs?: number;
  sourceArtifact?: string;
  type: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'CHECKPOINT';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  color: string;
  createdAt: string;
  lastLogin: string;
  isLoggedIn: boolean;
  preferences?: {
    theme?: string;
    geminiApiKey?: string;
    selectedModel?: string;
    notifications?: boolean;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  tokensCount?: number;
  latencyMs?: number;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  pinned?: boolean;
  model: string;
  tags?: string[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  description: string;
  weight: number;
  files: string[];
}

export interface ProjectAspectProgress {
  id: 'frontend' | 'backend' | 'database' | 'deployment' | 'security';
  name: string;
  icon: string;
  percentage: number;
  completedTasks: number;
  totalTasks: number;
  status: 'OPTIMAL' | 'IN_PROGRESS' | 'NEEDS_ATTENTION' | 'COMPLETED';
  summary: string;
  milestones: ProjectMilestone[];
}

