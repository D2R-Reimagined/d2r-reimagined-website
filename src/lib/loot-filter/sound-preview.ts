import { writable } from 'svelte/store';
export const soundPreview = writable({ playing: '', error: '' });
let audio: HTMLAudioElement | undefined;
let generation = 0;
export function stopSound() {
  generation++;
  if (audio) { audio.pause(); audio.currentTime = 0; }
  soundPreview.set({ playing: '', error: '' });
}
export async function playSound(sound: string) {
  if (!/^Filter(0[1-9]|1[0-6])$/.test(sound)) return;
  stopSound(); const request = generation;
  audio ??= new Audio();
  audio.src = `/audio/loot-filter/${sound}.flac`; audio.volume = 0.5;
  soundPreview.set({ playing: sound, error: '' });
  const failed = () => { if (request === generation) soundPreview.set({ playing: '', error: 'Sound could not play. Try again.' }); };
  audio.onended = () => { if (request === generation) soundPreview.set({ playing: '', error: '' }); };
  audio.onerror = failed;
  try { await audio.play(); } catch { failed(); }
}
