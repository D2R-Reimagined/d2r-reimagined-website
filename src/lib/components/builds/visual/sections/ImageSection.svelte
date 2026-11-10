<script lang="ts">
  import { tick } from 'svelte';
  import { safeMediaUrl, type BuildBlock } from '#lib/builds.js';
  import AutoGrow from '../ui/AutoGrow.svelte';
  import SectionNotes from './SectionNotes.svelte';
  import UrlCard from './UrlCard.svelte';
  let { block = $bindable() }: { block: BuildBlock } = $props();
  // While the URL field is focused we keep showing it, so a half-typed link never swaps the view.
  let editing = $state(false);
  let previous = $state('');
  let brokenUrl = $state('');
  let input = $state<HTMLInputElement>();
  let caption = $state<HTMLTextAreaElement>();
  const src = $derived(safeMediaUrl(block.url));
  const valid = (value: string) => !!safeMediaUrl(value);

  async function commit() { editing = false; await tick(); caption?.focus(); }
  async function replace() { previous = block.url; editing = true; await tick(); input?.focus(); input?.select(); }
  function cancel() { block.url = previous; editing = false; }
</script>

{#if src && !editing}
  <figure class="ve-figure ve-media">
    {#if brokenUrl === src}
      <div class="ve-dropzone error"><p>This image could not load. Check that the link points straight at an image file.</p></div>
    {:else}
      <img {src} alt={block.caption || block.title} loading="lazy" referrerpolicy="no-referrer" onerror={() => brokenUrl = src ?? ''} />
    {/if}
    <button type="button" class="ve-replace ve-reveal" onclick={replace}>Replace</button>
    <AutoGrow bind:value={block.caption} bind:element={caption} class="ve-caption" maxlength={400}
      placeholder="Add a caption (also read aloud as the image description)" aria-label="Image caption and description" />
  </figure>
{:else}
  <UrlCard bind:url={block.url} bind:input icon="image" label="Paste an HTTPS image URL" valid={valid}
    invalid="Use an https:// link that points straight at an image."
    oncommit={commit} oncancel={previous ? cancel : undefined} onfocusin={() => editing = true} onfocusout={() => { editing = false; previous = ''; }} />
{/if}
<SectionNotes bind:block />
