import type { Counts } from './counts.js';
import type { VocabIndex } from './vocabIndex.js';

export function poolWords(pool: Counts, index: VocabIndex, minLength: number): string[] {
  const alphabet = index.profile.alphabet;

  const letters: string[] = [];
  const multiplicities: number[] = [];
  for (let i = 0; i < pool.length; i++) {
    if (pool[i] > 0) {
      letters.push(alphabet[i]);
      multiplicities.push(pool[i]);
    }
  }

  const d = letters.length;
  const combo = new Array<number>(d).fill(0);
  const results: string[] = [];

  function recurse(i: number): void {
    if (i === d) {
      const total = combo.reduce((sum, c) => sum + c, 0);
      if (total < minLength) {
        return;
      }
      let sig = '';
      for (let j = 0; j < d; j++) {
        sig += letters[j].repeat(combo[j]);
      }
      const matches = index.bySignature.get(sig);
      if (matches) {
        results.push(...matches);
      }
      return;
    }
    for (let c = 0; c <= multiplicities[i]; c++) {
      combo[i] = c;
      recurse(i + 1);
    }
  }

  recurse(0);

  results.sort((a, b) => {
    if (a.length !== b.length) {
      return b.length - a.length;
    }
    return a < b ? -1 : a > b ? 1 : 0;
  });

  return results;
}
