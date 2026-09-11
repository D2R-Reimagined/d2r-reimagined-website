<script lang="ts">
  import { tick } from 'svelte';
  import { gearSlots, emptyGear, type BuildGearEntry, type GearSlot } from '$lib/build-gear';
  import BuildItemLink from './BuildItemLink.svelte';
  import BuildItemPicker from './BuildItemPicker.svelte';
  let { entries = $bindable([]), readonly = false }: { entries?: BuildGearEntry[]; readonly?: boolean } = $props();
  let editing = $state<BuildGearEntry | null>(null);
  let picking = $state(false);
  let editPanel = $state<HTMLDivElement>();
  const equipmentSlots = Object.entries(gearSlots).filter(([slot]) => slot !== 'inventory') as [GearSlot, string][];
  async function edit(slot: GearSlot, entry?: BuildGearEntry) {
    if (!entry && entries.length >= 52) return;
    editing = entry ?? emptyGear(slot);
    if (!entry) entries.push(editing);
    picking = false;
    await tick();
    editPanel?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function remove(entry: BuildGearEntry) {
    entries = entries.filter(value => value !== entry);
    if (editing === entry) { editing = null; picking = false; }
  }
</script>

{#snippet gear(entry: BuildGearEntry)}
  {#if entry.item}<BuildItemLink reference={entry.item} />{/if}
  {#if entry.name}<p class="gear-name">{entry.name}</p>{/if}
  {#if entry.notes}<p class="gear-notes">{entry.notes}</p>{/if}
  {#if !readonly}<div class="actions"><button type="button" onclick={() => edit(entry.slot, entry)}>Edit {gearSlots[entry.slot]}</button><button type="button" onclick={() => remove(entry)}>Remove</button></div>{/if}
{/snippet}

<div class="manual-gear">
  <h3>Equipment</h3>
  <div class="gear-grid">
    {#each equipmentSlots as [slot, label]}
      {@const entry = entries.find(entry => entry.slot === slot)}
      <div class="gear-slot panel"><h4>{label}</h4>
        {#if entry}{@render gear(entry)}{:else if !readonly}<button type="button" class="add" disabled={entries.length >= 52} onclick={() => edit(slot)}>＋ Add {label}</button>{:else}<p class="empty">Not specified</p>{/if}
      </div>
    {/each}
  </div>
  <h3>Inventory</h3>
  <div class="gear-grid">
    {#each entries.filter(entry => entry.slot === 'inventory') as entry}
      <div class="gear-slot panel"><h4>{entry.quantity} × Inventory item</h4>{@render gear(entry)}</div>
    {/each}
  </div>
  {#if !entries.some(entry => entry.slot === 'inventory')}<p class="empty">No inventory items specified.</p>{/if}
  {#if !readonly}<button type="button" class="add" disabled={entries.length >= 52} onclick={() => edit('inventory')}>＋ Add inventory item</button>{/if}

  {#if editing && entries.includes(editing) && !readonly}
    <div class="gear-edit panel" bind:this={editPanel} aria-label={`Editing ${gearSlots[editing.slot]}`}>
      <h3>{gearSlots[editing.slot]}</h3>
      <p>Choose an item from the catalog, or give custom gear a name. Add target rolls, sockets, or modifiers below.</p>
      <div class="actions"><button type="button" onclick={() => picking = !picking}>Choose catalog item</button>
        {#if editing.item}<button type="button" onclick={() => editing!.item = null}>Clear catalog item</button>{/if}
      </div>
      {#if editing.item}<BuildItemLink reference={editing.item} />{/if}
      {#if picking}<BuildItemPicker onchoose={reference => { if (editing) editing.item = reference; picking = false; }} />{/if}
      <label>Custom name / label<input class="field" maxlength="120" bind:value={editing.name} placeholder="e.g. Rare resistance ring" /></label>
      <label>Target rolls & modifiers<textarea class="field" rows="4" maxlength="2000" bind:value={editing.notes} placeholder="e.g. +10% faster cast rate, life, fire resistance"></textarea></label>
      {#if editing.slot === 'inventory'}<label>Quantity<input class="field" type="number" min="1" max="40" bind:value={editing.quantity} /></label>{/if}
      <button type="button" onclick={() => { editing = null; picking = false; }}>Done</button>
    </div>
  {/if}
</div>

<style>
  .manual-gear { min-width:0; margin:1rem 0; }
  h3 { color:var(--color-parchment-50); margin:1rem 0 .7rem; font-size:1.1rem; }
  h4 { color:var(--color-parchment-300); font-size:.8rem; margin-bottom:.7rem; }
  .gear-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.7rem; }
  .gear-slot,.gear-edit { padding:1rem; border-radius:6px; min-width:0; overflow-wrap:anywhere; }
  .gear-name { color:var(--color-parchment-50); }
  .gear-notes { white-space:pre-wrap; font-size:.9rem; margin-top:.6rem; }
  .empty,.gear-edit p { color:var(--color-parchment-300); font-size:.85rem; }
  .actions { display:flex; flex-wrap:wrap; gap:.7rem; margin:.7rem 0; }
  button { color:var(--color-parchment-200); text-decoration:underline; text-underline-offset:3px; font-size:.85rem; }
  button:disabled { opacity:.5; } .add { padding:.5rem 0; }
  .gear-edit { margin-top:1rem; border-color:var(--color-parchment-300); scroll-margin-top:90px; }
  label { display:grid; gap:.4rem; margin:.8rem 0; } input,textarea { width:100%; min-width:0; }
  @media(max-width:700px){.gear-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
  @media(max-width:450px){.gear-grid{grid-template-columns:minmax(0,1fr);}}
</style>
