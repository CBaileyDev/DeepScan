# Release Checklist

Use this before tagging a new desktop release.

## Pre-release

- [ ] All tests pass: `npm test`
- [ ] Typecheck clean: `npm run typecheck`
- [ ] Lint/format clean: `npm run lint && npm run format:check`
- [ ] Version bumped in `package.json` and `apps/garage-copilot-desktop/package.json`
- [ ] [RELEASES.md](./RELEASES.md) changelog updated
- [ ] README screenshots still accurate (or updated under `docs/screenshots/`)

## Smoke test

- [ ] `npm start` — Demo mode connects, scan runs, live monitor streams
- [ ] Real adapter (if available): connect, scan, live CSV export
- [ ] `npm run dist --workspace=@deepscan/app` — local package builds

## Tag & publish

```bash
git tag v0.x.x
git push origin v0.x.x
```

- [ ] **Desktop Release** workflow completes on macOS, Linux, Windows
- [ ] Download each artifact and launch once
- [ ] (Optional) Create a GitHub Release with notes copied from RELEASES.md

## Post-release

- [ ] Attach artifacts to GitHub Release if not automated
- [ ] Announce / update project links

## Signing (optional, production)

- [ ] macOS: Developer ID + `notarize` in `electron-builder` config
- [ ] Windows: Authenticode certificate
- [ ] Store secrets in GitHub Actions (never commit)
