<script lang="ts">
  import { page } from '$app/state';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import BackToTop from '$lib/components/BackToTop.svelte';
  import RouteLoading from '$lib/components/RouteLoading.svelte';
  import TradeChatDock from '$lib/components/TradeChatDock.svelte';
  import { initializeI18n } from '$lib/i18n';
  import '../app.css';

  let { children, data } = $props();
  // svelte-ignore state_referenced_locally
  initializeI18n(data.translations);

  let canonical = $derived(page.url.origin + page.url.pathname);
  let socialImage = $derived(new URL('/images/reimagined-hero.jpg', page.url.origin).toString());
  let isTradeRoute = $derived(page.url.pathname === '/trade' || page.url.pathname.startsWith('/trade/'));
</script>

<svelte:head>
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="canonical" href={canonical} />
  <meta name="theme-color" content="#070707" />
  <meta property="og:site_name" content="D2R Reimagined" />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={socialImage} />
  <meta property="og:image:alt" content="D2R Reimagined artwork" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={socialImage} />
</svelte:head>

<Header tradeEnabled={data.tradeEnabled} ladders={data.tradeLadders} />
<RouteLoading />
<main id="main-content">{@render children()}</main>
<Footer />
<BackToTop />
{#if isTradeRoute}<TradeChatDock />{/if}
