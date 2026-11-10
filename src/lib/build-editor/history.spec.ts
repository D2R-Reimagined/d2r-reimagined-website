import { describe, expect, it } from 'vitest';
import { DocumentHistory } from './history';

function clock() {
  let time = 0;
  return { now: () => time, advance: (ms: number) => { time += ms; } };
}

describe('DocumentHistory', () => {
  it('starts with nothing to undo and ignores unchanged documents', () => {
    const history = new DocumentHistory('a');
    history.record('a');
    expect(history.canUndo).toBe(false);
    expect(history.undo()).toBeNull();
    expect(history.redo()).toBeNull();
  });

  it('coalesces rapid changes into one step and separates pauses', () => {
    const time = clock();
    const history = new DocumentHistory('', { now: time.now });
    history.record('H'); time.advance(100);
    history.record('He'); time.advance(100);
    history.record('Hey'); time.advance(700);
    history.record('Hey!');
    expect(history.undo()).toBe('Hey');
    expect(history.undo()).toBe('');
    expect(history.canUndo).toBe(false);
    expect(history.redo()).toBe('Hey');
    expect(history.redo()).toBe('Hey!');
    expect(history.canRedo).toBe(false);
  });

  it('starts a new step after a checkpoint, even mid-burst', () => {
    const time = clock();
    const history = new DocumentHistory('a', { now: time.now });
    history.record('ab'); time.advance(10);
    history.checkpoint();
    history.record('abc');
    expect(history.undo()).toBe('ab');
  });

  it('clears redo on a new change and does not record a restored state', () => {
    const time = clock();
    const history = new DocumentHistory('a', { now: time.now });
    history.record('b'); time.advance(1000);
    expect(history.undo()).toBe('a');
    history.record('a'); // the editor re-serializes the restored document
    expect(history.canRedo).toBe(true);
    history.record('c');
    expect(history.canRedo).toBe(false);
    expect(history.undo()).toBe('a');
  });

  it('keeps at most `limit` undo steps', () => {
    const time = clock();
    const history = new DocumentHistory('0', { limit: 3, now: time.now });
    for (let i = 1; i <= 5; i++) { history.record(String(i)); time.advance(1000); }
    const undone: string[] = [];
    for (let state = history.undo(); state !== null; state = history.undo()) undone.push(state);
    expect(undone).toEqual(['4', '3', '2']);
  });
});
