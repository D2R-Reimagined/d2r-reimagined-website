<script lang="ts">
  import { tick } from 'svelte';
  import { youtubeEmbedUrl, type BuildBlock } from '#lib/builds.js';
  import AutoGrow from '../ui/AutoGrow.svelte';
  import SectionNotes from './SectionNotes.svelte';
  import UrlCard from './UrlCard.svelte';
  let { block = $bindable() }: { block: BuildBlock } = $props();
  // Same pattern as ImageSection: the URL field stays while focused.
  let editing = $state(false);
  let previous = $state('');
  let input = $state<HTMLInputElement>();
  let caption = $state<HTMLTextAreaElement>();
  const src = $derived(youtubeEmbedUrl(block.url));
  const valid = (value: string) => !!youtubeEmbedUrl(value);

  async function commit() { editing = false; await tick(); caption?.focus(); }
  async function replace() { previous = block.url; editing = true; await tick(); input?.focus(); input?.select(); }
  function cancel() { block.url = previous; editing = false; }
</script>

{#if src && !editing}
  <div class="ve-media">
    <iframe {src} title={block.title} loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
      sandbox="allow-scripts allow-same-origin allow-presentation" allow="encrypted-media; picture-in-picture; fullscreen"></iframe>
    <button type="button" class="ve-replace ve-reveal" onclick={replace}>Replace</button>
    <AutoGrow bind:value={block.caption} bind:element={caption} class="ve-caption" maxlength={400}
      placeholder="Add a caption" aria-label="Video caption" />
  </div>
{:else}
  <UrlCard bind:url={block.url} bind:input icon="video" label="Paste a YouTube link" valid={valid}
    invalid="Use a YouTube link such as https://www.youtube.com/watch?v=…, youtu.be/… or a Shorts link."
    oncommit={commit} oncancel={previous ? cancel : undefined} onfocusin={() => editing = true} onfocusout={() => { editing = false; previous = ''; }} />
{/if}
<SectionNotes bind:block />
