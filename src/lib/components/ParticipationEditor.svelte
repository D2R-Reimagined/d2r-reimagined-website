<script lang="ts">
  import { updateUserParticipation, type AdminUser } from '$lib/admin';

  let { user, onsaved, oncancel }: { user: AdminUser; onsaved: (user: AdminUser) => void; oncancel: () => void } = $props();
  // svelte-ignore state_referenced_locally
  let tradeBanned = $state(user.tradeBanned);
  // svelte-ignore state_referenced_locally
  let leaderboardBanned = $state(user.leaderboardBanned);
  let reason = $state('');
  let saving = $state(false);
  let error = $state('');

  async function save(): Promise<void> {
    if (saving || !reason.trim()) return;
    saving = true;
    error = '';
    try {
      onsaved(await updateUserParticipation(user.id, { tradeBanned, leaderboardBanned, reason: reason.trim() }));
    } catch (value) {
      error = value instanceof Error ? value.message : 'Could not save participation settings.';
    } finally {
      saving = false;
    }
  }
</script>

<form class="rounded border border-parchment-300/20 bg-black/30 p-5" onsubmit={(event) => { event.preventDefault(); void save(); }}>
  <h3 class="text-lg text-parchment-50">Participation bans for {user.displayName}</h3>
  <p class="mt-2 text-parchment-300">Bans apply across all seasons and characters. Trade bans hide existing listings and prevent offers and messages. Leaderboard bans exclude characters from public listings and rankings. Lifting a ban restores visibility.</p>
  {#if user.participationUpdatedAtUtc}
    <p class="mt-3 text-parchment-300">Last changed {new Date(user.participationUpdatedAtUtc).toLocaleString()}: {user.participationReason}</p>
  {/if}
  <fieldset disabled={saving} class="mt-4 space-y-3">
    <label class="flex items-center gap-2 text-parchment-50"><input type="checkbox" bind:checked={tradeBanned} /> Ban from trade</label>
    <label class="flex items-center gap-2 text-parchment-50"><input type="checkbox" bind:checked={leaderboardBanned} /> Ban from leaderboards and public character listings</label>
    <label class="block text-parchment-300">Reason for this change (staff only)
      <textarea required maxlength="1000" rows="2" bind:value={reason} class="mt-2 block w-full rounded border border-parchment-300/25 bg-black/40 px-3 py-2 text-parchment-50"></textarea>
    </label>
    {#if error}<p role="alert" class="text-requirement">{error}</p>{/if}
    <div class="flex gap-3">
      <button type="submit" disabled={!reason.trim()} class="rounded border border-ember-400 px-4 py-2 text-parchment-50 disabled:opacity-50">{saving ? 'Saving…' : 'Save participation settings'}</button>
      <button type="button" onclick={oncancel} class="rounded border border-parchment-300/30 px-4 py-2 text-parchment-300">Cancel</button>
    </div>
  </fieldset>
</form>
