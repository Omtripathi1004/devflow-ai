import {
  IssueItem,
  SpecializedAgent,
  WorkflowNode,
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

export const initialIssue: IssueItem = {
  id: 'BUG-142',
  title: 'CSV upload intermittently fails with TypeError in production',
  severity: 'HIGH',
  priority: 'P0',
  status: 'OPEN',
  reportedAt: '2026-09-23 18:42:10 UTC',
  reporter: 'SRE On-Call / Data Ingestion Team',
  affectedComponent: 'Data Pipeline Service / csvUploadService.ts',
  description:
    'Multiple production enterprise tenants reported 500 Internal Server Errors when uploading bulk batch CSV files without explicit filename headers or when multipart boundary chunking arrives with null file descriptors.',
  errorTrace: `TypeError: Cannot read properties of undefined (reading 'filename')
    at CsvUploadService.validateUpload (src/services/csvUploadService.ts:42:28)
    at CsvUploadService.processFileStream (src/services/csvUploadService.ts:78:14)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async UploadController.handleUpload (src/routes/upload.ts:31:9)`,
  reproductionSteps: [
    'Send multipart/form-data POST request to /api/v1/uploads/csv with header missing Content-Disposition filename param',
    'Stream chunks with delayed boundary metadata',
    'Observe unhandled promise rejection TypeError at csvUploadService.ts:42',
    'Server returns HTTP 500 without structured client error payload',
  ],
};

export const initialAgents: SpecializedAgent[] = [
  {
    id: 'repo-agent',
    name: 'Repository Agent',
    role: 'AST & Codebase Graph Navigator',
    avatarColor: '#22D3EE',
    currentTask: 'Indexed repository graph and mapped symbol dependencies for CsvUploadService',
    input: 'Repository branch: main @ commit 4f9b2a1; target issue: BUG-142',
    output: 'Identified 3 callers across upload routes, detected unhandled stream edge case in csvUploadService.ts:42',
    status: 'completed',
    durationMs: 4200,
    stageId: 'repo_analysis',
    reasoningSummary:
      'Scanned TypeScript AST across src/services and src/routes. Symbol CsvUploadService.validateUpload expects an UploadedFile payload object but does not guard against undefined payload in multipart boundary edge cases.',
    actionsPerformed: [
      'Cloned active branch AST index into memory',
      'Traversed symbol hierarchy for validateUpload and processFileStream',
      'Extracted caller graph: UploadController -> CsvUploadService',
      'Identified lack of type guard at line 42',
    ],
    filesInspected: [
      'src/services/csvUploadService.ts',
      'src/routes/upload.ts',
      'src/config/storage.ts',
      'src/types/upload.ts',
    ],
    outputArtifacts: [
      { name: 'Symbol Dependency Graph', type: 'JSON', link: '#repo' },
      { name: 'Caller Impact Matrix', type: 'AST_MAP', link: '#repo' },
    ],
  },
  {
    id: 'log-agent',
    name: 'Log Agent',
    role: 'Observability & Telemetry Triage',
    avatarColor: '#3B82F6',
    currentTask: 'Correlated production Datadog traces with APM exception traces',
    input: 'Production error log slice [18:00 - 18:45 UTC], filter: "status:500 service:data-pipeline"',
    output: '184 occurrences isolated across 14 enterprise tenants; 100% matched TypeError at csvUploadService.ts:42',
    status: 'completed',
    durationMs: 3800,
    stageId: 'log_analysis',
    reasoningSummary:
      'Error spike began immediately following v2.4.0 rollout when legacy multipart parser was swapped for streaming pipeline. 100% of failed requests lacked filename attribute in Content-Disposition.',
    actionsPerformed: [
      'Queried OpenTelemetry traces for correlation ID req_92fa801',
      'Filtered log streams by TypeError signature',
      'Aggregated tenant impact distribution',
      'Confirmed memory and CPU utilization were nominal prior to exception',
    ],
    filesInspected: ['logs/production_error_trace.log', 'telemetry/apm_metrics.json'],
    outputArtifacts: [
      { name: 'Error Frequency Histogram', type: 'METRICS', link: '#root-cause' },
      { name: 'Correlated Request Payloads', type: 'LOG_DUMP', link: '#docs' },
    ],
  },
  {
    id: 'doc-agent',
    name: 'Documentation Agent',
    role: 'Specification & RFC Context Engine',
    avatarColor: '#10B981',
    currentTask: 'Cross-referenced OpenAPI 3.1 specification against RFC 7578 multipart specifications',
    input: 'docs/API_SPEC.yaml, docs/ARCHITECTURE.md, README.md',
    output: 'Contract specifies optional filename with fallback to sanitized UUID timestamp',
    status: 'completed',
    durationMs: 3100,
    stageId: 'doc_analysis',
    reasoningSummary:
      'API spec explicitly defines upload file parameter as optional filename fallback. Architecture document states service should safely sanitize or generate fallback filename if client omitted parameter.',
    actionsPerformed: [
      'Parsed OpenAPI 3.1 schema definitions',
      'Extracted error handling requirements from ARCHITECTURE.md Section 4.2',
      'Validated compliance rules for multipart stream validation',
    ],
    filesInspected: ['docs/API_SPEC.yaml', 'docs/ARCHITECTURE.md', 'README.md'],
    outputArtifacts: [
      { name: 'Extracted Requirements Specs', type: 'REQUIREMENTS', link: '#docs' },
      { name: 'Contract Discrepancy Note', type: 'SPEC_DIFF', link: '#docs' },
    ],
  },
  {
    id: 'root-cause-agent',
    name: 'Root-Cause Agent',
    role: 'Diagnostic Synthesizer & Causal Graph Engine',
    avatarColor: '#F59E0B',
    currentTask: 'Synthesized AST, telemetry, and documentation into unified causal proof',
    input: 'Repository Agent AST diff + Log Agent 184 trace matches + Doc Agent RFC contract',
    output: 'Determined Root Cause with 96% confidence: Missing null guard and filename fallback in validateUpload()',
    status: 'completed',
    durationMs: 4600,
    stageId: 'root_cause',
    reasoningSummary:
      'Line 42 of csvUploadService.ts accessed file.filename without verifying if file object was initialized by streaming parser when client sends chunks without filename header. Root cause established.',
    actionsPerformed: [
      'Built multi-modal causal chain from logs, AST, and spec',
      'Evaluated and disproved 2 alternative hypotheses (memory starvation, stream backpressure)',
      'Calculated 96% diagnostic confidence score',
      'Linked exact code coordinates to failing log traces',
    ],
    filesInspected: ['src/services/csvUploadService.ts', 'logs/production_error_trace.log'],
    outputArtifacts: [
      { name: 'RCA Diagnostic Graph', type: 'DIAGNOSTIC', link: '#root-cause' },
      { name: 'Hypotheses Matrix', type: 'RCA_MATRIX', link: '#root-cause' },
    ],
  },
  {
    id: 'fix-agent',
    name: 'Fix Agent',
    role: 'Autonomous Patch Synthesizer',
    avatarColor: '#22D3EE',
    currentTask: 'Generated non-breaking defensive validation patch with UUID fallback and stream guard',
    input: 'Root cause diagnostic coordinates + TypeScript strict typing constraints',
    output: 'Generated patch for src/services/csvUploadService.ts (+24 lines, -6 lines)',
    status: 'completed',
    durationMs: 5100,
    stageId: 'fix',
    reasoningSummary:
      'Implemented defensive payload check, sanitized fallback filename generation using crypto.randomUUID(), strict mime-type validation, and graceful stream error handler returning clean 400 Bad Request.',
    actionsPerformed: [
      'Synthesized defensive guard block at validateUpload',
      'Added fallback filename generator using crypto.randomUUID()',
      'Wrapped stream pipe in try-catch with error propagation',
      'Preserved complete backward compatibility with existing callers',
    ],
    filesInspected: ['src/services/csvUploadService.ts'],
    outputArtifacts: [
      { name: 'Git Patch Unified Diff', type: 'DIFF', link: '#diff' },
      { name: 'Rollback Strategy Document', type: 'PLAN', link: '#diff' },
    ],
  },
  {
    id: 'test-agent',
    name: 'Test Agent',
    role: 'Regression & Test Suite Orchestrator',
    avatarColor: '#38BDF8',
    currentTask: 'Executed existing test suite and generated 5 new deterministic regression tests',
    input: 'Proposed patch + 42 baseline tests in tests/services/csvUploadService.test.ts',
    output: '47/47 tests passed (42 existing + 5 new regression scenarios); coverage increased from 74.2% to 88.6%',
    status: 'completed',
    durationMs: 6400,
    stageId: 'test',
    reasoningSummary:
      'All 42 preexisting tests executed without regressions. 5 new regression scenarios verified: missing filename header, empty chunk stream, corrupted delimiter, oversize payload, and stream cleanup.',
    actionsPerformed: [
      'Ran baseline test suite: 42 passed, 0 failed',
      'Synthesized 5 regression test cases covering reproduction vector',
      'Executed updated suite under mock multipart streams',
      'Calculated line and branch test coverage deltas',
    ],
    filesInspected: [
      'tests/services/csvUploadService.test.ts',
      'tests/fixtures/malformed.csv',
      'tests/fixtures/valid.csv',
    ],
    outputArtifacts: [
      { name: 'Test Execution Results (JUnit)', type: 'XML', link: '#tests' },
      { name: 'Code Coverage Report', type: 'LCOV', link: '#tests' },
    ],
  },
  {
    id: 'review-agent',
    name: 'Review Agent',
    role: 'Enterprise AI Code Reviewer',
    avatarColor: '#818CF8',
    currentTask: 'Evaluated proposed patch against 7 enterprise code quality criteria',
    input: 'Unified code diff + test report + repository style guides',
    output: '6 findings generated (1 security resolved, 1 performance improvement applied, 4 recommendations approved)',
    status: 'completed',
    durationMs: 4100,
    stageId: 'review',
    reasoningSummary:
      'Patch conforms to production architecture guidelines. Cryptographic randomness verified. Minor recommendation to add sanitization regex for legacy extensions was integrated.',
    actionsPerformed: [
      'Evaluated Correctness, Maintainability, Security, Performance, Compatibility, Style, and Test Coverage',
      'Verified zero memory leaks in streaming file descriptors',
      'Checked TypeScript 5.4 strict compliance',
      'Prepared human review summary breakdown',
    ],
    filesInspected: ['src/services/csvUploadService.ts', 'tsconfig.json'],
    outputArtifacts: [
      { name: 'AI Review Summary Card', type: 'REVIEW', link: '#review' },
      { name: 'Quality Scorecard', type: 'METRICS', link: '#review' },
    ],
  },
  {
    id: 'security-agent',
    name: 'Security Agent',
    role: 'SAST & Quality Gate Enforcer',
    avatarColor: '#EF4444',
    currentTask: 'Conducted automated static analysis, secret scanning, and dependency check',
    input: 'Patch AST + package.json + environment variable schemas',
    output: '8/8 Quality Gates PASSED (Zero High/Critical CVEs, Zero hardcoded secrets, AST sanitized)',
    status: 'completed',
    durationMs: 3900,
    stageId: 'security',
    reasoningSummary:
      'No secrets or sensitive tokens exposed. Input path traversal protections validated. MIME-type validation prevents malicious executable upload spoofing.',
    actionsPerformed: [
      'Scanned for hardcoded secrets and tokens',
      'Performed AST vulnerability pattern matching for path traversal',
      'Audited direct and transitive dependencies against OSV and CVE feeds',
      'Validated API schema backwards compatibility',
    ],
    filesInspected: ['src/services/csvUploadService.ts', 'package.json', 'package-lock.json'],
    outputArtifacts: [
      { name: 'Security Gate Assessment', type: 'AUDIT', link: '#security' },
      { name: 'SBOM Dependency Analysis', type: 'CYCLONEDX', link: '#security' },
    ],
  },
  {
    id: 'release-agent',
    name: 'Release Agent',
    role: 'Release Engineer & Audit Scribe',
    avatarColor: '#10B981',
    currentTask: 'Assembled release candidate v2.4.1-rc.1 with deployment checklist and rollback strategy',
    input: 'All validated artifacts from Stages 1 through 9',
    output: 'Release Candidate v2.4.1-rc.1 generated with 98% release readiness score and comprehensive release notes',
    status: 'completed',
    durationMs: 3200,
    stageId: 'release',
    reasoningSummary:
      'All automated prerequisites, regression tests, and security scans completed successfully. Release candidate package staged and waiting for human approval signature.',
    actionsPerformed: [
      'Generated Semantic Version bump v2.4.0 -> v2.4.1-rc.1',
      'Compiled Markdown changelog and customer-facing release notes',
      'Constructed canary deployment verification plan',
      'Published audit hash and signed metadata manifest',
    ],
    filesInspected: ['package.json', 'CHANGELOG.md', 'release/v2.4.1.manifest.json'],
    outputArtifacts: [
      { name: 'Release Notes (Markdown)', type: 'DOC', link: '#release' },
      { name: 'Canary Deployment Checklist', type: 'CHECKLIST', link: '#release' },
    ],
  },
];

export const initialWorkflowNodes: WorkflowNode[] = [
  {
    id: 'intake',
    label: 'Issue Intake & Triage',
    agentId: 'repo-agent',
    dependencies: [],
    status: 'completed',
    durationSec: 3.2,
    description: 'Parse bug report, triage severity P0, ingest reproduction telemetry',
  },
  {
    id: 'repo_analysis',
    label: 'Repository Analysis',
    agentId: 'repo-agent',
    dependencies: ['intake'],
    status: 'completed',
    durationSec: 4.2,
    description: 'Traverse AST, map symbol references and call hierarchy',
    isParallelBranch: true,
  },
  {
    id: 'log_analysis',
    label: 'Log Analysis',
    agentId: 'log-agent',
    dependencies: ['intake'],
    status: 'completed',
    durationSec: 3.8,
    description: 'Aggregate production error traces and correlate APM spans',
    isParallelBranch: true,
  },
  {
    id: 'doc_analysis',
    label: 'Document Analysis',
    agentId: 'doc-agent',
    dependencies: ['intake'],
    status: 'completed',
    durationSec: 3.1,
    description: 'Inspect OpenAPI schema and architectural error handling specs',
    isParallelBranch: true,
  },
  {
    id: 'root_cause',
    label: 'Root Cause Synthesis',
    agentId: 'root-cause-agent',
    dependencies: ['repo_analysis', 'log_analysis', 'doc_analysis'],
    status: 'completed',
    durationSec: 4.6,
    description: 'Multi-modal causal proof linking code line to runtime exception',
  },
  {
    id: 'fix',
    label: 'Patch Synthesis',
    agentId: 'fix-agent',
    dependencies: ['root_cause'],
    status: 'completed',
    durationSec: 5.1,
    description: 'Synthesize non-breaking defensive validation patch',
  },
  {
    id: 'test',
    label: 'Automated Regression Tests',
    agentId: 'test-agent',
    dependencies: ['fix'],
    status: 'completed',
    durationSec: 6.4,
    description: 'Execute 42 existing tests + synthesize 5 new regression tests',
  },
  {
    id: 'review',
    label: 'AI Code Review',
    agentId: 'review-agent',
    dependencies: ['test'],
    status: 'completed',
    durationSec: 4.1,
    description: '7-category code review with human approval checkpoints',
  },
  {
    id: 'security',
    label: 'Security & Quality Gates',
    agentId: 'security-agent',
    dependencies: ['review'],
    status: 'completed',
    durationSec: 3.9,
    description: 'SAST, Secret scanning, AST pattern verification, CVE audit',
  },
  {
    id: 'release',
    label: 'Release Readiness',
    agentId: 'release-agent',
    dependencies: ['security'],
    status: 'completed',
    durationSec: 3.2,
    description: 'Draft release notes, generate release candidate v2.4.1-rc.1',
  },
];

export const sampleDocuments: DocumentItem[] = [
  {
    id: 'doc-readme',
    title: 'README.md',
    type: 'README',
    path: 'README.md',
    status: 'INDEXED',
    summary:
      'High-level project overview of Data Ingestion Pipeline, quickstart instructions, environment configuration and architecture summary.',
    extractedRequirements: [
      'Node.js >= 20.x runtime requirement',
      'Supports CSV, JSON, and Parquet batch uploads up to 50MB',
      'High-availability multipart stream processing with zero temp-disk exhaustion',
    ],
    referencedFiles: ['src/services/csvUploadService.ts', 'src/routes/upload.ts', 'config/storage.ts'],
    keyFindings: [
      'Document indicates upload pipeline was migrated to streaming chunk architecture in v2.4.0',
      'States optional filename parameter must fallback to client session ID or generated timestamp',
    ],
    evidenceLinks: [
      { label: 'Upload Specs §3.1', target: '#diff' },
      { label: 'Architecture Guide', target: '#docs' },
    ],
    rawContent: `# Enterprise Data Ingestion Pipeline

High throughput, resilient data pipeline microservice designed for multi-tenant batch ingestion.

## Supported Formats
- CSV (RFC 4180 compliant, custom delimiters, auto-header inference)
- JSON Lines (ndjson streaming)
- Apache Parquet

## File Upload Constraints
- Default max file size: 50MB (configurable via \`MAX_UPLOAD_SIZE_BYTES\`)
- Streaming multipart/form-data handler: processes stream chunks directly into S3/GCS without buffering whole file in RAM.
- Filename requirement: Clients should send \`filename\` in \`Content-Disposition\`; if omitted, the service falls back to a generated UUIDv4 to preserve non-blocking ingest.
`,
  },
  {
    id: 'doc-arch',
    title: 'ARCHITECTURE.md',
    type: 'ARCHITECTURE',
    path: 'docs/ARCHITECTURE.md',
    status: 'INDEXED',
    summary:
      'Technical design documentation explaining streaming pipeline, backpressure management, error propagation, and security sandboxing.',
    extractedRequirements: [
      'Section 4.2: Stream validation must happen prior to piping to storage sink',
      'Section 4.5: Unhandled exceptions must be caught and mapped to HTTP 400 with sanitized code "INVALID_UPLOAD_DESCRIPTOR"',
      'Section 5.1: Path traversal protection must sanitize any provided filename using alphanumeric strip',
    ],
    referencedFiles: ['src/services/csvUploadService.ts', 'src/middleware/errorHandler.ts'],
    keyFindings: [
      'Identified contract requirement that was violated by the unhandled TypeError at line 42',
      'Architecture requires structured JSON error response instead of generic 500 crashes',
    ],
    evidenceLinks: [
      { label: 'Section 4.2 Stream Guards', target: '#root-cause' },
      { label: 'Section 5.1 Path Traversal Sanitization', target: '#diff' },
    ],
    rawContent: `# Pipeline Architecture & Design Specifications

## 4. Ingestion Lifecycle
1. Request received at \`/api/v1/uploads/csv\`
2. Authentication & tenant quota check via middleware
3. Multipart header validation & chunk streaming initialization
4. Defensive validation of file descriptor (file payload must not be null/undefined)
5. Pipe stream to storage provider with backpressure handling
6. Asynchronous worker queue dispatch for column typing & schema inference

### 4.2 Defensive Upload Rules
- Never assume client provided valid Content-Disposition metadata
- When filename is undefined or empty string, generate safe cryptographic identifier: \`crypto.randomUUID() + '.csv'\`
- Enforce strict MIME-type checking against \`['text/csv', 'application/vnd.ms-excel', 'text/plain']\`
`,
  },
  {
    id: 'doc-api',
    title: 'API_SPEC.yaml',
    type: 'API_SPEC',
    path: 'docs/API_SPEC.yaml',
    status: 'INDEXED',
    summary:
      'OpenAPI 3.1 specification for Data Ingestion endpoints including parameter descriptions and expected error schemas.',
    extractedRequirements: [
      'Endpoint: POST /api/v1/uploads/csv',
      'Content-Type: multipart/form-data',
      'Responses: 200 OK (UploadSuccess), 400 Bad Request (ValidationError), 413 Payload Too Large',
    ],
    referencedFiles: ['src/routes/upload.ts'],
    keyFindings: [
      'OpenAPI spec declares filename as optional property',
      '500 Internal Server Error returned in production represents an undocumented failure mode violating API SLA',
    ],
    evidenceLinks: [
      { label: 'OpenAPI Schema /uploads/csv', target: '#diff' },
    ],
    rawContent: `openapi: 3.1.0
info:
  title: Data Ingestion API
  version: 2.4.0
paths:
  /api/v1/uploads/csv:
    post:
      summary: Upload CSV dataset
      operationId: uploadCsvFile
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                  description: "Binary CSV data stream. Filename in Content-Disposition is optional."
      responses:
        '200':
          description: Upload successful and scheduled for ingestion
        '400':
          description: Invalid upload descriptor or corrupted CSV format
        '500':
          description: Internal server error (Not permitted under SLA)
`,
  },
  {
    id: 'doc-bug',
    title: 'BUG-142_Triage_Report.md',
    type: 'BUG_REPORT',
    path: 'reports/BUG-142.md',
    status: 'PARSED',
    summary:
      'Detailed triage report filed by SRE on-call following automated alerts from customer support desk.',
    extractedRequirements: [
      'Must resolve 500 error on CSV uploads without filename',
      'Must maintain zero performance regression on high-throughput 50MB uploads',
      'Must pass backward compatibility for legacy automated ETL clients',
    ],
    referencedFiles: ['src/services/csvUploadService.ts', 'logs/production_error_trace.log'],
    keyFindings: [
      '184 error occurrences logged in the last 45 minutes',
      'Tenant impact isolated to legacy automated script uploads using curl without filename header',
    ],
    evidenceLinks: [
      { label: 'View Root Cause Synthesis', target: '#root-cause' },
      { label: 'Inspect Production Logs', target: '#docs' },
    ],
    rawContent: `# Incident Triage: BUG-142

**Incident Status**: Active P0
**Trigger**: Alert \`HighRate5xx_DataPipeline\` fired at 18:04 UTC
**Impact**: 14 Enterprise Tenants experiencing intermittent CSV upload rejections
**Identified Trace**:
\`\`\`
TypeError: Cannot read properties of undefined (reading 'filename')
    at CsvUploadService.validateUpload (src/services/csvUploadService.ts:42:28)
\`\`\`
**Hypothesis**: Missing filename header in \`multipart/form-data\` request payload causes \`file.filename\` lookup on undefined property.
`,
  },
  {
    id: 'doc-logs',
    title: 'production_error_trace.log',
    type: 'LOGS',
    path: 'logs/production_error_trace.log',
    status: 'PARSED',
    summary:
      '184 production exception logs captured across cluster nodes between 18:00 and 18:45 UTC.',
    extractedRequirements: [
      'Trace correlation ID req_92fa801 matching tenant enterprise-corp-us',
      'Memory footprint was stable at 38% heap usage',
    ],
    referencedFiles: ['src/services/csvUploadService.ts'],
    keyFindings: [
      'Stack trace directly confirms line 42 of csvUploadService.ts as point of unhandled exception',
    ],
    evidenceLinks: [
      { label: 'Code Coordinates L42', target: '#diff' },
      { label: 'Correlated Trace View', target: '#root-cause' },
    ],
    rawContent: `2026-09-23T18:04:12.419Z [ERROR] [trace_id=req_92fa801] [tenant=enterprise-corp-us] CsvUploadService: Unhandled exception during file upload processing
TypeError: Cannot read properties of undefined (reading 'filename')
    at CsvUploadService.validateUpload (src/services/csvUploadService.ts:42:28)
    at CsvUploadService.processFileStream (src/services/csvUploadService.ts:78:14)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async UploadController.handleUpload (src/routes/upload.ts:31:9)
2026-09-23T18:04:12.422Z [WARN]  [trace_id=req_92fa801] Response status: 500 Internal Server Error returned to client 198.51.100.42
2026-09-23T18:05:01.104Z [ERROR] [trace_id=req_77bc119] [tenant=fintech-global] CsvUploadService: Unhandled exception during file upload processing
TypeError: Cannot read properties of undefined (reading 'filename')
    at CsvUploadService.validateUpload (src/services/csvUploadService.ts:42:28)
`,
  },
];

export const sampleRepositoryFiles: RepositoryFile[] = [
  {
    name: 'src',
    path: 'src',
    type: 'dir',
    children: [
      {
        name: 'services',
        path: 'src/services',
        type: 'dir',
        children: [
          {
            name: 'csvUploadService.ts',
            path: 'src/services/csvUploadService.ts',
            type: 'file',
            language: 'typescript',
            status: 'modified',
            size: '4.8 KB',
            content: `import { Readable } from 'node:stream';
import { randomUUID } from 'node:crypto';
import { StorageProvider } from '../config/storage';
import { BadRequestError } from '../errors/appErrors';

export interface UploadPayload {
  stream: Readable;
  filename?: string;
  mimetype?: string;
  encoding?: string;
}

export interface UploadResult {
  fileId: string;
  filename: string;
  sizeBytes: number;
  storedPath: string;
  uploadedAt: string;
}

export class CsvUploadService {
  private allowedMimeTypes = new Set([
    'text/csv',
    'application/vnd.ms-excel',
    'text/plain',
  ]);

  constructor(private storage: StorageProvider) {}

  /**
   * Validates upload metadata and guarantees safe filename resolution
   */
  public validateUpload(file: Partial<UploadPayload> | undefined): { sanitizedFilename: string; verifiedMime: string } {
    if (!file || !file.stream) {
      throw new BadRequestError('Upload payload is missing required file stream');
    }

    // Defensive resolution: fallback to UUID if filename is omitted or blank
    const rawFilename = file.filename?.trim();
    const sanitizedFilename = rawFilename && rawFilename.length > 0
      ? rawFilename.replace(/[^a-zA-Z0-9._-]/g, '_')
      : \`upload_\${randomUUID()}.csv\`;

    const verifiedMime = file.mimetype && this.allowedMimeTypes.has(file.mimetype)
      ? file.mimetype
      : 'text/csv';

    return { sanitizedFilename, verifiedMime };
  }

  public async processFileStream(file: UploadPayload): Promise<UploadResult> {
    const { sanitizedFilename, verifiedMime } = this.validateUpload(file);
    const fileId = randomUUID();
    const storedPath = \`ingest/\${fileId}_\${sanitizedFilename}\`;

    const bytesWritten = await this.storage.saveStream(storedPath, file.stream, verifiedMime);

    return {
      fileId,
      filename: sanitizedFilename,
      sizeBytes: bytesWritten,
      storedPath,
      uploadedAt: new Date().toISOString(),
    };
  }
}
`,
          },
          {
            name: 'dataPipeline.ts',
            path: 'src/services/dataPipeline.ts',
            type: 'file',
            language: 'typescript',
            status: 'inspected',
            size: '6.2 KB',
            content: `// Data Pipeline Ingestion Coordinator
export class DataPipeline {
  // Dispatches parsed stream chunks to worker queues
}
`,
          },
        ],
      },
      {
        name: 'routes',
        path: 'src/routes',
        type: 'dir',
        children: [
          {
            name: 'upload.ts',
            path: 'src/routes/upload.ts',
            type: 'file',
            language: 'typescript',
            status: 'inspected',
            size: '3.1 KB',
            content: `import { Router } from 'express';
import { CsvUploadService } from '../services/csvUploadService';

export const uploadRouter = Router();

uploadRouter.post('/csv', async (req, res, next) => {
  try {
    const filePayload = req.file; // from multipart middleware
    const result = await csvService.processFileStream(filePayload);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});
`,
          },
        ],
      },
      {
        name: 'config',
        path: 'src/config',
        type: 'dir',
        children: [
          {
            name: 'storage.ts',
            path: 'src/config/storage.ts',
            type: 'file',
            language: 'typescript',
            status: 'normal',
            size: '2.4 KB',
            content: `// Storage provider configuration
export interface StorageProvider {
  saveStream(path: string, stream: any, mime: string): Promise<number>;
}
`,
          },
        ],
      },
    ],
  },
  {
    name: 'tests',
    path: 'tests',
    type: 'dir',
    children: [
      {
        name: 'csvUploadService.test.ts',
        path: 'tests/services/csvUploadService.test.ts',
        type: 'file',
        language: 'typescript',
        status: 'modified',
        size: '8.4 KB',
        content: `import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Readable } from 'node:stream';
import { CsvUploadService } from '../../src/services/csvUploadService';

describe('CsvUploadService Unit & Regression Tests', () => {
  let service: CsvUploadService;
  let mockStorage: any;

  beforeEach(() => {
    mockStorage = {
      saveStream: vi.fn().mockResolvedValue(1024),
    };
    service = new CsvUploadService(mockStorage);
  });

  // 42 Pre-existing baseline tests
  it('should upload valid CSV file with explicit filename', async () => {
    const stream = Readable.from(['col1,col2\\nval1,val2']);
    const result = await service.processFileStream({
      stream,
      filename: 'customers.csv',
      mimetype: 'text/csv',
    });
    expect(result.filename).toBe('customers.csv');
    expect(result.sizeBytes).toBe(1024);
  });

  // 5 NEW Regression Tests for BUG-142
  it('REGRESSION: should safely accept upload when filename is undefined and generate safe fallback', async () => {
    const stream = Readable.from(['id,name\\n1,Acme Corp']);
    const result = await service.processFileStream({
      stream,
      filename: undefined,
      mimetype: 'text/csv',
    });
    expect(result.filename).toMatch(/^upload_[a-f0-9-]+\\.csv$/);
  });

  it('REGRESSION: should sanitize malicious path traversal characters in filename', async () => {
    const stream = Readable.from(['id,name\\n1,Test']);
    const result = await service.processFileStream({
      stream,
      filename: '../../etc/passwd',
      mimetype: 'text/csv',
    });
    expect(result.filename).not.toContain('..');
    expect(result.filename).toBe('.._.._etc_passwd');
  });

  it('REGRESSION: should reject upload with 400 Bad Request when file payload is null', () => {
    expect(() => service.validateUpload(null as any)).toThrow('Upload payload is missing required file stream');
  });

  it('REGRESSION: should fallback to text/csv when unrecognized mimetype is provided', () => {
    const stream = Readable.from(['col\\n1']);
    const validated = service.validateUpload({
      stream,
      filename: 'data.csv',
      mimetype: 'application/x-malicious-binary',
    });
    expect(validated.verifiedMime).toBe('text/csv');
  });

  it('REGRESSION: should handle empty whitespace filename string safely', () => {
    const stream = Readable.from(['header\\nval']);
    const validated = service.validateUpload({ stream, filename: '   ' });
    expect(validated.sanitizedFilename).toMatch(/^upload_[a-f0-9-]+\\.csv$/);
  });
});
`,
      },
    ],
  },
  {
    name: 'docs',
    path: 'docs',
    type: 'dir',
    children: [
      { name: 'ARCHITECTURE.md', path: 'docs/ARCHITECTURE.md', type: 'file', language: 'markdown', status: 'inspected' },
      { name: 'API_SPEC.yaml', path: 'docs/API_SPEC.yaml', type: 'file', language: 'yaml', status: 'inspected' },
    ],
  },
  {
    name: 'package.json',
    path: 'package.json',
    type: 'file',
    language: 'json',
    status: 'normal',
    size: '1.2 KB',
    content: `{
  "name": "data-pipeline-service",
  "version": "2.4.0",
  "scripts": {
    "test": "vitest run"
  }
}`,
  },
];

export const sampleRootCause: RootCauseModel = {
  issueId: 'BUG-142',
  issueSummary: 'CSV upload intermittently fails with unhandled TypeError in production',
  observedSymptoms: [
    '500 Internal Server Error returned to clients uploading without filename parameter',
    'Application stack trace points to csvUploadService.ts line 42 accessing undefined.filename',
    'Failure rate of 8.2% on batch ingestion endpoints during high peak hours',
    'Customer tickets reporting failed automated cron uploads from legacy curl scripts',
  ],
  affectedComponent: 'CsvUploadService (src/services/csvUploadService.ts)',
  suspectedFailureCondition:
    'Invocation of validateUpload() where file parameter or file.filename is undefined or missing from multipart boundary chunks.',
  dependencyChain: [
    'External Client / Legacy ETL script sends multipart request without filename attribute',
    'Express multipart parsing middleware populates req.file with stream but undefined filename property',
    'UploadController passes req.file into CsvUploadService.processFileStream',
    'CsvUploadService.validateUpload evaluates file.filename.trim() directly without optional chaining or null guard',
    'Node.js V8 runtime throws unhandled TypeError, rejecting promise and triggering HTTP 500 handler',
  ],
  confidenceScore: 96,
  alternativeHypotheses: [
    {
      hypothesis: 'Stream memory exhaustion or buffer overflow under high load',
      likelihood: 'LOW',
      reasoning: 'APM telemetry shows node heap memory was steady at 38% utilization during all 184 incidents.',
      status: 'DISPROVED',
    },
    {
      hypothesis: 'Corrupted CSV encoding or non-UTF8 binary payload',
      likelihood: 'LOW',
      reasoning: 'Exception occurs prior to CSV parsing phase inside metadata validation before stream pipe opens.',
      status: 'DISPROVED',
    },
    {
      hypothesis: 'Missing null/undefined guard on file.filename in validateUpload()',
      likelihood: 'HIGH',
      reasoning: 'Matches exact line number, reproduced in 100% of test runs with synthetic payloads missing filename.',
      status: 'ACCEPTED',
    },
  ],
  selectedRootCause:
    'Unchecked property access on optional filename header in validateUpload() (csvUploadService.ts:42). When multipart clients omit the filename parameter, file.filename is undefined, causing a runtime TypeError that crashes the upload lifecycle.',
  evidenceItems: [
    {
      id: 'ev-1',
      source: 'LOGS',
      snippet: "TypeError: Cannot read properties of undefined (reading 'filename') at CsvUploadService.validateUpload (src/services/csvUploadService.ts:42:28)",
      location: 'logs/production_error_trace.log:L2',
      impactExplanation: 'Demonstrates deterministic exception throwing at line 42.',
    },
    {
      id: 'ev-2',
      source: 'DOCS',
      snippet: 'When filename is undefined or empty string, generate safe cryptographic identifier: crypto.randomUUID() + .csv',
      location: 'docs/ARCHITECTURE.md §4.2',
      impactExplanation: 'Documents the explicit specification requirement that the current implementation neglected.',
    },
    {
      id: 'ev-3',
      source: 'CODE',
      snippet: 'const filename = file.filename.trim(); // line 42 unchecked access',
      location: 'src/services/csvUploadService.ts:42',
      impactExplanation: 'AST inspection confirms lack of optional chaining (?.) or truthiness validation.',
    },
  ],
};

export const sampleCodeChange: CodeChangeModel = {
  filePath: 'src/services/csvUploadService.ts',
  additions: 24,
  deletions: 6,
  riskLevel: 'LOW',
  rationale:
    'Introduces defensive checks for undefined payload and file.stream. Adds crypto.randomUUID() fallback for omitted or blank filenames, sanitizes filename against path traversal attacks, and validates MIME types against allowed whitelist.',
  testImpact:
    'Fixes all 184 production reproduction traces. 42 existing unit tests pass without deviation. 5 new regression tests verify fallback generation, path traversal sanitation, and null guards.',
  rollbackNotes:
    'Can be reverted via standard git revert commit in < 60 seconds without database schema migrations. Alternatively, toggle feature flag FF_STRICT_CSV_VALIDATION=false.',
  approvedByHuman: true,
  approvalTimestamp: '2026-09-23 18:55:00 UTC',
  lines: [
    { type: 'context', oldLineNumber: 38, newLineNumber: 38, content: "  constructor(private storage: StorageProvider) {}" },
    { type: 'context', oldLineNumber: 39, newLineNumber: 39, content: "" },
    { type: 'context', oldLineNumber: 40, newLineNumber: 40, content: "  /**" },
    { type: 'context', oldLineNumber: 41, newLineNumber: 41, content: "   * Validates upload metadata and guarantees safe filename resolution" },
    { type: 'del', oldLineNumber: 42, content: "  public validateUpload(file: any): { filename: string } {" },
    { type: 'del', oldLineNumber: 43, content: "    const filename = file.filename.trim();" },
    { type: 'del', oldLineNumber: 44, content: "    return { filename };" },
    { type: 'del', oldLineNumber: 45, content: "  }" },
    { type: 'add', newLineNumber: 42, content: "  public validateUpload(file: Partial<UploadPayload> | undefined): { sanitizedFilename: string; verifiedMime: string } {" },
    { type: 'add', newLineNumber: 43, content: "    if (!file || !file.stream) {" },
    { type: 'add', newLineNumber: 44, content: "      throw new BadRequestError('Upload payload is missing required file stream');" },
    { type: 'add', newLineNumber: 45, content: "    }" },
    { type: 'add', newLineNumber: 46, content: "" },
    { type: 'add', newLineNumber: 47, content: "    // Defensive resolution: fallback to UUID if filename is omitted or blank" },
    { type: 'add', newLineNumber: 48, content: "    const rawFilename = file.filename?.trim();" },
    { type: 'add', newLineNumber: 49, content: "    const sanitizedFilename = rawFilename && rawFilename.length > 0" },
    { type: 'add', newLineNumber: 50, content: "      ? rawFilename.replace(/[^a-zA-Z0-9._-]/g, '_')" },
    { type: 'add', newLineNumber: 51, content: "      : `upload_${randomUUID()}.csv`;" },
    { type: 'add', newLineNumber: 52, content: "" },
    { type: 'add', newLineNumber: 53, content: "    const verifiedMime = file.mimetype && this.allowedMimeTypes.has(file.mimetype)" },
    { type: 'add', newLineNumber: 54, content: "      ? file.mimetype" },
    { type: 'add', newLineNumber: 55, content: "      : 'text/csv';" },
    { type: 'add', newLineNumber: 56, content: "" },
    { type: 'add', newLineNumber: 57, content: "    return { sanitizedFilename, verifiedMime };" },
    { type: 'add', newLineNumber: 58, content: "  }" },
    { type: 'context', oldLineNumber: 46, newLineNumber: 59, content: "" },
    { type: 'context', oldLineNumber: 47, newLineNumber: 60, content: "  public async processFileStream(file: UploadPayload): Promise<UploadResult> {" },
    { type: 'del', oldLineNumber: 48, content: "    const { filename } = this.validateUpload(file);" },
    { type: 'del', oldLineNumber: 49, content: "    const fileId = randomUUID();" },
    { type: 'add', newLineNumber: 61, content: "    const { sanitizedFilename, verifiedMime } = this.validateUpload(file);" },
    { type: 'add', newLineNumber: 62, content: "    const fileId = randomUUID();" },
    { type: 'add', newLineNumber: 63, content: "    const storedPath = `ingest/${fileId}_${sanitizedFilename}`;" },
    { type: 'context', oldLineNumber: 50, newLineNumber: 64, content: "" },
    { type: 'context', oldLineNumber: 51, newLineNumber: 65, content: "    const bytesWritten = await this.storage.saveStream(storedPath, file.stream, verifiedMime);" },
  ],
};

export const sampleTestCenter: TestCenterModel = {
  command: 'npm test -- --filter=csvUploadService --coverage',
  existingTestsCount: 42,
  regressionTestsCount: 5,
  totalTestsCount: 47,
  passedCount: 47,
  failedCount: 0,
  skippedCount: 0,
  durationMs: 1420,
  coverageBefore: 74.2,
  coverageAfter: 88.6,
  testCases: [
    { id: 't-1', suite: 'Existing Baseline', name: 'should upload valid CSV file with explicit filename', durationMs: 24, status: 'PASSED', isRegression: false },
    { id: 't-2', suite: 'Existing Baseline', name: 'should stream 50MB batch without RAM exhaustion', durationMs: 180, status: 'PASSED', isRegression: false },
    { id: 't-3', suite: 'Existing Baseline', name: 'should calculate correct line count and byte size', durationMs: 45, status: 'PASSED', isRegression: false },
    { id: 't-4', suite: 'Existing Baseline', name: 'should reject non-CSV extensions (.exe, .sh)', durationMs: 12, status: 'PASSED', isRegression: false },
    { id: 't-5', suite: 'Existing Baseline', name: 'should preserve BOM headers for Excel exports', durationMs: 18, status: 'PASSED', isRegression: false },
    { id: 't-reg-1', suite: 'New Regression [BUG-142]', name: 'REGRESSION: should safely accept upload when filename is undefined and generate safe fallback', durationMs: 15, status: 'PASSED', isRegression: true },
    { id: 't-reg-2', suite: 'New Regression [BUG-142]', name: 'REGRESSION: should sanitize malicious path traversal characters in filename', durationMs: 11, status: 'PASSED', isRegression: true },
    { id: 't-reg-3', suite: 'New Regression [BUG-142]', name: 'REGRESSION: should reject upload with 400 Bad Request when file payload is null', durationMs: 9, status: 'PASSED', isRegression: true },
    { id: 't-reg-4', suite: 'New Regression [BUG-142]', name: 'REGRESSION: should fallback to text/csv when unrecognized mimetype is provided', durationMs: 14, status: 'PASSED', isRegression: true },
    { id: 't-reg-5', suite: 'New Regression [BUG-142]', name: 'REGRESSION: should handle empty whitespace filename string safely', durationMs: 10, status: 'PASSED', isRegression: true },
  ],
};

export const sampleReviewFindings: ReviewFinding[] = [
  {
    id: 'rev-1',
    category: 'correctness',
    severity: 'HIGH',
    file: 'src/services/csvUploadService.ts',
    line: 43,
    title: 'Guarded payload check prevents null pointer dereference',
    explanation:
      'Previous implementation accessed file.filename without verifying if file was defined. Guard clause directly resolves BUG-142.',
    suggestedAction: 'Keep guard clause with explicit descriptive BadRequestError.',
    status: 'APPROVED',
    humanApproved: true,
  },
  {
    id: 'rev-2',
    category: 'security',
    severity: 'MEDIUM',
    file: 'src/services/csvUploadService.ts',
    line: 50,
    title: 'Path traversal sanitization regex',
    explanation:
      'Replacing non-alphanumeric characters with underscores prevents directory traversal attacks like ../../etc/passwd.',
    suggestedAction: 'Ensure regex matches all POSIX and Windows special characters.',
    status: 'APPROVED',
    humanApproved: true,
  },
  {
    id: 'rev-3',
    category: 'performance',
    severity: 'LOW',
    file: 'src/services/csvUploadService.ts',
    line: 23,
    title: 'Use of Set for O(1) MIME-type membership check',
    explanation:
      'Using allowedMimeTypes Set avoids linear array scanning during high-throughput ingestion spikes.',
    suggestedAction: 'Approved as optimal practice.',
    status: 'APPROVED',
    humanApproved: true,
  },
  {
    id: 'rev-4',
    category: 'maintainability',
    severity: 'INFO',
    file: 'src/services/csvUploadService.ts',
    line: 42,
    title: 'Explicit TypeScript return signature',
    explanation:
      'Method explicitly types { sanitizedFilename: string; verifiedMime: string } for compiler safety.',
    suggestedAction: 'No changes required.',
    status: 'APPROVED',
    humanApproved: true,
  },
  {
    id: 'rev-5',
    category: 'compatibility',
    severity: 'INFO',
    file: 'src/services/csvUploadService.ts',
    line: 51,
    title: 'Backward compatibility with standard RFC 4180 uploaders',
    explanation:
      'Standard clients passing valid filenames experience zero behavioral change; legacy automated scripts without filenames are unblocked.',
    suggestedAction: 'Verified backward compatibility.',
    status: 'APPROVED',
    humanApproved: true,
  },
  {
    id: 'rev-6',
    category: 'test_coverage',
    severity: 'LOW',
    file: 'tests/services/csvUploadService.test.ts',
    line: 48,
    title: 'Regression suite covers all boundary conditions',
    explanation:
      'Added 5 targeted regression tests covering null payload, undefined filename, whitespace filename, and traversal attempts.',
    suggestedAction: 'Maintain regression tests permanently in CI pipeline.',
    status: 'APPROVED',
    humanApproved: true,
  },
];

export const sampleSecurityGates: SecurityGateItem[] = [
  {
    id: 'gate-tests',
    title: 'Automated Test Suite',
    category: 'TESTS',
    status: 'PASS',
    description: '47/47 unit and regression test cases passing (0 failures, 0 skipped)',
    rule: '100% pass rate required on all regression suites',
    findingsCount: 0,
    isSimulated: true,
  },
  {
    id: 'gate-lint',
    title: 'Static Code Linting',
    category: 'LINT',
    status: 'PASS',
    description: 'ESLint and TypeScript strict type-checking passed with zero warnings',
    rule: 'no-explicit-any, strictNullChecks: true',
    findingsCount: 0,
    isSimulated: true,
  },
  {
    id: 'gate-dep',
    title: 'Dependency Vulnerability Audit',
    category: 'DEPENDENCY',
    status: 'PASS',
    description: 'Scanned 109 production dependencies; 0 Critical, 0 High vulnerabilities detected',
    rule: 'Zero High/Critical CVEs in active production manifest',
    findingsCount: 0,
    isSimulated: true,
  },
  {
    id: 'gate-secrets',
    title: 'Secret & Credential Detection',
    category: 'SECRETS',
    status: 'PASS',
    description: 'Scanned diff for API keys, AWS tokens, private keys, and passwords',
    rule: 'Entropy scanner detects zero committed credentials',
    findingsCount: 0,
    isSimulated: true,
  },
  {
    id: 'gate-ast',
    title: 'Unsafe AST Code Patterns',
    category: 'UNSAFE_PATTERNS',
    status: 'PASS',
    description: 'No eval(), child_process, or arbitrary file system writes detected in patch',
    rule: 'Strict prohibition of un-sandboxed shell or eval invocations',
    findingsCount: 0,
    isSimulated: true,
  },
  {
    id: 'gate-api',
    title: 'API Schema Compatibility',
    category: 'API_COMPAT',
    status: 'PASS',
    description: 'All modified response types are backward-compatible with OpenAPI 3.1 contract',
    rule: 'No breaking changes permitted in minor or patch releases',
    findingsCount: 0,
    isSimulated: true,
  },
  {
    id: 'gate-docs',
    title: 'Documentation Impact Check',
    category: 'DOCS',
    status: 'PASS',
    description: 'Code change complies with ARCHITECTURE.md §4.2 specifications',
    rule: 'Code modifications must align with architecture requirements',
    findingsCount: 0,
    isSimulated: true,
  },
  {
    id: 'gate-deploy',
    title: 'Deployment Configuration',
    category: 'DEPLOYMENT',
    status: 'WARN',
    description: 'Canary deployment recommended due to core data ingestion path modification',
    rule: 'Canary rollout at 10% traffic recommended for core services',
    findingsCount: 1,
    isSimulated: true,
  },
];

export const sampleReleaseCenter: ReleaseCenterModel = {
  version: 'v2.4.1',
  releaseCandidateName: 'v2.4.1-rc.1',
  readinessScore: 98,
  humanApproved: true,
  isDeployed: false,
  releaseNotesMarkdown: `## DevFlow AI Release Candidate: v2.4.1-rc.1
**Target Issue**: BUG-142 (CSV upload intermittently fails in production)
**Build Status**: PASSED (47/47 Tests, Coverage: 88.6%)
**Quality Gate**: PASSED (0 Vulnerabilities, 0 Secrets)

### Summary of Changes
- **Defensive Ingestion Guard**: Added robust null checks and undefined stream protections in \`CsvUploadService.validateUpload()\`.
- **Fallback Filename Generator**: If client omits \`filename\` in multipart \`Content-Disposition\`, automatically falls back to \`upload_\${randomUUID()}.csv\`.
- **Path Traversal Sanitization**: Strips unsafe directory navigation sequences from incoming filenames.
- **MIME-Type Validation**: Enforces whitelist verification with safe fallback to \`text/csv\`.

### Verification & Testing
- 42 existing baseline unit tests verified with zero regression.
- 5 new automated regression tests synthesized by DevFlow Test Agent.
- Verified test coverage increased from 74.2% to 88.6%.

### Rollback Plan
- Fast revert available via \`git revert HEAD\` in < 60 seconds.
- Emergency feature flag: \`export FF_STRICT_CSV_VALIDATION=false\`.
`,
  rollbackPlan:
    'Instant single-commit revert via git revert. Feature flag FF_STRICT_CSV_VALIDATION=false will disable filename fallback and revert to previous streaming handler without redeployment.',
  deploymentNotes:
    '1. Deploy to Canary cluster (10% traffic) for 15 minutes.\n2. Monitor Datadog APM dashboard for TypeError count (must stay 0).\n3. Promote to 100% production traffic upon verification.',
  checklist: [
    { id: 'chk-1', title: 'Automated test suite passed (47/47 tests)', completed: true, required: true },
    { id: 'chk-2', title: 'Security & Secret scan completed (0 findings)', completed: true, required: true },
    { id: 'chk-3', title: 'AI Code Review approved across 7 categories', completed: true, required: true },
    { id: 'chk-4', title: 'Human-in-the-loop developer patch sign-off', completed: true, required: true },
    { id: 'chk-5', title: 'Canary rollback plan documented and tested', completed: true, required: true },
    { id: 'chk-6', title: 'Staging verification test passed', completed: true, required: false },
  ],
};

export const sampleBenchmarkMetrics: {
  manual: BenchmarkMetrics;
  devflow: BenchmarkMetrics;
} = {
  manual: {
    totalTimeMin: 195,
    investigationTimeMin: 75,
    manualSteps: 18,
    contextSwitches: 24,
    testCreationTimeMin: 45,
    reviewTimeMin: 35,
    releasePrepMin: 40,
    regressionCoveragePct: 45.0,
  },
  devflow: {
    totalTimeMin: 31,
    investigationTimeMin: 4.5,
    manualSteps: 2,
    contextSwitches: 2,
    testCreationTimeMin: 6.0,
    reviewTimeMin: 8.0,
    releasePrepMin: 4.5,
    regressionCoveragePct: 88.6,
  },
};

export const sampleActivities: ActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: '18:42:12 UTC',
    type: 'INFO',
    stageId: 'intake',
    title: 'Workflow Initialized',
    message: 'BUG-142 ingested from P0 Alert channel. Dispatching autonomous investigation pipeline.',
  },
  {
    id: 'act-2',
    timestamp: '18:42:15 UTC',
    type: 'INFO',
    stageId: 'repo_analysis',
    agentId: 'repo-agent',
    title: 'Parallel Investigation Dispatched',
    message: 'Repository Agent, Log Agent, and Documentation Agent started in parallel.',
  },
  {
    id: 'act-3',
    timestamp: '18:42:19 UTC',
    type: 'SUCCESS',
    stageId: 'log_analysis',
    agentId: 'log-agent',
    title: 'Log Agent Completed',
    message: 'Correlated 184 production traces with TypeError at csvUploadService.ts:42.',
    durationMs: 3800,
    sourceArtifact: 'logs/production_error_trace.log',
  },
  {
    id: 'act-4',
    timestamp: '18:42:20 UTC',
    type: 'SUCCESS',
    stageId: 'doc_analysis',
    agentId: 'doc-agent',
    title: 'Documentation Agent Completed',
    message: 'Extracted optional filename specification from OpenAPI and ARCHITECTURE.md §4.2.',
    durationMs: 3100,
    sourceArtifact: 'docs/ARCHITECTURE.md',
  },
  {
    id: 'act-5',
    timestamp: '18:42:22 UTC',
    type: 'SUCCESS',
    stageId: 'repo_analysis',
    agentId: 'repo-agent',
    title: 'Repository Agent Completed',
    message: 'AST graph resolved. Identified missing payload check in validateUpload().',
    durationMs: 4200,
    sourceArtifact: 'src/services/csvUploadService.ts',
  },
  {
    id: 'act-6',
    timestamp: '18:42:27 UTC',
    type: 'SUCCESS',
    stageId: 'root_cause',
    agentId: 'root-cause-agent',
    title: 'Root Cause Synthesized (96% Confidence)',
    message: 'Isolated root cause: Missing null guard and filename fallback in validateUpload().',
    durationMs: 4600,
    sourceArtifact: 'RCA Diagnostic Graph',
  },
  {
    id: 'act-7',
    timestamp: '18:42:33 UTC',
    type: 'SUCCESS',
    stageId: 'fix',
    agentId: 'fix-agent',
    title: 'Patch Generated (+24 / -6)',
    message: 'Synthesized defensive guard, crypto.randomUUID fallback, and path sanitization.',
    durationMs: 5100,
    sourceArtifact: 'src/services/csvUploadService.ts (Diff)',
  },
  {
    id: 'act-8',
    timestamp: '18:42:40 UTC',
    type: 'SUCCESS',
    stageId: 'test',
    agentId: 'test-agent',
    title: 'Regression Tests Passed (47/47)',
    message: '42 baseline tests + 5 new regression scenarios passed. Coverage rose to 88.6%.',
    durationMs: 6400,
    sourceArtifact: 'tests/services/csvUploadService.test.ts',
  },
  {
    id: 'act-9',
    timestamp: '18:42:45 UTC',
    type: 'SUCCESS',
    stageId: 'review',
    agentId: 'review-agent',
    title: 'AI Code Review Completed',
    message: '6 findings evaluated across 7 categories. Security & maintainability approved.',
    durationMs: 4100,
    sourceArtifact: 'Review Scorecard',
  },
  {
    id: 'act-10',
    timestamp: '18:42:49 UTC',
    type: 'SUCCESS',
    stageId: 'security',
    agentId: 'security-agent',
    title: 'Security & Quality Gate Passed',
    message: '8/8 checks passed. Zero secrets, zero High/Critical CVEs.',
    durationMs: 3900,
    sourceArtifact: 'Security Gate Assessment',
  },
  {
    id: 'act-11',
    timestamp: '18:42:53 UTC',
    type: 'CHECKPOINT',
    stageId: 'release',
    agentId: 'release-agent',
    title: 'Release Candidate v2.4.1-rc.1 Ready',
    message: 'Release readiness score: 98%. Ready for human approval & deployment.',
    durationMs: 3200,
    sourceArtifact: 'Release Candidate v2.4.1-rc.1',
  },
];
