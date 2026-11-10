import type { Handle } from '@sveltejs/kit/hooks';

/** The display font, and the body font unless the visitor picked another one in the header. */
const PRELOADED_FONT = /ExocetBlizzardMixedCaps/;

// SvelteKit preloads only scripts and styles by default, so a font is requested after the
// stylesheet that names it has downloaded and the page has been laid out. Preloading it from the
// HTML starts that download with the page. DiabloLight is left out: only the "Classic" choice
// uses it, and that choice lives in localStorage where the server cannot see it.
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, {
    preload: (file) =>
      file.type === 'js' || file.type === 'css' || (file.type === 'font' && PRELOADED_FONT.test(file.filename))
  });
