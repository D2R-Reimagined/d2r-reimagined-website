import { get } from 'svelte/store';

import { describe, expect, it } from 'vitest';

import { i18n, initializeI18n } from './i18n';

describe('keyed line localization', () => {
  it('renders the numeric range carried by the label-only healperhit string', () => {
    initializeI18n({ healperhit: 'Life Per Hit' });

    expect(get(i18n).line({ key: 'healperhit', args: [2, 4] })).toBe('2-4 Life Per Hit');
  });
});
