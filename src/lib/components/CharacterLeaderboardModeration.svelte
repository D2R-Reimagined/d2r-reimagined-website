<script lang="ts">
  import { authState } from '$lib/auth';
  import { updateCharacterLeaderboardBlacklist, type CharacterResponse } from '$lib/characters';

  let { character }: { character: CharacterResponse } = $props();
  let updated = $state<CharacterResponse | null>(null);
  let saving = $state(false);
  let error = $state('');
  let notice = $state('');
  let blacklisted = $derived(updated?.leaderboardBlacklisted ?? character.leaderboardBlacklisted ?? false);
  let canModerate = $derived($authState.user?.roles.some(role => role === 'Admin' || role === 'Moderator') ?? false);

  async function toggle(): Promise<void> {
    if (saving || !canModerate) return;
    saving = true;
    error = '';
    notice = '';
    try {
      updated = await updateCharacterLeaderboardBlacklist(character.id, !blacklisted);
      notice = updated.leaderboardBlacklisted
        ? `${character.name} is excluded from all leaderboards. Other characters on this account are unaffected.`
        : `${character.name}'s character blacklist was removed. Account-wide bans still apply.`;
    } catch (value) {
      error = value instanceof Error ? value.message : 'Could not update the character blacklist.';
    } finally {
      saving = false;
    }
  }
</script>

{#if canModerate}
  <section class="panel mb-6 rounded-lg p-4" aria-label="Character leaderboard moderation">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-parchment-50">{character.name}: {blacklisted ? 'Blacklisted from leaderboards' : 'Not individually blacklisted'}</p>
        <p class="mt-1 text-sm text-parchment-300">This restriction applies only to this character.</p>
      </div>
      <button type="button" disabled={saving} onclick={() => void toggle()}
        class="rounded border border-ember-400/60 px-4 py-2 text-parchment-50 hover:bg-ember-700/20 disabled:opacity-50">
        {saving ? 'Saving…' : blacklisted ? 'Remove leaderboard blacklist' : 'Blacklist from leaderboards'}
      </button>
    </div>
    {#if error}<p role="alert" class="mt-3 text-requirement">{error}</p>{/if}
    {#if notice}<p role="status" class="mt-3 text-parchment-300">{notice}</p>{/if}
  </section>
{/if}
