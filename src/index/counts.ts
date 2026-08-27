import type { Profile } from '../dataset/normalize.js';

export type Counts = Uint8Array;

export function buildAlphabetIndex(profile: Profile): Map<string, number> {
  const index = new Map<string, number>();
  Array.from(profile.alphabet).forEach((ch, i) => {
    index.set(ch, i);
  });
  return index;
}

export function toCounts(word: string, alphabetIndex: Map<string, number>): Counts {
  const counts = new Uint8Array(alphabetIndex.size);
  for (const ch of word) {
    const pos = alphabetIndex.get(ch);
    if (pos === undefined) {
      throw new Error(`toCounts: character "${ch}" is not present in the alphabet index`);
    }
    counts[pos] += 1;
  }
  return counts;
}

export function fits(word: Counts, pool: Counts): boolean {
  if (word.length !== pool.length) {
    throw new Error(
      `fits: length mismatch (word has ${word.length}, pool has ${pool.length})`,
    );
  }
  for (let i = 0; i < word.length; i++) {
    if (word[i] > pool[i]) {
      return false;
    }
  }
  return true;
}
