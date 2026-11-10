<script lang="ts">
  // The card frame and tone colour come from SectionShell (like the reader's .callout).
  import type { BuildBlock } from '#lib/builds.js';
  import SectionBody from '../text/SectionBody.svelte';
  import { visualEditor } from '../context';
  import { calloutTones } from './tones';
  let { block = $bindable() }: { block: BuildBlock } = $props();
  const editor = visualEditor();
</script>

<div class="ve-tone-switch ve-reveal" role="group" aria-label="Callout style">
  {#each calloutTones as tone}
    <button type="button" data-tone={tone.value} aria-pressed={block.tone === tone.value} onclick={() => block.tone = tone.value}>{tone.label}</button>
  {/each}
</div>
<SectionBody bind:body={block.body} characterClass={editor.characterClass} placeholder="Type '/' for commands"
  oninsertsection={(kind) => editor.insertAfter(block, kind)} />
