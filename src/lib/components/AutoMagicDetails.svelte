<script lang="ts">
  import { presentAutoMagic } from '#lib/automagic.js';
  import { i18n } from '#lib/i18n.js';
  import type { CatalogItem } from '#lib/types.js';

  let { item }: { item: CatalogItem } = $props();

  let entries = $derived(presentAutoMagic(item, $i18n));
</script>

{#if entries.length}
  <details class="item-disclosure automagic mt-2 text-sm">
    <summary>{$i18n.t('automagic_title')} ({entries.length})</summary>
    <p class="automagic-note">{$i18n.t('automagic_note')}</p>
    <ul class="item-disclosure-entries">
      {#each entries as entry}
        <li class="item-disclosure-entry">
          {#if entry.name}<p class="automagic-name">{entry.name}</p>{/if}
          {#each entry.lines as line}
            {#if line.children}
              <div class="automagic-group">
                <p class="text-parchment-300">{line.text}</p>
                <ul>
                  {#each line.children as child}
                    <li class="property-line">
                      {child.text}{#if child.selectionText}<span class="automagic-selection"> ({child.selectionText})</span>{/if}
                    </li>
                  {/each}
                </ul>
              </div>
            {:else}
              <p class="property-line">{line.text}</p>
            {/if}
          {/each}
          {#if entry.meta.length}<p class="requirement-line automagic-meta">{entry.meta.join(' · ')}</p>{/if}
        </li>
      {/each}
    </ul>
  </details>
{/if}

<style>
  .automagic-note {
    margin: 0.25rem 0 0.5rem;
    color: var(--color-parchment-300);
    font-style: italic;
    font-size: 0.75rem;
  }

  .automagic-name {
    color: var(--color-magic);
    font-weight: 600;
  }

  .automagic-group {
    margin: 0.25rem 0;
  }

  .automagic-group ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .automagic-selection {
    color: var(--color-parchment-300);
  }

  .automagic-meta {
    font-size: 0.75rem;
  }
</style>
