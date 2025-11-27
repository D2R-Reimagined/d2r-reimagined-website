import { route } from '@aurelia/router';

@route({
    title: 'D2R Reimagined',
    routes: [
        {
            path: '',
            component: import('./pages/home/home'),
            title: 'Home',
        },
        {
            path: 'cube-recipes',
            component: import('./pages/cube-recipes/cube-recipes'),
            title: 'Cube Recipes',
        },
        {
            path: 'uniques',
            component: import('./pages/uniques/uniques'),
            title: 'Uniques',
        },
        {
            path: 'sets',
            component: import('./pages/sets/sets'),
            title: 'Sets',
        },
        {
            path: 'runewords',
            component: import('./pages/runewords/runewords'),
            title: 'Runewords',
        },
        {
            path: 'grail',
            component: import('./pages/grail/grail'),
            title: 'Holy Grail',
        }
        ,
        {
            path: 'armors',
            component: import('./pages/bases/armors'),
            title: 'Armor Bases',
        },
        {
            path: 'weapons',
            component: import('./pages/bases/weapons'),
            title: 'Weapon Bases',
        },
        {
            path: 'affixes',
            component: import('./pages/affixes/affixes'),
            title: 'Affixes',
        }
    ]
})

export class App {
    fonts: Font[] = [
        { class: 'font-classic', name: 'Classic' },
        { class: 'font-resurrected', name: 'Resurrected' },
        { class: 'font-neutral', name: 'Neutral' },
    ];

    // UI state for back-to-top visibility
    showBackToTop = false;

    // Internals for back-to-top monitoring
    private _bt_lastScrollEl?: HTMLElement;
    private _bt_bound = false;
    private _bt_ticking = false;

    // Global document click handler to close the font <details> when clicking outside
    private _onDocClick?: (ev: MouseEvent) => void;

    attached() {
        this.loadFont();
        this.bindBackToTopMonitoring();
        // Initial computation
        this.updateBackToTopVisibility();

        // Close the font selection list when clicking anywhere outside of it
        this._onDocClick = (ev: MouseEvent) => {
            const details = document.querySelector('nav details') as HTMLDetailsElement | null;
            if (!details) return;
            // Only act when the dropdown is currently open
            if (!details.hasAttribute('open')) return;
            const target = ev.target as Node | null;
            // If the click was inside the <details>, ignore it
            if (target && details.contains(target)) return;
            // Otherwise, close the dropdown
            details.removeAttribute('open');
        };
        // Use capture to ensure we run before other handlers that might stop propagation
        document.addEventListener('click', this._onDocClick, true);
    }

    handleFontSelected(font: Font) {
        window.localStorage.setItem('font', font.class);
        this.loadFont();
    }

    detached() {
        // Clean up the global click listener
        if (this._onDocClick) {
            document.removeEventListener('click', this._onDocClick, true);
            this._onDocClick = undefined;
        }
    }

    /**
     * Handles font selection from the dropdown and safely closes the <details> element.
     * Using a single method avoids multi‑statement binding expressions that Aurelia disallows.
     */
    selectFont(font: Font, event?: Event) {
        this.handleFontSelected(font);
        // Close the <details> dropdown if the event came from within it
        const target = event?.target as HTMLElement | undefined;
        const details = target?.closest('details') as HTMLDetailsElement | null;
        if (details) {
            details.removeAttribute('open');
        }
        // Also close the mobile nav panel if it is open
        this.closeMobileMenu();
    }

    /**
     * Closes the mobile navigation panel by adding the 'hidden' class back to the container.
     */
    closeMobileMenu() {
        const panel = document.getElementById('navbarSupportedContent');
        if (panel && !panel.classList.contains('hidden')) {
            panel.classList.add('hidden');
        }
    }

    loadFont() {
        const selectedFont = window.localStorage.getItem('font') || 'font-resurrected';
        if (selectedFont) {
            const allClasses = this.fonts.map(font => font.class);
            document.body.classList.remove(...allClasses);
            document.body.classList.add(selectedFont);
        }
    }

    /**
     * Find the active scroll container used by the current route. Some pages
     * scroll the window; others place content inside a scrollable container.
     */
    private getScrollContainer(): HTMLElement | Document | undefined {
        const viewportEl = document.querySelector('au-viewport');
        const isScrollable = (el: Element | null): el is HTMLElement => {
            if (!el || !(el instanceof HTMLElement)) return false;
            const cs = getComputedStyle(el);
            const oy = cs.overflowY;
            if (oy !== 'auto' && oy !== 'scroll') return false;
            return (el.scrollHeight - 1) > el.clientHeight;
        };
        let node: HTMLElement | null = viewportEl ? viewportEl.parentElement : null;
        while (node && node !== document.body) {
            if (isScrollable(node)) return node;
            node = node.parentElement;
        }
        // Fall back to document scrolling
        return document;
    }

