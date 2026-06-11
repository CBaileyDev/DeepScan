# DeepScan Releases

Pre-built desktop binaries are produced by CI when a version tag is pushed or when the release workflow is run manually.

## Download

| Platform | Artifact | Workflow |
|----------|----------|----------|
| macOS | `.dmg` / `.zip` in `deepscan-mac` | [Desktop Release](.github/workflows/desktop-release.yml) |
| Windows | `.exe` / `.zip` in `deepscan-win` | same |
| Linux | `.AppImage` / `.deb` in `deepscan-linux` | same |

1. Open **Actions → Desktop Release** in GitHub.
2. Download the artifact for your OS (retained 14 days), **or**
3. Push a tag `v*` (e.g. `v0.2.0`) to trigger a release build on all three platforms.

> Builds are **unsigned** by default (`identity: null` in `electron-builder.yml`). macOS Gatekeeper and Windows SmartScreen may warn until you sign and notarize with your own certificates.

## CLI / engine only

The diagnostic engine ships as an npm workspace package (`@deepscan/engine`). From a clone:

```bash
npm install && npm run build
cd apps/garage-copilot && node dist/cli.js diagnose --demo
```

## Versioning

- Root `package.json` and `apps/garage-copilot-desktop/package.json` should match the release tag.
- See [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) before tagging.

## Changelog

### Unreleased

- Expanded Mode 01 PID coverage (O2 bank, catalyst temps, fuel type, injection timing)
- Mode 09 CALID / CVN / ECU name
- Mode 06 onboard monitoring test results
- Custom PID registry (desktop + CLI `--custom-pids`)
- Protocol selector, auto-reconnect, history JSON export, adapter log export
- CLI `--out` for reports and monitor output

### v0.1.0

- Initial read-only diagnose / live monitor / tune advisor desktop app and CLI
