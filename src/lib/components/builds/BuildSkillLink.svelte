<script lang="ts">
  import { onDestroy } from 'svelte';
  import { loadSkillClasses } from '$lib/skills';
  import { findBuildSkill, skillPreviewRank } from '$lib/build-skills';
  import { i18n } from '$lib/i18n';
  import type { Skill } from '$lib/types';
  import SkillDetails from '$lib/components/skills/SkillDetails.svelte';

  let { skillId, rank = 1 }: { skillId: number; rank?: number } = $props();
  let skill = $state<Skill | undefined>();
  let skills = $state<Skill[]>([]);
  let open = $state(false);
  let error = $state('');
  let trigger: HTMLButtonElement;
  let pinned = $state(false);
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  function cancelClose() {
    clearTimeout(closeTimer);
    closeTimer = undefined;
  }
  function close() {
    cancelClose();
    open = false;
    pinned = false;
  }
  function leave(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    cancelClose();
    // Allow the pointer to cross the small gap between the name and the popover.
    closeTimer = setTimeout(close, 150);
  }
  onDestroy(cancelClose);
  let position = $state({ left: 12, top: 80, width: 340, height: 500 });
  $effect(() => {
    let active = true;
    const id = skillId;
    skill = undefined; skills = []; error = '';
    loadSkillClasses().then(classes => {
      if (!active) return;
      const found = findBuildSkill(classes, id);
      skill = found?.skill; skills = found?.skills ?? [];
      if (!skill) error = 'This skill is no longer in the current game catalog.';
    }).catch(() => { if (active) error = 'The skill catalog could not be loaded. Reopen the guide to retry.'; });
    return () => { active = false; };
  });
  function show() {
    cancelClose();
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(370, window.innerWidth - 24);
    const height = Math.min(500, window.innerHeight - 100);
    position = { left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      top: Math.max(76, Math.min(rect.bottom + 8, window.innerHeight - height - 12)), width, height };
    open = true;
  }
</script>

<svelte:window onkeydown={event => { if (event.key === 'Escape') close(); }} onscroll={close} onresize={close} />
<span class="skill-reference" role="group" onpointerenter={cancelClose} onpointerleave={leave}>
  <button type="button" bind:this={trigger} class="skill-name" aria-expanded={open}
    onmouseenter={show} onfocus={show} onclick={() => { if (pinned) close(); else { pinned = true; show(); } }}>
    {skill ? $i18n.t(skill.NameKey) : `Skill ${skillId}`}
  </button>
  {#if open}
    <span class="skill-popover" role="dialog" aria-label={`Skill details: ${skill ? $i18n.t(skill.NameKey) : skillId}`} tabindex="-1"
      style={`left:${position.left}px;top:${position.top}px;width:${position.width}px;max-height:${position.height}px`}>
      <button type="button" class="close" onclick={() => { trigger.focus(); close(); }} aria-label="Close skill details">×</button>
      {#if skill}<SkillDetails {skill} {skills} ranks={{}} rank={skillPreviewRank(skill, rank)} available={false} increase={() => {}} decrease={() => {}} readonly headingLabel="Skill preview - no equipment or synergy bonuses" />{:else}<span class="fallback">{error || "Loading skill..."}</span>{/if}
    </span>
  {/if}
</span>

<style>
  .skill-name { color:var(--color-parchment-200); text-decoration:underline dotted; text-underline-offset:4px; text-align:left; cursor:pointer; overflow-wrap:anywhere; }
  .skill-name:hover { color:var(--color-parchment-50); }
  .skill-popover { display:block; position:fixed; z-index:70; overflow:auto; background:var(--color-abyss-850); border:1px solid var(--color-parchment-300); box-shadow:0 12px 50px #000c; border-radius:8px; text-align:left; }
  .skill-popover :global(.scroll-card) { content-visibility:visible; contain:none; }
  .close { position:sticky; top:0; float:right; z-index:1; background:#222; border-radius:3px; padding:2px 12px; font-size:24px; }
  .fallback { display:block; padding:2rem; }
</style>
