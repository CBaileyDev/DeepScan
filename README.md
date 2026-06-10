# DeepScan

Professional read-only automotive diagnostics: a cross-platform desktop app and command-line tools for OBD-II vehicle scanning. Plug an ELM327 adapter into your car's OBD-II port and diagnose trouble codes, monitor live parameters, and validate tune changes — entirely offline, without modifying your vehicle.

- **Diagnose** — scan trouble codes, check readiness monitors, view live snapshot
- **Monitor** — stream live parameters with trend analysis and health flags
- **Tune Advisor** — validate gearing, injector, and electrical load changes before flashing
- **Read-only by design** — no code clearing, ECU writing, or active tests

## Quick Start

### Desktop App (GUI)

```bash
npm install
npm start          # builds the engine + app, then launches the GUI
```

Click **Demo mode** to explore with a simulated vehicle (no hardware), or **Connect OBD-II** to plug in a real ELM327 adapter.

### CLI

```bash
cd apps/garage-copilot
npm install
npm run build
node dist/cli.js diagnose --demo           # offline demo
node dist/cli.js diagnose --port /dev/ttyUSB0  # real hardware
```

## Repository Structure

```
DeepScan/
├── apps/
│   ├── garage-copilot/          # CLI engine: OBD-II driver, diagnostics, trends
│   └── garage-copilot-desktop/  # Electron GUI wrapping the engine
├── .gitignore
├── LICENSE (MIT)
└── README.md (this file)
```

### `garage-copilot` — Engine

The core diagnostic library: ELM327 driver, SAE J1979 OBD-II decoder, trend analyzer, and tune advisor. Runs in Node.js and the browser (via transpilation). All the tested OBD logic lives here.

**Quick start:**
```bash
cd apps/garage-copilot
npm install && npm run build
npm test                  # 93 unit tests
node dist/cli.js diagnose --vehicle "2014 Subaru Forester"
```

### `garage-copilot-desktop` — Desktop App

Electron GUI for Windows, macOS, and Linux. Wraps the engine with a Web Serial adapter for real hardware and a modern responsive UI (gauges, live monitor, history timeline, VIN lookup, tune forms).

**Quick start:**
```bash
cd apps/garage-copilot-desktop
npm install && npm start   # builds engine + app, launches GUI
npm run dist              # package for your OS (macOS .dmg/.zip, Windows .exe/.zip, Linux .AppImage/.deb)
```

## Development

### Install & Build

```bash
npm install               # installs all workspaces (when configured)
npm run build             # builds both apps
npm test                  # runs all tests
npm run typecheck         # TypeScript strict mode
```

### Development Mode

**Engine (CLI):**
```bash
cd apps/garage-copilot
npm run dev -- diagnose --demo
```

**Desktop app:**
```bash
cd apps/garage-copilot-desktop
npm start
```

## Architecture

### Engine

- **OBD bridge** (`src/obd/`): ELM327 protocol driver, PID decoders, DTC decode, VIN validation, transport abstraction
- **Diagnose** (`src/diagnose/`): One-pass diagnostic snapshot → structured report
- **Monitor** (`src/monitor/`): PID time-series recorder → trend stats + health flags
- **Tune Advisor** (`src/tune/`): Planning math for gearing, injectors, electrical load
- **Agent** (`src/agent/`): Optional MCP configuration and Claude playbook

### Desktop App

- **Main process** (`src/main/`): Window creation, native serial picker, IPC bridge
- **Renderer** (`src/renderer/`): Web Serial adapter, canvas gauges, live monitor, VIN UI, history timeline

Both are written in TypeScript with strict mode, fully tested, and hardened against security issues.

## Safety & Legal

- **Read-only by design**: No code clearing, ECU writing, or active tests anywhere in the codebase.
- **Evidence, not diagnosis**: Reports are caveated; no manufacturer-specific DTC meanings are invented.
- **Tune = advisory math only**: The advisor validates the *consequence* of a proposed change; it does not flash anything.
- **Clone adapters vary**: ELM327 clones are unreliable; STN-based dongles (OBDLink SX/MX+) are recommended.

Modifying emissions-related calibration on a road vehicle is regulated (U.S. Clean Air Act, etc.). Keep performance changes to off-road and track use only.

## License

MIT. See [LICENSE](./LICENSE).
