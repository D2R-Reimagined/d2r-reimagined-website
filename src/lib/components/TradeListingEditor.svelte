<script lang="ts">
  import {
    canEditTradeListing,
    tradeListingEditForm,
    tradeListingEdits,
    type TradeListingEditForm
  } from '#lib/trade-listing-edit.js';
  import { updateTradeListing, type TradeListing } from '#lib/trades.js';

  let { listing, onsaved }: { listing: TradeListing; onsaved: (updated: TradeListing) => void } = $props();

  let form = $state<TradeListingEditForm | null>(null);
  let saving = $state(false);
  let error = $state('');
  let editable = $derived(canEditTradeListing(listing.status));

  // An offer accepted while the form is open ends the edit: what was typed was
  // for a listing that has since changed hands, and must not return with it.
  $effect(() => {
    if (!editable) close();
  });

  function open(): void {
    form = tradeListingEditForm(listing);
    error = '';
  }

  function close(): void {
    form = null;
    error = '';
  }

  async function save(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!form || saving) return;
    const edits = tradeListingEdits(listing, form);
    if (Object.keys(edits).length === 0) {
      close();
      return;
    }
    if (edits.title !== undefined && edits.title.length < 3) {
      error = 'The listing title needs at least 3 characters.';
      return;
    }
    saving = true;
    error = '';
    try {
      const updated = await updateTradeListing(listing.id, edits);
      form = null;
      onsaved(updated);
    } catch (value) {
      error = value instanceof Error ? value.message : 'The listing could not be saved.';
    } finally {
      saving = false;
    }
  }
</script>

<section class="mt-6 panel rounded-lg p-5 sm:p-6" aria-label="Edit listing">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 class="display-text text-xl text-parchment-50">Listing details</h2>
      {#if !editable}
        <p class="mt-1 text-sm text-parchment-300">{listing.status === 'Reserved' ? 'This item is pending with a buyer. Return it to active to edit the listing.' : 'Completed trades cannot be edited.'}</p>
      {:else if !form}
        <p class="mt-1 text-sm text-parchment-300">Change your price or notes without closing the listing. Offers and chats stay as they are.</p>
      {/if}
    </div>
    {#if editable && !form}<button type="button" class="trade-secondary-button" onclick={open}>Edit listing</button>{/if}
  </div>

  {#if editable && form}
    <form class="mt-5 space-y-5" onsubmit={save}>
      {#if error}<div role="alert" class="rounded border border-red-500/35 bg-red-950/35 px-4 py-3 text-sm text-red-200">{error}</div>{/if}
      {#if listing.isIdentified}
        <label class="block text-sm text-parchment-200">Listing title<input required minlength="3" maxlength="120" class="field mt-2" bind:value={form.title} /></label>
      {/if}
      <label class="block text-sm text-parchment-200">Price / what you want <span class="text-parchment-300">(free text)</span><input maxlength="500" class="field mt-2" placeholder="Examples: 2 Ber, Jah + offer, similar Sorceress gear" bind:value={form.price} /></label>
      <label class="block text-sm text-parchment-200">Notes<textarea rows="3" maxlength="4000" class="field mt-2 resize-y" placeholder="Anything the buyer should know…" bind:value={form.description}></textarea></label>
      <label class="flex items-start gap-3 rounded border border-parchment-300/15 bg-black/20 p-4"><input type="checkbox" class="checkbox mt-0.5" bind:checked={form.isNegotiable} /><span><strong class="block text-parchment-50">Open to offers</strong><span class="mt-1 block text-sm text-parchment-300">Players can submit an offer without starting a conversation.</span></span></label>
      <p class="text-xs text-parchment-300">The item itself can't be changed here. List it again if this is the wrong item.</p>
      <div class="flex flex-col-reverse gap-3 border-t border-parchment-300/15 pt-5 sm:flex-row sm:justify-end">
        <button type="button" disabled={saving} class="trade-secondary-button" onclick={close}>Cancel</button>
        <button type="submit" disabled={saving} class="trade-primary-button sm:min-w-40">{saving ? 'Saving…' : 'Save changes'}</button>
      </div>
    </form>
  {/if}
</section>
