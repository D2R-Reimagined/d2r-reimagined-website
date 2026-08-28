import { describe, expect, it } from 'vitest';
import { detectLauncherPlatform, formatDownloadSize, resolveLauncherDownloads } from './launcher-downloads';

const asset = (name: string, size = 52_428_800) => ({
  name,
  size,
  browser_download_url: `https://example.test/${name}`
});

describe('launcher downloads', () => {
  it('selects public downloads without exposing Velopack update packages', () => {
    const downloads = resolveLauncherDownloads([
      asset('D2RReimagined.ReimaginedLauncher-0.10.1-full.nupkg'),
      asset('D2RReimagined.ReimaginedLauncher-win-Portable.zip'),
      asset('D2RReimagined.ReimaginedLauncher-win-Setup.exe'),
      asset('D2RReimagined.ReimaginedLauncher.AppImage'),
      asset('ReimaginedLauncher-v0.10.1-win-x64.zip')
    ]);

    expect(downloads.windowsSetup?.name).toBe('D2RReimagined.ReimaginedLauncher-win-Setup.exe');
    expect(downloads.windowsStatic?.name).toBe('ReimaginedLauncher-v0.10.1-win-x64.zip');
    expect(downloads.linuxAppImage?.name).toBe('D2RReimagined.ReimaginedLauncher.AppImage');
  });

  it('uses the portable archive when a versioned static archive is unavailable', () => {
    const downloads = resolveLauncherDownloads([asset('D2RReimagined.ReimaginedLauncher-win-Portable.zip')]);
    expect(downloads.windowsStatic?.name).toContain('Portable.zip');
  });

  it('detects supported desktop operating systems without treating macOS as Linux', () => {
    expect(detectLauncherPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('windows');
    expect(detectLauncherPlatform('Mozilla/5.0 (X11; Linux x86_64)')).toBe('linux');
    expect(detectLauncherPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')).toBe('unknown');
  });

  it('formats release asset sizes', () => {
    expect(formatDownloadSize(52_428_800)).toBe('50.0 MB');
    expect(formatDownloadSize(0)).toBe('');
  });
});
