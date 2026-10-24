import { describe, expect, it } from 'vitest';
import { d2rLoaderUploadProblem, d2rLoaderVersionFromFileName, maxD2RLoaderBytes } from './d2rloader-release';

describe('d2rLoaderVersionFromFileName', () => {
  it('reads the version from d2rloader.net download names', () => {
    expect(d2rLoaderVersionFromFileName('D2RLoader-1.3.1-beta.zip')).toBe('1.3.1-beta');
    expect(d2rLoaderVersionFromFileName('d2rloader-v1.4.0.zip')).toBe('1.4.0');
  });

  it('leaves the version blank for names it cannot read', () => {
    expect(d2rLoaderVersionFromFileName('D2RLoader.zip')).toBe('');
    expect(d2rLoaderVersionFromFileName('D2RLoader-latest.zip')).toBe('');
    expect(d2rLoaderVersionFromFileName('loader-1.3.1.zip')).toBe('');
  });
});

describe('d2rLoaderUploadProblem', () => {
  const zip = new File([new Uint8Array([0x50, 0x4b])], 'D2RLoader-1.3.1-beta.zip');

  it('accepts a ZIP with a release version', () => {
    expect(d2rLoaderUploadProblem(zip, '1.3.1-beta')).toBeNull();
    expect(d2rLoaderUploadProblem(zip, ' v1.3.1 ')).toBeNull();
  });

  it('rejects a missing file, other file types, oversized files and malformed versions', () => {
    expect(d2rLoaderUploadProblem(null, '1.3.1')).toMatch(/Choose/);
    expect(d2rLoaderUploadProblem(new File(['x'], 'D2RLoader.exe'), '1.3.1')).toMatch(/\.zip/);
    const huge = { name: 'D2RLoader-1.3.1.zip', size: maxD2RLoaderBytes + 1 } as File;
    expect(d2rLoaderUploadProblem(huge, '1.3.1')).toMatch(/128 MiB/);
    expect(d2rLoaderUploadProblem(zip, '')).toMatch(/Version/);
    expect(d2rLoaderUploadProblem(zip, 'latest')).toMatch(/Version/);
  });
});
