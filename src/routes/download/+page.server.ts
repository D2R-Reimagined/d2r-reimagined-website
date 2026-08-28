import type { PageServerLoad } from './$types';
import { resolveLauncherDownloads, type GitHubReleaseAsset } from '$lib/launcher-downloads';

const releasesUrl = 'https://github.com/D2R-Reimagined/reimagined-launcher/releases';

type GitHubRelease = {
  tag_name: string;
  html_url: string;
  published_at: string;
  assets: GitHubReleaseAsset[];
};

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
  setHeaders({
    'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400'
  });

  try {
    const response = await fetch('https://api.github.com/repos/D2R-Reimagined/reimagined-launcher/releases/latest', {
      headers: {
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28'
      }
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const release = await response.json() as GitHubRelease;
    return {
      release: {
        version: release.tag_name,
        publishedAt: release.published_at,
        url: release.html_url,
        downloads: resolveLauncherDownloads(release.assets)
      },
      releasesUrl
    };
  } catch {
    return { release: null, releasesUrl };
  }
};
