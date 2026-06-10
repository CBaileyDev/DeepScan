/**
 * Launch the headless smoke harness in a real Electron main process.
 * Unsets ELECTRON_RUN_AS_NODE when present (some CI/dev shells set it globally).
 */
const { spawnSync } = require('node:child_process');
const { join } = require('node:path');

const root = join(__dirname, '..');
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const electron = require('electron');
const result = spawnSync(electron, [join(__dirname, 'smoke.cjs')], {
  cwd: root,
  env,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
