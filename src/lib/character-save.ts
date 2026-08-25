export const maximumCharacterSaveSize = 4 * 1024 * 1024;

export function sameCharacterName(left: string, right: string): boolean {
  return left.localeCompare(right, undefined, { sensitivity: 'accent' }) === 0;
}

export function validateCharacterSave(file: File): void {
  if (!file.name.toLowerCase().endsWith('.d2s')) {
    throw new Error('Choose a Diablo II character save with the .d2s extension.');
  }

  if (file.size === 0) {
    throw new Error('The selected character save is empty.');
  }

  if (file.size > maximumCharacterSaveSize) {
    throw new Error('The selected character save exceeds the 4 MiB limit.');
  }
}
