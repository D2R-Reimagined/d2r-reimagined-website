<script lang="ts">
  // The reader's "SETUP" tabs, editable: click to switch, double-click (or the ⋯ menu) to rename.
  import { tick } from 'svelte';
  import type { BuildContent } from '#lib/builds.js';
  import { canAddVariant, limits } from '#lib/build-editor/document.js';
  import AutoGrow from './ui/AutoGrow.svelte';
  import Icon from './ui/Icon.svelte';
  import Menu from './ui/Menu.svelte';
  let { content = $bindable(), activeVariantId = $bindable(''), onadd, onremove }: {
    content: BuildContent; activeVariantId?: string; onadd: (copy: boolean) => void; onremove: () => void;
  } = $props();
  const variant = $derived(content.document.variants.find((v) => v.id === activeVariantId) ?? content.document.variants[0]);
  const canAdd = $derived(canAddVariant(content));
  const fullReason = `A guide can have at most ${limits.variants} setups`;
  let renaming = $state<string | null>(null);
  let original = '';
  let menuOpen = $state(false);
  let more = $state<HTMLButtonElement>();
  let renameInput = $state<HTMLInputElement>();
  let description = $state<HTMLTextAreaElement>();
  let bar = $state<HTMLDivElement>();

  async function rename(id: string) {
    const target = content.document.variants.find((v) => v.id === id);
    if (!target) return;
    activeVariantId = id; original = target.name; renaming = id;
    await tick();
    renameInput?.focus(); renameInput?.select();
  }
  async function finish(revert: boolean) {
    const target = content.document.variants.find((v) => v.id === renaming);
    if (target && (revert || !target.name.trim())) target.name = original;
    const id = renaming;
    renaming = null;
    await tick();
    bar?.querySelector<HTMLButtonElement>(`[data-variant="${id}"]`)?.focus();
  }
  async function describe() { await tick(); description?.focus(); }
</script>

<div class="ve-variant-bar" role="group" aria-label="Build setups" bind:this={bar}>
  <span class="ve-eyebrow">SETUP</span>
  {#each content.document.variants as option (option.id)}
    {#if renaming === option.id}
      <input class="ve-bare ve-variant-rename" bind:this={renameInput} bind:value={option.name} maxlength="60" aria-label="Setup name"
        onblur={() => { if (renaming) void finish(false); }}
        onkeydown={(event) => {
          if (event.key === 'Enter') { event.preventDefault(); void finish(false); }
          if (event.key === 'Escape') { event.preventDefault(); void finish(true); }
        }} />
    {:else}
      <button type="button" class="ve-variant-tab" class:active={variant.id === option.id} class:unnamed={!option.name.trim()}
        data-variant={option.id} aria-pressed={variant.id === option.id} title="Double-click to rename"
        onclick={() => activeVariantId = option.id} ondblclick={() => rename(option.id)}>{option.name.trim() || 'Unnamed setup'}</button>
    {/if}
  {/each}
  <span class="ve-anchor">
    <button type="button" class="ve-icon-button" bind:this={more} aria-haspopup="menu" aria-expanded={menuOpen}
      aria-label={`Options for the ${variant.name || 'unnamed'} setup`} onclick={() => menuOpen = !menuOpen}><Icon name="more" /></button>
    <Menu bind:open={menuOpen} anchor={more} label="Setup options">
      <button type="button" role="menuitem" class="ve-menu-item" onclick={() => rename(variant.id)}><Icon name="pencil" /> Rename</button>
      <button type="button" role="menuitem" class="ve-menu-item" onclick={describe}><Icon name="note" /> When to use this setup</button>
      <button type="button" role="menuitem" class="ve-menu-item" disabled={!canAdd} title={canAdd ? undefined : fullReason} onclick={() => onadd(true)}><Icon name="copy" /> Duplicate</button>
      <button type="button" role="menuitem" class="ve-menu-item danger" disabled={content.document.variants.length <= 1}
        title={content.document.variants.length <= 1 ? 'A guide needs at least one setup' : undefined} onclick={onremove}><Icon name="trash" /> Delete</button>
    </Menu>
  </span>
  <button type="button" class="ve-icon-button" aria-label="Add a setup" disabled={!canAdd} title={canAdd ? 'Add a setup' : fullReason}
    onclick={() => onadd(false)}><Icon name="plus" /></button>
</div>
<AutoGrow bind:value={variant.description} bind:element={description} class="ve-variant-description" maxlength={400}
  placeholder="When to use this setup (optional): what changes, and when should players switch?" aria-label="When to use this setup" />
