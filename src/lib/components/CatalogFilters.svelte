<script lang="ts">
    import type {CatalogSlug} from '$lib/types';
    import type {WeaponSortMode} from '$lib/catalog-controls';
    import {i18n} from '$lib/i18n';
    import SearchableSelect from './SearchableSelect.svelte';
    import SearchableMultiSelect from './SearchableMultiSelect.svelte';

    type Option = { value: string; label: string };

    let {
        slug, typeOptions, classOptions, equipmentOptions, propertyOptions,
        recipeTypeOptions, runeOptions, weaponSortOptions,
        search = $bindable(''), selectedType = $bindable(''),
        selectedClass = $bindable(''), subtype = $bindable(''),
        hideVanilla = $bindable(false), runeCount = $bindable(''),
        selectedEquipment = $bindable(''), selectedTier = $bindable(''),
        selectedSockets = $bindable(''), propertyType = $bindable(''),
        minLevel = $bindable(''), maxLevel = $bindable(''),
        exactType = $bindable(false), recipeType = $bindable(''),
        selectedRunes = $bindable([]), weaponSort = $bindable(''),
        handFilter = $bindable(''), reset
    }: {
        slug: CatalogSlug;
        typeOptions: Option[];
        classOptions: Option[];
        equipmentOptions: Option[];
        propertyOptions: Option[];
        recipeTypeOptions: Option[];
        runeOptions: Option[];
        weaponSortOptions: Array<{ value: WeaponSortMode; label: string }>;
        search?: string;
        selectedType?: string;
        selectedClass?: string;
        subtype?: string;
        hideVanilla?: boolean;
        runeCount?: string;
        selectedEquipment?: string;
        selectedTier?: string;
        selectedSockets?: string;
        propertyType?: string;
        minLevel?: string;
        maxLevel?: string;
        exactType?: boolean;
        recipeType?: string;
        selectedRunes?: string[];
        weaponSort?: WeaponSortMode;
        handFilter?: string;
        reset: () => void;
    } = $props();

    const fieldLabel = 'mb-1 block text-xs uppercase tracking-widest text-parchment-300';
    let expanded = $state(true);
</script>

<section
        class="filters-panel panel sticky top-16 z-40 mb-4 max-h-[calc(100vh-4rem)] overflow-y-auto rounded-lg p-2.5 sm:p-3"
        aria-label="Catalog filters"
        data-testid="catalog-filters"
