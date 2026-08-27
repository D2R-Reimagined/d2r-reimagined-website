import { describe, expect, it } from 'vitest';

import { isSha256, normalizeSha256 } from './sha256';

const hash = 'a2682f662afba057a58430f7bb2c8c573140260de4003c913d0798dbd5bc3a2f';

describe('normalizeSha256', () => {
  it('normalizes a plain hash to uppercase', () => {
    expect(normalizeSha256(hash)).toBe(hash.toUpperCase());
  });

  it('removes pasted whitespace and invisible characters', () => {
    const pasted = `${hash.slice(0, 20)}\u200b ${hash.slice(20, 42)}\r\n${hash.slice(42)}`;
    expect(normalizeSha256(pasted)).toBe(hash.toUpperCase());
  });

  it('extracts a complete hash from certutil output', () => {
    const pasted = `SHA256 hash of server-saves.dll:\r\n${hash}\r\nCertUtil: -hashfile command completed successfully.`;
    expect(normalizeSha256(pasted)).toBe(hash.toUpperCase());
  });

  it('accepts only complete normalized hashes', () => {
    expect(isSha256(hash.toUpperCase())).toBe(true);
    expect(isSha256(hash)).toBe(false);
    expect(isSha256(hash.slice(0, 63).toUpperCase())).toBe(false);
  });
});
