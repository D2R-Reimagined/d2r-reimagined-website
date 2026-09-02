<script lang="ts">
  import { buildDate, type BuildSummary } from '$lib/builds';
  let { build, manage = false }: { build: BuildSummary; manage?: boolean } = $props();
  const colors: Record<string, string> = { Amazon:'#ab9560', Assassin:'#aa8eae', Barbarian:'#bc7967', Druid:'#8ea773', Necromancer:'#89a99b', Paladin:'#ccae66', Sorceress:'#85a1c0', Warlock:'#b985aa' };
</script>
<a class="guide-card" href={`/builds/${build.id}${manage ? '/edit' : ''}`} style={`--class-color:${colors[build.characterClass] ?? '#bba070'}`}>
  <div class="card-art"><span class="class-seal" aria-hidden="true">{build.characterClass.slice(0,3).toUpperCase()}</span><div><span class="class-label">{build.characterClass}</span><span class="focus-label">{build.category}</span></div><span class="patch">{manage ? build.isPublished ? 'Published' : 'Draft' : build.patch || 'Community guide'}</span></div>
  <div class="card-body"><div class="card-tags"><span>{build.budget}</span>{#each build.tags.slice(0, 2) as tag}<span>{tag}</span>{/each}</div>
    <h2>{build.title}</h2><p class="summary">{build.summary || 'Your guide is taking shape. Continue editing in the workshop.'}</p>
    <div class="author"><span class="avatar">{build.authorName.slice(0,1).toUpperCase()}</span><span>{build.authorName}</span><span class="date">{buildDate(build.updatedAtUtc)}</span></div>
  </div>
  <div class="card-footer">{#if manage}<span>{build.isPublished ? 'Manage published guide' : 'Continue your draft'}</span>{:else}<span class="rating"><span aria-hidden="true">★</span> {build.ratingCount ? build.rating.toFixed(1) : 'Unrated'} <small>({build.ratingCount})</small></span><span>{build.commentCount} comments</span>{/if}<span class="arrow" aria-hidden="true">↗</span></div>
</a>
<style>
  .guide-card { min-width:0; display:flex; flex-direction:column; overflow:hidden; border:1px solid #b9a1682b; background:#151413; border-radius:7px; transition:border-color .15s,transform .15s; }
  .guide-card:hover { border-color:#b9a16885; transform:translateY(-2px); }
  .card-art { display:flex; gap:1rem; align-items:center; padding:1.5rem 1.3rem; min-height:105px; background:radial-gradient(ellipse at 15% 10%,color-mix(in srgb,var(--class-color) 14%,transparent),transparent 80%),#0f0f0e; border-bottom:1px solid #b9a16820; }
  .class-seal { display:grid; place-items:center; height:48px; width:48px; flex:none; border:1px solid color-mix(in srgb,var(--class-color) 45%,transparent); color:var(--class-color); border-radius:50%; font:12px var(--font-display); }
  .card-art > div { display:grid; gap:.45rem; }.class-label { color:var(--class-color); font:12px Arial,sans-serif; }.focus-label { color:#766c5b; text-transform:uppercase; font:9px Arial,sans-serif; letter-spacing:.17em; }.patch { margin-left:auto; align-self:start; max-width:120px; overflow-wrap:anywhere; color:#938975; font:10px/1.5 Arial,sans-serif; text-align:right; }
  .card-body { padding:1.3rem; flex:1; }.card-tags { display:flex; flex-wrap:wrap; gap:.4rem; margin-bottom:.9rem; }.card-tags span { font:9px/1.4 Arial,sans-serif; border:1px solid #ffffff15; color:#a89a81; border-radius:3px; padding:.25rem .4rem; overflow-wrap:anywhere; }
  h2 { font-family:var(--font-display); color:#e6d9be; font-size:1.2rem; line-height:1.5; overflow-wrap:anywhere; }.summary { color:#968c7b; font:12px/1.8 Arial,sans-serif; margin:.7rem 0 1.4rem; display:-webkit-box; line-clamp:3; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; overflow-wrap:anywhere; }
  .author { display:flex; align-items:center; gap:.5rem; font:10px Arial,sans-serif; color:#b7aa90; }.avatar { display:grid; place-items:center; width:22px; height:22px; background:#b49b6415; border:1px solid #b49b6430; border-radius:50%; flex:none; }.date { margin-left:auto; color:#746c5e; white-space:nowrap; }
  .card-footer { display:flex; align-items:center; gap:1rem; border-top:1px solid #ffffff0a; padding:.9rem 1.3rem; color:#998d75; font:10px Arial,sans-serif; }.rating { color:#d1b478; }.rating small { color:#7c725f; }.arrow { margin-left:auto; color:#b9a169; }
</style>
