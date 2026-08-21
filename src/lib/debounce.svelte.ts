/**
 * Mirrors a text value once it stops changing, so filtering waits for a pause in typing
 * instead of running on every keystroke.
 *
 * Clearing the field applies immediately — a visitor wiping the box expects the results to
 * go away at once, and showing nothing is never the expensive path.
 *
 * ```ts
 * let search = $state('');
 * const query = debounced(() => search);
 * let results = $derived(filter(query.current));
 * ```
 */
export function debounced(read: () => string, delay = 200): { readonly current: string } {
  let value = $state(read().trim());

  $effect(() => {
    const next = read().trim();
    if (next === value) return;
    if (!next) {
      value = '';
      return;
    }
    const timer = setTimeout(() => (value = next), delay);
    return () => clearTimeout(timer);
  });

  return {
    get current() {
      return value;
    }
  };
}
