import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  TRADE_CURRENCIES,
  formatOfferText,
  formatStructuredPriceText,
  getTradeCurrency,
  parseOfferCurrencyChips,
  searchTradeCurrencies
} from './trade-pricing';

describe('trade pricing currencies', () => {
  it('ships an existing static webp sprite for every configured currency without duplicates', () => {
    const staticRoot = join(process.cwd(), 'static');
    expect(TRADE_CURRENCIES).toHaveLength(68);
    expect(new Set(TRADE_CURRENCIES.map((entry) => entry.code)).size).toBe(68);
    expect(new Set(TRADE_CURRENCIES.map((entry) => entry.name)).size).toBe(68);
    expect(new Set(TRADE_CURRENCIES.map((entry) => entry.shortLabel)).size).toBe(68);
    for (const currency of TRADE_CURRENCIES) {
      expect(currency.sprite.startsWith('/data/sprites/items/')).toBe(true);
      const diskPath = join(staticRoot, currency.sprite.slice(1));
      expect(existsSync(diskPath), `Missing sprite for ${currency.code}: ${currency.sprite}`).toBe(true);
    }
  });

  it('ranks Orb of Corruption first when searching for ooc', () => {
    const results = searchTradeCurrencies('ooc');
    expect(results[0]?.code).toBe('ka3');
    expect(results[1]?.code).toBe('ooc');
  });

  it('formats OR, AND, note, and offers-only listing prices cleanly', () => {
    expect(
      formatStructuredPriceText(
        [
          { currencyCode: 'ka3', quantity: 2 },
          { currencyCode: 'r24', quantity: 1 }
        ],
        'Or',
        null
      )
    ).toBe('2 OoC or Ist');

    expect(
      formatStructuredPriceText(
        [
          { currencyCode: 'r30', quantity: 1 },
          { currencyCode: 'r31', quantity: 1 }
        ],
        'And',
        'or cold skillers'
      )
    ).toBe('Ber + Jah (or cold skillers)');

    expect(formatStructuredPriceText([], 'Or', 'willing to bundle')).toBe('willing to bundle');
    expect(formatStructuredPriceText([], 'Or', '   ')).toBeNull();
  });

  it('formats and parses structured currency offer strings while falling back for free text', () => {
    const formatted = formatOfferText(
      [
        { currencyCode: 'ka3', quantity: 2 },
        { currencyCode: 'keyset', quantity: 1 }
      ],
      'can add cold skiller — online now'
    );
    expect(formatted).toBe('2 OoC + 1 3x3 Keyset — can add cold skiller — online now');

    expect(parseOfferCurrencyChips(formatted)).toEqual({
      items: [
        { currencyCode: 'ka3', quantity: 2 },
        { currencyCode: 'keyset', quantity: 1 }
      ],
      note: 'can add cold skiller — online now'
    });

    expect(parseOfferCurrencyChips('2 Keyset + 1 Ist')).toEqual({
      items: [
        { currencyCode: 'keyset', quantity: 2 },
        { currencyCode: 'r24', quantity: 1 }
      ],
      note: null
    });

    expect(parseOfferCurrencyChips('Griffon swap + Ber')).toEqual({
      items: [],
      note: 'Griffon swap + Ber'
    });

    for (const freeText of ['10 gems', '5 map', '2 worldstone shard', '3 ancients', '2 socket']) {
      expect(parseOfferCurrencyChips(freeText)).toEqual({
        items: [],
        note: freeText
      });
    }
  });

  it('includes authentic D2RR currencies and excludes vendor-bought or fungible vanilla items', () => {
    expect(getTradeCurrency('KA3')?.shortLabel).toBe('OoC');
    expect(getTradeCurrency('mrl')?.shortLabel).toBe('Prism');
    expect(getTradeCurrency('1gc')?.shortLabel).toBe('Gem Cluster');
    expect(getTradeCurrency('mpa')?.name).toBe("Mephisto's Animus");
    expect(getTradeCurrency('xa1')?.shortLabel).toBe('West Shard');
    expect(getTradeCurrency('ua5')?.name).toBe("Worusk's End");
    expect(getTradeCurrency('r34')?.shortLabel).toBe('Brak');
    expect(getTradeCurrency('r39')?.name).toBe('Hev Rune');

    expect(getTradeCurrency('toa')).toBeNull();
    expect(getTradeCurrency('gmm')).toBeNull();
    expect(getTradeCurrency('gmr')).toBeNull();
    expect(getTradeCurrency('gmk')).toBeNull();
    expect(getTradeCurrency('gmo')).toBeNull();
    expect(getTradeCurrency('unknown')).toBeNull();
  });
});
