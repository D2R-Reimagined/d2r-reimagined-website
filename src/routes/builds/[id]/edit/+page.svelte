<script lang="ts">
  import { page } from '$app/state';
  import BuildEditor from '$lib/components/builds/BuildEditor.svelte';
</script>
{#key page.params.id}<BuildEditor id={page.params.id!} />{/key}
