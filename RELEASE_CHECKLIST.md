# DeepScan Release Checklist

Use this checklist before creating a new release.

## Pre-Release (1-2 days before)

- [ ] **Code review**: Ensure all PRs are merged and reviewed
- [ ] **Testing**: Run full test suite
  ```bash
  npm install --legacy-peer-deps
  npm test
  ```
- [ ] **Smoke test**: Test the desktop app on your platform
  ```bash
  npm run dist --workspace=@deepscan/app
  # Test the created .dmg, .exe, or .AppImage
  ```
- [ ] **Performance**: Run perf monitoring smoke test
  ```bash
  cd apps/garage-copilot-desktop
  electron scripts/smoke.cjs --perf
  ```
- [ ] **Changelog**: Prepare release notes covering:
  - New features (with emojis: ✨)
  - Bug fixes (🐛)
  - Performance improvements (⚡)
  - Breaking changes (⚠️)
  - Thank you message to contributors

## Release Day

- [ ] **Version bump**: Update version in `apps/garage-copilot-desktop/package.json`
  - Follow semantic versioning (major.minor.patch)
  - Example: 0.1.0 → 0.2.0 (new feature) or 0.1.1 (bug fix)

- [ ] **Create tag**: 
  ```bash
  git tag v0.2.0
  git push origin v0.2.0
  ```

- [ ] **Wait for CI**: GitHub Actions workflow will build on all platforms (~10-15 min)
  - Monitor build status at: https://github.com/cbaileydev/deepscan/actions

- [ ] **Verify artifacts**: Once builds complete, check that all platforms produced artifacts:
  - macOS: `.dmg` + `.zip`
  - Windows: `.exe` + `.zip`
  - Linux: `.AppImage` + `.deb`

## Post-Release (After CI Completes)

- [ ] **Review draft release**: Check GitHub Release draft created by CI
  - Verify all artifacts are attached
  - Review auto-generated release notes
  - Edit release notes if needed (add manually prepared changelog)

- [ ] **Publish release**: Convert draft to public release
  - Click "Publish release" button on GitHub
  - Users will be notified via GitHub Releases

- [ ] **Verify auto-update**: On an older app version, check for update notification
  - Auto-updater checks on launch and every hour
  - Should notify of new version within 1 hour
  - User can defer or update immediately

- [ ] **Announce release** (optional):
  - Post on social media / forums
  - Update website with download links
  - Notify users via in-app notification

## Rollback (If Something Goes Wrong)

If a release is broken:

1. **Delete the tag**:
   ```bash
   git tag -d v0.2.0
   git push origin :refs/tags/v0.2.0
   ```

2. **Delete the release** on GitHub:
   - Go to https://github.com/cbaileydev/deepscan/releases
   - Click "..." → "Delete"

3. **Fix the issue** on main branch

4. **Re-tag** with a new version (don't re-use the old version number)

## Code Signing (Future)

When adding code signing for distribution:

1. **macOS**: Add Apple Developer certificate to GitHub Secrets
   - `APPLE_ID`, `APPLE_ID_PASSWORD`, `CSC_LINK`, `CSC_KEY_PASSWORD`

2. **Windows**: Add code signing cert to GitHub Secrets
   - `WIN_CSC_LINK`, `WIN_CSC_KEY_PASSWORD`

3. Release workflow will automatically sign and notarize on each build

## Troubleshooting

**Q: GitHub Actions build failed**
A: Check the workflow logs at https://github.com/cbaileydev/deepscan/actions

**Q: Artifacts are missing**
A: Re-run the workflow (gear icon → "Re-run all jobs")

**Q: Auto-updater isn't detecting the new version**
A: electron-updater caches metadata. Users need to force a check or restart.

**Q: macOS app fails to run after update**
A: May be a signing/notarization issue. Check the build logs.

**Q: Windows SmartScreen warning**
A: Normal for unsigned builds. Add code signing to eliminate.
