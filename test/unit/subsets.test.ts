import { describe, expect, it } from 'vitest';
import type { Profile } from '../../src/dataset/normalize.js';
import { buildAlphabetIndex, toCounts } from '../../src/index/counts.js';
import { buildVocabIndex, type VocabEntry } from '../../src/index/vocabIndex.js';
import { poolWords } from '../../src/index/subsets.js';

const profile: Profile = {
  locale: 'test',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  case: 'upper',
  map: {},
  strip: [],
  rareLetters: {},
};

const words = ['STOP', 'POTS', 'SPOT', 'TOP', 'POT', 'SOT', 'CAT', 'DOG', 'BIRD', 'FISH'];

const entries: VocabEntry[] = words.map((word, i) => ({
  word,
  role: 'core',
  rank: i / words.length,
}));

const index = buildVocabIndex(profile, entries, 'test-hash');
const alphabetIndex = buildAlphabetIndex(profile);

describe('poolWords', () => {
  const pool = toCounts('STOP', alphabetIndex);

  it('includes mutual anagrams of the pool word', () => {
    const result = poolWords(pool, index, 3);
    expect(result).toContain('STOP');
    expect(result).toContain('POTS');
    expect(result).toContain('SPOT');
  });

  it('does not include words containing letters outside the pool', () => {
    const result = poolWords(pool, index, 3);
    for (const word of result) {
      for (const ch of word) {
        expect('STOP'.includes(ch)).toBe(true);
      }
    }
    expect(result).not.toContain('CAT');
    expect(result).not.toContain('DOG');
    expect(result).not.toContain('BIRD');
    expect(result).not.toContain('FISH');
  });

  it('orders results by length descending, then lexicographically ascending', () => {
    const result = poolWords(pool, index, 2);
    for (let i = 1; i < result.length; i++) {
      const prev = result[i - 1];
      const cur = result[i];
      if (prev.length === cur.length) {
        expect(prev.localeCompare(cur)).toBeLessThanOrEqual(0);
      } else {
        expect(prev.length).toBeGreaterThan(cur.length);
      }
    }
  });

  it('excludes words shorter than minLength', () => {
    const shortIncluded = poolWords(pool, index, 3);
    expect(shortIncluded).toContain('TOP');

    const shortExcluded = poolWords(pool, index, 4);
    expect(shortExcluded).not.toContain('TOP');
    expect(shortExcluded).not.toContain('POT');
    expect(shortExcluded).not.toContain('SOT');
  });
});
