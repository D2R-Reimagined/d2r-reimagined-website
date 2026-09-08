<script lang="ts">
    import {untrack} from 'svelte';
    import {afterNavigate, replaceState} from '$app/navigation';
    import {page} from '$app/state';
    import {i18n} from '$lib/i18n';
    import {
        calculateIas,
        canDualWield,
        maxIas,
        normalAttack,
        readIasUrl,
        skillAvailable,
        weaponAvailable,
        writeIasUrl
    } from '$lib/ias-calculator';

    let {data} = $props();
    let setup = $state(untrack(() => readIasUrl(page.url, data.ias)));
    let ready = $state(false);
    let shareStatus = $state('');
    let weaponSearch = $state('');
    let skills = $derived(data.ias.Skills.filter(s => skillAvailable(s, setup.character, setup.form)));
    let skill = $derived(skills.find(s => s.Code === setup.skill));
    let weapons = $derived(data.ias.Weapons.filter(w => weaponAvailable(w, setup.character, skill)).sort((a, b) => $i18n.t(a.NameKey).localeCompare($i18n.t(b.NameKey))));
    let visibleWeapons = $derived(weapons.filter(w => w.Code === setup.weapon || $i18n.t(w.NameKey).toLocaleLowerCase().includes(weaponSearch.toLocaleLowerCase())));
    let weapon = $derived(weapons.find(w => w.Code === setup.weapon));
    let dualAllowed = $derived(!!skill?.Rule.DualAllowed && !!weapon && canDualWield(weapon, setup.character) && setup.form === 'human');
    let secondWeapons = $derived(weapons.filter(w => canDualWield(w, setup.character)));
    let result = $derived(calculateIas(data.ias, setup));
    let buffs = $derived(data.ias.Buffs.filter(b => b.Code !== 'Maul' && (b.Code !== 'Wearwolf' || setup.form === 'wolf')));

    function normalizeInputs() {
        setup = readIasUrl(writeIasUrl(page.url, setup, data.ias), data.ias);
    }

    function reconcile() {
        const selected = data.ias.Skills.find(s => s.Code === setup.skill && skillAvailable(s, setup.character, setup.form));
        if (!selected) setup.skill = normalAttack;
        const primary = data.ias.Weapons.find(w => w.Code === setup.weapon && weaponAvailable(w, setup.character, selected));
        if (!primary) {
            setup.weapon = '';
            setup.weaponIas = 0;
        }
        if (!selected?.Rule.DualAllowed || !primary || !canDualWield(primary, setup.character) || setup.form !== 'human') {
            setup.secondary = '';
            setup.secondaryIas = 0;
        } else if (!data.ias.Weapons.some(w => w.Code === setup.secondary && weaponAvailable(w, setup.character, selected) && canDualWield(w, setup.character))) {
            setup.secondary = '';
            setup.secondaryIas = 0;
        }
        if (setup.character !== 'bar' || !primary?.OneOrTwoHanded) setup.oneHanded = false;
        if (setup.form !== 'wolf') setup.buffs.Wearwolf = 0;
        if (setup.form !== 'bear') setup.buffs.Maul = 0;
        weaponSearch = '';
    }

    afterNavigate(() => {
        setup = readIasUrl(page.url, data.ias);
        reconcile();
        ready = true;
    });
    $effect(() => {
        if (!ready) return;
        const url = writeIasUrl(page.url, setup, data.ias);
        if (url.href !== page.url.href) {
            replaceState(url, page.state);
            shareStatus = '';
        }
    });

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(writeIasUrl(page.url, setup, data.ias).href);
            shareStatus = 'Link copied';
        } catch {
            shareStatus = 'Copy the address from your browser to share this setup.';
        }
    }
</script>

<svelte:head>
    <title>IAS Calculator — D2R Reimagined</title>
    <meta name="description"
          content="Calculate attack-speed breakpoints with D2R Reimagined weapon bases, skill bonuses, and animation timings."/>
</svelte:head>

