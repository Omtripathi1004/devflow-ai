import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const workspaceRoot = resolve(import.meta.dirname, '..');

describe('IBM Bob 2.0 integration evidence', () => {
  it('keeps the dashboard entrypoint and evidence links aligned with the Vite app', () => {
    const page = readFileSync(resolve(workspaceRoot, 'app/page.js'), 'utf8');
    const readme = readFileSync(resolve(workspaceRoot, 'README.md'), 'utf8');

    expect(page).toContain("../src/components/DevFlowDashboard");
    expect(readme).toContain('IBM Bob 2.0 Usage Statement');
    expect(readme).toContain('docs/screenshots/bob-execution-log.json');
    expect(readme).toContain('app/page.js');
  });

  it('keeps the execution log valid and points to present screenshot evidence', () => {
    const logPath = resolve(workspaceRoot, 'docs/screenshots/bob-execution-log.json');
    const log = JSON.parse(readFileSync(logPath, 'utf8')) as {
      session_metadata: { evidence_mode: string };
      verification_summary: { verification_assets: { screenshot_path: string } };
    };

    expect(log.session_metadata.evidence_mode).toBe('deterministic repository simulation');
    expect(existsSync(resolve(workspaceRoot, log.verification_summary.verification_assets.screenshot_path))).toBe(true);
  });
});