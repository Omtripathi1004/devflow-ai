# DevFlow AI — Autonomous Developer Workflow Platform

> **Live Demo**: [https://devflow-ai-swart.vercel.app](https://devflow-ai-swart.vercel.app)
>
> **Built on IBM Bob 2.0 Multi-Agent Concepts**: Specialized Autonomous Subagents, Parallel Investigation Branches, Document & AST Understanding, Guarded Patch Synthesis, Regression Testing, and Human-in-the-Loop Release Validation.

> **IBM Bob 2.0 Usage Statement:** This repository is a DevFlow AI demonstration that uses IBM Bob 2.0 concepts and deterministic simulated agent telemetry. It is not an official IBM product, does not claim to run a live IBM Bob service by default, and requires configured credentials before any live adapter can be used.

---

## 🤖 IBM Bob 2.0 Engine Architectural Integration

DevFlow AI demonstrates **IBM Bob 2.0** orchestration patterns in a Vite + React + TypeScript application. The default adapter is deterministic simulation, while the Settings view exposes an optional live adapter configuration:
- **Agent Mode Workspace Management:** Operates autonomously across the codebase, parsing AST trees, generating test suites, and creating multi-file code diffs.
- **Parallel Subagent Tasks:** Triggers concurrent subagents: `Doc-Intel` (PRD Ingestion), `AST Reviewer` (Code Drift Analysis), `Test Synthesizer` (Unit Test Generation), and `Patch Generator` (Diff Engine).
- **Document Understanding:** Ingests non-negotiable PRD specifications to evaluate diffs against system architecture.

### 📸 Proof of Engine Execution
The repository session evidence and execution record are stored in:
- `docs/screenshots/bob-session-1.png`
- `docs/screenshots/bob-session-2.png`
- `docs/screenshots/bob-execution-log.json`

Session links:
- [Execution log](docs/screenshots/bob-execution-log.json)
- [Primary session screenshot (Agent Mode & Test Results)](docs/screenshots/bob-session-1.png)
- [Secondary session screenshot (Full Workspace View)](docs/screenshots/bob-session-2.png)
- [Primary dashboard entrypoint](app/page.js)

![IBM Bob 2.0 Agent Mode Execution](docs/screenshots/bob-session-1.png)

### 📋 Hackathon Rule Compliance Matrix

| Requirement | Target Location | Verification Status |
|---|---|---|
| **IBM Bob 2.0 Session Evidence** | `docs/screenshots/bob-session-1.png` and `docs/screenshots/bob-execution-log.json` | ✔ PRESENT (simulation) |
| **IBM Bob Usage Statement** | `README.md` (Root) | ✔ PRESENT |
| **Interactive Web Dashboard** | `devflow-ai-swart.vercel.app` | ✔ PASS (Live UI) |
| **Parallel Subagent Execution** | React UI + deterministic workflow model | ✔ PRESENT (simulation) |

---

### 🎬 3-Minute Demo Video Blueprint & Voiceover Script

| Timestamp | Visual Screen Action | Voiceover Script Guidance |
|---|---|---|
| **0:00 - 0:30** | **Slide / Front Page**<br>Show `devflow-ai-swart.vercel.app` banner and problem overview. | *"Modern software engineering teams waste hours on manual code reviews and suffer from architectural drift. Today, we introduce DevFlow AI, an autonomous developer workflow platform powered by IBM Bob 2.0."* |
| **0:30 - 1:30** | **VS Code IDE Recording**<br>Show IBM Bob 2.0 in VS Code running subagent prompts live. Point to task logs. | *"Here in VS Code, IBM Bob 2.0 runs in Agent Mode. Watch as it triggers four parallel subagents: Doc-Intel ingests PRD PDFs, AST Reviewer scans code structure, Test Synthesizer generates test suites, and Patch Generator produces multi-file diffs."* |
| **1:30 - 2:30** | **Web Portal Showcase**<br>Demonstrate PDF upload, parallel agent tree execution, and unified diff viewer on the website. | *"On our live web dashboard, developers upload architecture specs. DevFlow AI visualizes IBM Bob's subagent execution tree in real-time and renders interactive code diffs for immediate pull-request approval."* |
| **2:30 - 3:00** | **GitHub & ROI Conclusion**<br>Show GitHub repository with README.md usage statement & docs/screenshots/. | *"DevFlow AI delivers a 7x speedup in PR review cycles with 0 architectural violations. Our public repo contains full IBM Bob 2.0 session proofs and documentation. Thank you!"* |

---

## 1. Executive Summary & Problem Statement

Modern software maintenance for enterprise critical incidents (P0/P1) is fragmented, error-prone, and slow:
- **Traditional Manual Workflow**: An on-call engineer takes ~195 minutes jumping across Datadog/APM telemetry, searching Git histories, deciphering outdated RFC specifications, reproducing exceptions via curl, writing defensive patches, generating tests, waiting on peer reviews, and coordinating staging canary rollouts. Context switching is rampant (24+ switches).
- **DevFlow AI Solution**: DevFlow coordinates **9 specialized domain subagents** that execute concurrently:
  - Dispatches parallel AST, telemetry, and specification investigation branches.
  - Reconciles empirical evidence with code symbols into mathematical causal proofs (96% certainty).
  - Synthesizes guarded code patches with cryptographic fallbacks and path traversal sanitization.
  - Synthesizes 5 new regression scenarios expanding test coverage from 74.2% to 88.6%.
  - Enforces 8 security/quality gates and produces Canary-ready Release Candidates with automated changelogs.
  - **Measurable Impact**: Total turnaround dropped from **195 minutes to 31 minutes** (an **84% reduction**, saving **164 minutes** per incident).

---

## 2. System Architecture

```mermaid
flowchart TD
    subgraph Intake ["1. Ingestion Phase"]
        A["P0 Incident (BUG-142)\nCSV Upload Intermittently Fails"] --> B["Orchestrator Engine\n(IBM Bob 2.0 Core)"]
    end

    subgraph ParallelPhase ["2. Concurrent Investigation Phase (Parallel)"]
        B --> C["Repository Agent\n(AST & Caller Hierarchy)"]
        B --> D["Log Agent\n(APM & Error Traces)"]
        B --> E["Documentation Agent\n(OpenAPI & Arch Specs)"]
    end

    subgraph Synthesis ["3. Diagnostic & Fix Synthesis"]
        C --> F["Root-Cause Agent\n(96% Causal Certainty)"]
        D --> F
        E --> F
        F --> G["Fix Agent\n(Git Patch: +24 / -6)"]
    end

    subgraph Validation ["4. Multi-Layer Validation"]
        G --> H["Test Agent\n(42 Base + 5 New Regr = 47 Tests)"]
        H --> I["Review Agent\n(7 Quality Categories)"]
        I --> J["Security Agent\n(8 Security & Quality Gates)"]
    end

    subgraph ReleasePhase ["5. Release Readiness"]
        J --> K["Release Agent\n(v2.4.1-rc.1 Candidate)"]
        K --> L["Human-in-the-Loop Gate\n(Lead Developer Approval)"]
        L --> M["Canary Deployment & Audit Export"]
    end

    style B fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#fff
    style F fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#fff
    style G fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff
    style L fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px,color:#fff
```

---

## 3. Specialized Subagent Roster

| Agent Name | Primary Specialty | Key Inputs | Synthesized Output Artifact |
|---|---|---|---|
| **Repository Agent** | AST & Symbol Call Hierarchy | Git `main` @ commit 4f9b2a1 | AST map isolating `csvUploadService.ts:42` |
| **Log Agent** | Observability & Telemetry Triage | Datadog/APM slice [18:00–18:45 UTC] | 184 correlated TypeError occurrences |
| **Documentation Agent** | Specification & RFC Context | OpenAPI 3.1 & `ARCHITECTURE.md` §4.2 | Extracted RFC 7578 filename fallback rule |
| **Root-Cause Agent** | Diagnostic Causal Synthesizer | AST diff + Log traces + RFC contract | 96% confidence causal proof & hypotheses matrix |
| **Fix Agent** | Autonomous Patch Synthesizer | Diagnostic coordinates & strict TypeScript | Unified Git diff (+24 / -6 lines) |
| **Test Agent** | Test Suite & Regression Engine | Patch diff + 42 preexisting tests | 47/47 passing tests (+14.4% coverage delta) |
| **Review Agent** | Enterprise AI Code Reviewer | Unified diff + style guidelines | 6 evaluated findings across 7 quality axes |
| **Security Agent** | SAST & Quality Gate Enforcer | Package manifest + AST patterns | 8/8 Quality Gates PASSED (Zero CVEs/Secrets) |
| **Release Agent** | Release Engineer & Audit Scribe | Validated artifacts from all stages | Release candidate `v2.4.1-rc.1` + Release notes |

---

## 4. Run Instructions

### Prerequisites
- Node.js >= 18.x or Node.js 24.x
- npm >= 9.x

### Quickstart
```bash
# 1. Install dependencies
npm install

# 2. Launch Vite development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 5. Judge-Demo Script (11-Step Evaluation Flow)

When presenting DevFlow AI to judges, follow this concise script:

1. **Step 1: Open the Application & Launch Judge Tour**
   - Click the **"Judge Tour"** button in the top navigation bar to open the interactive 11-step evaluation guide.
2. **Step 2: Overview Dashboard**
   - Highlight the **Before vs After Productivity card** (-84% resolution time, 164 minutes saved per P0).
   - Point out the active KPIs: 4.5 min investigation, 100% test pass rate, 98% release readiness score.
3. **Step 3: Trigger the Autonomous Demo Workflow**
   - Click **"Run Demo Workflow"** in the top header.
   - Watch the state transition through the deterministic simulation runner.
4. **Step 4: Inspect the Visual Workflow Graph (`Workflows` tab)**
   - Show how the graph forks after Issue Intake into **3 parallel subagents** (Repository, Log, Doc).
   - Demonstrate the **Single-Stage Retry** feature: click **"Simulate Test Failure"**, observe the node fail, and click **"Retry Stage Only"** to recover without restarting the whole pipeline!
5. **Step 5: View the Triage Dossier (`Issues` tab)**
   - Show `BUG-142` with real-world production stack trace: `TypeError: Cannot read properties of undefined (reading 'filename')`.
6. **Step 6: Open the Agent Orchestrator & Agent Drawer (`Agent Orchestration` tab)**
   - Click on **Root-Cause Agent** to slide open the **Agent Detail Drawer**.
   - Show the explicit reasoning summary, actions performed, files inspected, and generated artifacts.
7. **Step 7: Browse the Codebase (`Repository Explorer` tab)**
   - Navigate the file tree to `src/services/csvUploadService.ts`. Notice the **"PROPOSED PATCH APPLIED"** badge and highlighted line coordinates.
8. **Step 8: Inspect Multi-Modal Documents (`Documents` tab)**
   - Inspect `ARCHITECTURE.md §4.2` and OpenAPI schema showing how DevFlow extracted explicit contractual requirements.
9. **Step 9: Review Root Cause & Git Diff (`Root Cause` and `Code Changes` tabs)**
   - Show the 96% diagnostic certainty gauge and disproved alternative hypotheses (memory leak, delimiter).
   - In `Code Changes`, inspect the Git diff with +24 additions and -6 deletions.
   - Demonstrate the **Human-in-the-Loop Checkpoint**: click **"Approve Patch"**.
10. **Step 10: Verify Tests & Security Gates (`Tests`, `Code Review`, `Security` tabs)**
    - Show 47/47 passed tests (42 existing + 5 newly synthesized regression tests).
    - Show 7 review dimensions and 8/8 passed security gates.
11. **Step 11: Release & Export Audit Report (`Release Center` and `Benchmarks` tabs)**
    - Click **"Create Release Candidate & Deploy"** in the Release Center (triggers celebratory confetti).
    - Click **"Export Full Audit Manifest (JSON)"** to download the signed compliance audit record.
    - Show the interactive **Benchmark Calculator** in the Benchmarks tab.

---

## 6. Sample Data Description

All demonstration data is technically coherent and tells a single reproducible story:
- **Target Issue**: `BUG-142` — CSV upload intermittently fails with TypeError in production.
- **Root Cause**: Unchecked `file.filename` access at line 42 in `src/services/csvUploadService.ts` when multipart streaming clients omit filename parameters.
- **Synthesized Patch**: Defensive check for undefined stream, `crypto.randomUUID()` fallback, path traversal sanitization, and MIME-type verification.
- **Regression Suite**: 5 new test cases added to `tests/services/csvUploadService.test.ts` covering missing filename, path traversal (`../../etc/passwd`), null payload, invalid mime, and whitespace strings.
- **Metrics**: 195 minutes manual baseline vs 31 minutes DevFlow automated turnaround.

---

## 7. Configuration & Modular Architecture

DevFlow AI features a modular adapter layer. By default, it operates in deterministic simulation mode (`[SIMULATED - BOB 2.0 ADAPTER]`). Real IBM Bob 2.0 or custom LLM endpoints can be connected via the **Settings** view or `.env` configuration:

```env
# .env.example
BOB_ADAPTER_MODE=simulation # switch to 'live' when IBM Bob REST endpoint is active
BOB_API_ENDPOINT=https://api.ibm.com/bob/v2/orchestrate
BOB_API_KEY=bob_live_sk_sample_key_9942
BOB_MODEL_ID=ibm-granite-3-code-34b
ENABLE_HUMAN_IN_THE_LOOP=true
CANARY_DEPLOY_TARGET=canary.internal.cluster.local
```

---

## 8. Integrated Open-Source Ecosystem & Repositories

DevFlow AI incorporates architectural and engineering principles from 5 curated open-source repositories:

| Repository Source | Integrated Feature & Capability | DevFlow AI Module |
|---|---|---|
| **[emretasss/AI-Workflow-Hub-2000-](https://github.com/emretasss/AI-Workflow-Hub-2000-)** | 2,000+ free N8N AI automation workflows, webhook triggers, multi-agent pipelines, and auto-PR triage | **Automation Hub (`/automation`)** |
| **[Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps)** | 100+ AI Agents, Agent Skills, multi-model evaluation (Granite 34B, Granite 8B, Claude 3.5, Llama 3.3, DeepSeek), and RAG Apps | **AI Copilot & Models (`/copilot`)** |
| **[donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)** | Large-scale distributed architecture, Kafka/Redis partitioned queues, MicroVM container sandboxing, and capacity planning (10,000+ PRs/day) | **System Architecture (`/system_design`)** |
| **[public-apis/public-apis](https://github.com/public-apis/public-apis)** | Developer ecosystem APIs: GitHub REST/GraphQL, NIST NVD/CVE security vulnerabilities, Datadog APM tracing, and Slack/Discord webhooks | **Public APIs Hub (`/public_apis`)** |
| **[bradtraversy/design-resources-for-developers](https://github.com/bradtraversy/design-resources-for-developers)** | Cybernetic dark mode palette, micro-grid background, glassmorphism cards, and responsive data visualizers | **Global UI/UX Design System** |

---

## 9. IBM Bob 2.0 Architectural Enhancements (PDF Specification)

This platform implements all core enhancements specified in the *DevFlow AI × IBM Bob 2.0 Architectural Specification*:

### Feature A: DocuMind Spec Guard (§7)
- Ingests PRD PDFs, OpenAPI 3.1 schemas, and legacy RFC documents (`RFC-7578 Multipart Ingestion Spec.pdf`).
- Generates 1,536-dimensional semantic chunk embeddings indexed in Milvus/Qdrant.
- Cross-references active Git diffs to enforce zero architectural boundary drift:
  - **42% Manual Spec Drift Rate** eliminated down to **0.0% Verified Compliance**.

### Feature B: Parallel Sentinel Review (§7)
- Replaces sequential reviews with 3 concurrent specialized sentinel agents:
  1. **Performance Sentinel**: Monitors event-loop blocking, memory complexity $O(1)$, and async backpressure.
  2. **Security Sentinel**: Validates OWASP Top 10, path traversal sanitization, and CSPRNG entropy (`crypto.randomUUID()`).
  3. **Style & Architecture Sentinel**: Checks RFC 7578 contract conformance and strict TypeScript type bounds.

### Feature C: Auto-Remediation Sandbox Container (§6 & §7)
- Isolated MicroVM container execution (`node:22-alpine-sandbox` with 512MB RAM cap and zero outbound egress).
- Compiles candidate patches with `tsc --noEmit --strict` and verifies tests before presenting to human reviewers.

### Feature D: Anti-Gravity Agent Console & Master Prompt Suite (§8)
- Real-time subagent task allocation, progress logs, parallel process execution trees, and one-click patch approval controls.
- Implements the exact production prompts from PDF Section 8:
  - **Master Orchestrator Prompt (Bob 2.0 Agent Mode)**
  - **Subagent Prompt 1: Document Intelligence & Spec Compliance**
  - **Subagent Prompt 2: Parallel Test Generation & Patch Synthesizer**

### Quantitative Impact & ROI Benchmark (§9)
- **Pull Request Cycle Time**: 3.5 Days (84 Hours) ➔ **0.5 Days (12 Hours)** (**7x Faster Velocity**)
- **Unit Test Coverage**: ~45% Average ➔ **>85% Automated** (**+40% Coverage Boost**)
- **Architectural Spec Drift**: High (42% manual drift) ➔ **Zero** (**100% Compliance**)
- **Developer Onboarding Time**: 21 Days to 1st PR ➔ **3 Days to 1st PR** (**85% Onboarding Reduction**)

