<script lang="ts">
    import {untrack} from 'svelte';
    import {i18n} from '$lib/i18n';
    import {calculateHealth, healthInputs, levelScale, type HealthInputs, type HealthKind, type HealthMonster} from '$lib/health-calculator';

    let {data} = $props();
    let selected = $state(untrack(() => data.health.Monsters.find(m => m.Enabled && m.Killable)!.Id));
    let difficulty = $state(2);
    let players = $state(1);
    let profile = $state<'HP' | 'LHP'>('LHP');
    let kind = $state<HealthKind>('normal');
    let areaId = $state(0);
    let search = $state('');
    let showInactive = $state(false);
    let edits = $state<Partial<HealthInputs>>({});
    let monster = $derived(data.health.Monsters.find(m => m.Id === selected)!);
    let baseline = $derived(healthInputs(data.health, monster, difficulty, areaId, profile, kind));
    let input = $derived({...baseline, ...edits});
    let current = $derived(calculateHealth(data.health, baseline, players));
    let changed = $derived(calculateHealth(data.health, input, players));
    let areas = $derived(data.health.Areas.filter(a => monster.Areas[difficulty].includes(a.Id)));
    let visible = $derived(data.health.Monsters.filter(m => (showInactive || (m.Enabled && m.Killable)) &&
        `${$i18n.t(m.NameKey)} ${m.Id}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())));
    const fields: {key: Exclude<keyof HealthInputs, 'noRatio'>; label: string; source: string}[] = [
        {key: 'level', label: 'Base monster level', source: 'monstats / levels'},
        {key: 'min', label: 'Minimum HP value', source: 'monstats: minHP'},
        {key: 'max', label: 'Maximum HP value', source: 'monstats: maxHP'},
        {key: 'scale', label: 'Level-table HP', source: 'monlvl: HP or L-HP'},
        {key: 'playerPercent', label: 'HP per extra player (%)', source: 'Engine rule'},
        {key: 'typePercent', label: 'Monster type bonus (%)', source: 'monumod: constants'},
        {key: 'extraPercent', label: 'Additional life bonus (%)', source: 'Manual scenario modifier'},
        {key: 'flatLife', label: 'Additional flat life', source: 'Manual scenario modifier'}
    ];
    function edit(key: typeof fields[number]['key'], value: number) {
        edits[key] = value;
        if (key === 'level') edits.scale = levelScale(data.health, value, difficulty, profile);
    }
    function select(m: HealthMonster) { selected = m.Id; areaId = 0; kind = 'normal'; edits = {}; }
    function resetContext() { areaId = 0; edits = {}; }
    function range(result: ReturnType<typeof calculateHealth>) {
        return result.error ? 'Unavailable' : `${result.min?.toLocaleString('en-US')} – ${result.max?.toLocaleString('en-US')}`;
    }
</script>

<svelte:head>
    <title>Monster Health Calculator | D2R Reimagined</title>
    <meta name="robots" content="noindex, nofollow" />
    <meta name="description" content="Explore monster health and compare balance changes using the current Reimagined data." />
</svelte:head>

<section class="mx-auto max-w-7xl px-5 py-12">
    <p class="text-sm uppercase tracking-widest text-ember-400">Balancing workbench</p>
    <h1 class="display-text mt-3 text-4xl sm:text-6xl">Health Calculator</h1>
    <p class="mt-4 max-w-3xl text-parchment-300">Explore the mod’s monster health, change its contributing values, and compare the result. Edits are a local preview; reset or reload to return to the exported values.</p>

    <div class="panel my-8 grid gap-5 rounded-lg p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label>Difficulty<select bind:value={difficulty} onchange={resetContext}><option value={0}>Normal</option><option value={1}>Nightmare</option><option value={2}>Hell</option></select></label>
        <label>Health table<select bind:value={profile} onchange={() => edits = {}}><option value="LHP">L-HP (expansion scaling)</option><option value="HP">HP (original scaling)</option></select></label>
        <label class="sm:col-span-2">Players: <strong>{players}</strong> · +{(players - 1) * data.health.Rules.AdditionalPlayerPercent}% base health
            <input class="mt-4 w-full accent-orange-500" type="range" min="1" max={data.health.Rules.MaximumPlayers} step="1" bind:value={players} />
        </label>
    </div>

    <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section class="panel min-w-0 rounded-lg p-5">
            <h2 class="display-text text-2xl">Monsters <span class="text-sm text-parchment-300">({visible.length})</span></h2>
            <label class="mt-4 block">Search monsters<input type="search" placeholder="Name or file ID" bind:value={search} /></label>
            <label class="my-4 flex items-center gap-2"><input type="checkbox" bind:checked={showInactive} /> Include disabled / unkillable rows</label>
            <p class="mb-3 text-xs text-parchment-300">Listed HP uses the file’s base level and the current difficulty, table and players. Select a monster to choose its area and type.</p>
            <div class="max-h-[42rem] overflow-auto">
                <table class="w-full text-left text-sm">
                    <thead><tr><th>Monster</th><th>Level</th><th>Current HP</th></tr></thead>
                    <tbody>{#each visible as m (m.Id)}
                        {@const result = calculateHealth(data.health, healthInputs(data.health, m, difficulty, 0, profile, 'normal'), players)}
                        <tr class:chosen={m.Id === selected}>
                            <td><button class="text-left hover:text-ember-400" onclick={() => select(m)}>{$i18n.t(m.NameKey)}<small class="block break-all text-parchment-300">{m.Id}</small></button></td>
                            <td>{m.Stats[difficulty].Level}</td><td>{range(result)}</td>
                        </tr>
                    {/each}</tbody>
                </table>
                {#if !visible.length}<p class="py-8">No matching monsters.</p>{/if}
            </div>
        </section>

        <div class="min-w-0 space-y-6">
            <section class="panel rounded-lg p-5">
                <div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="display-text text-2xl">{$i18n.t(monster.NameKey)}</h2><p class="text-sm text-parchment-300">{monster.Id}{monster.Boss ? ' · Boss' : ''}</p></div>
                    <button class="rounded border border-white/20 px-3 py-2 hover:border-ember-400" onclick={() => edits = {}}>Reset tweaks</button></div>
                <div class="my-5 grid gap-4 sm:grid-cols-2">
                    <label>Area<select bind:value={areaId} onchange={() => edits = {}}><option value={0}>Use monstats level</option>{#each areas as area}<option value={area.Id}>{$i18n.t(area.NameKey)} · {area.Levels[difficulty]}</option>{/each}</select></label>
                    <label>Monster type<select bind:value={kind} onchange={() => edits = {}}><option value="normal">{monster.Boss ? 'Boss (base stats)' : 'Normal'}</option><option value="minion">Unique minion</option><option value="champion">Champion</option><option value="unique">Unique / superunique</option></select></label>
                </div>
                <p class="mb-5 text-xs text-parchment-300">Area level affects Nightmare/Hell monsters unless boss or noRatio is set. Champion/unique level additions do not recalculate base health. Missing area membership uses the file level; edit it for scripted spawns or terror zones.</p>
                <div class="grid gap-4 sm:grid-cols-2">{#each fields as field}
                    <label>{field.label}<input type="number" step="1" value={input[field.key]} disabled={field.key === 'scale' && input.noRatio}
                        oninput={e => edit(field.key, e.currentTarget.value === '' ? NaN : Number(e.currentTarget.value))} />
                        <small class="text-parchment-300">{field.source} · current: {baseline[field.key]}</small></label>
                {/each}</div>
                <label class="mt-5 flex items-center gap-2"><input type="checkbox" checked={input.noRatio} onchange={e => edits.noRatio = e.currentTarget.checked} /> noRatio — HP values are absolute, skip level scaling</label>
            </section>
            <section class="panel rounded-lg p-5" aria-live="polite">
                <h2 class="display-text mb-5 text-2xl">Health comparison</h2>
                <div class="grid gap-4 sm:grid-cols-2"><div><p class="text-parchment-300">Current</p><p class="mt-2 text-xl">{range(current)}</p></div><div><p class="text-ember-400">With tweaks</p><p class="mt-2 text-xl">{range(changed)}</p></div></div>
                {#if current.error}<p class="mt-4 text-amber-300">Current: {current.error}</p>{/if}
                {#if changed.error}<p class="mt-4 text-amber-300" role="alert">{changed.error}</p>{:else}
                    <p class="mt-4 text-parchment-300">Midpoint: {changed.average?.toLocaleString('en-US')}
                        {#if !current.error && current.average} · {(((changed.average ?? 0) / current.average - 1) * 100).toFixed(1)}% change{/if}</p>
                    <ol class="mt-5 space-y-2 text-sm text-parchment-300"><li>1. Base HP: {changed.base?.join(' – ')}</li><li>2. Player scaling: {changed.playerLife?.join(' – ')}</li><li>3. Monster type: {changed.typed?.map(v => Math.floor(v)).join(' – ')}</li><li>4. Additional scenario bonuses → final HP above</li></ol>
                    {#if changed.capped}<p class="mt-4 text-amber-300">Player-scaled health reached the engine cap ({data.health.Rules.MaximumLife.toLocaleString('en-US')}).</p>{/if}
                {/if}
            </section>
            <details class="panel rounded-lg p-5"><summary class="cursor-pointer">Other current stats & calculation notes</summary>
                <div class="mt-4 grid grid-cols-2 gap-3 text-sm">{#each Object.entries(monster.Stats[difficulty]).filter(([key]) => key.endsWith('Resist')) as [key, value]}<p>{key.replace('Resist', '')} resistance: {value}%</p>{/each}<p>DamageRegen: {monster.DamageRegen ?? 0}</p><p>MonProp: {monster.MonProp || 'None'}</p></div>
                <p class="mt-4 text-sm text-parchment-300">This models table-based spawn health and standard type bonuses. Summoning skills, equipment, auras, special champion variants and scripted life changes are not automatically applied. Use the additional bonus fields to explore those scenarios; they are separate sequential modifiers. Resistances and regeneration above are reference values, not effective-health calculations.</p>
                <p class="mt-3 text-sm text-parchment-300">Base ratios round down; player scaling is capped before type bonuses. Type bonuses use fixed-point life. Values beyond the supported life-stat range show an error instead of a misleading result.</p>
            </details>
        </div>
    </div>
</section>

<style>
    .panel { background: rgba(12, 12, 15, .72); border: 1px solid rgba(210, 185, 140, .18); }
    label { font-size: .875rem; color: #d6c9b1; }
    select, input[type=number], input[type=search] { display: block; width: 100%; min-width: 0; margin-top: .4rem; border: 1px solid #51483b; border-radius: .35rem; background: #151518; color: #eee4d2; padding: .65rem; }
    input:disabled { opacity: .45; }
    th, td { padding: .7rem .4rem; border-bottom: 1px solid #ffffff12; }
    th { position: sticky; top: 0; background: #19181a; }
    td { vertical-align: top; }
    .chosen { background: #a8642229; }
</style>
