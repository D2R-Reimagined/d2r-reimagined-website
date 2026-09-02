<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { apiRequest, authState, initializeAuth } from '$lib/auth';
  import { buildDate, getBuild, type BuildComment, type BuildDetails, type BuildPage } from '$lib/builds';
  import BuildRenderer from './BuildRenderer.svelte';
  let { initial, initialVariant = '' }: { initial: BuildDetails; initialVariant?: string } = $props();
  // svelte-ignore state_referenced_locally
  let details = $state(initial);
  // svelte-ignore state_referenced_locally
  let activeVariantId = $state(initialVariant);
  let comments = $state<BuildPage<BuildComment>>({items:[],total:0,skip:0,count:30});
  let commentBody = $state('');
  let replyTo = $state<BuildComment | null>(null);
  let commentsBusy = $state(true);
  let busy = $state(false);
  let error = $state('');
  let commentError = $state('');
  let notice = $state('');
  let removing = $state<string | null>(null);
  let build = $derived(details.build);
  let isOwner = $derived($authState.user?.id === build.authorId);
  let canModerate = $derived(isOwner || $authState.user?.roles.some(role => role === 'Admin' || role === 'Moderator'));
  let signInUrl = $derived(`/profile?returnTo=${encodeURIComponent(`/builds/${build.id}`)}`);
  const message = (value: unknown) => value instanceof Error ? value.message : 'Something went wrong. Please try again.';
  onMount(async () => {
    void loadComments();
    await initializeAuth();
    if ($authState.user) {
      try { details = await getBuild(build.id); } catch (value) { error = message(value); }
    }
  });
  async function loadComments(skip = 0) {
    commentsBusy = true; commentError = '';
    try { comments = await apiRequest<BuildPage<BuildComment>>(`/builds/${build.id}/comments?skip=${skip}`); }
    catch (value) { commentError = message(value); }
    finally { commentsBusy = false; }
  }
  async function rate(stars: number | null) {
    if (busy) return; busy = true; error = ''; notice = '';
    try {
      await apiRequest(`/builds/${build.id}/rating`, {method: stars === null ? 'DELETE' : 'PUT', body: stars === null ? undefined : JSON.stringify({stars})}, true);
      details = await getBuild(build.id); notice = stars ? 'Your rating has been saved.' : 'Your rating has been removed.';
    } catch (value) { error = message(value); }
    finally { busy = false; }
  }
  async function postComment(event: SubmitEvent) {
    event.preventDefault(); if (busy || !commentBody.trim()) return;
    busy = true; error = ''; notice = '';
    try {
      await apiRequest(`/builds/${build.id}/comments`, {method:'POST',body:JSON.stringify({body:commentBody,parentId:replyTo?.id ?? null})}, true);
      commentBody = ''; replyTo = null; notice = 'Comment posted.';
      details.build.commentCount++; await loadComments();
    } catch (value) { error = message(value); }
    finally { busy = false; }
  }
  async function removeComment(id: string) {
    if (busy) return; busy = true; error = '';
    try {
      await apiRequest(`/builds/${build.id}/comments/${id}`,{method:'DELETE'},true);
      removing = null; details.build.commentCount = Math.max(0,details.build.commentCount-1);
      await loadComments(Math.max(0,comments.items.length === 1 ? comments.skip-30 : comments.skip));
    } catch (value) { error = message(value); }
    finally { busy = false; }
  }
  async function share() {
    const url = new URL(`/builds/${build.id}`,page.url.origin);
    if (activeVariantId) url.searchParams.set('variant',activeVariantId);
    try { await navigator.clipboard.writeText(url.href); notice = 'Build link copied.'; }
    catch { notice = `Share this link: ${url.href}`; }
  }
