import Aurelia from 'aurelia';
import { RouterConfiguration } from '@aurelia/router';

import * as Elements from './resources/elements/index.js';
import * as Resources from './resources/index.js';
import { cleanCurrentUrl } from './utilities/url-sanitize.js';
import { App } from './app.js';

import './styles/tailwind.css';

import { Tooltip } from 'flowbite';

// Global URL cleanup on initial load
cleanCurrentUrl();

// Also clean URL on browser navigation (back/forward) without reloading
window.addEventListener('popstate', () => {
    cleanCurrentUrl();
});

// Tooltip Manager (responsive to resize/hover changes)
interface ITooltipLike {
  show: () => void;
  hide: () => void;
  destroy?: () => void;
}
type TooltipRecord = {
    tooltip: ITooltipLike;
    clickHide: () => void;
    enter?: EventListener;
    leave?: EventListener;
    move?: EventListener;
    idleTimer?: number | null;
    suppressedUntil?: number;
};

// Helpers to provide a single help source that can render as a tooltip (lg+)
// or as an inline panel (mobile). Help content can be supplied via:
// - data-help-text="..." (simple text, can live on the trigger or ancestor)
// - data-help-template="tpl-id" (rich HTML inside a <template id="tpl-id">)
function getHelpNode(
    contextEl: Element,
): { node: HTMLElement; id: string } | null {
    // Prefer template for rich content
    const tplHost = contextEl.closest('[data-help-template]');
    const tplId =
    tplHost?.getAttribute('data-help-template') ||
    contextEl.getAttribute('data-help-template');
    if (tplId) {
        const tpl = document.getElementById(tplId) as HTMLTemplateElement | null;
        if (tpl && 'content' in tpl) {
            const wrapper = document.createElement('div');
            wrapper.appendChild(tpl.content.cloneNode(true));
            return { node: wrapper, id: tplId };
        }
    }
    // Fallback to a simple text attribute
    const textHost = contextEl.closest('[data-help-text]');
    const helpText =
    textHost?.getAttribute('data-help-text') ||
    contextEl.getAttribute('data-help-text');
    if (helpText) {
        const wrapper = document.createElement('div');
        wrapper.textContent = helpText;
        return {
            node: wrapper,
            id: 'help-' + Math.random().toString(36).slice(2),
        };
    }
    return null;
}

function ensureInfoPanelFor(button: HTMLElement): HTMLElement | null {
    const forId = button.getAttribute('data-info-for') || '';
    const trigger = (
    forId ? document.getElementById(forId) : button.previousElementSibling
  ) as HTMLElement | null;
    if (!trigger) return null;

    // If the button already controls a panel, return it
    const existingId = button.getAttribute('aria-controls');
    if (existingId) {
        const existingEl = document.getElementById(existingId);
        if (existingEl) return existingEl;
    }

    // Determine a good host to position the inline panel: the closest help host
    const helpHost =
    trigger.closest('[data-help-text], [data-help-template]') ||
    button.closest('[data-help-text], [data-help-template]');

    // Read help content from the trigger/host/button (in that order)
    const help =
    getHelpNode(trigger) ||
    (helpHost ? getHelpNode(helpHost) : null) ||
    getHelpNode(button) ||
    (button.parentElement ? getHelpNode(button.parentElement) : null);
    if (!help) return null;

    const panel = document.createElement('div');
    const panelId =
    'info-' + (forId || help.id || Math.random().toString(36).slice(2));
    panel.id = panelId;
    panel.className = 'info-panel-base hidden';
    panel.setAttribute('data-info-panel', '');
    panel.appendChild(help.node);

    // Insert the panel as a new row after the help host (preferred),
    // otherwise append next to the button as a fallback
    if (helpHost) {
        helpHost.insertAdjacentElement('afterend', panel);
    } else {
        button.parentElement?.appendChild(panel);
    }

    button.setAttribute('aria-controls', panelId);
    return panel;
}