    private hasNativeSmoothScroll(): boolean {
        // Most engines expose 'scrollBehavior' on documentElement.style when supported
        return 'scrollBehavior' in (document.documentElement.style as any);
    }

    private easeOutCubic(t: number) {
        return 1 - Math.pow(1 - t, 3);
    }

    private animateWindowToTop(duration = 400) {
        const start = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (start <= 0) return;
        const startTs = performance.now();
        const step = (ts: number) => {
            const p = Math.min(1, (ts - startTs) / duration);
            const eased = this.easeOutCubic(p);
            const y = Math.round(start * (1 - eased));
            window.scrollTo(0, y);
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    private animateElementToTop(el: HTMLElement, duration = 400) {
        const start = el.scrollTop || 0;
        if (start <= 0) return;
        const startTs = performance.now();
        const step = (ts: number) => {
            const p = Math.min(1, (ts - startTs) / duration);
            const eased = this.easeOutCubic(p);
            el.scrollTop = Math.round(start * (1 - eased));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    /**
     * Scroll back to the top of the page, regardless of which element is the
     * actual scroll root. Uses smooth scrolling when available.
     */
    scrollToTop() {
        const scroller = this.getScrollContainer();
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const duration = reduceMotion ? 0 : 400;

        // Window: use native smooth when available, else manual fallback
        if (this.hasNativeSmoothScroll() && duration > 0) {
            try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { window.scrollTo(0, 0); }
        } else if (duration > 0) {
            this.animateWindowToTop(duration);
        } else {
            window.scrollTo(0, 0);
        }

        // Element scroller: always use controlled animation for consistency across engines
        if (scroller && scroller instanceof HTMLElement) {
            if (duration > 0) {
                this.animateElementToTop(scroller, duration);
            } else {
                scroller.scrollTop = 0;
            }
        }

        // Ensure visibility updates once animation completes (covers browsers
        // that may not fire scroll events reliably during programmatic scroll).
        if (duration > 0) {
            window.setTimeout(() => this.updateBackToTopVisibility(), duration + 100);
        } else {
            this.updateBackToTopVisibility();
        }
    }

    // ---- Back-to-top show/hide monitoring ----
    private getWindowScrollTop(): number {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    private updateBackToTopVisibility() {
        const el = this.getScrollContainer();
        const elTop = el && el instanceof HTMLElement ? el.scrollTop : 0;
        const scrollTop = Math.max(this.getWindowScrollTop(), elTop || 0);
        const viewportH = el && el instanceof HTMLElement ? el.clientHeight : window.innerHeight;
        const threshold = Math.max(viewportH * 2.5, 800);
        this.showBackToTop = scrollTop > threshold;
        this._bt_ticking = false;
    }

    private onAnyScroll = () => {
        if (!this._bt_ticking) {
            this._bt_ticking = true;
            requestAnimationFrame(() => this.updateBackToTopVisibility());
        }
    };

    private bindBackToTopMonitoring() {
        if (this._bt_bound) return;
        this._bt_bound = true;

        // Always monitor window
        window.addEventListener('scroll', this.onAnyScroll, { passive: true });
        window.addEventListener('resize', this.onAnyScroll);

        // Monitor inner scroll container if present
        const el = this.getScrollContainer();
        if (el && el instanceof HTMLElement) {
            this._bt_lastScrollEl = el;
            el.addEventListener('scroll', this.onAnyScroll, { passive: true });
        }

        // Observe route/layout changes to rebind when scroll container changes
        const viewportEl = document.querySelector('au-viewport');
        const observeTarget = viewportEl ? viewportEl.parentElement : document.body;
        if (observeTarget) {
            const mo = new MutationObserver(() => {
                const current = this.getScrollContainer();
                const currentEl = current && current instanceof HTMLElement ? current : undefined;
                if (currentEl !== this._bt_lastScrollEl) {
                    if (this._bt_lastScrollEl) this._bt_lastScrollEl.removeEventListener('scroll', this.onAnyScroll);
                    if (currentEl) currentEl.addEventListener('scroll', this.onAnyScroll, { passive: true });
                    this._bt_lastScrollEl = currentEl;
                }
                this.onAnyScroll();
            });
            mo.observe(observeTarget, { attributes: true, childList: true, subtree: true });
        }
    }
}

type Font = {
    class: string;
    name: string;
};
