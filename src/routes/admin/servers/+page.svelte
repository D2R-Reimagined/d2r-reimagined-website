<script lang="ts">
  import { onMount, tick } from 'svelte';
  import ServerRegistryEditor from '$lib/components/ServerRegistryEditor.svelte';
  import type { ServerConfiguration } from '$lib/server-registry';
  import { appendLogs, connectServerTelemetry, getServers, logLevels, type TelemetryLog, type TelemetryServer } from '$lib/server-telemetry';

  let servers = $state<TelemetryServer[]>([]);
  let configured = $state<ServerConfiguration[]>([]);
  let selectedId = $state('');
  let loading = $state(true);
  let connection = $state('Connecting');
  let error = $state('');
  let logs = $state<TelemetryLog[]>([]);
  let frozen = $state<TelemetryLog[]>([]);
  let paused = $state(false);
  let follow = $state(true);
  let severity = $state(0);
  let search = $state('');
  let historyGap = $state(false);
  let now = $state(Date.now());
  let clockOffset = $state(0);
  let logPane: HTMLDivElement | undefined = $state();
  let disconnect: (() => void) | undefined;
  let mounted = false;
  const selected = $derived(servers.find(s => s.id === selectedId));
  const snapshot = $derived(selected?.snapshot);
  const visibleLogs = $derived((paused ? frozen : logs).filter(e => e.level >= severity && e.message.toLowerCase().includes(search.toLowerCase())));
  const stalled = $derived(snapshot?.games.flatMap(g => g.players).filter(p => p.stalled).length ?? 0);

  function configuration(id: string): ServerConfiguration | undefined { return configured.find(s => s.id === id); }
  function displayName(id: string): string { return configuration(id)?.name?.trim() || id; }
  function age(server: TelemetryServer): number {
    return server.receivedAtUtc ? Math.max(0, (now + clockOffset - Date.parse(server.receivedAtUtc)) / 1000) : Infinity;
  }
  function status(server: TelemetryServer): string {
    if (server.status === 'disabled') return 'disabled';
    return age(server) > 30 ? 'offline' : age(server) > 10 ? 'delayed' : server.status;
  }
  function tone(value: string): string {
    return value === 'online' ? 'text-emerald-300' : value === 'offline' || value === 'stalled' ? 'text-requirement' : 'text-amber-300';
  }
  function duration(seconds: number): string {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m`;
  }
  function choose(id: string): void {
    if (!mounted || (id === selectedId && disconnect)) return;
    disconnect?.(); selectedId = id;
    logs = []; frozen = []; paused = false; historyGap = false; error = '';
    disconnect = connectServerTelemetry(id, frame => {
      servers = frame.servers; clockOffset = Date.parse(frame.nowUtc) - Date.now();
      historyGap ||= frame.gap;
      logs = appendLogs(logs, frame.entries);
      if (follow && !paused) void tick().then(() => { if (logPane) logPane.scrollTop = logPane.scrollHeight; });
    }, (state, message) => { connection = state; error = message ?? ''; });
  }
  async function load(signal: AbortSignal): Promise<void> {
    try {
      const frame = await getServers(signal);
      if (signal.aborted) return;
      servers = frame.servers; clockOffset = Date.parse(frame.nowUtc) - Date.now(); error = '';
      if (!selectedId && servers.length) choose(servers[0].id);
    } catch (e) { if (!signal.aborted) error = e instanceof Error ? e.message : 'Unable to load servers.'; }
    finally { if (!signal.aborted) loading = false; }
  }
  async function refreshMonitoring(): Promise<void> {
    if (!mounted) return;
    const frame = await getServers();
    if (!mounted) return;
    servers = frame.servers; clockOffset = Date.parse(frame.nowUtc) - Date.now();
    if (!selectedId && servers.length) choose(servers[0].id);
  }
  function togglePause(): void { if (!paused) frozen = [...logs]; paused = !paused; }
  function exportLogs(): void {
    const text = visibleLogs.map(e => `${new Date(e.timestamp).toISOString()} [${logLevels[e.level]}] [${e.session}/${e.sourceId}] ${e.message}`).join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `server-${selectedId}-${new Date().toISOString().replaceAll(':', '-')}.log`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  onMount(() => {
    mounted = true;
    const controller = new AbortController();
    void load(controller.signal);
    const timer = setInterval(() => { now = Date.now(); }, 1000);
    const discovery = setInterval(() => { if (!selectedId) void load(controller.signal); }, 10000);
    return () => { mounted = false; controller.abort(); disconnect?.(); clearInterval(timer); clearInterval(discovery); };
  });
</script>

<svelte:head><title>Servers | D2R Reimagined</title></svelte:head>

<div class="space-y-5">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div><h2 class="display-text text-3xl text-parchment-50">Servers</h2><p class="mt-2 text-sm text-parchment-300">Manage dedicated servers and regions, and monitor live lobbies, connections, and diagnostics.</p></div>
    <span class={`rounded-full border border-parchment-300/25 px-3 py-1 text-xs ${connection === 'Live' ? 'text-emerald-300' : 'text-amber-300'}`} role="status">{selectedId ? connection : loading ? 'Loading' : 'No servers'}</span>
  </div>
  {#if error}<div class="rounded-lg border border-ember-400/40 bg-ember-700/20 p-3 text-sm text-parchment-50" role="alert">{error} {connection === 'Reconnecting' ? 'The stream will retry automatically. Displayed data is the last report.' : ''}</div>{/if}
  <ServerRegistryEditor onchange={refreshMonitoring} onconfigured={value => { configured = value; }} />
  <h3 class="display-text text-xl text-parchment-50">Live monitoring</h3>
  {#if loading}
    <div class="panel rounded-lg p-8 text-parchment-300">Loading server reports…</div>
  {:else if !servers.length}
    <div class="panel rounded-lg p-8"><h3 class="display-text text-xl text-parchment-50">No dedicated servers configured</h3><p class="mt-3 text-parchment-300">Add a server above, then enable telemetry on its D2RDS host.</p></div>
  {:else}
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Dedicated servers">
      {#each servers as server (server.id)}
        <button onclick={() => choose(server.id)} aria-pressed={selectedId === server.id} class={`panel min-w-0 rounded-lg p-4 text-left transition hover:border-ember-400/65 ${selectedId === server.id ? 'border-ember-400/65 bg-ember-700/15' : ''}`}>
          <span class="flex items-center justify-between gap-2"><span class="display-text truncate text-lg text-parchment-50" title={server.id}>{displayName(server.id)}</span><span class={`text-xs uppercase tracking-wider ${tone(status(server))}`}>{status(server)}</span></span>
          <span class="mt-1 block text-xs text-parchment-300">{displayName(server.id) !== server.id ? `${server.id} · ` : ''}{server.address}{server.snapshot ? `:${server.snapshot.gamePort}` : ''}</span>
          {#if server.regionIds?.length}<span class="mt-1 block break-words text-xs text-parchment-300">{server.regionIds.join(' · ')}</span>{/if}
          <span class="mt-3 block text-sm text-parchment-200">{server.snapshot?.games.length ?? 0}{configuration(server.id)?.maxGames ? ` / ${configuration(server.id)?.maxGames}` : ''} lobbies · {server.snapshot?.games.reduce((n, g) => n + g.connectedCount, 0) ?? 0} connections</span>
          <span class="mt-1 block text-xs text-parchment-300">{server.receivedAtUtc ? `Last report ${duration(age(server))} ago` : 'Waiting for the first report'}</span>
        </button>
      {/each}
    </div>
    {#if selected}
      {#if status(selected) === 'disabled'}<div class="panel rounded-lg px-4 py-3 text-sm text-amber-300">This server is disabled. Hosting and server API access are turned off; any reports below show its last observed state.</div>
      {:else if snapshot && status(selected) !== 'online'}<div class="panel rounded-lg px-4 py-3 text-sm text-amber-300">{status(selected) === 'offline' ? 'This host is offline or has stopped reporting. Lobbies and characters below are its last observed state.' : status(selected) === 'stalled' ? 'The game loop or lobby snapshot has stopped updating. Reports are still arriving.' : status(selected) === 'delayed' ? 'Reports are delayed. The state below may have changed.' : 'This host is starting. Waiting for the game loop to publish its first snapshot.'}</div>{/if}
      {#if snapshot}
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div class="panel rounded-lg p-4"><p class="text-xs uppercase tracking-wider text-parchment-300">Process uptime</p><p class="mt-2 text-xl text-parchment-50">{duration(snapshot.uptimeSeconds)}</p><p class="mt-1 text-xs text-parchment-300">PID {snapshot.pid}</p></div>
          <div class="panel rounded-lg p-4"><p class="text-xs uppercase tracking-wider text-parchment-300">Memory</p><p class="mt-2 text-xl text-parchment-50">{(snapshot.memoryBytes / 1048576).toFixed(0)} MiB</p><p class="mt-1 text-xs text-parchment-300">Process working set</p></div>
          <div class="panel rounded-lg p-4"><p class="text-xs uppercase tracking-wider text-parchment-300">Game loop</p><p class="mt-2 text-xl text-parchment-50">{snapshot.lastTickMs} ms</p><p class="mt-1 text-xs text-parchment-300">Peak {snapshot.maxTickMs} ms · {snapshot.slowTicks} slow ticks</p></div>
          <div class="panel rounded-lg p-4"><p class="text-xs uppercase tracking-wider text-parchment-300">Lobby directory</p><p class={`mt-2 text-xl ${snapshot.lobby.state === 'failed' ? 'text-requirement' : 'text-parchment-50'}`}>{snapshot.lobby.state}</p><p class="mt-1 text-xs text-parchment-300">HTTP {snapshot.lobby.lastStatus || '—'} · {snapshot.lobby.failures} failures</p></div>
        </div>
        {#if stalled}<p class="text-sm text-amber-300" role="status">{stalled} connection{stalled === 1 ? '' : 's'} held in a handshake or transition state for at least 30 seconds.</p>{/if}
        <section aria-label="Hosted lobbies" class="space-y-3">
          <div class="flex items-baseline justify-between gap-3"><h3 class="display-text text-xl text-parchment-50">Hosted lobbies</h3><span class="text-xs text-parchment-300">{snapshot.joins} joins · {snapshot.leaves} departures this process</span></div>
          {#if !snapshot.games.length}<div class="panel rounded-lg p-6 text-sm text-parchment-300">This host has no observed lobbies.</div>{/if}
          {#each snapshot.games as game (game.id)}
            <article class="panel overflow-hidden rounded-lg">
              <div class="flex flex-wrap items-start justify-between gap-3 border-b border-parchment-300/15 p-4">
                <div class="min-w-0"><h4 class="display-text break-words text-lg text-parchment-50">{game.name}</h4><p class="mt-1 break-words text-sm text-parchment-300">{game.description || 'No description'}</p><p class="mt-2 text-xs text-parchment-300">{game.difficulty} · {game.mode} · {game.hardcore ? 'Hardcore' : 'Softcore'}{game.ladder ? ' · Ladder' : ''}{game.terrorized ? ' · Terrorized' : ''}{game.passwordRequired ? ' · Password protected' : ''}</p></div>
                <div class="text-right text-sm text-parchment-200"><p>{game.connectedCount} / {game.maxPlayers} connections</p><p class="mt-1 text-xs text-parchment-300">Observed {duration(game.observedSeconds)} · ID {game.id}</p><p class="mt-1 text-xs text-parchment-300">{game.levelDifferenceEnabled ? `Level difference ≤ ${game.levelDifference}` : 'No level restriction'}</p></div>
              </div>
              {#if !game.players.length}<p class="px-4 py-3 text-sm text-parchment-300">No characters connected.</p>{:else}
                <div class="overflow-x-auto"><table class="w-full min-w-[35rem] text-left text-sm"><thead class="bg-abyss-900 text-xs text-parchment-300"><tr><th class="px-4 py-2 font-normal">Character</th><th class="px-4 py-2 font-normal">Class / client</th><th class="px-4 py-2 font-normal">Connection state</th><th class="px-4 py-2 font-normal">Connected</th></tr></thead><tbody>
                  {#each game.players as player (player.clientId)}<tr class="border-t border-parchment-300/10"><td class="px-4 py-3 text-parchment-50">{player.name || 'Joining…'}</td><td class="px-4 py-3 text-parchment-300">{player.class}<span class="ml-2 text-xs">#{player.clientId}</span></td><td class={`px-4 py-3 ${player.stalled ? 'text-amber-300' : 'text-parchment-200'}`}>{player.state}{player.stalled ? ' · stalled' : ''}<span class="mt-1 block text-xs text-parchment-300">{duration(player.stateSeconds)} in state</span></td><td class="px-4 py-3 text-parchment-300">{duration(player.connectedSeconds)}</td></tr>{/each}
                </tbody></table></div>
              {/if}
            </article>
          {/each}
        </section>
      {:else}<div class="panel rounded-lg p-6 text-parchment-300">No report received from this host yet. Check that report_telemetry is enabled and the API URL and server key are configured.</div>{/if}
      <section class="panel rounded-lg" aria-label="Server logs">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-300/15 p-4"><div><h3 class="display-text text-xl text-parchment-50">Live diagnostics</h3><p class="mt-1 text-xs text-parchment-300">{logs.length} retained lines · {paused ? 'Display paused; receiving continues' : 'Streaming server and captured file logs'}</p></div><div class="flex flex-wrap gap-2"><button class="control" onclick={togglePause}>{paused ? 'Resume' : 'Pause'}</button><button class="control" aria-pressed={follow} onclick={() => follow = !follow}>Follow {follow ? 'on' : 'off'}</button><button class="control" disabled={!visibleLogs.length} onclick={exportLogs}>Export visible</button></div></div>
        <div class="flex flex-wrap gap-3 p-4"><label class="min-w-40 flex-1 text-xs text-parchment-300">Search logs<input class="mt-1 w-full rounded border border-parchment-300/25 bg-abyss-900 px-3 py-2 text-sm text-parchment-50" bind:value={search} placeholder="Character, lobby, error…" /></label><label class="text-xs text-parchment-300">Minimum severity<select class="mt-1 block rounded border border-parchment-300/25 bg-abyss-900 px-3 py-2 text-sm text-parchment-50" bind:value={severity}>{#each logLevels as level, i}<option value={i}>{level}</option>{/each}</select></label></div>
        {#if historyGap || selected.sourceGaps}<p class="px-4 pb-3 text-xs text-amber-300">Log history is incomplete. Lines were rotated out, forwarding fell behind, or the API’s stored history was reset. {selected.sourceGaps ? `${selected.sourceGaps} source gap(s) observed.` : ''}</p>{/if}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need focus to scroll this bounded log region.) -->
        <div bind:this={logPane} class="h-[28rem] overflow-auto border-t border-parchment-300/15 bg-abyss-950 p-3 font-mono text-xs leading-5" role="region" tabindex="0" aria-label="Scrollable diagnostics log">
          {#if !visibleLogs.length}<p class="p-3 text-parchment-300">{logs.length ? 'No lines match your filters.' : 'Waiting for log lines from this host.'}</p>{/if}
          {#each visibleLogs as entry (`${entry.session}:${entry.sourceId}`)}<div class="grid grid-cols-[auto_auto_minmax(0,1fr)] items-start gap-x-3 border-b border-white/5 py-1"><time class="text-parchment-300" datetime={new Date(entry.timestamp).toISOString()} title={new Date(entry.timestamp).toLocaleString()}>{new Date(entry.timestamp).toLocaleTimeString()}</time><span class={entry.level >= 3 ? 'text-requirement' : entry.level === 2 ? 'text-amber-300' : 'text-parchment-300'}>{logLevels[entry.level]}</span><span class="whitespace-pre-wrap break-words text-parchment-200">{entry.message}</span></div>{/each}
        </div>
        <p class="p-3 text-xs text-parchment-300">Up to 2,000 lines / 1 MiB per host are retained by the API for 24 hours after its last report. Logs may contain player information. Downloaded logs are private administration data.</p>
      </section>
    {/if}
  {/if}
</div>

<style>
  .control { border: 1px solid rgb(188 167 125 / .25); border-radius: .375rem; padding: .4rem .65rem; color: #d8c9a7; font-size: .75rem; background: #0d0d0e; }
  .control:hover { border-color: #e45a35; }
  .control:disabled { opacity: .4; cursor: default; }
</style>
