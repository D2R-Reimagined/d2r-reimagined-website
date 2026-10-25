// Pure helpers for pinning a ladder to one D2RLoader release ZIP.

export const maxD2RLoaderBytes = 128 * 1024 * 1024;

const versionPattern = /^[0-9]+(\.[0-9]+){1,3}(-[0-9A-Za-z][0-9A-Za-z.]*)?$/;

/** Reads the version from a d2rloader.net download name such as `D2RLoader-1.3.1-beta.zip`. */
export function d2rLoaderVersionFromFileName(fileName: string): string {
  const match = /^D2RLoader[-_ ]v?(.+?)\.zip$/i.exec(fileName.trim());
  return match && versionPattern.test(match[1]) ? match[1] : '';
}

export function d2rLoaderUploadProblem(file: File | null, version: string): string | null {
  if (!file) return 'Choose the D2RLoader release ZIP.';
  if (!file.name.toLowerCase().endsWith('.zip')) return 'Upload the D2RLoader release .zip from d2rloader.net.';
  if (file.size <= 0 || file.size > maxD2RLoaderBytes) return 'D2RLoader ZIPs must be between 1 byte and 128 MiB.';
  if (!versionPattern.test(version.trim().replace(/^v/i, ''))) return 'Version must look like 1.3.1 or 1.3.1-beta.';
  return null;
}
