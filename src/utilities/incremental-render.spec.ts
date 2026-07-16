import { IncrementalRenderer, tagIds } from './incremental-render';

import { afterEach, describe, expect, it, vi } from 'vitest';

const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

describe('IncrementalRenderer', () => {
    it('shows only the first page initially', () => {
        const r = new IncrementalRenderer<number>(10);
        expect(r.shown).toBe(10);
        expect(r.visible(range(100))).toHaveLength(10);
    });

    it('grows by one page and clamps to the list length', () => {
        const items = range(25);
        const r = new IncrementalRenderer<number>(10);

        expect(r.grow(items)).toBe(true);
        expect(r.shown).toBe(20);
        expect(r.visible(items)).toHaveLength(20);

        expect(r.grow(items)).toBe(true); // 20 -> 25 (clamped, not 30)
        expect(r.shown).toBe(25);

        expect(r.grow(items)).toBe(false); // nothing left
        expect(r.shown).toBe(25);
    });

    it('reports hasMore until everything is shown', () => {
        const items = range(15);
        const r = new IncrementalRenderer<number>(10);
        expect(r.hasMore(items)).toBe(true);
        r.grow(items);
        expect(r.hasMore(items)).toBe(false);
    });

    it('reset collapses back to the first page', () => {
        const items = range(50);
        const r = new IncrementalRenderer<number>(10);
        r.grow(items);
        r.grow(items);
        expect(r.shown).toBe(30);
        r.reset();
        expect(r.shown).toBe(10);
    });

    describe('attach / detach', () => {
        afterEach(() => {
            vi.unstubAllGlobals();
        });

        it('grows when the sentinel intersects and disconnects on detach', () => {
            let capturedCb: IntersectionObserverCallback | null = null;
            const observe = vi.fn();
            const disconnect = vi.fn();
            vi.stubGlobal(
                'IntersectionObserver',
                class {
                    constructor(cb: IntersectionObserverCallback) {
                        capturedCb = cb;
                    }
                    observe = observe;
                    disconnect = disconnect;
                },
            );

            const r = new IncrementalRenderer<number>(10);
            const onGrow = vi.fn();
            const sentinel = {} as HTMLElement;
            r.attach(sentinel, onGrow);

            expect(observe).toHaveBeenCalledWith(sentinel);
            expect(capturedCb).not.toBeNull();

            capturedCb?.(
                [{ isIntersecting: true } as IntersectionObserverEntry],
                {},
            );
            expect(onGrow).toHaveBeenCalledTimes(1);

            r.detach();
            expect(disconnect).toHaveBeenCalledTimes(1);
        });

        it('is a no-op without a sentinel', () => {
            const r = new IncrementalRenderer<number>(10);
            expect(() => r.attach(null, () => undefined)).not.toThrow();
        });
    });
});

describe('tagIds', () => {
    it('assigns sequential positional ids', () => {
        const items = [{ name: 'a' }, { name: 'b' }, { name: 'c' }] as Array<
            { name: string } & { __rid?: number }
        >;
        tagIds(items);
        expect(items.map((i) => i.__rid)).toEqual([0, 1, 2]);
    });
});
