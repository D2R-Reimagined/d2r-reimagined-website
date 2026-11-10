<script lang="ts">
  import type { BuildBlock } from '#lib/builds.js';
  import SectionBody from '../text/SectionBody.svelte';
  import { visualEditor } from '../context';
  let { block = $bindable() }: { block: BuildBlock } = $props();
  const editor = visualEditor();
</script>

<SectionBody bind:body={block.body} characterClass={editor.characterClass} placeholder="Type '/' for commands"
  oninsertsection={(kind) => editor.insertAfter(block, kind)} />
