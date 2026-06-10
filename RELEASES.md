# DeepScan Releases

## Creating a Release

### Local Testing (Single-Platform)

To build the desktop app for your current OS:

```bash
npm run dist --workspace=@deepscan/app
```

Output artifacts go to `apps/garage-copilot-desktop/release/`:
- **macOS**: `.dmg` (installer) + `.zip` (portable)
- **Windows**: `.exe` (NSIS installer) + `.zip` (portable)
- **Linux**: `.AppImage` (portable) + `.deb` (package)

### Official Release (Multi-Platform via GitHub Actions)

1. **Update version** in `apps/garage-copilot-desktop/package.json`:
   ```json
   "version": "0.2.0"
   ```

2. **Create a git tag** and push:
   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

3. **GitHub Actions will**:
   - Build on macOS, Windows, and Linux runners simultaneously
   - Create signed/notarized artifacts (see code signing section below)
   - Upload to a GitHub Release draft
   - Publish with auto-generated release notes

4. **Review and publish** the release on GitHub (convert from draft to public)

## Platform-Specific Notes

### macOS

- **DMG**: Double-click to mount, drag DeepScan to /Applications
- **ZIP**: Unzip and run the DeepScan.app bundle
- **Signing/Notarization**: Currently unsigned. To enable:
  - Obtain an Apple Developer Certificate
  - Set environment variables in CI:
    ```
    APPLE_ID=your-email@example.com
    APPLE_ID_PASSWORD=generated-app-password
    CSC_LINK=path/to/certificate.p12
    CSC_KEY_PASSWORD=certificate-password
    ```
  - electron-builder will automatically sign and notarize

### Windows

- **EXE**: NSIS installer. Users can choose installation location
- **ZIP**: Portable executable (no installation required)
- **Code Signing**: Currently unsigned (SmartScreen may warn). To sign:
  - Obtain a Windows Code Signing Certificate
  - Set environment variables:
    ```
    WIN_CSC_LINK=path/to/certificate.pfx
    WIN_CSC_KEY_PASSWORD=certificate-password
    ```

### Linux

- **AppImage**: Portable executable. Mark as executable: `chmod +x DeepScan-*.AppImage`
- **DEB**: Installable package: `sudo apt install ./DeepScan-*.deb`
- **Icon**: Integrates with desktop environment
- **No code signing required**

## Configuration Files

- **electron-builder.yml**: Package settings, targets, signing config
- **.github/workflows/release.yml**: CI/CD workflow for automated builds
- **build-scripts/configure-fuses.cjs**: Electron security hardening (ASAR, sandboxing)

## Versioning

Follow semantic versioning (major.minor.patch):
- **Major**: Breaking changes to DTC database, UI, or CLI
- **Minor**: New features (live monitor, VIN lookup)
- **Patch**: Bug fixes (timeout guards, crash fixes)

Version is read from `package.json` and auto-inserted into release artifacts and updater checks.

## Auto-Updates (Future)

Currently builds standalone releases. To enable auto-updates:

1. Configure electron-updater in `src/main/main.ts`:
   ```typescript
   import { autoUpdater } from 'electron-updater';
   autoUpdater.checkForUpdatesAndNotify();
   ```

2. Host release notes and artifacts on GitHub Releases (or a custom server)

3. Users will be notified of new versions and can update in-app

## Troubleshooting

### Build Fails on Windows
- Ensure Visual Studio Build Tools are installed
- Run as Administrator
- Check antivirus isn't blocking node_modules

### macOS Notarization Fails
- Verify Apple ID credentials are correct
- Ensure certificate is valid and not revoked
- Check network connectivity to Apple services

### Linux DEB Installation Issues
- Verify package name matches maintainer email format
- Check desktop entry files for syntax errors
- Test on clean Ubuntu/Debian systems

## Security

- **All builds** use electron-builder's ASAR format to prevent casual tampering
- **Code signing** (macOS/Windows) prevents tampering during distribution
- **SmartScreen** (Windows) warns if unsigned; code signing prevents this
- **Gatekeeper** (macOS) allows unsigned apps with `sudo xattr -rd com.apple.quarantine`

## References

- [electron-builder Documentation](https://www.electron.build/)
- [Electron Security](https://www.electronjs.org/docs/latest/tutorial/security)
- [GitHub Actions](https://docs.github.com/en/actions)
