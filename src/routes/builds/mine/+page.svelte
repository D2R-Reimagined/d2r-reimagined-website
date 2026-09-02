<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { apiRequest, authState, initializeAuth } from '$lib/auth';
  import type { BuildPage, BuildSummary } from '$lib/builds';
  import BuildCard from '$lib/components/builds/BuildCard.svelte';
  let result = $state<BuildPage<BuildSummary>>({ items:[],total:0,skip:0,count:24 });
  let busy = $state(true); let error = $state('');
  async function load(skip = 0) {
    busy = true; error = '';
    try { result = await apiRequest<BuildPage<BuildSummary>>(`/builds/mine?skip=${skip}`,{},true); }
    catch (value) { error = value instanceof Error ? value.message : 'Your builds could not be loaded.'; }
    finally { busy = false; }
  }
  onMount(async () => { await initializeAuth(); if (!$authState.user) { await goto('/profile?returnTo=%2Fbuilds%2Fmine'); return; } await load(); });
</script>
<svelte:head><title>My Builds | D2R Reimagined</title><meta name="robots" content="noindex" /></svelte:head>
<div class="builds-page"><a href="/builds" class="back-link">← Community builds</a><div class="page-heading"><div><p class="eyebrow">YOUR CORNER OF SANCTUARY</p><h1 class="build-title">My builds</h1><p class="build-intro">Continue a draft, refine a setup, or share what you’ve learned.</p></div><a href="/builds/new" class="primary">＋ Create a build</a></div>
  {#if error}<div role="alert" class="alert">{error} <button onclick={() => load(result.skip)}>Retry</button></div>
  {:else if busy}<div class="empty">Loading your builds…</div>
  {:else if !result.items.length}<div class="empty"><h2>Your next guide starts here.</h2><p>Your private drafts and published builds will appear here. Only you can see drafts.</p><a href="/builds/new" class="primary">Open the workshop ↗</a></div>
  {:else}<div class="guide-grid">{#each result.items as build}<BuildCard {build} manage />{/each}</div><nav class="pager" aria-label="My builds pages"><button class="secondary" disabled={busy || result.skip === 0} onclick={() => load(Math.max(0,result.skip-24))}>← Previous</button><span>{result.skip+1}–{Math.min(result.skip+24,result.total)} of {result.total}</span><button class="secondary" disabled={busy || result.skip+24 >= result.total} onclick={() => load(result.skip+24)}>Next →</button></nav>{/if}
</div>
