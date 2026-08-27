export function normalizeSha256(value: string): string {
  const completeHash = value.match(/[A-Fa-f0-9]{64}/)?.[0];
  const hexadecimalCharacters = completeHash ?? value.replace(/[^A-Fa-f0-9]/g, '');
  return hexadecimalCharacters.slice(0, 64).toUpperCase();
}

export function isSha256(value: string): boolean {
  return /^[A-F0-9]{64}$/.test(value);
}
