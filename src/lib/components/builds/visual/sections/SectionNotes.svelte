<script lang="ts">
  // The optional notes under an embed (items, skills, equipment, image, video).
  import type { BuildBlock } from '#lib/builds.js';
  import SectionBody from '../text/SectionBody.svelte';
  import { visualEditor } from '../context';
  let { block = $bindable() }: { block: BuildBlock } = $props();
  const editor = visualEditor();
</script>

<div class="ve-notes">
  <SectionBody bind:body={block.body} characterClass={editor.characterClass} placeholder="Add notes…"
    oninsertsection={(kind) => editor.insertAfter(block, kind)} />
</div>
