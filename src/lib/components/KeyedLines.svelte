<script lang="ts">
  import { i18n } from '$lib/i18n';
  import { sortModifierLines } from '$lib/catalog-controls';
  import { childChance, groupHeading, propertyGroupsTitle, splitPropertyGroups } from '$lib/property-groups';
  import { getSkillPoolLookup, resolveSkillPool } from '$lib/skill-selection';
  import type { KeyedLine } from '$lib/types';

  let {
    lines = [],
    class: className = 'property-line',
    collapsible = true
  }: {
    lines?: KeyedLine[];
    class?: string;
    /** Collapse alternate property groups into one disclosure; off inside clickable rows such as Grail labels. */
    collapsible?: boolean;
  } = $props();

  let orderedLines = $derived(sortModifierLines(lines));
  let split = $derived(collapsible ? splitPropertyGroups(orderedLines) : { visible: orderedLines, groups: [] });
  const skillPools = getSkillPoolLookup();

  // Translated names for a restricted skill pool, or null when any name is unavailable so
  // a partial (and therefore wrong) list is never shown.
  function poolNames(line: KeyedLine): string[] | null {
    const keys = resolveSkillPool(line, skillPools());
    if (!keys) return null;
    const names = keys.map((key) => $i18n.t(key));
    return names.some((name, index) => !name || name === keys[index]) ? null : names;
  }
</script>

{#snippet pool(line: KeyedLine)}
  {@const names = poolNames(line)}
  {#if names}
    <details class="item-disclosure item-disclosure-inline">
      <summary>{$i18n.t('skill_pool_count', [names.length])}</summary>
      <ul class="skill-pool-names">
        {#each names as name}<li>{name}</li>{/each}
      </ul>
    </details>
  {/if}
{/snippet}

{#snippet groupChildren(keyedLine: KeyedLine)}
  {#each keyedLine.children ?? [] as child}
    <p>{$i18n.line(child)}{childChance(child, keyedLine)}</p>
    {@render pool(child)}
  {/each}
{/snippet}

{#if orderedLines.length}
  <div class={className}>
    {#each split.visible as keyedLine}
      {#if keyedLine.children?.length}
        <div class="my-2 rounded border border-parchment-300/20 bg-black/25 p-2">
          {#if keyedLine.code}<p class="mb-1 text-parchment-300">{$i18n.t(keyedLine.code)}</p>{/if}
          {@render groupChildren(keyedLine)}
        </div>
      {:else if keyedLine.key}
        <p>{$i18n.line(keyedLine)}</p>
        {@render pool(keyedLine)}
      {/if}
    {/each}
    {#if split.groups.length}
      <details class="item-disclosure property-groups mt-2 text-sm">
        <summary>{propertyGroupsTitle(split.groups.length, $i18n.t)}</summary>
        <ol class="item-disclosure-entries mt-1">
          {#each split.groups as group, index}
            {@const heading = groupHeading(group, $i18n.t)}
            <li class="item-disclosure-entry">
              <p class="property-group-heading"><span class="property-group-index">{index + 1}.</span>{heading}</p>
              {@render groupChildren(group)}
            </li>
          {/each}
        </ol>
      </details>
    {/if}
  </div>
{/if}

<style>
  .skill-pool-names {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.125rem 0.75rem;
    margin: 0.25rem auto 0;
    padding: 0;
    list-style: none;
    max-width: 22rem;
  }

  .property-group-heading {
    color: var(--color-parchment-300);
    font-size: 0.75rem;
  }

  .property-group-index {
    margin-right: 0.3em;
    font-variant-numeric: tabular-nums;
  }
</style>