>
    <div class="flex items-center justify-between gap-3">
        <h2 class="display-text text-sm text-parchment-50">Filters</h2>
        <button
                type="button"
                class="flex size-7 shrink-0 items-center justify-center rounded text-parchment-200 transition hover:bg-parchment-300/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
                aria-label={expanded ? 'Collapse filters' : 'Expand filters'}
                title={expanded ? 'Collapse filters' : 'Expand filters'}
                aria-controls="catalog-filter-controls"
                aria-expanded={expanded}
                onclick={() => expanded = !expanded}
        >
            <svg class="size-4 transition-transform" class:rotate-180={!expanded}
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m6 11 6-6 6 6m-12 7 6-6 6 6" />
            </svg>
        </button>
    </div>

    {#if expanded}
        <div id="catalog-filter-controls"
             class="filters-grid mt-1.5 grid grid-cols-2 items-end gap-2 lg:grid-cols-4 xl:grid-cols-6">
            <label class="col-span-2">
                <span class={fieldLabel}>{$i18n.t('filter_search_placeholder')}</span>
                <input class="field" type="search" placeholder="Name, property, base, or class…" autocomplete="off"
                       bind:value={search}/>
            </label>

            {#if slug === 'bases'}
                <label>
                    <span class={fieldLabel}>{$i18n.t('filter_select_category')}</span>
                    <select class="field" bind:value={subtype}>
                        <option value="">All bases</option>
                        <option value="weapon">{$i18n.t('label_weapons')}</option>
                        <option value="armor">{$i18n.t('label_armors')}</option>
                    </select>
                </label>
            {:else if slug === 'affixes'}
                <label>
                    <span class={fieldLabel}>{$i18n.t('filter_select_affix_type')}</span>
                    <select class="field" bind:value={subtype}>
                        <option value="">All affixes</option>
                        <option value="prefix">{$i18n.t('label_prefix')}</option>
                        <option value="suffix">{$i18n.t('label_suffix')}</option>
                    </select>
                </label>
            {/if}

            {#if slug === 'cube-recipes'}
                <div class="col-span-2"><SearchableSelect id="recipe-type" label={$i18n.t('filter_select_recipe_type')}
                    placeholder="All recipe types" options={recipeTypeOptions} bind:value={recipeType} /></div>
            {/if}

            {#if typeOptions.length}
                <SearchableSelect id="item-type" label={$i18n.t('filter_select_type')}
                    placeholder="All types" options={typeOptions} bind:value={selectedType} />
            {/if}

            {#if (slug === 'uniques' || slug === 'sets') && equipmentOptions.length}
                <SearchableSelect id="equipment" label={$i18n.t('filter_select_equipment')}
                    placeholder="All equipment" options={equipmentOptions} bind:value={selectedEquipment} />
            {/if}

            {#if classOptions.length}
                <SearchableSelect id="item-class" label={$i18n.t('filter_select_class')}
                    placeholder="All classes" options={classOptions} bind:value={selectedClass} />
            {/if}

            {#if slug === 'bases'}
                <label>
                    <span class={fieldLabel}>{$i18n.t('filter_select_tier')}</span>
                    <select class="field" bind:value={selectedTier}>
                        <option value="">All tiers</option>
                        <option value="Normal">{$i18n.t('label_normal')}</option>
                        <option value="Exceptional">{$i18n.t('label_exceptional')}</option>
                        <option value="Elite">{$i18n.t('label_elite')}</option>
                    </select>
                </label>
                <label>
                    <span class={fieldLabel}>{$i18n.t('filter_select_sockets')}</span>
                    <select class="field" bind:value={selectedSockets}>
                        <option value="">Any sockets</option>
                        {#each [1, 2, 3, 4, 5, 6] as count}
                            <option value={String(count)}>{count === 1 ? $i18n.t('label_socket', [count]) : $i18n.t('label_sockets', [count])}</option>
                        {/each}
                    </select>
                </label>
            {/if}

            {#if slug === 'affixes'}
                <div class="col-span-2"><SearchableSelect id="property-type" label={$i18n.t('filter_select_property_type')}
                    placeholder="All properties" options={propertyOptions} bind:value={propertyType} /></div>
                <label>
                    <span class={fieldLabel}>{$i18n.t('filter_min_rlvl')}</span>
                    <select class="field" bind:value={minLevel}>
                        <option value="">No minimum</option>
                        {#each Array.from({length: 99}, (_, i) => i + 1) as level}
                            <option value={String(level)}>{level}</option>
                        {/each}
                    </select>
                </label>
                <label>
                    <span class={fieldLabel}>{$i18n.t('filter_max_rlvl')}</span>
                    <select class="field" bind:value={maxLevel}>
                        <option value="">No maximum</option>
                        {#each Array.from({length: 99}, (_, i) => i + 1) as level}
                            <option value={String(level)}>{level}</option>
                        {/each}
                    </select>
                </label>
            {/if}

            {#if slug === 'runewords'}
                <label>
                    <span class={fieldLabel}>{$i18n.t('filter_rune_count')}</span>
                    <select class="field" bind:value={runeCount}>
                        <option value="">Any count</option>
                        {#each [2, 3, 4, 5, 6] as count}
                            <option value={String(count)}>{count} runes</option>
                        {/each}
                    </select>
                </label>
                <div class="col-span-2">
                    <SearchableMultiSelect id="runes-only" label={$i18n.t('filter_runes_only_placeholder')}
                        placeholder="Any runes" options={runeOptions} bind:value={selectedRunes} />
                </div>
            {/if}

            {#if ['affixes', 'runewords'].includes(slug) && typeOptions.length}
                <label class="compact-control flex items-center gap-2 rounded-md border border-parchment-300/20 bg-black/20">
                    <input type="checkbox" bind:checked={exactType} class="checkbox"/>
                    <span>{$i18n.t('filter_exact')}</span>
                </label>
            {/if}

            {#if ['bases', 'uniques', 'sets'].includes(slug)}
                <label>
                    <span class={fieldLabel}>{$i18n.t('sort_select_weapon_type')}</span>
                    <select class="field" bind:value={handFilter}>
                        <option value="">All weapons</option>
                        <option value="1h">{$i18n.t('label_1h_only')}</option>
                        <option value="2h">{$i18n.t('label_2h_only')}</option>
                    </select>
                </label>
                <label class="col-span-2">
                    <span class={fieldLabel}>{$i18n.t('sort_by_damage')}</span>
                    <select class="field" bind:value={weaponSort}>
                        {#each weaponSortOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </label>
            {/if}

            {#if ['uniques', 'sets', 'runewords'].includes(slug)}
                <label class="compact-control flex items-center gap-2 rounded-md border border-parchment-300/20 bg-black/20">
                    <input type="checkbox" bind:checked={hideVanilla} class="checkbox"/>
                    <span>{$i18n.t('filter_hide_vanilla')}</span>
                </label>
            {/if}

            <button type="button" onclick={reset}
                    class="compact-control rounded-md border border-ember-500/55 text-ember-400 transition hover:bg-ember-700 hover:text-white">
                {$i18n.t('filter_reset')}
            </button>
        </div>
    {/if}
</section>

<style>
    .filters-grid > :global(*) {
        min-width: 0;
    }

    .filters-grid :global(.field),
    .compact-control {
        min-height: 2.25rem;
        padding: 0.4rem 0.6rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
    }

</style>
