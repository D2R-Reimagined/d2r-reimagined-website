<script lang="ts">
  import type { BuildBlock } from '#lib/builds.js';
  import CharacterViewer from '#lib/components/CharacterViewer.svelte';
  import BuildGear from '../../BuildGear.svelte';
  import { visualEditor } from '../context';
  import SectionNotes from './SectionNotes.svelte';
  let { block = $bindable() }: { block: BuildBlock } = $props();
  const editor = visualEditor();
  let refreshRequested = $state(false);
  const manual = $derived(block.equipmentMode === 'manual');
  const matching = $derived(editor.characters.filter((c) => c.class === editor.characterClass));
  const snapshot = $derived(editor.equipment[block.id]);
  const missing = $derived(!!block.characterId && !matching.some((c) => c.id === block.characterId));

  function setMode(mode: 'character' | 'manual') {
    block.equipmentMode = mode;
    block.manualGear ??= [];
  }
  function refresh() { block.snapshotVersion++; refreshRequested = true; }
</script>

<div class="ve-segmented" role="group" aria-label="Equipment source">
  <button type="button" aria-pressed={!manual} onclick={() => setMode('character')}>From a character</button>
  <button type="button" aria-pressed={manual} onclick={() => setMode('manual')}>Build it manually</button>
</div>

{#if manual}
  <BuildGear bind:entries={block.manualGear} />
{:else}
  {#if editor.characterError}
    <p class="ve-alert">{editor.characterError}</p>
  {:else if !matching.length}
    <p class="ve-hint">No matching characters. <a href="/profile">Upload a {editor.characterClass} on your profile</a> first.</p>
  {:else}
    <div class="ve-character-list" role="group" aria-label={`Your ${editor.characterClass} characters`}>
      {#each matching as character (character.id)}
        <button type="button" class="ve-pill" aria-pressed={block.characterId === character.id}
          onclick={() => block.characterId = block.characterId === character.id ? null : character.id}>
          {character.name} <small>Level {character.level}{character.isHardcore ? ' · HC' : ''}</small>
        </button>
      {/each}
    </div>
  {/if}
  {#if missing}<p class="ve-issue">The selected character is no longer in your list. Choose another one.</p>{/if}
  <p class="ve-hint">The server captures the equipment and inventory on save. Publishing shares this snapshot, including if the original character is private. Later character changes do not alter this guide.</p>
  {#if snapshot}
    <div class="ve-snapshot">
      <div class="ve-snapshot-bar">
        <span>Captured: {snapshot.character.name}</span>
        {#if refreshRequested}<span role="status">Equipment will be refreshed from the character when you save.</span>
        {:else}<button type="button" class="ve-text-button" onclick={refresh}>Refresh snapshot on next save</button>{/if}
      </div>
      {#if block.characterId && block.characterId !== snapshot.character.id}
        <p class="ve-hint">You picked a different character. Its equipment replaces this snapshot when you save.</p>
      {/if}
      <CharacterViewer details={snapshot} inventoryOnly embedded />
    </div>
  {/if}
{/if}
<SectionNotes bind:block />