</script>
<svelte:head><title>{build.title} | D2R Reimagined Builds</title><meta name="description" content={details.content.summary} /><meta property="og:title" content={build.title} /><meta property="og:description" content={details.content.summary} /></svelte:head>
<article class="builds-page reader"><a href="/builds" class="back-link">← All builds</a>
  <header class="guide-header"><div class="guide-badges"><a href={`/builds?characterClass=${build.characterClass}`}>{build.characterClass}</a><span>{build.category}</span><span>{build.budget}</span>{#if build.patch}<span>{build.patch}</span>{/if}</div>
    <h1 class="build-title">{build.title}</h1><p class="build-intro">{build.summary}</p>
    <div class="byline"><span class="author-avatar">{build.authorName.slice(0,1).toUpperCase()}</span><span>By <strong>{build.authorName}</strong></span><span>Updated {buildDate(build.updatedAtUtc)}</span><a href="#community">★ {build.ratingCount ? build.rating.toFixed(1) : 'Unrated'} ({build.ratingCount})</a><a href="#discussion">{build.commentCount} comments</a></div>
    <div class="guide-actions"><button type="button" class="secondary" onclick={share}>Copy build link ↗</button>{#if isOwner}<a href={`/builds/${build.id}/edit`} class="secondary">Edit build</a>{/if}<a href="#discussion" class="secondary">Join the discussion</a></div>
    {#if build.tags.length}<div class="guide-tags">{#each build.tags as tag}<a href={`/builds?tag=${encodeURIComponent(tag)}`}>#{tag}</a>{/each}</div>{/if}
  </header>
  {#if error}<div class="alert" role="alert">{error}</div>{/if}{#if notice}<p role="status" class="reader-notice">{notice}</p>{/if}
  <BuildRenderer content={details.content} equipment={details.equipment} bind:activeVariantId />

  <section class="community-panel" id="community"><div><p class="eyebrow">PLAYER FEEDBACK</p><h2>How does this build play?</h2><p>Rate the guide after trying it. Your feedback helps other players choose.</p></div>
    <div class="rating-box"><div class="rating-summary"><span>★</span> {build.ratingCount ? build.rating.toFixed(1) : 'No ratings yet'} <small>{build.ratingCount} {build.ratingCount === 1 ? 'rating' : 'ratings'}</small></div>
      {#if $authState.user && !isOwner}<div class="stars" role="group" aria-label="Rate this build">{#each [1,2,3,4,5] as stars}<button type="button" class:chosen={(details.myRating ?? 0) >= stars} aria-label={`Rate ${stars} ${stars === 1 ? 'star' : 'stars'}`} aria-pressed={details.myRating === stars} disabled={busy} onclick={() => rate(stars)}>★</button>{/each}</div><span class="muted">{details.myRating ? `Your rating: ${details.myRating}/5` : 'Choose your rating'}</span>{#if details.myRating}<button class="text-button" disabled={busy} onclick={() => rate(null)}>Remove rating</button>{/if}
      {:else if isOwner}<p class="muted">Authors cannot rate their own guides.</p>{:else}<a href={signInUrl} class="text-button">Sign in to rate this build</a>{/if}
    </div>
  </section>
  <section class="discussion" id="discussion"><div class="discussion-heading"><h2>Discussion <span>{comments.total}</span></h2><p>Ask questions, share your results, and help refine the build.</p></div>
    {#if $authState.user}<form onsubmit={postComment}><label for="build-comment">Your comment</label>{#if replyTo}<p class="replying">Replying to {replyTo.authorName}: {replyTo.body.slice(0,120)} <button type="button" onclick={() => replyTo = null}>Cancel reply</button></p>{/if}<textarea id="build-comment" bind:value={commentBody} maxlength="2000" rows="4" required placeholder="What worked for you? What would you like to know?"></textarea><div class="comment-form-footer"><small>{commentBody.length}/2000 · Be constructive and respectful.</small><button type="submit" class="primary" disabled={busy || !commentBody.trim()}>Post comment</button></div></form>
    {:else}<div class="sign-in-panel"><p>Have a question or a suggestion?</p><a href={signInUrl} class="secondary">Sign in to comment</a></div>{/if}
    {#if commentError}<p role="alert" class="alert">{commentError} <button onclick={() => loadComments(comments.skip)}>Retry</button></p>
    {:else if commentsBusy}<p class="muted">Loading discussion…</p>
    {:else if !comments.items.length}<p class="no-comments">No comments yet. Start the conversation.</p>
    {:else}<div class="comments">{#each comments.items as comment (comment.id)}<article class="comment"><div class="comment-meta"><span class="author-avatar">{comment.authorName.slice(0,1).toUpperCase()}</span><strong>{comment.authorName}</strong>{#if comment.userId === build.authorId}<span class="author-badge">Guide author</span>{/if}<time datetime={comment.createdAtUtc}>{buildDate(comment.createdAtUtc)}</time></div>
      {#if comment.parentId}<p class="reply-context">↳ Reply to {comments.items.find(c => c.id === comment.parentId)?.authorName ?? 'an earlier comment'}</p>{/if}
      <p class="comment-body">{comment.body}</p><div class="comment-actions">{#if $authState.user}<button disabled={busy} onclick={() => { replyTo = comment; document.getElementById('build-comment')?.focus(); }}>Reply</button>{/if}{#if canModerate || $authState.user?.id === comment.userId}<button disabled={busy} onclick={() => removing = comment.id}>Remove</button>{/if}</div>
      {#if removing === comment.id}<div class="remove-confirm">Remove this comment? <button disabled={busy} onclick={() => removeComment(comment.id)}>Confirm removal</button><button onclick={() => removing = null}>Cancel</button></div>{/if}
    </article>{/each}</div><nav class="pager" aria-label="Discussion pages"><button class="secondary" disabled={commentsBusy || comments.skip === 0} onclick={() => loadComments(Math.max(0,comments.skip-30))}>← Newer</button><span>{comments.skip+1}–{Math.min(comments.skip+30,comments.total)} of {comments.total}</span><button class="secondary" disabled={commentsBusy || comments.skip+30 >= comments.total} onclick={() => loadComments(comments.skip+30)}>Older →</button></nav>{/if}
  </section>
</article>
<style>
  .guide-header{padding:2rem 0 2.2rem;}.guide-badges,.guide-tags{display:flex;gap:.6rem;flex-wrap:wrap;}.guide-badges > *{padding:.4rem .6rem;border:1px solid #b29b603d;border-radius:3px;color:#bba16d;font:10px Arial,sans-serif;}.reader .build-title{max-width:1000px;font-size:clamp(1.8rem,4vw,3rem);overflow-wrap:anywhere;}.byline{display:flex;flex-wrap:wrap;gap:.8rem;align-items:center;font:11px Arial,sans-serif;color:#9c8f76;margin:1.5rem 0;}.byline strong{color:#cfbd95;}.byline a{color:#bca476;}.author-avatar{display:grid;place-items:center;flex:none;width:27px;height:27px;background:#b19a6010;border:1px solid #b19a6038;border-radius:50%;font:11px Arial,sans-serif;color:#c1aa78;}.guide-actions{display:flex;flex-wrap:wrap;gap:.6rem;}.guide-tags{margin-top:1.2rem;font:11px Arial,sans-serif;color:#8e7e5b;}.reader-notice{padding:1rem;background:#8ba37810;border:1px solid #8ba37840;border-radius:4px;font:13px/1.7 Arial,sans-serif;overflow-wrap:anywhere;}
  .community-panel{display:flex;justify-content:space-between;gap:2rem;border:1px solid #b19a6038;background:#b19a6007;border-radius:7px;padding:2rem;margin:3rem 0;scroll-margin-top:90px;}.community-panel h2,.discussion h2{font:1.5rem var(--font-display);color:#e5d7b9;margin:.7rem 0;}.community-panel p:not(.eyebrow),.discussion-heading p{font:13px/1.8 Arial,sans-serif;color:#97896f;}.rating-box{text-align:right;min-width:215px;}.rating-summary{font:20px Arial,sans-serif;color:#d8c08b;}.rating-summary small{display:block;font:11px Arial,sans-serif;color:#8c8069;margin:.5rem 0;}.stars{display:flex;justify-content:flex-end;gap:.4rem;}.stars button{font:28px Arial,sans-serif;color:#494337;padding:.2rem;cursor:pointer;}.stars button.chosen,.stars button:hover{color:#d2ae5d;}.text-button{display:block;color:#bfa16a;font:11px Arial,sans-serif;margin-top:.7rem;text-decoration:underline;}.rating-box .text-button{margin-left:auto;}
  .discussion{max-width:900px;margin:0 auto;scroll-margin-top:90px;}.discussion-heading{margin-bottom:1.5rem;}.discussion h2 span{font:13px Arial,sans-serif;color:#8d7b58;}.discussion form{padding:1.3rem;background:#141311;border:1px solid #b19a602b;border-radius:6px;margin-bottom:2rem;}.discussion label{font:12px Arial,sans-serif;color:#b7a789;}.discussion textarea{display:block;width:100%;min-width:0;margin:.8rem 0;padding:1rem;background:#0a0908;border:1px solid #b19a6038;border-radius:4px;color:#ded2bb;font:14px/1.7 Arial,sans-serif;resize:vertical;}.comment-form-footer{display:flex;justify-content:space-between;gap:1rem;align-items:center;flex-wrap:wrap;}.comment-form-footer small{font:10px Arial,sans-serif;color:#85765b;}.sign-in-panel{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;padding:1.5rem;border:1px solid #b19a602b;border-radius:5px;font:13px Arial,sans-serif;color:#b3a284;margin-bottom:2rem;}
  .comment{padding:1.5rem 0;border-bottom:1px solid #ffffff10;}.comment-meta{display:flex;align-items:center;gap:.7rem;flex-wrap:wrap;font:12px Arial,sans-serif;color:#bfaf8e;}.comment-meta time{margin-left:auto;font-size:10px;color:#86765b;}.author-badge{font-size:9px;border:1px solid #b19a6040;padding:.2rem .4rem;border-radius:3px;color:#c7aa6b;}.comment-body{font:14px/1.8 Arial,sans-serif;color:#c5baa6;white-space:pre-wrap;overflow-wrap:anywhere;margin:1rem 0;}.comment-actions{display:flex;gap:1rem;font:11px Arial,sans-serif;color:#a18e6c;}.no-comments{padding:2rem 0;font:13px Arial,sans-serif;color:#8c7c60;}.replying,.reply-context{font:11px/1.6 Arial,sans-serif;color:#ac9977;padding:.7rem 0;overflow-wrap:anywhere;}.replying button{text-decoration:underline;margin-left:.5rem;}.remove-confirm{border:1px solid #b8705450;padding:1rem;margin-top:.8rem;color:#d89881;font:12px Arial,sans-serif;}.remove-confirm button{margin-left:1rem;text-decoration:underline;}
  @media(max-width:650px){.community-panel{flex-direction:column;padding:1.3rem;}.rating-box{text-align:left;}.stars{justify-content:flex-start;}.rating-box .text-button{margin-left:0;}.discussion form{padding:1rem;}}
</style>
