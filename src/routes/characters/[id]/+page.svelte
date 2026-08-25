<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import CharacterViewer from '$lib/components/CharacterViewer.svelte';
  import { getCharacterDetails, type CharacterDetailsResponse } from '$lib/characters';

  let details = $state<CharacterDetailsResponse | null>(null);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    try {
      const characterId = page.params.id;
      if (!characterId) throw new Error('This character could not be found.');
      details = await getCharacterDetails(characterId);
    } catch (value) {
      error = value instanceof Error ? value.message : 'This character could not be loaded.';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{details ? `${details.character.name} | D2R Reimagined` : 'Character Viewer | D2R Reimagined'}</title>
  <meta name="description" content={details ? `View ${details.character.name}'s D2R Reimagined equipment and inventory.` : 'View a D2R Reimagined character save.'} />
</svelte:head>

<div class="min-h-[75vh] bg-[#101014] px-3 py-8 sm:px-6 sm:py-12">
  <div class="mx-auto max-w-screen-2xl">
    {#if loading}
      <div class="panel rounded-lg p-10 text-center text-parchment-300">Loading character save…</div>
    {:else if error || !details}
      <div class="panel rounded-lg p-10 text-center">
        <h1 class="display-text text-3xl text-parchment-50">Character unavailable</h1>
        <p class="mt-3 text-red-200">{error || 'This character could not be found.'}</p>
        <a href="/profile" class="mt-6 inline-block rounded border border-ember-400/50 px-5 py-2 text-parchment-50 hover:bg-ember-700/20">Back to profile</a>
      </div>
    {:else}
      <CharacterViewer {details} />
    {/if}
  </div>
</div>
