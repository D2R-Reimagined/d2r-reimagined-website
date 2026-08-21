<script lang="ts">
    import type {CatalogSlug} from '$lib/types';
    import type {WeaponSortMode} from '$lib/catalog-controls';
    import {i18n} from '$lib/i18n';

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
        class:collapsed={!expanded}
        class="filters-panel panel sticky top-16 z-40 mb-8 max-h-[calc(100vh-4rem)] overflow-y-auto rounded-lg p-3 sm:p-4"
        aria-label="Catalog filters"
        data-testid="catalog-filters"
>
    <div class="flex items-center justify-between gap-3">
        <div>
            <h2 class="display-text text-base text-parchment-50">Filters</h2>
            <p class="text-xs text-parchment-300">Refine the catalog results.</p>
        </div>
        <button
                type="button"
                class="shrink-0 rounded-md border border-parchment-300/30 px-3 py-1.5 text-sm text-parchment-200 transition hover:border-ember-400/70 hover:text-white"
                aria-controls="catalog-filter-controls"
                aria-expanded={expanded}
                onclick={() => expanded = !expanded}
        >
            {expanded ? 'Collapse' : 'Expand'} <span aria-hidden="true">{expanded ? '▴' : '▾'}</span>
        </button>
    </div>

    {#if expanded}
        <div id="catalog-filter-controls"
             class="filters-grid mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <label class="sm:col-span-2">
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
                <label class="sm:col-span-2">
                    <span class={fieldLabel}>{$i18n.t('filter_select_recipe_type')}</span>
                    <select class="field" bind:value={recipeType}>
                        <option value="">All recipe types</option>
                        {#each recipeTypeOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </label>
            {/if}

            {#if typeOptions.length}
                <label>
                    <span class={fieldLabel}>{$i18n.t('filter_select_type')}</span>
                    <select class="field" bind:value={selectedType}>
                        <option value="">All types</option>
                        {#each typeOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </label>
            {/if}

            {#if (slug === 'uniques' || slug === 'sets') && equipmentOptions.length}
                <label>
                    <span class={fieldLabel}>{$i18n.t('filter_select_equipment')}</span>
                    <select class="field" bind:value={selectedEquipment}>
                        <option value="">All equipment</option>
                        {#each equipmentOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </label>
            {/if}

            {#if classOptions.length}
                <label>
                    <span class={fieldLabel}>{$i18n.t('filter_select_class')}</span>
                    <select class="field" bind:value={selectedClass}>
                        <option value="">All classes</option>
                        {#each classOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </label>
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
                <label class="sm:col-span-2">
                    <span class={fieldLabel}>{$i18n.t('filter_select_property_type')}</span>
                    <select class="field" bind:value={propertyType}>
                        <option value="">All properties</option>
                        {#each propertyOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </label>
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
                <label class="sm:col-span-2">
                    <span class={fieldLabel}>{$i18n.t('filter_runes_only_placeholder')}</span>
                    <select class="field min-h-28" multiple size="4" bind:value={selectedRunes}>
                        {#each runeOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                    <span class="mt-1 block text-xs text-parchment-300/75">Hold Ctrl or Command to choose multiple runes.</span>
                </label>
            {/if}

            {#if ['affixes', 'runewords'].includes(slug) && typeOptions.length}
                <label class="compact-control flex min-h-12 items-center gap-3 self-end rounded-md border border-parchment-300/20 bg-black/20 px-3 py-2">
                    <input type="checkbox" bind:checked={exactType}
                           class="rounded border-gray-600 bg-gray-900 text-ember-500 focus:ring-ember-500"/>
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
                <label class="sm:col-span-2">
                    <span class={fieldLabel}>{$i18n.t('sort_by_damage')}</span>
                    <select class="field" bind:value={weaponSort}>
                        {#each weaponSortOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </label>
            {/if}

            {#if ['uniques', 'sets', 'runewords'].includes(slug)}
                <label class="compact-control flex min-h-12 items-center gap-3 self-end rounded-md border border-parchment-300/20 bg-black/20 px-3 py-2">
                    <input type="checkbox" bind:checked={hideVanilla}
                           class="rounded border-gray-600 bg-gray-900 text-ember-500 focus:ring-ember-500"/>
                    <span>{$i18n.t('filter_hide_vanilla')}</span>
                </label>
            {/if}

            <button type="button" onclick={reset}
                    class="compact-control min-h-12 self-end rounded-md border border-ember-500/55 px-4 py-2 text-ember-400 transition hover:bg-ember-700 hover:text-white">
                {$i18n.t('filter_reset')}
            </button>
        </div>
    {/if}
</section>

<style>
    .filters-panel.collapsed {
        margin-bottom: 1rem;
    }

    @media (max-height: 800px) and (min-width: 640px) {
        .filters-panel {
            padding: 0.65rem;
        }

        .filters-grid {
            margin-top: 0.5rem;
            gap: 0.5rem;
        }

        :global(.filters-grid .field) {
            padding: 0.45rem 0.6rem;
        }

        :global(.filters-grid .compact-control) {
            min-height: 2.5rem;
            padding-top: 0.35rem;
            padding-bottom: 0.35rem;
        }
    }
</style>
