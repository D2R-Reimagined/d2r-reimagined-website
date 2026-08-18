<script lang="ts">
  import { Badge } from 'flowbite-svelte';

  import { itemTitle, itemType } from '$lib/catalog';
  import { i18n } from '$lib/i18n';
  import type { CatalogItem, CatalogSlug, KeyedLine } from '$lib/types';
  import KeyedLines from './KeyedLines.svelte';

  let { item, slug }: { item: CatalogItem; slug: CatalogSlug } = $props();

  const equipmentEarly = new Set([
    'strDefense', 'strDefenseRange', 'strDefenseRangeRange', 'strChanceToBlock',
    'strSmiteDamage', 'strKickDamage', 'strWeaponDamageGenericRange',
    'strWeaponDamageOneHand', 'strWeaponDamageTwoHand'
  ]);
  const requirements = new Set([
    'strRequiredClass', 'strRequiredDexterity', 'strRequiredStrength',
    'strRequiredDexterityRange', 'strRequiredStrengthRange', 'strRequiredLevelRange'
  ]);

  function byKeys(lines: KeyedLine[] | undefined, keys: Set<string>, include = true) {
    return (lines ?? []).filter((line) => include === keys.has(line.key));
  }

  function typeName(value: string | { Index?: string; Name?: string; Class?: string }): string {
    return typeof value === 'string' ? value : value.Index ?? value.Name ?? '';
  }

  function quantity(value: number | undefined): string {
    return value && value > 1 ? `${value} × ` : '';
  }
</script>

<article class="panel flex h-full flex-col rounded-lg p-5 text-center transition duration-200 hover:-translate-y-0.5 hover:border-ember-400/45">
  <header class="mb-3 border-b border-parchment-300/15 pb-3">
    <h2 class:unique-line={slug !== 'sets'} class:set-line={slug === 'sets'} class="display-text text-xl">
      {$i18n.t(itemTitle(item, slug))}
    </h2>
    <div class="mt-2 flex flex-wrap justify-center gap-2 text-xs">
      {#if item.Vanilla}
        <Badge color={item.Vanilla === 'Y' ? 'gray' : 'red'}>{item.Vanilla === 'Y' ? 'Vanilla' : 'Reimagined'}</Badge>
      {/if}
      {#if item.source}<Badge color="gray">{item.source}</Badge>{/if}
      {#if item.RequiredLevel != null}<Badge color="gray">Level {item.RequiredLevel}</Badge>{/if}
    </div>
  </header>

  {#if slug === 'sets'}
    <KeyedLines lines={item.PartialBonuses} class="set-line text-sm" />
    <KeyedLines lines={item.FullBonuses} class="set-line text-sm" />
    <div class="mt-2 space-y-5">
      {#each item.SetItems ?? [] as setItem}
        <section>
          <h3 class="set-line text-lg">{$i18n.t(setItem.Index)}</h3>
          <p class="base-line">{$i18n.t(setItem.Equipment?.NameKey)}</p>
          <KeyedLines lines={byKeys(setItem.Equipment?.Lines, equipmentEarly)} class="base-line" />
          {#each setItem.Equipment?.DamageTypes ?? [] as damage}
            <KeyedLines lines={damage.Lines} class="base-line" />
          {/each}
          <KeyedLines lines={byKeys(setItem.Equipment?.Lines, requirements)} class="requirement-line" />
          {#if !(setItem.Equipment?.Lines ?? []).some((line) => line.key === 'strRequiredLevelRange')}
            <p class="requirement-line">{$i18n.t('strRequiredLevel', [setItem.RequiredLevel ?? 1])}</p>
          {/if}
          <KeyedLines lines={setItem.Lines} />
          {#each setItem.SetBonuses ?? [] as bonus}<KeyedLines lines={bonus} class="set-line" />{/each}
        </section>
      {/each}
    </div>
  {:else if slug === 'runewords'}
    <p class="base-line mb-1">
      {(item.Types ?? []).map((value) => $i18n.t(typeName(value))).join(` ${$i18n.t('label_or')} `)}
    </p>
    <p class="mb-2">{(item.Runes ?? []).map((rune) => $i18n.t(rune.NameKey)).join(' + ')}</p>
    {#if !(item.Lines ?? []).some((line) => line.key === 'strRequiredLevelRange')}
      <p class="requirement-line">{$i18n.t('strRequiredLevel', [item.RequiredLevel ?? 1])}</p>
    {/if}
    <KeyedLines lines={item.Lines} />
  {:else if slug === 'bases'}
    <p class="base-line mb-1">{$i18n.t(itemType(item))}</p>
    {#each item.DamageTypes ?? [] as damage}<KeyedLines lines={damage.Lines} class="base-line" />{/each}
    <KeyedLines lines={byKeys(item.Lines, requirements, false)} class="base-line" />
    <KeyedLines lines={byKeys(item.Lines, requirements)} class="requirement-line" />
    {#if item.RequiredLevel != null}<p class="requirement-line">{$i18n.t('strRequiredLevel', [item.RequiredLevel])}</p>{/if}
    {#if item.GemSockets}<p class="mt-2 text-sm text-parchment-300">Sockets: {String(item.GemSockets)}</p>{/if}
  {:else if slug === 'affixes'}
    <p class="base-line mb-1">{item.PType} · Level {String(item.Level ?? 0)}{Number(item.MaxLevel) ? `–${String(item.MaxLevel)}` : '+'}</p>
    {#if item.ClassSpecific}<p class="requirement-line">{String(item.ClassSpecific)}</p>{/if}
    <p class="mb-2 text-sm text-parchment-300">{(item.Types ?? []).map((value) => $i18n.t(typeName(value))).join(', ')}</p>
    <KeyedLines lines={item.Lines} />
  {:else if slug === 'cube-recipes'}
    <div class="space-y-3 text-left">
      <div>
        <h3 class="display-text text-xs uppercase tracking-widest text-parchment-300">Inputs</h3>
        {#each item.Inputs ?? [] as input}<p>{quantity(input.Quantity)}{$i18n.line(input.Name)}</p>{/each}
      </div>
      <div>
        <h3 class="display-text text-xs uppercase tracking-widest text-parchment-300">Outputs</h3>
        {#each Object.values(item.Outputs ?? {}) as output}
          <p>{quantity(output.Quantity)}{$i18n.line(output.Name)}</p>
          <KeyedLines lines={output.Lines} />
        {/each}
      </div>
      <KeyedLines lines={item.Notes} class="text-parchment-300" />
    </div>
  {:else}
    <p class="base-line mb-1">{$i18n.t(item.Equipment?.NameKey)}</p>
    <KeyedLines lines={byKeys(item.Equipment?.Lines, equipmentEarly)} class="base-line" />
    {#each item.Equipment?.DamageTypes ?? [] as damage}<KeyedLines lines={damage.Lines} class="base-line" />{/each}
    <KeyedLines lines={byKeys(item.Equipment?.Lines, requirements)} class="requirement-line" />
    {#if !(item.Equipment?.Lines ?? []).some((line) => line.key === 'strRequiredLevelRange')}
      <p class="requirement-line">{$i18n.t('strRequiredLevel', [item.RequiredLevel ?? 1])}</p>
    {/if}
    <KeyedLines lines={item.Lines} />
  {/if}
</article>