const TooltipManager = (() => {
    const hoverMql = matchMedia('(hover: hover) and (pointer: fine)');
    const lgMql = matchMedia('(min-width: 1024px)'); // tailwind lg breakpoint

    let enabled = false;
    const instances = new Map<HTMLElement, TooltipRecord>();
    let docClickHandler: EventListener | null = null;
    let observer: MutationObserver | null = null;

    const setupTrigger = (trigger: HTMLElement) => {
        if (!enabled) return;
        if (instances.has(trigger)) return;
        let target: HTMLElement | null = null;
        const id = trigger.getAttribute('data-tooltip-target');
        if (id) target = document.getElementById(id);

        // If no explicit tooltip target, try to generate from a help source
        if (!target) {
            const help = getHelpNode(trigger);
            if (!help) return; // nothing to show for this trigger
            target = document.createElement('div');
            const tipId = 'tt-' + help.id;
            target.id = tipId;
            target.setAttribute('role', 'tooltip');
            target.className = 'tooltip-base';
            target.appendChild(help.node);
            // Place after trigger for Flowbite positioning
            trigger.insertAdjacentElement('afterend', target);
            // A11y: associate trigger with tooltip
            trigger.setAttribute('aria-describedby', tipId);
        }

        // Choose placement. Allow per-trigger override via data-tooltip-placement
        const overridePlacement = (
            trigger.getAttribute('data-tooltip-placement') ||
      trigger
          .closest('[data-tooltip-placement]')
          ?.getAttribute('data-tooltip-placement') ||
      ''
        ).toLowerCase();
        // Only accept safe values we use (top/bottom). Could be extended to left/right if desired.
        const allowed: Record<string, true> = { top: true, bottom: true };
        // Default / fallback
        let placement: 'top' | 'bottom' = allowed[overridePlacement]
            ? (overridePlacement as 'top' | 'bottom')
            : 'top';
        try {
            if (!allowed[overridePlacement]) {
                const rect = trigger.getBoundingClientRect();
                const vh = window.innerHeight || document.documentElement.clientHeight;
                const spaceAbove = rect.top;
                const spaceBelow = vh - rect.bottom;
                placement = spaceAbove >= spaceBelow ? 'top' : 'bottom';
            }
        } catch {
            /* default to top */
        }

        // Resolve the required idle (no-move) delay before showing, in ms.
        const resolveIdleMs = (): number => {
            const findAttr = (node: Element | null): string | null =>
                (node as HTMLElement | null)?.getAttribute('data-tooltip-idle') ?? null;
            const raw =
        findAttr(trigger) ||
        findAttr(trigger.closest('[data-tooltip-idle]')) ||
        findAttr(document.body);
            const n = raw ? parseInt(raw, 10) : NaN;
            return Number.isFinite(n) && n >= 0 ? n : 500; // default 500ms if not specified
        };
        const idleMs = resolveIdleMs();

    // Create a Flowbite tooltip with a minimal, typed surface we care about
    type TooltipCtor = new (
      targetEl: HTMLElement,
      triggerEl: HTMLElement,
      options?: Record<string, unknown>, // Flowbite types can be too restrictive for custom strategy
    ) => ITooltipLike;
    const TTip: TooltipCtor = Tooltip as unknown as TooltipCtor;
    const rawTooltip: unknown = new TTip(target, trigger, {
        // We will control show/hide manually to enforce the idle (no-move) requirement
        triggerType: 'none',
        placement,
        offset: 8,
        // Prefer fixed positioning to avoid clipping within overflow/scroll containers
        // Some Flowbite type bundles may not include "strategy"
        ...({ strategy: 'fixed' } as Record<string, unknown>),
    });
    const t: ITooltipLike = rawTooltip as ITooltipLike;

    const clearIdle = (rec: TooltipRecord) => {
        if (rec.idleTimer != null) {
            clearTimeout(rec.idleTimer);
            rec.idleTimer = null;
        }
    };

    const rec: TooltipRecord = {
        tooltip: t,
        clickHide: () => {
            clearIdle(rec);
            t.hide();
            // Prevent the tooltip from reappearing for 1 second after a click
            rec.suppressedUntil = Date.now() + 1000;
        },
        idleTimer: null,
        suppressedUntil: 0,
    };

    const onEnter: EventListener = () => {
        if (Date.now() < (rec.suppressedUntil || 0)) return;
        clearIdle(rec);
        rec.idleTimer = window.setTimeout(() => {
            try {
                t.show();
            } catch {
                /* noop */
            }
        }, idleMs);
    };
    const onMove: EventListener = () => {
        if (Date.now() < (rec.suppressedUntil || 0)) return;
        // Any cursor movement while hovering resets the idle timer until stable for idleMs
        clearIdle(rec);
        rec.idleTimer = window.setTimeout(() => {
            try {
                t.show();
            } catch {
                /* noop */
            }
        }, idleMs);
    };
    const onLeave: EventListener = () => {
        clearIdle(rec);
        try {
            t.hide();
        } catch {
        /* noop */
        }
    };

    rec.enter = onEnter;
    rec.leave = onLeave;
    rec.move = onMove;

    const clickHide: EventListener = rec.clickHide;
    trigger.addEventListener('click', clickHide);
    trigger.addEventListener('mouseenter', onEnter);
    trigger.addEventListener('mousemove', onMove);
    trigger.addEventListener('mouseleave', onLeave);

    instances.set(trigger, rec);
    };

    const initExisting = () => {
        document
            .querySelectorAll<HTMLElement>(
                '[data-tooltip-target], [data-help-text], [data-help-template]',
            )
            .forEach(setupTrigger);
    };

    const attachObserver = () => {
        if (observer) return;
        observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                m.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) return;
                    if (
                        node.hasAttribute('data-tooltip-target') ||
            node.hasAttribute('data-help-text') ||
            node.hasAttribute('data-help-template')
                    )
                        setupTrigger(node);
                    node
                        .querySelectorAll?.(
                            '[data-tooltip-target], [data-help-text], [data-help-template]',
                        )
                        .forEach((el) => {
                            if (el instanceof HTMLElement) setupTrigger(el);
                        });
                });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    const detachObserver = () => {
        observer?.disconnect();
        observer = null;
    };

    const attachDocClickHandler = () => {
        if (docClickHandler) return;
        docClickHandler = (event: Event) => {
            const target = event.target as HTMLElement;
            instances.forEach((rec, trigger) => {
                // If the user clicks outside the trigger, hide it immediately
                if (!trigger.contains(target)) {
                    try {
                        rec.tooltip.hide?.();
                        if (rec.idleTimer != null) {
                            clearTimeout(rec.idleTimer);
                            rec.idleTimer = null;
                        }
                    } catch {
                        /* noop */
                    }
                } else {
                    // If they clicked inside the trigger, activate the suppression
                    rec.clickHide();
                }
            });
        };
        document.addEventListener('click', docClickHandler, { capture: true });
    };

    const detachDocClickHandler = () => {
        if (!docClickHandler) return;
        // Must pass the same capture flag used in addEventListener
        document.removeEventListener('click', docClickHandler, true);
        docClickHandler = null;
    };

    const enable = () => {
        if (enabled) return;
        enabled = true;
        initExisting();
        attachDocClickHandler();
        attachObserver();
    };

    const disable = () => {
        if (!enabled) return;
        enabled = false;

        // Hide and destroy all tooltip instances and remove per-trigger listeners
        instances.forEach(
            ({ tooltip, clickHide, enter, leave, move, idleTimer }, trigger) => {
                try {
                    tooltip.hide?.();
                } catch {
                    /* noop */
                }
                try {
                    tooltip.destroy?.();
                } catch {
                    /* noop */
                }
                trigger.removeEventListener('click', clickHide);
                if (enter) trigger.removeEventListener('mouseenter', enter);
                if (leave) trigger.removeEventListener('mouseleave', leave);
                if (move) trigger.removeEventListener('mousemove', move);
                if (idleTimer != null)
                    try {
                        clearTimeout(idleTimer);
                    } catch {
                        /* noop */
                    }
            },
        );
        instances.clear();

        detachDocClickHandler();
        detachObserver();
    };

    // Ensure any inline mobile info panels are hidden when at lg+ breakpoint
    const hideInlinePanelsOnLg = () => {
        if (!lgMql.matches) return;
        // Hide any visible inline info panels
        document
            .querySelectorAll<HTMLElement>('[data-info-panel]:not(.hidden)')
            .forEach((el) => el.classList.add('hidden'));
        // Reset any toggles that may have been left expanded on mobile
        document
            .querySelectorAll<HTMLElement>('[data-info-for][aria-expanded="true"]')
            .forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
    };

    const updateMode = () => {
        const shouldEnable = hoverMql.matches && lgMql.matches;
        if (shouldEnable) enable();
        else disable();
        // On entering lg (or already at lg), make sure mobile panels are not shown
        hideInlinePanelsOnLg();
    };

    const addMqlListener = (
        mql: MediaQueryList,
        handler: (e: MediaQueryListEvent) => void,
    ) => {
        if (typeof mql.addEventListener === 'function')
            mql.addEventListener('change', handler);
        else mql.addListener(handler);
    };
    const removeMqlListener = (
        mql: MediaQueryList,
        handler: (e: MediaQueryListEvent) => void,
    ) => {
        if (typeof mql.removeEventListener === 'function')
            mql.removeEventListener('change', handler);
        else mql.removeListener(handler);
    };

    // Reusable listener references to ensure proper removal
    const onHoverChange: (e: MediaQueryListEvent) => void = () => updateMode();
    const onLgChange: (e: MediaQueryListEvent) => void = () => updateMode();

    const start = () => {
        addMqlListener(hoverMql, onHoverChange);
        addMqlListener(lgMql, onLgChange);
        updateMode();
    };

    const stop = () => {
        disable();
        removeMqlListener(hoverMql, onHoverChange);
        removeMqlListener(lgMql, onLgChange);
    };

    return { start, stop };
})();

// Mobile info button toggles (inline panels only)
function initMobileInfoButtons(): void {
    document.addEventListener(
        'click',
        (e) => {
            const target = e.target as HTMLElement | null;
            const btn = target?.closest('[data-info-for]') as HTMLElement | null;
            if (!btn) return;

            const panel = ensureInfoPanelFor(btn);
            if (!panel) return;
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            panel.classList.toggle('hidden', expanded);
        },
        true,
    );
}

// Initialize UI helpers at once
TooltipManager.start();
initMobileInfoButtons();

void Aurelia.register(
    RouterConfiguration.customize({
    //title: "Betsy Bot Admin Panel",
        useUrlFragmentHash: false,
    }),
)
    .register(Resources)
    .register(Elements)
    .app(App)
    .start();
