export type LauncherPlatform = 'windows' | 'linux' | 'unknown';

export type GitHubReleaseAsset = {
  name: string;
  browser_download_url: string;
  size: number;
};

export type LauncherDownload = {
  name: string;
  url: string;
  size: number;
};

export type LauncherDownloads = {
  windowsSetup: LauncherDownload | null;
  windowsStatic: LauncherDownload | null;
  linuxAppImage: LauncherDownload | null;
};

function download(asset: GitHubReleaseAsset | undefined): LauncherDownload | null {
  if (!asset) return null;
  return { name: asset.name, url: asset.browser_download_url, size: asset.size };
}

export function resolveLauncherDownloads(assets: GitHubReleaseAsset[]): LauncherDownloads {
  const windowsSetup = assets.find((asset) => /-win-Setup\.exe$/i.test(asset.name));
  const windowsStatic = assets.find((asset) => /ReimaginedLauncher-v[^/]+-win-x64\.zip$/i.test(asset.name))
    ?? assets.find((asset) => /-win-Portable\.zip$/i.test(asset.name));
  const linuxAppImage = assets.find((asset) => /\.AppImage$/i.test(asset.name));

  return {
    windowsSetup: download(windowsSetup),
    windowsStatic: download(windowsStatic),
    linuxAppImage: download(linuxAppImage)
  };
}

export function detectLauncherPlatform(userAgent: string, navigatorPlatform = ''): LauncherPlatform {
  const value = `${navigatorPlatform} ${userAgent}`.toLowerCase();
  if (value.includes('windows') || value.includes('win32') || value.includes('win64')) return 'windows';
  if (value.includes('linux') || value.includes('x11')) return 'linux';
  return 'unknown';
}

export function formatDownloadSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
