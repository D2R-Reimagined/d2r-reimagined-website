# Keyed wire format — renderer reference

The `d2r-multi-export-tool` ships every property line as a `KeyedLine`:

```jsonc
{ "key": "ModStre10d", "args": [3, "FireBolt", 5, 12] }
```

All numerics are finalized server-side. The website's only job at render time
is to look up `key` in the active-language map and splat `args` into the
template using `format-template.ts`.

## Files

- `src/utilities/format-template.ts` — pure function `formatTemplate(template, args)`.
  Supports `%% %d %D %s %S %+d %i %0..%9 %c1..%c9` (color codes are stripped).
- `src/utilities/keyed-line.ts` — `KeyedLine`, `StringMap`, `LanguageCode`,
  `LANGUAGES`, `FALLBACK_LANGUAGE`, `isKeyedLine`.
- `src/utilities/translation-store.ts` — singleton store with
  `setLanguage(code)`, `getActiveLanguage()`, `onLanguageChanged(listener)`,
  `lookup(key)`, `t(key, args)`, `format(line)`. Fetches
  `/data/strings/{code}.json`. Falls back enUS → bare key.
- `src/resources/value-converters/keyed-line.ts` — Aurelia
  `KeyedLineValueConverter` and `KeyedLinesValueConverter`.

## Bootstrapping

Once at app start (e.g. in `app.ts`'s `binding`/`attached`):

```ts
import { setLanguage } from './utilities/translation-store';

await setLanguage('enUS'); // or whatever the user picked / saved
```

The store preloads `enUS` automatically the first time `setLanguage` runs so
fallbacks resolve without an extra fetch.

## Rendering in templates

```html
<!-- single line -->
<span>${myLine | keyedLine}</span>

<!-- list of IKeyedLine[] (e.g. unique.lines / equipment.lines) -->
<ul>
  <li repeat.for="text of item.lines | keyedLines">${text}</li>
</ul>
```

For programmatic use:

```ts
import { t, format } from '../utilities/translation-store';

const defense = t('strDefense', [240]);              // "Defense: 240"
const damage  = format({ key: 'strWeaponDamageOneHandRange', args: [12, 30] });
```

## Reactivity to language change

The Aurelia value converters resolve at bind/dirty-check time. After
`setLanguage('frFR')`, components that re-evaluate their bindings will pick up
the new strings. For pages that should immediately re-render on language
change, subscribe via `onLanguageChanged` and trigger an Aurelia
`signaler.dispatchSignal('lang')` (or simply reassign the bound array).

## Contract location

Schema for `data/keyed/*.json` and the list of synthetic keys + enUS
templates live in
`d2r-multi-export-tool/D2RMultiExport.Lib/Config/synthetic-strings.json`.
