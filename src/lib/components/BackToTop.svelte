<script lang="ts">
  import { onMount } from 'svelte';
  import { i18n } from '$lib/i18n';

  let visible = $state(false);

  onMount(() => {
    const update = () => visible = window.scrollY > 500;
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  });

  function goToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

{#if visible}
  <button
    type="button"
    class="fixed bottom-5 right-5 z-50 grid size-12 place-items-center rounded-full border border-ember-400/70 bg-abyss-900 text-xl text-ember-400 transition hover:-translate-y-0.5 hover:bg-ember-700 hover:text-white"
    aria-label={$i18n.t('aria_back_to_top')}
    title={$i18n.t('sr_top')}
    onclick={goToTop}
  >
    <span aria-hidden="true">↑</span>
  </button>
{/if}
