<script lang="ts">
  // Tags as chips: Enter or comma adds, × or Backspace in an empty field removes.
  import { addTags, limits } from '#lib/build-editor/document.js';
  import Icon from './ui/Icon.svelte';
  let { tags = $bindable([]) }: { tags?: string[] } = $props();
  let draft = $state('');
  const full = $derived(tags.length >= limits.tags);

  function commit() {
    if (!draft.trim()) return;
    const next = addTags(tags, draft);
    if (next.length !== tags.length) tags = next;
    draft = '';
  }
  function input(event: Event & { currentTarget: HTMLInputElement }) {
    const value = event.currentTarget.value;
    if (!value.includes(',')) { draft = value; return; }
    // Typing or pasting commas adds everything before the last comma.
    const cut = value.lastIndexOf(',');
    const next = addTags(tags, value.slice(0, cut));
    if (next.length !== tags.length) tags = next;
    draft = value.slice(cut + 1).trimStart();
    event.currentTarget.value = draft;
  }
  function keydown(event: KeyboardEvent) {
    if (event.key === 'Enter') { event.preventDefault(); commit(); }
    else if (event.key === 'Backspace' && !draft && tags.length) tags = tags.slice(0, -1);
  }
</script>

<div class="ve-tags">
  {#each tags as tag, index}
    <span class="ve-tag">#{tag}<button type="button" aria-label={`Remove tag ${tag}`} onclick={() => tags = tags.filter((_, i) => i !== index)}><Icon name="close" size={12} /></button></span>
  {/each}
  <input class="ve-bare ve-tag-input" value={draft} maxlength="60" disabled={full} aria-label="Add a tag"
    placeholder={full ? `${limits.tags} tags maximum` : tags.length ? 'Add tag…' : 'Beginner friendly, Hardcore, Solo self-found…'}
    oninput={input} onkeydown={keydown} onblur={commit} />
</div>