<section class="mx-auto max-w-7xl px-5 py-12 sm:py-16">
    <div class="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
            <h1 class="display-text mt-3 text-4xl sm:text-6xl">IAS Calculator</h1>
        </div>
        <div>
            <button class="share" onclick={copyLink}>Copy setup link ↗</button>
            <p class="mt-2 text-xs text-parchment-300" aria-live="polite">{shareStatus}</p></div>
    </div>

    <div class="grid items-start gap-6 lg:grid-cols-[23rem_1fr]">
        <div class="space-y-5">
            <section class="panel rounded-lg p-5">
                <h2 class="display-text mb-5 text-xl">Your attack</h2>
                <div class="grid grid-cols-2 gap-4">
                    <label>Character<select class="field" bind:value={setup.character} onchange={reconcile}>
                        {#each data.ias.Classes as character}
                            <option value={character.ClassCode}>{$i18n.t(character.NameKey)}</option>
                        {/each}
                    </select></label>
                    <label>Form<select class="field" bind:value={setup.form} onchange={reconcile}>
                        <option value="human">Human</option>
                        <option value="wolf">Werewolf</option>
                        <option value="bear">Werebear</option>
                    </select></label>
                </div>
                <label class="mt-4">Attack<select class="field" bind:value={setup.skill} onchange={reconcile}>
                    <option value={normalAttack}>Normal attack</option>
                    {#each skills as entry}
                        <option value={entry.Code}>{$i18n.t(entry.NameKey)}</option>
                    {/each}
                </select></label>
                {#if skill}<label class="mt-4">Skill level<input class="field" type="number" min="1" max="100" step="1"
                                                                 onchange={normalizeInputs}
                                                                 bind:value={setup.level}/></label>{/if}
                <label class="mt-4">Find a weapon<input class="field" type="search" placeholder="Search weapon bases…"
                                                        bind:value={weaponSearch}/></label>
                <label class="mt-4">Weapon base<select class="field" bind:value={setup.weapon} onchange={reconcile}>
                    <option value="">Unarmed / choose a weapon</option>
                    {#each visibleWeapons as entry}
                        <option value={entry.Code}>{$i18n.t(entry.NameKey)} ({entry.Speed > 0 ? '+' : ''}{entry.Speed}
                            )
                        </option>
                    {/each}
                </select></label>
                {#if weapon}<p class="mt-2 text-xs text-parchment-300">Base speed: <span
                        class="text-parchment-50">{weapon.Speed}</span> · Lower is faster</p>{/if}
                {#if setup.character === 'bar' && weapon?.OneOrTwoHanded && !setup.secondary}<label
                        class="check mt-4"><input type="checkbox" bind:checked={setup.oneHanded}/> Wield sword
                    one-handed</label>{/if}
                {#if dualAllowed}<label class="mt-4">Second weapon<select class="field" bind:value={setup.secondary}
                                                                          onchange={() => { if (!setup.secondary) setup.secondaryIas = 0; }}>
                    <option value="">None</option>
                    {#each secondWeapons as entry}
                        <option value={entry.Code}>{$i18n.t(entry.NameKey)} ({entry.Speed})</option>
                    {/each}
                </select></label>{/if}
            </section>

            <section class="panel rounded-lg p-5">
                <h2 class="display-text mb-2 text-xl">Increased attack speed</h2>
                <p class="mb-5 text-xs leading-relaxed text-parchment-300">Enter the IAS shown on your equipment. Weapon
                    IAS is separate from the rest of your gear.</p>
                <div class="grid grid-cols-2 gap-4">
                    <label>Equipment IAS %<input class="field" type="number" min="0" max={maxIas} step="1"
                                                 onchange={normalizeInputs} bind:value={setup.ias}/></label>
                    <label>Weapon IAS %<input class="field" type="number" min="0" max={maxIas} step="1"
                                              onchange={normalizeInputs} disabled={!weapon}
                                              bind:value={setup.weaponIas}/></label>
                    {#if setup.secondary}<label>Second weapon IAS %<input class="field" type="number" min="0"
                                                                          max={maxIas} step="1"
                                                                          onchange={normalizeInputs}
                                                                          bind:value={setup.secondaryIas}/></label>{/if}
                </div>
            </section>

            <details class="panel rounded-lg p-5"
                     open={Object.values(setup.buffs).some(n => n > 0) || setup.slow > 0 || setup.chilled || setup.extraSpeed !== 0}>
                <summary class="display-text cursor-pointer text-xl">Buffs & slowing effects</summary>
                <p class="mt-3 text-xs leading-relaxed text-parchment-300">Use effective skill levels, including
                    +skills. Zero disables a buff. Only enable effects active on your character.</p>
                <div class="mt-5 grid grid-cols-2 gap-4">
                    {#each buffs as buff}<label>{$i18n.t(buff.NameKey)}<input class="field" type="number" min="0"
                                                                              max={buff.Values?.length ?? 0} step="1"
                                                                              onchange={normalizeInputs}
                                                                              disabled={!buff.Values}
                                                                              bind:value={setup.buffs[buff.Code]}/>
                        {#if setup.buffs[buff.Code] > 0 && buff.Values}<span
                                class="text-xs text-ember-400">{buff.Values[Math.min(buff.Values.length, setup.buffs[buff.Code]) - 1]}
                            % skill IAS</span>{/if}
                    </label>{/each}
                    <label>Slowed by %<input class="field" type="number" min="0" max="100" step="1"
                                             onchange={normalizeInputs} bind:value={setup.slow}/></label>
                    <label>Other skill IAS %<input class="field" type="number" min="-200" max="200" step="1"
                                                   onchange={normalizeInputs} bind:value={setup.extraSpeed}/></label>
                </div>
                <label class="check mt-5"><input type="checkbox" bind:checked={setup.chilled}/> Chilled (−50% skill IAS)</label>
            </details>
        </div>

        <div class="min-w-0 space-y-5">
            {#if result.error}
                <div class="panel rounded-lg p-8" role="status"><h2 class="display-text text-2xl">Choose your setup</h2>
                    <p class="mt-3 text-parchment-300">{result.error}</p></div>
            {:else}
                {#each result.tables as table}
                    <section class="panel overflow-hidden rounded-lg">
                        <div class="border-b border-parchment-300/15 bg-ember-950/20 p-6">
                            <p class="text-xs uppercase tracking-[0.2em] text-ember-400">{table.label}</p>
                            <div class="mt-4 grid gap-5 sm:grid-cols-2">
                                <div><p class="text-xs text-parchment-300">Current frame pattern</p>
                                    <p class="display-text mt-1 break-words text-3xl text-parchment-50">{table.current.frames.join(' / ')}</p>
                                    <p class="mt-2 text-sm text-parchment-300">{table.current.attacksPerSecond.toFixed(2)}
                                        attacks per second</p></div>
                                <div><p class="text-xs text-parchment-300">Next breakpoint</p>
                                    {#if table.next}<p class="display-text mt-1 text-3xl text-ember-400">
                                        +{table.next.ias - (Number(setup.ias) || 0)}% IAS</p>
                                        <p class="mt-2 text-sm text-parchment-300">{table.next.ias}% equipment IAS
                                            total</p>{:else}<p class="display-text mt-1 text-2xl text-set">No later
                                        breakpoint</p>
                                        <p class="mt-2 text-sm text-parchment-300">Within the {maxIas.toLocaleString()}%
                                            equipment IAS range.</p>{/if}
                                </div>
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-sm">
                                <caption class="sr-only">{table.label} equipment IAS breakpoints</caption>
                                <thead>
                                <tr>
                                    <th>Equipment IAS</th>
                                    <th>Frames</th>
                                    <th>Attacks / sec</th>
                                </tr>
                                </thead>
                                <tbody>
                                {#each table.rows as row}
                                    <tr class:current={row === table.current}>
                                        <td>{row.ias}%
                                            {#if row === table.current}<span
                                                    class="ml-2 text-xs text-ember-400">Current</span>{/if}
                                        </td>
                                        <td>{row.frames.join(' / ')}</td>
                                        <td>{row.attacksPerSecond.toFixed(2)}</td>
                                    </tr>
                                {/each}
                                </tbody>
                            </table>
                        </div>
                    </section>
                {/each}
            {/if}
            {#if result.notes.length}
                <div class="panel rounded-lg p-5">
                    <ul class="list-disc space-y-2 pl-4 text-sm leading-relaxed text-parchment-300">
                        {#each result.notes as note}
                            <li>{note}</li>
                        {/each}
                    </ul>
                </div>
            {/if}
            <div class="px-1 text-sm leading-relaxed text-parchment-300">
                <p>Breakpoints use Reimagined’s weapon speeds, skill values, and animation timings. The game runs at 25
                    simulation frames per second. Cast-rate skills use FCR instead of IAS.</p>
                <p class="mt-3">Wereforms assume you have the skill or item needed to transform. Normal attacks model
                    the selected weapon. Special attacks without verified timing show an unavailable result.</p>
                <p class="mt-3 text-xs">Mechanics reference: <a class="text-ember-400 hover:underline"
                                                                href="https://warren1001.github.io/IAS_Calculator/"
                                                                target="_blank" rel="noreferrer">Warren’s IAS
                    Calculator</a>. This calculator uses the mod’s exported data.</p>
            </div>
        </div>
    </div>
</section>

<style>
    label {
        display: flex;
        flex-direction: column;
        gap: .45rem;
        font-size: .8rem;
        color: var(--color-parchment-200);
    }

    .field {
        width: 100%;
        min-width: 0;
        padding: .65rem .75rem;
        border: 1px solid var(--color-parchment-300);
        border-color: color-mix(in srgb, var(--color-parchment-300) 22%, transparent);
        border-radius: .3rem;
        background: var(--color-abyss-950);
        color: var(--color-parchment-50);
    }

    .field:focus {
        outline: 1px solid var(--color-ember-400);
    }

    .check {
        flex-direction: row;
        align-items: center;
        gap: .6rem;
    }

    th, td {
        padding: .8rem 1.5rem;
        border-bottom: 1px solid color-mix(in srgb, var(--color-parchment-300) 10%, transparent);
    }

    th {
        color: var(--color-parchment-300);
        font-size: .75rem;
        font-weight: 500;
        white-space: nowrap;
    }

    .current {
        background: color-mix(in srgb, var(--color-ember-700) 18%, transparent);
        color: var(--color-parchment-50);
    }

    .share {
        border: 1px solid color-mix(in srgb, var(--color-ember-400) 50%, transparent);
        border-radius: .3rem;
        padding: .65rem 1rem;
        color: var(--color-parchment-50);
        font-size: .85rem;
    }

    .share:hover {
        background: color-mix(in srgb, var(--color-ember-700) 25%, transparent);
    }
</style>
