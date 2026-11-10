<script lang="ts">
  // A keyboard-navigable dropdown. Put it inside a `position:relative` wrapper next to its trigger
  // and render `<button role="menuitem" class="ve-menu-item">` (or menuitemradio) children.
  // Arrow keys/Home/End move, Escape or Tab closes, choosing an item closes it.
  import { tick, type Snippet } from 'svelte';
  let { open = $bindable(false), anchor, label, wide = false, children }: {
    open?: boolean; anchor?: HTMLElement; label: string; wide?: boolean; children: Snippet;
  } = $props();
  let menu = $state<HTMLDivElement>();
  let shift = $state(0);
  let upward = $state(false);

  const items = () => [...(menu?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not(:disabled)') ?? [])];

  $effect.pre(() => { if (!open) { shift = 0; upward = false; } });
  $effect(() => {
    if (!open || !menu) return;
    // Keep the menu on screen: nudge it sideways, and open it upwards near the bottom edge.
    const rect = menu.getBoundingClientRect();
    const anchorRect = anchor?.getBoundingClientRect();
    let x = 0;
    if (rect.right > window.innerWidth - 8) x = window.innerWidth - 8 - rect.right;
    if (rect.left + x < 8) x = 8 - rect.left;
    shift = x;
    upward = rect.bottom > window.innerHeight - 8 && !!anchorRect && anchorRect.top > rect.height + 80;
    items()[0]?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menu?.contains(target) && !anchor?.contains(target)) open = false;
    };
    window.addEventListener('pointerdown', outside, true);
    return () => window.removeEventListener('pointerdown', outside, true);
  });

  async function close(restoreFocus: boolean) {
    open = false;
    await tick();
    // Give focus back unless the chosen action moved it somewhere useful.
    if (restoreFocus && (!document.activeElement || document.activeElement === document.body)) anchor?.focus();
  }
  function keydown(event: KeyboardEvent) {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const go = (next: number) => { event.preventDefault(); list[(next + list.length) % list.length]?.focus(); };
    if (event.key === 'ArrowDown') go(index + 1);
    else if (event.key === 'ArrowUp') go(index - 1);
    else if (event.key === 'Home') go(0);
    else if (event.key === 'End') go(list.length - 1);
    else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); void close(true); }
    else if (event.key === 'Tab') void close(false);
  }
  function click(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('[role^="menuitem"]:not(:disabled)')) void close(true);
  }
</script>

{#if open}
  <div class="ve-menu" class:wide class:upward role="menu" tabindex="-1" aria-label={label} bind:this={menu}
    style:translate={shift ? `${shift}px 0` : undefined} onkeydown={keydown} onclick={click}>
    {@render children()}
  </div>
{/if}
