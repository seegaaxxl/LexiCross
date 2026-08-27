import { describe, expect, it } from 'vitest';
import { buildAlphabetIndex, fits, toCounts } from '../../src/index/counts.js';
import type { Profile } from '../../src/dataset/normalize.js';

const profile: Profile = {
  locale: 'test',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  case: 'upper',
  map: {},
  strip: [],
  rareLetters: {},
};

describe('buildAlphabetIndex', () => {
  it('produces correct positions for a known alphabet', () => {
    const index = buildAlphabetIndex(profile);
    expect(index.get('A')).toBe(0);
    expect(index.get('B')).toBe(1);
    expect(index.get('Z')).toBe(25);
    expect(index.size).toBe(26);
  });
});

describe('toCounts', () => {
  const index = buildAlphabetIndex(profile);

  it('produces correct per-letter counts for a known word', () => {
    const counts = toCounts('STOP', index);
    expect(counts[index.get('S')!]).toBe(1);
    expect(counts[index.get('T')!]).toBe(1);
    expect(counts[index.get('O')!]).toBe(1);
    expect(counts[index.get('P')!]).toBe(1);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(4);
  });

  it('counts repeated letters correctly', () => {
    const counts = toCounts('PUPPY', index);
    expect(counts[index.get('P')!]).toBe(3);
    expect(counts[index.get('U')!]).toBe(1);
    expect(counts[index.get('Y')!]).toBe(1);
  });

  it('throws on a character outside the alphabet', () => {
    expect(() => toCounts('CAT9', index)).toThrow();
  });
});

describe('fits', () => {
  const index = buildAlphabetIndex(profile);

  it('true when word letters are a subset of pool', () => {
    const word = toCounts('TOP', index);
    const pool = toCounts('STOP', index);
    expect(fits(word, pool)).toBe(true);
  });

  it('false when word needs more of some letter than pool has', () => {
    const word = toCounts('PUPPY', index);
    const pool = toCounts('PUP', index);
    expect(fits(word, pool)).toBe(false);
  });

  it('true for exact match', () => {
    const word = toCounts('STOP', index);
    const pool = toCounts('STOP', index);
    expect(fits(word, pool)).toBe(true);
  });

  it('true for the empty word against any pool', () => {
    const word = toCounts('', index);
    const pool = toCounts('STOP', index);
    expect(fits(word, pool)).toBe(true);
  });

  it('throws on length mismatch', () => {
    const word = new Uint8Array(3);
    const pool = new Uint8Array(4);
    expect(() => fits(word, pool)).toThrow();
  });
});
