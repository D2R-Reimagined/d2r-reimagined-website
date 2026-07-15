// Incremental "load-more on scroll" helper.
//
// List pages (uniques, sets, ...) render one card per data row. Rendering the
// whole filtered set up front creates tens of thousands of DOM nodes, and the
// browser's cycle collector then walks that entire graph on every GC pass -
// the dominant cost while scrolling/filtering (see issue #60). This class keeps
// only a growing prefix of the list in the DOM and extends it as a sentinel
// element scrolls into view via IntersectionObserver.
//
// Pair it with `key.bind` on the repeat so growing/resetting the visible slice
// reuses existing views instead of rebuilding them.

export class IncrementalRenderer<T> {
    readonly pageSize: number;
    shown: number;
    private _observer: IntersectionObserver | null = null;

    constructor(pageSize = 60) {
        this.pageSize = pageSize;
        this.shown = pageSize;
    }

    /** Collapse back to the first page (call whenever the source list changes). */
    reset(): void {
        this.shown = this.pageSize;
    }

    /** The prefix of `items` currently meant to be in the DOM. */
    visible(items: T[]): T[] {
        return items.slice(0, this.shown);
    }

    /** Grow by one page. Returns false when already showing everything. */
    grow(items: T[]): boolean {
        if (this.shown >= items.length) return false;
        this.shown = Math.min(this.shown + this.pageSize, items.length);
        return true;
    }

    hasMore(items: T[]): boolean {
        return this.shown < items.length;
    }

    /**
     * Observe `sentinel`; call `onGrow` whenever it enters view (plus an 800px
     * lead margin so growth happens ~a viewport early). No-op without a sentinel
     * or when IntersectionObserver is unavailable (e.g. unit-test env).
     */
    attach(sentinel: HTMLElement | null | undefined, onGrow: () => void): void {
        if (!sentinel || typeof IntersectionObserver === 'undefined') return;
        this._observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) onGrow();
            },
            { rootMargin: '0px 0px 800px 0px' },
        );
        this._observer.observe(sentinel);
    }

    detach(): void {
        this._observer?.disconnect();
        this._observer = null;
    }
}

/**
 * Tag each item with a stable `__rid` so `key.bind: item.__rid` can identify a
 * view across filter/sort changes. Ids are positional within the loaded array,
 * which is stable for the lifetime of the data (loaded once per page).
 */
export function tagIds<T extends object>(items: T[], field = '__rid'): T[] {
    for (let i = 0; i < items.length; i++) {
        (items[i] as Record<string, unknown>)[field] = i;
    }
    return items;
}
