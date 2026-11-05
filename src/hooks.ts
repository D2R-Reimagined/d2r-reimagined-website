export const reroute = ({ url }: { url: URL }): string | undefined => {
  if (/^\/loot-filter-?v2(?=\/|$)/i.test(url.pathname)) {
    return url.pathname.replace(/^\/loot-filter-?v2/i, '/loot-filterv2');
  }
};

