<script lang="ts">
  import { inlineTokens, markdownBlocks } from '$lib/build-markdown';
  import type { BuildItemReference } from '$lib/builds';
  import BuildItemLink from './BuildItemLink.svelte';
  let { text }: { text: string } = $props();
</script>

{#snippet inline(value: string)}
  {#each inlineTokens(value) as token}
    {#if token.kind === 'bold'}<strong>{token.text}</strong>
    {:else if token.kind === 'italic'}<em>{token.text}</em>
    {:else if token.kind === 'strike'}<s>{token.text}</s>
    {:else if token.kind === 'code'}<code>{token.text}</code>
    {:else if token.kind === 'link'}<a href={token.href} rel="ugc noreferrer">{token.text}</a>
    {:else if token.kind === 'item'}<BuildItemLink reference={{ catalog: token.catalog as BuildItemReference['catalog'], key: token.key! }} />
    {:else}{token.text}{/if}
  {/each}
{/snippet}

<div class="guide-prose">
  {#each markdownBlocks(text) as block}
    {#if block.kind === 'heading'}<svelte:element this={`h${block.level}`}>{@render inline(block.text!)}</svelte:element>
    {:else if block.kind === 'code'}<pre><code>{block.text}</code></pre>
    {:else if block.kind === 'quote'}<blockquote>{@render inline(block.text!)}</blockquote>
    {:else if block.kind === 'rule'}<hr />
    {:else if block.kind === 'list'}
      {#if block.ordered}<ol>{#each block.lines! as line}<li>{@render inline(line)}</li>{/each}</ol>
      {:else}<ul>{#each block.lines! as line}<li>{@render inline(line)}</li>{/each}</ul>{/if}
    {:else if block.kind === 'table'}
      <div class="table-scroll"><table><thead><tr>{#each block.rows![0] as cell}<th>{@render inline(cell)}</th>{/each}</tr></thead>
        <tbody>{#each block.rows!.slice(1) as row}<tr>{#each row as cell}<td>{@render inline(cell)}</td>{/each}</tr>{/each}</tbody>
      </table></div>
    {:else}<p>{@render inline(block.text!)}</p>{/if}
  {/each}
</div>

<style>
  .guide-prose { color:#d2ccc0; line-height:1.8; overflow-wrap:anywhere; font-family:Arial,Helvetica,sans-serif; font-size:15px; }
  .guide-prose :global(p), blockquote { white-space:pre-line; margin:0 0 1rem; }
  .guide-prose :global(h3), .guide-prose :global(h4), .guide-prose :global(h5), .guide-prose :global(h6) { font-weight:600; color:#f7f1e3; margin:1.3rem 0 .6rem; font-size:1.15em; }
  strong { color:#f6e6c4; } a { color:#e9ab74; text-decoration:underline; }
  ul,ol { padding-left:1.5rem; margin-bottom:1rem; } ul { list-style:disc; } ol { list-style:decimal; }
  li { padding-left:.3rem; margin:.3rem 0; }
  blockquote { border-left:3px solid #b29354; padding:.5rem 1rem; background:#cda9590a; }
  code { background:#ffffff0b; border-radius:3px; padding:.15rem .3rem; font-family:monospace; }
  pre { max-width:100%; overflow:auto; padding:1rem; background:#080808; margin-bottom:1rem; }
  pre code { background:none; } hr { border-color:#ffffff20; margin:1.5rem 0; }
  .table-scroll { max-width:100%; overflow:auto; margin:1rem 0; }
  table { border-collapse:collapse; min-width:100%; } th,td { padding:.65rem .9rem; border:1px solid #ffffff20; text-align:left; min-width:100px; }
  th { background:#ffffff08; color:#eddbb4; }
</style>
