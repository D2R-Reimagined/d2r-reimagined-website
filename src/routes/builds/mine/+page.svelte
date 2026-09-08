<script lang="ts">
  import { Button } from 'flowbite-svelte';
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
<div class="builds-page"><a href="/builds" class="back-link">← Community builds</a><div class="page-heading"><div><p class="eyebrow">YOUR CORNER OF SANCTUARY</p><h1 class="build-title">My builds</h1><p class="build-intro">Continue a draft, refine a setup, or share what you’ve learned.</p></div><Button href="/builds/new" color="red" size="sm">＋ Create a build</Button></div>
  {#if error}<div role="alert" class="alert">{error} <button onclick={() => load(result.skip)}>Retry</button></div>
  {:else if busy}<div class="empty panel">Loading your builds…</div>
  {:else if !result.items.length}<div class="empty panel"><h2>Your next guide starts here.</h2><p>Your private drafts and published builds will appear here. Only you can see drafts.</p><Button href="/builds/new" color="red" size="sm">Open the workshop ↗</Button></div>
  {:else}<div class="guide-grid">{#each result.items as build}<BuildCard {build} manage />{/each}</div><nav class="pager" aria-label="My builds pages"><Button color="alternative" size="sm" disabled={busy || result.skip === 0} onclick={() => load(Math.max(0,result.skip-24))}>← Previous</Button><span>{result.skip+1}–{Math.min(result.skip+24,result.total)} of {result.total}</span><Button color="alternative" size="sm" disabled={busy || result.skip+24 >= result.total} onclick={() => load(result.skip+24)}>Next →</Button></nav>{/if}
</div>
